import dynamic from "next/dynamic";
import p5Types from "p5";

export default function Fireworks() {
    const Sketch = dynamic(
        () => import("react-p5").then((mod) => mod.default),
        { ssr: false }
    );

    function setup(p5: p5Types, canvasParentRef: Element) {
        p5.createCanvas(100, 100);
    }

    function draw(p5: p5Types) {
        p5.background(100, 100, 100);
    }

    return <Sketch setup={setup} draw={draw} />;
}
