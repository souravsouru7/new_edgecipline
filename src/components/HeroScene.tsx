import type { CSSProperties } from "react";
import Image from "next/image";

import { GlobeMesh } from "./hero/GlobeMesh";
import { PlanetAtmosphere } from "./hero/PlanetAtmosphere";

const keywords = ["Awareness", "Clarity", "Better habits", "Discipline", "Consistency"];

const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function HeroScene() {
  return (
    <>
      {/* The landscape is its own layer now, so it can take the slowest
          parallax without repainting a background-position every frame. */}
      <div className="hero-sky" aria-hidden="true" />
      <div className="scene" aria-hidden="true">
        <div className="scene-overlay" />
        <div className="globe">
          <Image
            src="/hero/globe.webp"
            alt=""
            width={1600}
            height={1600}
            priority
            sizes="(max-width: 767px) 86vw, (max-width: 1200px) 52vw, 720px"
          />
          {/* Sits over the artwork and under the light sweep, so the sweep
              passes across the mesh as well. */}
          <GlobeMesh />
          <PlanetAtmosphere />
        </div>
        <div className="keyword-list">
          {keywords.map((keyword, index) => (
            <span key={keyword} style={vars({ "--i": index })}>
              {keyword}
            </span>
          ))}
        </div>
        <div className="rock">
          <Image
            src="/hero/rock.webp"
            alt=""
            width={2200}
            height={1238}
            priority
            sizes="(max-width: 767px) 110vw, 58vw"
          />
        </div>
        <div className="trader">
          <Image
            src="/hero/trader.webp"
            alt=""
            width={900}
            height={1350}
            priority
            sizes="(max-width: 767px) 52vw, 25vw"
          />
        </div>
      </div>
      {/* Hands the scene over to the Emotional Loop instead of cutting to black. */}
      <div className="hero-veil" aria-hidden="true" />
    </>
  );
}
