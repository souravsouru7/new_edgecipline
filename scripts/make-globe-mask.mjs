/**
 * Generates public/hero/globe-mask.webp.
 *
 * `.globe-sheen` in src/app/motion.css sweeps a cyan/purple light across the
 * hero planet and needs to clip that light to the artwork's own silhouette,
 * including the DNA spiral. Using globe.webp itself as the CSS mask would pull
 * the full 541KB original a second time (next/image serves the visible copy
 * from a different URL), so this writes a small mask asset instead: a black
 * image whose alpha channel is the artwork's alpha, downscaled.
 *
 * Run from the project root after the hero artwork changes:
 *   node scripts/make-globe-mask.mjs
 */
import path from "node:path";
import sharp from "sharp";

const SIZE = 384;
const src = path.join(process.cwd(), "public/hero/globe.webp");
const out = path.join(process.cwd(), "public/hero/globe-mask.webp");

const alpha = await sharp(src)
  .resize(SIZE, SIZE, { fit: "fill" })
  .ensureAlpha()
  .extractChannel("alpha")
  .raw()
  .toBuffer();

const info = await sharp({
  create: { width: SIZE, height: SIZE, channels: 3, background: { r: 0, g: 0, b: 0 } },
})
  .joinChannel(alpha, { raw: { width: SIZE, height: SIZE, channels: 1 } })
  // The colour channels are solid black, so only alphaQuality matters here.
  .webp({ quality: 20, alphaQuality: 70, effort: 6 })
  .toFile(out);

console.log(`wrote ${out} ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)}KB`);
