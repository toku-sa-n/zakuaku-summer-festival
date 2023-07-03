import dynamic from "next/dynamic";
import p5Types from "p5";

const fps = 60 as const;
const gravityInPixelsPerSecondsSquad = 98 as const;

export default function Fireworks() {
    const Sketch = dynamic(
        () => import("react-p5").then((mod) => mod.default),
        { ssr: false }
    );

    let particles: Particle[] = [];

    function setup(p5: p5Types, canvasParentRef: Element) {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.frameRate(fps);

        particles = Array.from(Array(100), () => {
            let x = Math.random() * 1000 - 500;
            let y = Math.random() * 1000 - 500;

            return new Vector2d(x, y);
        })
            .filter((v) => v.x * v.x + v.y * v.y < 500 * 500)
            .map((v) => {
                return new Particle(
                    new Vector2d(p5.width / 2, p5.height / 2),
                    new Vector2d(v.x + p5.width / 2, v.y + p5.height / 2),
                    3
                );
            });
    }

    function windowResized(p5: p5Types) {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    function draw(p5: p5Types) {
        p5.clear();

        particles.map((particle) => {
            particle.update();
            particle.draw(p5);

            return particle;
        });
    }

    return <Sketch setup={setup} windowResized={windowResized} draw={draw} />;
}

class Particle {
    private coordInPixels: Vector2d;
    private velocityInPixelsPerSeconds: Vector2d;
    private color: [number, number, number];
    private size: number;

    constructor(
        srcCoordInPixels: Vector2d,
        dstCoordInPixels: Vector2d,
        arriveDstInSeconds: number
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

        this.color = [
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255,
        ];

        this.size = Math.random() * 10 + 5;
    }

    update() {
        const frameInSecond = 1 / fps;

        this.coordInPixels.x +=
            this.velocityInPixelsPerSeconds.x * frameInSecond;
        this.coordInPixels.y +=
            this.velocityInPixelsPerSeconds.y * frameInSecond;

        this.velocityInPixelsPerSeconds.y +=
            gravityInPixelsPerSecondsSquad * frameInSecond;
    }

    draw(p5: p5Types) {
        p5.noStroke();
        p5.fill(p5.color(this.color[0], this.color[1], this.color[2]));
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
