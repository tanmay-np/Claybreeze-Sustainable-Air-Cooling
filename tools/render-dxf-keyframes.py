"""Render the eight DXF-guide key frames to latex-shared/dxf-guide/step-N.png with headless Edge.

Needs a local web server at the repository root (for example the preview server on port 4317,
or: python -m http.server 4317) because the page loads the site's CSS and JavaScript.
    python tools/render-dxf-keyframes.py [--port 4317]
"""
import argparse
import subprocess
from pathlib import Path

from PIL import Image

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "latex-shared" / "dxf-guide"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=4317)
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    for n in range(1, 9):
        png = OUT / f"step-{n}.png"
        url = f"http://127.0.0.1:{a.port}/tools/dxf-keyframes.html?step={n}"
        subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                        "--window-size=960,600", "--virtual-time-budget=3000", f"--screenshot={png}", url],
                       check=True, capture_output=True, timeout=60)
        with Image.open(png) as im:
            im.convert("RGB").crop((0, 0, 960, 600)).save(png, optimize=True)
        print(png.relative_to(ROOT), png.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()
