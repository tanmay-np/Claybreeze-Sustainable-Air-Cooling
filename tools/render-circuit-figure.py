"""Render the Circuit & Control Lab drawing to latex-shared/circuit-lab.png with headless Edge.

Needs a local web server at the repository root (e.g. python -m http.server 4317).
    python tools/render-circuit-figure.py [--port 4317] [--t 31] [--rh 55]
"""
import argparse
import subprocess
from pathlib import Path

from PIL import Image

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "latex-shared" / "circuit-lab.png"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=4317)
    ap.add_argument("--t", default="31")
    ap.add_argument("--rh", default="55")
    a = ap.parse_args()
    url = f"http://127.0.0.1:{a.port}/tools/circuit-figure.html?t={a.t}&rh={a.rh}"
    subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                    "--window-size=1040,1300", "--virtual-time-budget=3000", f"--screenshot={OUT}", url],
                   check=True, capture_output=True, timeout=60)
    with Image.open(OUT) as im:
        im.convert("RGB").crop((0, 0, 1040, 1300)).save(OUT, optimize=True)
    print(OUT.relative_to(ROOT), OUT.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()
