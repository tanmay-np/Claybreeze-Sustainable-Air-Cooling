"""ClayBreeze cost sheet: computes every amount and writes
data/cost-sheet.csv, docs/cost-sheet.md, and the cost tables between the
COST-TABLE markers in index.html and report/main.tex.

    python tools/cost-sheet.py

Actual prices were given by the team. Estimated prices are market rates looked up on
28 Nov 2026 (sources in SOURCES). Labour and machine time are not included.
"""
import csv
import json
import math
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATE = "28 Nov 2026"
STEEL = 7850.0  # kg/m3

SOURCES = {
    "steel": ("OfBusiness — MS pipe prices (MS pipes ₹55–65/kg)", "https://www.ofbusiness.com/prices/pipes"),
    "robocraze": ("Robocraze (Indian electronics retailer)", "https://robocraze.com/"),
    "mdf": ("materialdepot.in — Greenply 8 × 4 ft interior plain MDF, 3 mm (₹13.55/sq ft)", "https://materialdepot.in/greenply-8-ft-x-4-ft-interior-grade-plain-mdf-3-mm/product"),
    "electrode": ("TradeIndia — 2.5 mm arc welding electrode (₹165/kg)", "https://www.tradeindia.com/products/2-50-mm-arc-welding-electrode-rod-6840372.html"),
    "disc": ("IndiaMART, Yash Traders — 4 inch cutting wheel (₹9/piece)", "https://m.indiamart.com/yashtraders-gujarat"),
}


