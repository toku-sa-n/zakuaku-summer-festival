import dynamic from "next/dynamic";
import p5Types from "p5";

const fps = 60 as const;
const gravityInPixelsPerSecondsSquad = 98 as const;

export default function Fireworks() {
    const Sketch = dynamic(
        () => import("react-p5").then((mod) => mod.default),
        { ssr: false }
    );

    let fireworks: ExplodingFirework[] = [];
    let nextFireworkInFrames = 0;

    function setup(p5: p5Types, canvasParentRef: Element) {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.frameRate(fps);
    }

    function windowResized(p5: p5Types) {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    function draw(p5: p5Types) {
        p5.clear();

        if (nextFireworkInFrames-- <= 0) {
            fireworks.push(
                new ExplodingFirework(
                    new Vector2d(
                        p5.width * Math.random(),
                        (p5.height / 2) * Math.random()
                    )
                )
            );

            nextFireworkInFrames = Math.random() * 15;
        }

        fireworks = fireworks.map((firework) => {
            firework.update();
            return firework;
        });

        fireworks.forEach((firework) => firework.draw(p5));

        fireworks = fireworks.filter((firework) => firework.visible());
    }

    return <Sketch setup={setup} windowResized={windowResized} draw={draw} />;
}

class ExplodingFirework {
    private particles: Particle[];

    constructor(center: Vector2d) {
        const color: [number, number, number] = [
            Math.random() * 100 + 155,
            Math.random() * 100 + 155,
            Math.random() * 100 + 155,
        ];

        this.particles = particlesForCircleFireworks(
            center,
            Math.random() * 400 + 100,
            color
        );
    }

    visible(): boolean {
        return this.particles.length > 0;
    }

    update() {
        this.particles = this.particles
            .map((particle) => {
                particle.update();
                return particle;
            })
            .filter((particle) => particle.visible());
    }

    draw(p5: p5Types) {
        this.particles.forEach((particle) => particle.draw(p5));
    }
}

class Particle {
    private coordInPixels: Vector2d;
    private velocityInPixelsPerSeconds: Vector2d;
    private color: [number, number, number];
    private initialSize: number;
    private size: number;
    private diminishTime: number;
    private opacity: number;

    constructor(
        srcCoordInPixels: Vector2d,
        dstCoordInPixels: Vector2d,
        arriveDstInSeconds: number,
        color: [number, number, number]
    ) {
        this.coordInPixels = srcCoordInPixels;
        this.velocityInPixelsPerSeconds = new Vector2d(
            (dstCoordInPixels.x - srcCoordInPixels.x) / arriveDstInSeconds,
            (2 * srcCoordInPixels.y -
                2 * dstCoordInPixels.y -
                gravityInPixelsPerSecondsSquad *
                    arriveDstInSeconds *
                    arriveDstInSeconds) /
                (2 * arriveDstInSeconds)
        );

        this.color = color;

        this.size = Math.random() * 10 + 5;
        this.initialSize = this.size;
        this.diminishTime = Math.random() * 1 + 3;
        this.opacity = 255;
    }

    visible(): boolean {
        return this.opacity > 0 && this.size > 0;
    }

    update() {
        const frameInSecond = 1 / fps;

        this.coordInPixels.x +=
            this.velocityInPixelsPerSeconds.x * frameInSecond;
        this.coordInPixels.y +=
            this.velocityInPixelsPerSeconds.y * frameInSecond;

        this.velocityInPixelsPerSeconds.y +=
            gravityInPixelsPerSecondsSquad * frameInSecond;

        this.velocityInPixelsPerSeconds.x -=
            this.velocityInPixelsPerSeconds.x * frameInSecond * 2;
        this.velocityInPixelsPerSeconds.y -=
            this.velocityInPixelsPerSeconds.y * frameInSecond * 2;

        this.size -= (this.initialSize * frameInSecond) / this.diminishTime;

        if (this.size < 0) {
            this.size = 0;
        }

        this.opacity -= (255 * frameInSecond) / this.diminishTime;

        if (this.opacity < 0) {
            this.opacity = 0;
        }
    }

    draw(p5: p5Types) {
        p5.noStroke();
        p5.fill(
            p5.color(this.color[0], this.color[1], this.color[2], this.opacity)
        );
        p5.ellipse(
            this.coordInPixels.x,
            this.coordInPixels.y,
            this.size,
            this.size
        );
    }
}

class Vector2d {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

function particlesForCircleFireworks(
    center: Vector2d,
    radius: number,
    color: [number, number, number]
): Particle[] {
    return Array.from(Array(300), () => {
        let x = Math.random() * radius * 2 - radius;
        let y = Math.random() * radius * 2 - radius;

        return new Vector2d(x, y);
    })
        .filter((v) => v.x * v.x + v.y * v.y < radius * radius)
        .map((v) => {
            return new Particle(
                structuredClone(center),
                new Vector2d(v.x + center.x, v.y + center.y),
                1,
                color
            );
        });
}
