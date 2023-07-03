import dynamic from "next/dynamic";
import p5Types from "p5";

const fps: number = 60 as const;

export default function Fireworks() {
    const Sketch = dynamic(
        () => import("react-p5").then((mod) => mod.default),
        { ssr: false }
    );

    function setup(p5: p5Types, canvasParentRef: Element) {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.frameRate(fps);
    }

    function windowResized(p5: p5Types) {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    function draw(p5: p5Types) {
        p5.clear();
    }

    return <Sketch setup={setup} windowResized={windowResized} draw={draw} />;
}