# ---------------- frame length from the SolidWorks GLB ----------------
def glb_mesh_volume(path, node_name):
    data = path.read_bytes()
    jlen = struct.unpack("<I", data[12:16])[0]
    gltf = json.loads(data[20:20 + jlen])
    off = 20 + jlen
    blen = struct.unpack("<I", data[off:off + 4])[0]
    buf = data[off + 8:off + 8 + blen]

    def read(idx):
        a = gltf["accessors"][idx]
        bv = gltf["bufferViews"][a["bufferView"]]
        fmt, size = {5126: ("f", 4), 5123: ("H", 2), 5125: ("I", 4)}[a["componentType"]]
        n = {"SCALAR": 1, "VEC3": 3}[a["type"]]
        start = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
        vals = struct.unpack_from(f"<{a['count'] * n}{fmt}", buf, start)
        return [vals[i:i + n] for i in range(0, len(vals), n)] if n > 1 else list(vals)

    node = next(nd for nd in gltf["nodes"] if nd.get("name") == node_name)
    vol = 0.0
    for prim in gltf["meshes"][node["mesh"]]["primitives"]:
        P = read(prim["attributes"]["POSITION"])
        I = read(prim["indices"])
        for k in range(0, len(I), 3):
            a, b, c = P[I[k]], P[I[k + 1]], P[I[k + 2]]
            vol += (a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6.0
    return abs(vol)


glb = ROOT / "assets/models/claybreeze-assembly.glb"
frame_vol = glb_mesh_volume(glb, "20mm_frame-1")       # closed mesh, modelled as SOLID 20 x 20 bar
frame_len = frame_vol / (0.020 * 0.020)                  # m of 20 x 20 section in the model
WALL = 1.2e-3                                            # assumed wall (not confirmed)
pipe_area = 0.020 ** 2 - (0.020 - 2 * WALL) ** 2         # m2
pipe_kg_m = pipe_area * STEEL
pipe_len = frame_len * 1.10                              # + 10 % wastage
pipe_kg = pipe_len * pipe_kg_m

rod_len = 6 * 0.480 * 1.10
rod_kg_m = math.pi * 0.006 ** 2 * STEEL
rod_kg = rod_len * rod_kg_m

STEEL_RATE = 60.0  # ₹/kg, midpoint of ₹55–65/kg

mdf_area_sqft = 0.426 * 0.253 / 0.09290304 * 1.10        # nested DXF area + 10 %

# ---------------- items ----------------
# (item, qty, unit, rate, basis, note)
ITEMS = [
    ("Clay pots", 1, "lot (30 pots)", 1000, "Actual", "Given by the team"),
    ("Water pump", 1, "pc", 250, "Actual", "Given by the team"),
    ("Tubing", 1, "lot", 110, "Actual", "Given by the team"),
    ("Exhaust fans", 2, "pc", 750, "Actual", "Given by the team"),
    ("Spray paint", 1, "lot", 200, "Actual", "Given by the team"),
    ("Water tray / tub", 1, "pc", 150, "Actual", "Given by the team"),
    ("MS square pipe 20 × 20 mm (1.2 mm wall assumed)", round(pipe_kg, 2), "kg", STEEL_RATE, "Estimated",
     f"{pipe_len:.2f} m ({frame_len:.2f} m from the CAD model + 10 % wastage) × {pipe_kg_m:.3f} kg/m; market rate, {DATE}, {SOURCES['steel'][0]}"),
    ("MS round rod Ø12 mm, 6 × 480 mm", round(rod_kg, 2), "kg", STEEL_RATE, "Estimated",
     f"{rod_len:.2f} m (2.88 m + 10 % wastage) × {rod_kg_m:.3f} kg/m; market rate, {DATE}, same MS rate assumed"),
    ("ESP32 development board (38-pin)", 1, "pc", 455, "Estimated", f"Market rate, {DATE}, Robocraze"),
    ("DHT11 sensor module", 1, "pc", 62, "Estimated", f"Market rate, {DATE}, Robocraze"),
    ("3-channel 5 V relay module", 1, "pc", 227, "Estimated", f"Market rate, {DATE}, Robocraze (ACEBOTT 3-channel)"),
    ("Breadboard, 830 points", 1, "pc", 68, "Estimated", f"Market rate, {DATE}, Robocraze (MB102)"),
    ("Jumper wire set (M-M, M-F, F-F)", 1, "set", 142, "Estimated", f"Market rate, {DATE}, Robocraze"),
    ("3 mm MDF for the enclosure", round(mdf_area_sqft, 2), "sq ft", 13.55, "Estimated",
     f"Nested DXF area 426 × 253 mm + 10 %; market rate, {DATE}, {SOURCES['mdf'][0]}"),
    ("Welding electrodes 2.5 mm", 0.5, "kg", 165, "Estimated", f"Quantity assumed; market rate, {DATE}, {SOURCES['electrode'][0]}"),
    ("Cutting / grinding discs 4 inch", 4, "pc", 9, "Estimated", f"Quantity assumed; market rate, {DATE}, {SOURCES['disc'][0]}"),
]

rows = []
for item, qty, unit, rate, basis, note in ITEMS:
    amount = int(qty * rate + 0.5)  # round half up
    rows.append({"Item": item, "Qty": qty, "Unit": unit, "Rate (₹)": rate, "Amount (₹)": amount, "Basis": basis, "Note": note})
actual = sum(r["Amount (₹)"] for r in rows if r["Basis"] == "Actual")
estimated = sum(r["Amount (₹)"] for r in rows if r["Basis"] == "Estimated")
grand = actual + estimated
assert actual == 3210, actual  # team's subtotal
assert grand == sum(r["Amount (₹)"] for r in rows)

# ---------------- CSV ----------------
with open(ROOT / "data/cost-sheet.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["Item", "Qty", "Unit", "Rate (INR)", "Amount (INR)", "Basis", "Note"])
    for r in rows:
        w.writerow([r["Item"], r["Qty"], r["Unit"], r["Rate (₹)"], r["Amount (₹)"], r["Basis"], r["Note"]])
    w.writerow(["Actual subtotal", "", "", "", actual, "Actual", ""])
    w.writerow(["Estimated subtotal", "", "", "", estimated, "Estimated", ""])
    w.writerow(["Grand total", "", "", "", grand, "", "Labour and machine time not included (Tinkerers' Lab facility)"])


def fmt(x):
    return f"{x:,.2f}".rstrip("0").rstrip(".") if isinstance(x, float) else f"{x:,}"


# ---------------- Markdown ----------------
md = [
    "# Cost Sheet",
    "",
    f"Prices in Indian rupees (₹). **Actual** = amounts paid, given by the team. **Estimated** = market rates looked up on {DATE} (sources below). Generated by `tools/cost-sheet.py`, which also writes [`data/cost-sheet.csv`](../data/cost-sheet.csv).",
    "",
    "| Item | Qty | Unit | Rate (₹) | Amount (₹) | Basis |",
    "|---|---:|---|---:|---:|---|",
]
for r in rows:
    md.append(f"| {r['Item']} | {fmt(r['Qty'])} | {r['Unit']} | {fmt(r['Rate (₹)'])} | {fmt(r['Amount (₹)'])} | {r['Basis']} |")
md += [f"| **Actual subtotal** | | | | **{fmt(actual)}** | Actual |",
       f"| **Estimated subtotal** | | | | **{fmt(estimated)}** | Estimated |",
       f"| **Grand total** | | | | **{fmt(grand)}** | |",
       "",
       f"Built for about ₹{fmt(grand)} in materials; far below the purchase cost of a room AC.",
       "",
       "**Not included:** labour and machine time — the frame, laser cutting and 3D printing were done with the Tinkerers' Lab facility.",
       "",
       "## How the estimates were made",
       "",
       f"- **MS frame length:** the SolidWorks GLB export (`assets/models/claybreeze-assembly.glb`, mesh `20mm_frame-1`) is a closed mesh of {frame_vol * 1e6:,.0f} cm³. It models the pipe as a solid 20 × 20 mm bar, so its volume ÷ 400 mm² gives the member length: **{frame_len:.2f} m** (front and back frames, depth members, rear fan-mount extension). With 10 % wastage: **{pipe_len:.2f} m**.",
       f"- **MS frame mass:** because the CAD section is solid, volume × 7850 kg/m³ ({frame_vol * STEEL:.1f} kg) would overstate a hollow pipe. The wall thickness is not confirmed, so a **1.2 mm wall is assumed**: {pipe_area * 1e6:.2f} mm² → {pipe_kg_m:.3f} kg/m → **{pipe_kg:.2f} kg**.",
       f"- **Rods:** 6 × 480 mm of Ø12 mm round bar + 10 % = {rod_len:.2f} m × {rod_kg_m:.3f} kg/m = **{rod_kg:.2f} kg**.",
       f"- **Steel rate:** ₹{STEEL_RATE:.0f}/kg, the midpoint of ₹55–65/kg for MS pipes ([OfBusiness]({SOURCES['steel'][1]})); the same rate is assumed for the round bar.",
       f"- **Electronics:** [Robocraze]({SOURCES['robocraze'][1]}) listed prices on {DATE} (ESP32 38-pin ₹455, DHT11 ₹62, 3-channel relay ₹227, MB102 breadboard ₹68, jumper wire set ₹142).",
       f"- **MDF:** nested area of the enclosure DXF (426 × 253 mm) + 10 % at ₹13.55/sq ft ([materialdepot.in]({SOURCES['mdf'][1]})).",
       f"- **Consumables:** 0.5 kg of 2.5 mm electrodes at ₹165/kg ([TradeIndia]({SOURCES['electrode'][1]})) and four 4-inch discs at ₹9 each ([IndiaMART]({SOURCES['disc'][1]})); the quantities are assumptions.",
       "",
       "Market prices change; the estimated rows are indicative, not quotes.",
       "",
       "## Next-stage material for water resistance (future scope)",
       "",
       "- **MS + epoxy primer + powder coating:** lowest cost.",
       "- **GI square pipe with cold-galvanised weld joints:** recommended.",
       "- **Aluminium tube, bolted/riveted:** light, rust-free.",
       "- **SS304:** most durable, highest cost.",
       ""]
(ROOT / "docs/cost-sheet.md").write_text("\n".join(md), encoding="utf-8")

# ---------------- HTML table ----------------
def chip(basis):
    return f'<span class="cost-badge cost-{basis.lower()}">{basis}</span>'


h = ['<table class="fab-table cost-table stack-sm" id="cost-table">',
     '            <caption>Materials cost (₹)</caption>',
     '            <thead><tr><th scope="col">Item</th><th scope="col">Qty</th><th scope="col">Unit</th><th scope="col">Rate (₹)</th><th scope="col">Amount (₹)</th><th scope="col">Basis</th></tr></thead>',
     '            <tbody>']
for r in rows:
    h.append(f'              <tr><td>{r["Item"]}</td><td class="num">{fmt(r["Qty"])}</td><td>{r["Unit"]}</td><td class="num">{fmt(r["Rate (₹)"])}</td><td class="num">{fmt(r["Amount (₹)"])}</td><td>{chip(r["Basis"])}</td></tr>')
h += ['            </tbody>',
      '            <tfoot>',
      f'              <tr><th scope="row">Actual subtotal</th><td class="num cost-total" colspan="5">₹{fmt(actual)}</td></tr>',
      f'              <tr><th scope="row">Estimated subtotal</th><td class="num cost-total" colspan="5">₹{fmt(estimated)}</td></tr>',
      f'              <tr class="cost-grand"><th scope="row">Grand total</th><td class="num cost-total" colspan="5">₹{fmt(grand)}</td></tr>',
      '            </tfoot>',
      '          </table>']
h.append(f'          <p class="cost-note"><strong>Built for about ₹{fmt(grand)} in materials; far below the purchase cost of a room AC.</strong> '
         "Labour and machine time are not included: the frame, laser cutting and 3D printing used the Tinkerers' Lab facility.</p>")
html_table = "\n".join(h)

# ---------------- TeX table ----------------
def tex(s):
    return str(s).replace("₹", "").replace("×", r"$\times$").replace("Ø", r"$\varnothing$").replace("%", r"\%").replace("&", r"\&")


t = [r"\begin{table}[H]", r"\centering", r"\caption{Cost sheet (Rs.). Actual = paid (given by the team); Estimated = market rate, " + DATE + r" (sources in the text).}",
     r"\label{tab:cost}", r"\small", r"\begin{tabularx}{\linewidth}{@{}>{\raggedright\arraybackslash}Xrlrrl@{}}", r"\toprule",
     r"\textbf{Item} & \textbf{Qty} & \textbf{Unit} & \textbf{Rate} & \textbf{Amount} & \textbf{Basis} \\", r"\midrule"]
for r in rows:
    t.append(f"{tex(r['Item'])} & {fmt(r['Qty'])} & {tex(r['Unit'])} & {fmt(r['Rate (₹)'])} & {fmt(r['Amount (₹)']).replace(',', '{,}')} & {r['Basis']} \\\\")
t += [r"\midrule",
      rf"\multicolumn{{4}}{{@{{}}l}}{{\textbf{{Actual subtotal}}}} & \textbf{{{fmt(actual).replace(',', '{,}')}}} & \\",
      rf"\multicolumn{{4}}{{@{{}}l}}{{\textbf{{Estimated subtotal}}}} & \textbf{{{fmt(estimated).replace(',', '{,}')}}} & \\",
      rf"\multicolumn{{4}}{{@{{}}l}}{{\textbf{{Grand total}}}} & \textbf{{{fmt(grand).replace(',', '{,}')}}} & \\",
      r"\bottomrule", r"\end{tabularx}", r"\end{table}", "",
      r"\noindent\textbf{Built for about Rs.~" + fmt(grand).replace(",", "{,}") + r" in materials; far below the purchase cost of a room AC.} "
      r"Labour and machine time are not included: the frame, laser cutting and 3D printing used the Tinkerers' Lab facility."]
tex_table = "\n".join(t)


def put(path, start, end, content):
    p = ROOT / path
    s = p.read_text(encoding="utf-8")
    i, j = s.index(start) + len(start), s.index(end)
    p.write_text(s[:i] + "\n" + content + "\n" + s[j:], encoding="utf-8")


put("index.html", "<!-- COST-TABLE:START -->", "<!-- COST-TABLE:END -->", "          " + html_table + "\n          ")
put("report/main.tex", "% COST-TABLE:START", "% COST-TABLE:END", tex_table)
print(json.dumps({"frame_volume_cm3": round(frame_vol * 1e6, 1), "frame_len_m": round(frame_len, 3), "pipe_len_m": round(pipe_len, 3),
                  "pipe_kg": round(pipe_kg, 2), "rod_kg": round(rod_kg, 2), "solid_mass_kg": round(frame_vol * STEEL, 1),
                  "actual": actual, "estimated": estimated, "grand": grand}, indent=1))
