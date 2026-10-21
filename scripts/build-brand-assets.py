"""Build the web brand assets from the supplied logo artwork.

The brand was delivered as two files:

  brand-logo-reference.png    the full stacked lockup on a black fabric plate
  brand-mark-transparent.png  the angular E on transparency

The site needs the lockup WITHOUT the plate — a black square behind the logo
is visible against the navy canvas and ruins the translucent navbar — and it
needs the mark and the wordmark separately, because the stacked lockup is
nearly square and cannot be read at navigation-bar height.

Nothing here redraws or re-letters anything. The mark is the supplied
transparent asset; the wordmark is the supplied artwork with its plate lifted
off; the stacked lockup is rebuilt from those two at the proportions measured
off the original plate (mark 741 tall : 82 gap : 188 of type, in its 1536px
coordinate space).

Run:  python -P scripts/build-brand-assets.py <path-to-asset-folder>
"""

import sys
from pathlib import Path

from PIL import Image

OUT = Path("public/brand")

# Measured off the plate: the fabric background never exceeds 32, the green
# tops out around 208 and the wordmark white at 255.
LO, HI = 36, 170

# Crop boxes in the reference's own 1536x1536 space.
WORDMARK_BOX = (315, 1055, 1220, 1158)
LOWER_BOX = (315, 1055, 1220, 1262)  # wordmark + tagline + rule
MARK_H, GAP, TYPE_W = 741, 82, 889


def knockout(img: Image.Image) -> Image.Image:
    """Lift artwork off the near-black plate.

    Alpha comes from the brightest channel rather than from luma: the artwork
    is a saturated green on black, and luma would make the green far more
    transparent than the white beside it. RGB is then un-premultiplied, which
    restores full colour on the anti-aliased edges instead of leaving them
    muddied toward black.
    """
    img = img.convert("RGB")
    w, h = img.size
    out = Image.new("RGBA", (w, h))
    src, dst = img.load(), out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = src[x, y]
            v = max(r, g, b)
            if v <= LO:
                continue
            a = min(1.0, (v - LO) / (HI - LO))
            inv = 1.0 / a
            dst[x, y] = (
                min(255, int(r * inv + .5)),
                min(255, int(g * inv + .5)),
                min(255, int(b * inv + .5)),
                int(a * 255 + .5),
            )
    return out


def trimmed(img: Image.Image) -> Image.Image:
    return img.crop(img.getbbox())


def main(folder: str) -> None:
    src = Path(folder)
    ref = Image.open(src / "brand-logo-reference.png")
    mark = trimmed(Image.open(src / "brand-mark-transparent.png").convert("RGBA"))
    OUT.mkdir(parents=True, exist_ok=True)

    def save(img: Image.Image, name: str) -> None:
        img.save(OUT / name, "WEBP", quality=95, method=6)
        print(f"  {name:16} {img.size[0]}x{img.size[1]}")

    mw, mh = mark.size
    save(mark.resize((round(600 * mw / mh), 600), Image.LANCZOS), "mark.webp")

    word = trimmed(knockout(ref.crop(WORDMARK_BOX)))
    ww, wh = word.size
    save(word.resize((900, round(900 * wh / ww)), Image.LANCZOS), "wordmark.webp")

    # The stacked lockup, at the reference's own proportions.
    scale = 1200 / TYPE_W
    mark_h = round(MARK_H * scale)
    gap = round(GAP * scale)
    lower = trimmed(knockout(ref.crop(LOWER_BOX)))
    lw, lh = lower.size
    lower = lower.resize((1200, round(1200 * lh / lw)), Image.LANCZOS)
    m2 = mark.resize((round(mark_h * mw / mh), mark_h), Image.LANCZOS)
    canvas = Image.new("RGBA", (1200, mark_h + gap + lower.size[1]), (0, 0, 0, 0))
    canvas.alpha_composite(m2, ((1200 - m2.size[0]) // 2, 0))
    canvas.alpha_composite(lower, (0, mark_h + gap))
    save(canvas, "logo.webp")

    # App icons: the mark on the brand canvas, because its lower half is a
    # dark green that disappears against a dark OS background.
    navy = (5, 9, 20, 255)

    def icon(size: int, pad: float) -> Image.Image:
        box = Image.new("RGBA", (size, size), navy)
        inner = round(size * (1 - pad * 2))
        s = inner / max(mw, mh)
        m = mark.resize((max(1, round(mw * s)), max(1, round(mh * s))), Image.LANCZOS)
        box.alpha_composite(m, ((size - m.size[0]) // 2, (size - m.size[1]) // 2))
        return box

    icon(512, .17).save("src/app/icon.png")
    icon(180, .14).save("src/app/apple-icon.png")
    icon(256, .10).save(
        "src/app/favicon.ico",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )
    print("  icon.png 512, apple-icon.png 180, favicon.ico")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
