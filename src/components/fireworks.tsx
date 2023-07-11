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

    const setup = (p5: p5Types, _: Element) => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.frameRate(fps);
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
    };

    return <Sketch setup={setup} windowResized={windowResized} draw={draw} />;
}
