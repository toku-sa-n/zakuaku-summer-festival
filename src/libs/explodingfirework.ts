import p5Types from "p5";
import Particle from "./particle";
import Vector2d from "./vector2d";

export default class ExplodingFirework {
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
            color,
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

function particlesForCircleFireworks(
    center: Vector2d,
    radius: number,
    color: [number, number, number],
): Particle[] {
    return Array.from(Array(300), () => {
        const x = Math.random() * radius * 2 - radius;
        const y = Math.random() * radius * 2 - radius;

        return new Vector2d(x, y);
    })
        .filter((v) => v.x * v.x + v.y * v.y < radius * radius)
        .map(
            (v) =>
                new Particle(
                    structuredClone(center),
                    new Vector2d(v.x + center.x, v.y + center.y),
                    1,
                    color,
                ),
        );
}
