import dynamic from "next/dynamic";
import p5Types from "p5";

const fps: number = 60 as const;

export default function Fireworks() {
    const Sketch = dynamic(
        () => import("react-p5").then((mod) => mod.default),
        { ssr: false }
    );

    let particle: Particle;

    function setup(p5: p5Types, canvasParentRef: Element) {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.frameRate(fps);

        particle = new Particle(p5.width / 2, p5.height / 2);
    }

    function windowResized(p5: p5Types) {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    function draw(p5: p5Types) {
        p5.clear();

        particle.update();

        particle.draw(p5);
    }

    return <Sketch setup={setup} windowResized={windowResized} draw={draw} />;
}

class Particle {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update() {
        this.x += 1;
        this.y += 1;
    }

    draw(p5: p5Types) {
        p5.ellipse(this.x, this.y, 10, 10);
    }
}
