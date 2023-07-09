import { fps, gravityInPixelsPerSecondsSquad } from "./consts";
import Vector2d from "./vector2d";
import p5Types from "p5";

export default class Particle {
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
        color: [number, number, number],
    ) {
        this.coordInPixels = srcCoordInPixels;
        this.velocityInPixelsPerSeconds = new Vector2d(
            (dstCoordInPixels.x - srcCoordInPixels.x) / arriveDstInSeconds,
            (2 * srcCoordInPixels.y -
                2 * dstCoordInPixels.y -
                gravityInPixelsPerSecondsSquad *
                    arriveDstInSeconds *
                    arriveDstInSeconds) /
                (2 * arriveDstInSeconds),
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
            p5.color(this.color[0], this.color[1], this.color[2], this.opacity),
        );
        p5.ellipse(
            this.coordInPixels.x,
            this.coordInPixels.y,
            this.size,
            this.size,
        );
    }
}
