"""Create WebP copies of the site images in media/web/ (originals are not touched).

Photos (media/photos/*.jpeg) get 800 px and native-width copies; the photos are at most
1280 px wide, so they are never upscaled. CAD screenshots (media/cad-screenshots/*.png,
1917 px wide) get 800 px and 1600 px copies. Output names replace spaces with hyphens:
media/web/<name>-<width>.webp. Run from the repository root: python tools/make-web-images.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "media" / "web"
SETS = [
    (ROOT / "media" / "photos", ("*.jpeg", "*.jpg"), 80),
    (ROOT / "media" / "cad-screenshots", ("*.png",), 88),
]


def widths_for(width):
    return sorted({min(800, width), min(1600, width)})


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for folder, patterns, quality in SETS:
        for pattern in patterns:
            for src in sorted(folder.glob(pattern)):
                with Image.open(src) as im:
                    im = im.convert("RGB")
                    for w in widths_for(im.width):
                        h = round(im.height * w / im.width)
                        dest = OUT / f"{src.stem.replace(' ', '-')}-{w}.webp"
                        im.resize((w, h), Image.LANCZOS).save(dest, "WEBP", quality=quality, method=6)
                        print(f"{dest.relative_to(ROOT)}  {w}x{h}  {dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
