"""Render one panel of a DXF as an SVG preview (the panel whose outline matches --size).

Groups the DXF's LINE entities into connected outlines, picks the outline whose bounding
box matches the requested size (mm), and writes it as an SVG at 1 user unit = 1 mm,
flipped so that +Y points up as in the DXF. The DXF itself is not modified.

    python tools/dxf-panel-preview.py cad/dxf-enclosure/basic-box-120x150x100-3mm.dxf \
        --size 150x100 --out media/diagrams/enclosure-panel-150x100.svg
"""
import argparse
import ezdxf


def outlines(path):
    lines = [e for e in ezdxf.readfile(path).modelspace() if e.dxftype() == "LINE"]
    key = lambda p: (round(p[0], 3), round(p[1], 3))
    parent = {}

    def find(a):
        while parent.setdefault(a, a) != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    for ln in lines:
        parent[find(key(ln.dxf.start))] = find(key(ln.dxf.end))
    groups = {}
    for ln in lines:
        groups.setdefault(find(key(ln.dxf.start)), []).append(ln)
    return list(groups.values())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dxf")
    ap.add_argument("--size", default="150x100")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    w, h = (float(v) for v in a.size.lower().split("x"))
    for g in outlines(a.dxf):
        xs = [c for ln in g for c in (ln.dxf.start[0], ln.dxf.end[0])]
        ys = [c for ln in g for c in (ln.dxf.start[1], ln.dxf.end[1])]
        x0, y0, gw, gh = min(xs), min(ys), max(xs) - min(xs), max(ys) - min(ys)
        if abs(gw - w) < 0.01 and abs(gh - h) < 0.01:
            break
    else:
        raise SystemExit(f"no outline of {a.size} mm")
    f = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")
    # Chain the segments into one closed path in drawing order.
    segs = [((ln.dxf.start[0] - x0, gh - (ln.dxf.start[1] - y0)), (ln.dxf.end[0] - x0, gh - (ln.dxf.end[1] - y0))) for ln in g]
    k = lambda p: (round(p[0], 3), round(p[1], 3))
    adj = {}
    for i, (p, q) in enumerate(segs):
        adj.setdefault(k(p), []).append((i, q))
        adj.setdefault(k(q), []).append((i, p))
    used, start = set(), segs[0][0]
    pts, cur = [start], start
    while len(used) < len(segs):
        nxt = next(((i, q) for i, q in adj[k(cur)] if i not in used), None)
        if nxt is None:
            break
        used.add(nxt[0])
        cur = nxt[1]
        pts.append(cur)
    closed = k(pts[0]) == k(pts[-1]) and len(used) == len(segs)
    d = "M" + " L".join(f"{f(x)} {f(y)}" for x, y in pts[:-1]) + " Z"
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 {f(gw + 8)} {f(gh + 8)}" width="{f(gw + 8)}mm" height="{f(gh + 8)}mm">\n'
           f'  <title>{a.size} mm panel from {a.dxf.replace(chr(92), "/").split("/")[-1]} ({len(g)} segments, {"closed" if closed else "OPEN"})</title>\n'
           f'  <path d="{d}" fill="none" stroke="#b3471a" stroke-width="0.4" stroke-linejoin="round"/>\n</svg>\n')
    with open(a.out, "w", encoding="utf-8") as fh:
        fh.write(svg)
    print(f"{a.size} mm panel: {len(g)} segments, {'closed' if closed else 'OPEN'} -> {a.out}")
    print(d)


if __name__ == "__main__":
    main()
