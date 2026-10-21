import { NeuralNetwork } from "./hero/NeuralNetwork";

/**
 * The hero's visual half.
 *
 * Three layers, all decorative and all `aria-hidden`: the ambient light that
 * gives the midnight canvas depth, the neural network itself, and a scrim
 * that keeps the headline legible over it. The page's base background —
 * gradient and vignette — is rendered once for the whole document by
 * components/PageSky.tsx, so nothing here repeats it.
 *
 * `.neural` is sized and placed entirely in CSS with no intrinsic content, so
 * it reserves its space before the canvas has drawn anything and cannot shift
 * the layout.
 */
export function HeroScene() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="scene-glow" />
      <div className="neural">
        <NeuralNetwork />
      </div>
      <div className="scene-scrim" />
    </div>
  );
}
