import type { CSSProperties } from "react";
import type { ReactNode } from "react";

const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * One panel of the stage: the section's anchor id and the word the progress
 * rail uses for it. The order here is the order of the children passed to
 * `Stage`, and the count has to match.
 */
export type StagePanel = { id: string; label: string };

/**
 * The scroll stage.
 *
 * Every section of the landing page is a panel inside `.stage-pin`, which is
 * held still in the viewport while the document scrolls past it. The panels
 * cross-fade through that frame one at a time over the page's one shared
 * background, so each section's content arrives and leaves in place.
 *
 * Everything visible here is a Server Component and every section is rendered
 * exactly once, in document order, with its own heading and copy — nothing is
 * duplicated for the animation and nothing is hidden from a crawler or a
 * screen reader. `StageMotion` supplies the scroll state; `app/stage.css`
 * decides what it looks like. Without JavaScript, or on a viewport too small
 * to hold a section, neither applies and this is a plain scrolling page.
 */
export function Stage({ panels, children }: { panels: StagePanel[]; children: ReactNode }) {
  return (
    <div className="stage">
      <div className="stage-pin">{children}</div>

      {/* Progress rail. Real links, so they work as a section index before
          any JavaScript runs and for anyone navigating by keyboard;
          StageMotion turns a click into a scroll to that panel's place on
          the stage once the frame is pinned. */}
      <nav className="stage-rail" aria-label="Sections">
        <span className="stage-rail-track" aria-hidden="true">
          <i data-stage-fill />
        </span>
        <ol>
          {panels.map(({ id, label }, index) => (
            <li key={id} style={vars({ "--i": index })}>
              <a href={`#${id}`} data-stage-mark>
                <b aria-hidden="true">{String(index + 1).padStart(2, "0")}</b>
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
