import type { CSSProperties } from "react";
import Image from "next/image";

import { GlobeCanvas } from "./hero/GlobeCanvas";
import { PlanetAtmosphere } from "./hero/PlanetAtmosphere";

const keywords = ["Awareness", "Clarity", "Better habits", "Discipline", "Consistency"];

const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function HeroScene() {
  return (
    <>
      {/* No landscape layer here any more: the hero's background — ink
          gradient, landscape, aura and scrim — is the whole page's background
          now, rendered once by components/PageSky.tsx. */}
      <div className="scene" aria-hidden="true">
        <div className="scene-overlay" />
        {/* The planet is drawn, not photographed: GlobeCanvas renders the
            point cloud, graticule and orbit rings on one canvas, so it
            actually turns. That replaced a 541KB still plus an SVG mesh
            animated on top of it. PlanetAtmosphere keeps the surrounding
            glow and motes, which stay in CSS. */}
        <div className="globe">
          <GlobeCanvas />
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
    </>
  );
}
