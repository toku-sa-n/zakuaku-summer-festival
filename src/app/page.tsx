"use client";

import Fireworks from "@/components/fireworks";
import Image from "next/image";

export default function Home() {
    // It does not seem that p5js can render SVGs well. Rendering SVGs via p5js
    // results in unscalable images. That is why we are using nextjs to render
    // them.
    //
    // See https://github.com/processing/p5.js/issues/3274.
    return (
        <>
            <Fireworks />
            <Image
                src="/derich_and_rosemary.svg"
                width={0}
                height={0}
                alt="Derich and Rosemary"
                style={{
                    position: "fixed",
                    bottom: "0",
                    width: "auto",
                    left: "50%",
                    height: "50vh",
                    transform: "translate(-50%,0)",
                }}
            />
        </>
    );
}
