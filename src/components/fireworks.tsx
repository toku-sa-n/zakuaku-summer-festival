import dynamic from "next/dynamic";
import p5Types from "p5";
import Vector2d from "@/libs/vector2d";
import ExplodingFirework from "@/libs/explodingfirework";
import { fps } from "@/libs/consts";

export default function Fireworks() {
    const Sketch = dynamic(
        () => import("react-p5").then((mod) => mod.default),
        {
            ssr: false,
        },
    );

    let fireworks: ExplodingFirework[] = [];
    let nextFireworkInFrames = 0;
    let img: p5Types.Image;

    const preload = (p5: p5Types) => {
        img = p5.loadImage("derich_and_rosemary.svg");
    };

    const setup = (p5: p5Types, _: Element) => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.frameRate(fps);
        img.resize(0, p5.height / 2);
    };

    const windowResized = (p5: p5Types) => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    };

    const draw = (p5: p5Types) => {
        p5.clear();

        nextFireworkInFrames -= 1;

        if (nextFireworkInFrames <= 0) {
            fireworks.push(
                new ExplodingFirework(
                    new Vector2d(
                        p5.width * Math.random(),
                        (p5.height / 2) * Math.random(),
                    ),
                ),
            );

            nextFireworkInFrames = Math.random() * fps + fps;
        }

        fireworks = fireworks.map((firework) => {
            firework.update();
            return firework;
        });

        fireworks.forEach((firework) => firework.draw(p5));

        fireworks = fireworks.filter((firework) => firework.visible());

        p5.image(
            img,
            p5.width / 2 - img.width / 2,
            p5.height - img.height,
            img.width,
            img.height,
        );
    };

    return (
        <Sketch
            preload={preload}
            setup={setup}
            windowResized={windowResized}
            draw={draw}
        />
    );
}
