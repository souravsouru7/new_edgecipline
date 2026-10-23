import type { CSSProperties } from "react";

import type { Group } from "@/data/features";
import styles from "./Features.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * The band that opens each of the four stages.
 *
 * It carries the stage's `h2` — the heading the fourteen feature `h3`s sit
 * under — plus the anchor the hero's index links to. The rotating lattice
 * beside it is two nested CSS 3D cubes: cheap enough to run four times on the
 * page without a second WebGL context, and decorative, so it is hidden from
 * assistive technology.
 */
export function StageHeader({
  group,
  index,
  total,
}: {
  group: Group;
  index: number;
  total: number;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <header className={css("ftxStage")} id={`group-${group.id}`}>
      <div className={css("ftxInner")}>
        <div className={css("ftxStageInner")}>
          <b className={css("ftxStageNum")} aria-hidden="true" data-reveal="fade">
            {number}
          </b>

          <div className={css("ftxStageCopy")}>
            <p className={css("ftxEyebrow")} data-reveal="fade">
              <i aria-hidden="true" />
              Stage {number} / {String(total).padStart(2, "0")}
            </p>

            <h2 id={`group-${group.id}-title`} data-reveal>
              {group.title}
            </h2>

            <p data-reveal style={vars({ "--mo-delay": ".08s" })}>
              {group.intro}
            </p>
          </div>

          <div className={css("ftxLattice")} aria-hidden="true" data-reveal="fade">
            <div className={css("ftxLatticeSpin")}>
              <div className={css("ftxCube")}>
                <i /><i /><i /><i /><i /><i />
              </div>
              <div className={css("ftxCube")} data-inner="">
                <i /><i /><i /><i /><i /><i />
              </div>
            </div>
          </div>
        </div>

        <div className={css("ftxStageRule")} aria-hidden="true" data-sequence>
          <span />
        </div>
      </div>
    </header>
  );
}
