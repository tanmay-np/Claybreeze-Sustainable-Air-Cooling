/*
 * "From SolidWorks to Laser Cutter — exporting DXF files" (Makerspace Workbench).
 * An 8-step stepper; each step has an original, stylised animated SVG illustration
 * (a generic CAD-window look, not a copy of any product's interface). Menu paths in the
 * text follow the SOLIDWORKS 2024 help pages cited with each step.
 * The worked example is the ClayBreeze enclosure; PANEL_D is the 150 x 100 mm side panel
 * taken from cad/dxf-enclosure/basic-box-120x150x100-3mm.dxf by tools/dxf-panel-preview.py.
 * Animations loop only while on screen and stop under prefers-reduced-motion / ?reducedmotion.
 * window.ClayBreezeDxfGuide exposes the illustrations so tools/dxf-keyframes.html can render
 * the report's static figure strip from the same code.
 */
(() => {
  "use strict";
  const SVGNS = "http://www.w3.org/2000/svg";
  const params = new URLSearchParams(location.search);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || params.has("reducedmotion");
  const el = (tag, attrs, parent) => { const n = document.createElementNS(SVGNS, tag); Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v)); if (parent) parent.append(n); return n; };
  const txt = (x, y, s, cls, parent, extra) => { const t = el("text", { x, y, class: cls || "dg-t", ...(extra || {}) }, parent); t.textContent = s; return t; };
  const c01 = (u) => (u < 0 ? 0 : u > 1 ? 1 : u);
  const ease = (u) => { u = c01(u); return u * u * (3 - 2 * u); };
  const lerp = (a, b, u) => a + (b - a) * u;
  const f1 = (v) => (+v).toFixed(1);
  const win = (u, a, b) => ease((u - a) / (b - a)); // 0..1 between times a and b

  // 150 x 100 mm side panel of the ClayBreeze enclosure (mm, y down), generated from the DXF.
  const PANEL_D = "M150 0 L147 0 L133.5 0 L133.5 3 L120.5 3 L120.5 0 L107.5 0 L107.5 3 L94.5 3 L94.5 0 L81.5 0 L81.5 3 L68.5 3 L68.5 0 L55.5 0 L55.5 3 L42.5 3 L42.5 0 L29.5 0 L29.5 3 L16.5 3 L16.5 0 L3 0 L0 0 L0 3 L0 17.5 L3 17.5 L3 30.5 L0 30.5 L0 43.5 L3 43.5 L3 56.5 L0 56.5 L0 69.5 L3 69.5 L3 82.5 L0 82.5 L0 97 L0 100 L3 100 L16.5 100 L16.5 97 L29.5 97 L29.5 100 L42.5 100 L42.5 97 L55.5 97 L55.5 100 L68.5 100 L68.5 97 L81.5 97 L81.5 100 L94.5 100 L94.5 97 L107.5 97 L107.5 100 L120.5 100 L120.5 97 L133.5 97 L133.5 100 L147 100 L150 100 L150 97 L150 82.5 L147 82.5 L147 69.5 L150 69.5 L150 56.5 L147 56.5 L147 43.5 L150 43.5 L150 30.5 L147 30.5 L147 17.5 L150 17.5 L150 3 Z";

  const HELP = {
    units: "https://help.solidworks.com/2023/english/SolidWorks/sldworks/HIDD_OPTIONS_UNITS_NEW.htm",
    output: "https://help.solidworks.com/2024/english/SolidWorks/sldworks/HIDD_DVE_PART_EXPORT_OPTIONS.htm",
    options: "https://help.solidworks.com/2024/English/SolidWorks/sldworks/r_dxf_dwg_export_options.htm",
    sheet: "https://help.solidworks.com/2024/English/solidworks/sldworks/t_Saving_Sheet_Metal_Flat_Patterns_DXF_Files.htm"
  };

  const STEPS = [
    { title: "Model each panel at 1:1 in millimetres",
      html: "Set the part to millimetres (<b>Tools › Options › Document Properties › Units</b>, unit system <b>MMGS</b>). Sketch the panel outline at full size — for our long side, 150 × 100 mm — and extrude it to the sheet thickness: <b>3 mm</b> for our MDF. One part per panel keeps each DXF simple.",
      src: [["Document Properties – Units", HELP.units]], period: 4.6, still: 3.8 },
    { title: "Add finger joints and allow for kerf",
      html: "Cut tabs and slots along the mating edges so the six panels press together — our DXF has 13 mm fingers, 3 mm deep (the sheet thickness). The beam burns away a thin strip (the kerf), so tabs come out slightly narrow and slots wide. Either offset the outline by half the kerf in CAD or apply kerf compensation in the laser software — see the <a class=\"text-link\" href=\"#fl-kerf\">kerf demo</a>.",
      src: [], period: 5, still: 3.6 },
    { title: "Method A — export a face from the part",
      html: "Select the panel's flat face, then <b>File › Save As</b> and choose <b>Dxf (*.dxf)</b> as <i>Save as type</i>. The <b>DXF/DWG Output</b> PropertyManager opens: under <i>Export</i> choose <b>Faces / loops / edges</b> (or <b>Annotation views</b> to export a named view such as Front), check the preview in the <i>DXF/DWG Cleanup</i> window, remove anything you do not want, and click <b>Save</b>. You can also right-click the selected face and choose <b>Export to DXF / DWG</b>. A face exported from a part keeps its true size; the help's <i>Scale output 1:1</i> option applies to drawings only.",
      src: [["DXF/DWG Output PropertyManager", HELP.output]], period: 5.6, still: 4.8 },
    { title: "Method B — export from a drawing",
      html: "Make a drawing of the panel with one <b>Front</b> view at <b>scale 1:1</b>, then hide the dimensions and annotations so only the outline is left. Choose <b>File › Save As</b>, set <i>Save as type</i> to <b>Dxf (*.dxf)</b>, click <b>Options</b> and under <b>Scale output 1:1 (Drawings only)</b> tick <b>Enable</b>, so the geometry is written at model size whatever the sheet scale.",
      src: [["DXF/DWG File Export Options", HELP.options]], period: 5, still: 3.9 },
    { title: "Method C — sheet metal flat pattern (if used)",
      html: "Only if the panel is modelled as a sheet-metal part: in the FeatureManager design tree, right-click <b>Flat-Pattern</b> and choose <b>Export to DXF/DWG</b> (or <b>File › Save As › Dxf (*.dxf)</b>). In the DXF/DWG Output PropertyManager, under <i>Entities To Export</i>, clear <b>Bend lines</b> so the laser only sees the outline. Our MDF panels are ordinary parts, so we use method A or B.",
      src: [["Saving Sheet Metal Flat Patterns as DXF Files", HELP.sheet], ["DXF/DWG Output PropertyManager", HELP.output]], period: 5, still: 4.2 },
    { title: "Export settings — what the laser needs",
      html: "Millimetres, <b>1:1</b>, no title block or border, only the cutting geometry. In the Save As <b>Options</b>, <b>Enable merging</b> (end point merging) closes tiny gaps between line ends, and <b>Export all splines as polylines</b> helps laser software that handles splines badly. Put cut lines and engrave lines on separate layers or colours — <b>Custom Map SOLIDWORKS to DXF/DWG</b> can map them to layers.",
      src: [["DXF/DWG File Export Options", HELP.options]], period: 5, still: 4.6 },
    { title: "Check the DXF before cutting",
      html: "Open the file in a DXF viewer or the laser software and confirm: the overall size (our long side measures <b>150 × 100 mm</b>), every contour is <b>closed</b>, and there are <b>no duplicate lines</b> (a doubled line is cut twice and burns the edge). Reading our DXF with <code>ezdxf</code> gives six closed outlines, 76 line segments for this panel.",
      src: [], period: 5, still: 4.6 },
    { title: "Import into the laser software and cut",
      html: "Import the DXF, give each layer its job — <b>cut</b> (red here) and <b>engrave</b> (blue) — with its own power and speed, focus on the sheet, run a test on scrap, then cut. The animation traces the real 150 × 100 mm panel outline from our DXF. Stay with the machine for the whole job.",
      src: [], period: 7.5, still: 7.2 }
  ];

  // ---------- Generic CAD-window frame ----------
  function frame(g, title, tree) {
    el("rect", { x: 6, y: 6, width: 468, height: 288, rx: 8, class: "dg-win" }, g);
    el("rect", { x: 6, y: 6, width: 468, height: 24, rx: 8, class: "dg-bar" }, g);
    el("rect", { x: 6, y: 22, width: 468, height: 8, class: "dg-bar" }, g);
    [18, 30, 42].forEach((x) => el("circle", { cx: x, cy: 18, r: 3.5, class: "dg-dot" }, g));
    txt(240, 22, title, "dg-t dg-title", g, { "text-anchor": "middle" });
    const rows = [];
    if (tree) {
      el("rect", { x: 6, y: 30, width: 104, height: 264, class: "dg-pane" }, g);
      tree.forEach((label, i) => {
        const r = el("rect", { x: 12, y: 40 + i * 22, width: 92, height: 18, rx: 3, class: "dg-row" }, g);
        txt(18, 53 + i * 22, label, "dg-t dg-small", g);
        rows.push(r);
      });
    }
    return rows;
  }
  const panelPath = (g, x, y, s, cls) => el("path", { d: PANEL_D, class: cls, transform: `translate(${x} ${y}) scale(${s})` }, g);
  const lenOf = (p) => (p.getTotalLength ? p.getTotalLength() : 600);
  const drawTo = (p, L, frac) => { p.style.strokeDasharray = `${f1(L)} ${f1(L + 10)}`; p.style.strokeDashoffset = f1(L * (1 - frac)); };
  const cursor = (g) => el("path", { d: "M0 0 L0 15 L4 11 L7 18 L10 17 L7 10 L12 10 Z", class: "dg-cursor" }, g);
  const place = (n, x, y) => n.setAttribute("transform", `translate(${f1(x)} ${f1(y)})`);
  const show = (n, o) => n.setAttribute("opacity", f1(c01(o)));
  function check(g, x, y) { const b = el("g", {}, g); el("rect", { x, y: y - 10, width: 12, height: 12, rx: 2, class: "dg-box" }, b); const m = el("path", { d: `M${x + 2.5} ${y - 4} l3 3 l5 -6`, class: "dg-tick" }, b); return { b, m }; }

  // ---------- The eight illustrations: build(g) returns update(u) ----------
  const BUILD = [
    // 1. Sketch drawn, then extruded to 3 mm
    (g) => {
      const rows = frame(g, "Part — Panel_150x100", ["Front Plane", "Sketch1", "Extrude 3 mm"]);
      const X = 175, Y = 82, W = 225, H = 150;
      const side = el("polygon", { class: "dg-solid-side" }, g);
      const topf = el("polygon", { class: "dg-solid-top" }, g);
      const face = el("rect", { x: X, y: Y, width: W, height: H, class: "dg-face" }, g);
      const sk = el("rect", { x: X, y: Y, width: W, height: H, class: "dg-sketch", pathLength: 100 }, g);
      const d1 = el("g", {}, g); el("line", { x1: X, y1: Y - 14, x2: X + W, y2: Y - 14, class: "dg-dim" }, d1); txt(X + W / 2, Y - 18, "150", "dg-t dg-dimt", d1, { "text-anchor": "middle" });
      const d2 = el("g", {}, g); el("line", { x1: X - 14, y1: Y, x2: X - 14, y2: Y + H, class: "dg-dim" }, d2); txt(X - 18, Y + H / 2 + 4, "100", "dg-t dg-dimt", d2, { "text-anchor": "end" });
      const thick = txt(X + W + 22, Y + 14, "3 mm", "dg-t dg-accent", g);
      return (u) => {
        const draw = win(u, 0.1, 1.5), dims = win(u, 1.1, 1.6), ex = win(u, 1.9, 3.1);
        sk.style.strokeDashoffset = f1(100 * (1 - draw));
        show(d1, dims * (1 - ex * 0.6)); show(d2, dims * (1 - ex * 0.6));
        const dx = 16 * ex, dy = -11 * ex;
        side.setAttribute("points", `${X + W},${Y} ${X + W + dx},${Y + dy} ${X + W + dx},${Y + H + dy} ${X + W},${Y + H}`);
        topf.setAttribute("points", `${X},${Y} ${X + dx},${Y + dy} ${X + W + dx},${Y + dy} ${X + W},${Y}`);
        show(face, ex); show(thick, win(u, 2.6, 3.1));
        rows.forEach((r, i) => r.classList.toggle("is-on", (i === 1 && u < 1.8) || (i === 2 && u >= 1.8)));
      };
    },
    // 2. Finger joints appear; kerf gap highlighted
    (g) => {
      frame(g, "Part — finger joints", ["Sketch1", "Cut tabs", "Kerf check"]);
      const X = 128, Y = 70, S = 1.4;
      const plain = el("rect", { x: X, y: Y, width: 150 * S, height: 100 * S, class: "dg-outline" }, g);
      const fingers = panelPath(g, X, Y, S, "dg-outline dg-strong");
      const LF = lenOf(fingers);
      el("circle", { cx: X + 42.5 * S, cy: Y + 1.5 * S, r: 9, class: "dg-lens" }, g);
      // Kerf inset: a tab sitting in a slot, gaps exaggerated
      const ix = 360, iy = 92;
      el("rect", { x: ix - 8, y: iy - 22, width: 112, height: 150, rx: 6, class: "dg-card" }, g);
      txt(ix + 48, iy - 6, "kerf (zoomed)", "dg-t dg-small", g, { "text-anchor": "middle" });
      el("rect", { x: ix, y: iy + 54, width: 96, height: 50, class: "dg-mat-b" }, g);
      el("rect", { x: ix + 30, y: iy + 54, width: 36, height: 26, class: "dg-slot" }, g);
      el("rect", { x: ix, y: iy + 10, width: 96, height: 34, class: "dg-mat-a" }, g);
      const tab = el("rect", { x: ix + 33, y: iy + 44, width: 30, height: 26, class: "dg-mat-a" }, g);
      const gl = el("rect", { x: ix + 30, y: iy + 54, width: 3, height: 26, class: "dg-gap" }, g);
      const gr = el("rect", { x: ix + 63, y: iy + 54, width: 3, height: 26, class: "dg-gap" }, g);
      txt(ix + 48, iy + 122, "gap = kerf", "dg-t dg-accent", g, { "text-anchor": "middle" });
      void tab;
      return (u) => {
        const grow = win(u, 0.3, 1.8);
        show(plain, 1 - grow); show(fingers, grow);
        drawTo(fingers, LF, grow);
        const pulse = u > 2 ? 0.55 + 0.45 * Math.sin((u - 2) * 4) : 0;
        show(gl, pulse); show(gr, pulse);
      };
    },
    // 3. File > Save As > Dxf (*.dxf)
    (g) => {
      frame(g, "Part — Panel_150x100", ["Sketch1", "Extrude 3 mm"]);
      const face = el("rect", { x: 160, y: 120, width: 225, height: 150, class: "dg-face is-sel" }, g);
      void face;
      txt(122, 46, "File", "dg-t dg-menu", g);
      [158, 194, 232, 270].forEach((x) => el("rect", { x, y: 38, width: 26, height: 8, rx: 2, class: "dg-ghost" }, g));
      const menu = el("g", {}, g);
      el("rect", { x: 118, y: 52, width: 120, height: 104, rx: 4, class: "dg-card" }, menu);
      [0, 1, 2].forEach((i) => el("rect", { x: 128, y: 62 + i * 20, width: 60 + i * 8, height: 8, rx: 2, class: "dg-ghost" }, menu));
      const saveRow = el("rect", { x: 122, y: 118, width: 112, height: 20, rx: 3, class: "dg-hl" }, menu);
      txt(130, 132, "Save As…", "dg-t", menu);
      const dlg = el("g", {}, g);
      el("rect", { x: 196, y: 74, width: 250, height: 150, rx: 6, class: "dg-card dg-shadow" }, dlg);
      txt(208, 94, "Save As", "dg-t dg-strongt", dlg);
      txt(208, 120, "File name:", "dg-t dg-small", dlg); txt(294, 120, "Panel_150x100", "dg-t dg-small dg-mono", dlg);
      txt(208, 146, "Save as type:", "dg-t dg-small", dlg);
      el("rect", { x: 294, y: 134, width: 140, height: 18, rx: 3, class: "dg-field" }, dlg);
      const typeTxt = txt(300, 147, "Part (*.sldprt)", "dg-t dg-small dg-mono", dlg);
      const list = el("g", {}, dlg);
      el("rect", { x: 294, y: 154, width: 140, height: 62, rx: 3, class: "dg-card" }, list);
      el("rect", { x: 302, y: 160, width: 80, height: 7, rx: 2, class: "dg-ghost" }, list);
      const dxfRow = el("rect", { x: 296, y: 172, width: 136, height: 18, rx: 3, class: "dg-hl" }, list);
      txt(302, 185, "Dxf (*.dxf)", "dg-t dg-small dg-mono", list);
      txt(302, 207, "Dwg (*.dwg)", "dg-t dg-small dg-mono", list);
      const exp = el("g", {}, g);
      el("rect", { x: 196, y: 232, width: 250, height: 30, rx: 5, class: "dg-card dg-accentbox" }, exp);
      el("circle", { cx: 212, cy: 247, r: 4.5, class: "dg-radio" }, exp);
      txt(224, 251, "Export: Faces / loops / edges", "dg-t dg-small", exp);
      const cur = cursor(g);
      return (u) => {
        show(menu, win(u, 0.3, 0.6) * (1 - win(u, 1.9, 2.1)));
        show(saveRow, win(u, 1.2, 1.5));
        show(dlg, win(u, 2.0, 2.3));
        show(list, win(u, 2.7, 2.9) * (1 - win(u, 3.7, 3.9)));
        show(dxfRow, win(u, 3.2, 3.4));
        typeTxt.textContent = u > 3.8 ? "Dxf (*.dxf)" : "Part (*.sldprt)";
        show(exp, win(u, 4.2, 4.6));
        let cx = 300, cy = 260;
        if (u < 1.9) { const a = win(u, 0.1, 0.4), b = win(u, 0.7, 1.3); cx = lerp(lerp(300, 130, a), 170, b); cy = lerp(lerp(260, 44, a), 126, b); }
        else { const a = win(u, 2.4, 2.8), b = win(u, 2.9, 3.3); cx = lerp(lerp(170, 420, a), 340, b); cy = lerp(lerp(126, 143, a), 180, b); }
        place(cur, cx, cy);
      };
    },
    // 4. Drawing sheet, view at 1:1, dimensions fade out
    (g) => {
      frame(g, "Drawing — Panel_150x100", ["Sheet1", "Drawing View1"]);
      el("rect", { x: 120, y: 38, width: 346, height: 248, class: "dg-sheet" }, g);
      el("rect", { x: 128, y: 46, width: 330, height: 232, class: "dg-sheetborder" }, g);
      const X = 186, Y = 92, S = 1.4;
      panelPath(g, X, Y, S, "dg-outline dg-strong");
      txt(X + 105, Y + 154, "Front · Scale 1:1", "dg-t dg-small", g, { "text-anchor": "middle" });
      const dims = el("g", {}, g);
      el("line", { x1: X, y1: Y - 16, x2: X + 210, y2: Y - 16, class: "dg-dim" }, dims);
      txt(X + 105, Y - 20, "150", "dg-t dg-dimt", dims, { "text-anchor": "middle" });
      el("line", { x1: X + 226, y1: Y, x2: X + 226, y2: Y + 140, class: "dg-dim" }, dims);
      txt(X + 232, Y + 74, "100", "dg-t dg-dimt", dims);
      
      const toast = el("g", { class: "dg-toast" }, g);
      el("rect", { x: 150, y: 256, width: 286, height: 22, rx: 5, class: "dg-card dg-accentbox" }, toast);
      txt(293, 271, "File › Save As › Dxf (*.dxf) › Options › 1:1", "dg-t dg-small", toast, { "text-anchor": "middle" });
      return (u) => { show(dims, 1 - win(u, 1.6, 2.4)); show(toast, win(u, 2.9, 3.3)); };
    },
    // 5. Flat pattern > right-click > Export to DXF/DWG
    (g) => {
      const rows = frame(g, "Sheet-metal part (if used)", ["Sheet-Metal", "Base-Flange", "Flat-Pattern"]);
      panelPath(g, 180, 92, 1.4, "dg-outline dg-strong");
      const ctx = el("g", {}, g);
      el("rect", { x: 96, y: 98, width: 150, height: 78, rx: 4, class: "dg-card dg-shadow" }, ctx);
      el("rect", { x: 106, y: 108, width: 70, height: 8, rx: 2, class: "dg-ghost" }, ctx);
      const hl = el("rect", { x: 100, y: 124, width: 142, height: 20, rx: 3, class: "dg-hl" }, ctx);
      txt(108, 138, "Export to DXF/DWG", "dg-t dg-small", ctx);
      el("rect", { x: 106, y: 154, width: 56, height: 8, rx: 2, class: "dg-ghost" }, ctx);
      const out = el("g", {}, g);
      el("rect", { x: 262, y: 222, width: 190, height: 58, rx: 5, class: "dg-card dg-accentbox" }, out);
      txt(272, 240, "Entities To Export", "dg-t dg-small dg-strongt", out);
      const c1 = check(out, 272, 262); txt(290, 261, "Geometry", "dg-t dg-small", out); void c1;
      const c2 = check(out, 362, 262); txt(380, 261, "Bend lines", "dg-t dg-small", out);
      const cur = cursor(g);
      return (u) => {
        rows.forEach((r, i) => r.classList.toggle("is-on", i === 2 && u > 1.1));
        show(ctx, win(u, 1.5, 1.7)); show(hl, win(u, 2.2, 2.4)); show(out, win(u, 3.0, 3.3));
        show(c2.m, 1 - win(u, 3.6, 3.8));
        const a = win(u, 0.2, 1.0), b = win(u, 1.8, 2.3);
        place(cur, lerp(lerp(300, 60, a), 150, b), lerp(lerp(230, 92, a), 134, b));
      };
    },
    // 6. Export checklist card
    (g) => {
      frame(g, "Before you export", null);
      el("rect", { x: 70, y: 44, width: 340, height: 236, rx: 8, class: "dg-card" }, g);
      txt(90, 70, "Export settings for the laser", "dg-t dg-strongt", g);
      const items = [["Units: millimetres (MMGS)", true], ["Scale output 1:1 — Enable", true], ["Title block and border on the sheet", false], ["End point merging — Enable merging", true], ["Export all splines as polylines", true]];
      const boxes = items.map(([label], i) => { const c = check(g, 92, 102 + i * 30); txt(112, 101 + i * 30, label, "dg-t dg-small", g); return c; });
      const layers = el("g", {}, g);
      txt(92, 262, "Layers:", "dg-t dg-small", layers);
      el("rect", { x: 140, y: 252, width: 12, height: 12, class: "dg-red" }, layers); txt(156, 262, "CUT", "dg-t dg-small", layers);
      el("rect", { x: 196, y: 252, width: 12, height: 12, class: "dg-blue" }, layers); txt(212, 262, "ENGRAVE", "dg-t dg-small", layers);
      return (u) => {
        boxes.forEach((c, i) => {
          const at = 0.5 + i * 0.6;
          if (items[i][1]) show(c.m, win(u, at, at + 0.2));
          else show(c.m, 1 - win(u, at, at + 0.25)); // the title block starts ticked and is cleared
          c.b.classList.toggle("is-off", !items[i][1] && u > at + 0.2);
        });
        show(layers, win(u, 3.6, 3.9));
      };
    },
    // 7. DXF viewer: outline pulses closed, dimensions check out
    (g) => {
      frame(g, "DXF viewer — basic-box … .dxf", ["Layer 0", "76 lines"]);
      const X = 150, Y = 70, S = 1.5;
      const p = panelPath(g, X, Y, S, "dg-outline dg-strong");
      const glow = panelPath(g, X, Y, S, "dg-glow");
      const LP = lenOf(p);
      const m = el("g", {}, g);
      el("line", { x1: X, y1: Y + 166, x2: X + 225, y2: Y + 166, class: "dg-dim" }, m);
      txt(X + 112, Y + 182, "150.00 mm ✓", "dg-t dg-ok", m, { "text-anchor": "middle" });
      el("line", { x1: X + 240, y1: Y, x2: X + 240, y2: Y + 150, class: "dg-dim" }, m);
      txt(X + 246, Y + 80, "100.00 ✓", "dg-t dg-ok", m);
      const c1 = txt(122, 274, "1 closed contour ✓", "dg-t dg-ok", g);
      const c2 = txt(300, 274, "0 duplicate lines ✓", "dg-t dg-ok", g);
      return (u) => {
        drawTo(p, LP, win(u, 0, 1.2));
        show(glow, u > 1.2 ? 0.35 + 0.35 * Math.sin((u - 1.2) * 5) : 0);
        show(c1, win(u, 1.6, 1.9)); show(m, win(u, 2.4, 2.8)); show(c2, win(u, 3.3, 3.6));
      };
    },
    // 8. Laser software: layers assigned, head cuts the real panel, then engraves
    (g) => {
      frame(g, "Laser software", null);
      el("rect", { x: 6, y: 30, width: 112, height: 264, class: "dg-pane" }, g);
      txt(14, 50, "Layers", "dg-t dg-small dg-strongt", g);
      const l1 = el("g", {}, g); el("rect", { x: 14, y: 60, width: 10, height: 10, class: "dg-red" }, l1); txt(30, 69, "Cut", "dg-t dg-small", l1); txt(30, 83, "power · speed", "dg-t dg-tiny", l1);
      const l2 = el("g", {}, g); el("rect", { x: 14, y: 96, width: 10, height: 10, class: "dg-blue" }, l2); txt(30, 105, "Engrave", "dg-t dg-small", l2); txt(30, 119, "power · speed", "dg-t dg-tiny", l2);
      el("rect", { x: 126, y: 38, width: 340, height: 248, class: "dg-mdf" }, g);
      const X = 184, Y = 88, S = 1.5;
      panelPath(g, X, Y, S, "dg-guide");
      const cut = panelPath(g, X, Y, S, "dg-cut");
      const eng = txt(X + 112, Y + 82, "ClayBreeze", "dg-t dg-engrave", g, { "text-anchor": "middle" });
      const clipId = `dg-clip-${Math.random().toString(36).slice(2, 7)}`;
      const clip = el("clipPath", { id: clipId }, g);
      const clipRect = el("rect", { x: X + 40, y: Y + 60, width: 0, height: 34 }, clip);
      eng.setAttribute("clip-path", `url(#${clipId})`);
      const head = el("g", {}, g);
      el("circle", { r: 7, class: "dg-head" }, head);
      const spark = el("circle", { r: 3.5, class: "dg-spark" }, head);
      const L = lenOf(cut);
      return (u) => {
        show(l1, win(u, 0.2, 0.5)); show(l2, win(u, 0.5, 0.8));
        const p = win(u, 0.9, 5.1);
        drawTo(cut, L, p);
        const e = win(u, 5.3, 6.8);
        clipRect.setAttribute("width", f1(150 * e));
        let hx, hy;
        if (u < 5.2) { const pt = cut.getPointAtLength ? cut.getPointAtLength(L * p) : { x: 0, y: 0 }; hx = X + pt.x * S; hy = Y + pt.y * S; }
        else { hx = X + 40 + 150 * e; hy = Y + 78; }
        place(head, hx, hy);
        show(spark, (u > 0.9 && u < 5.1) || (u > 5.3 && u < 6.8) ? 0.6 + 0.4 * Math.sin(u * 40) : 0);
        spark.classList.toggle("is-blue", u > 5.2);
      };
    }
  ];

  // Render one step's illustration into an <svg>; returns update(t).
  function render(svg, i) {
    svg.querySelectorAll(":scope > g.dg-scene").forEach((n) => n.remove());
    const g = el("g", { class: "dg-scene" }, svg);
    const update = BUILD[i](g);
    return (t) => update(t % STEPS[i].period);
  }
  window.ClayBreezeDxfGuide = { STEPS, render };

  // ---------- Stepper on the page ----------
  const box = document.getElementById("dxf-guide");
  if (!box) return;
  const svg = box.querySelector(".dg-svg");
  const titleEl = box.querySelector(".dg-step-title"), bodyEl = box.querySelector(".dg-step-body"), srcEl = box.querySelector(".dg-step-src");
  const countEl = box.querySelector(".dg-count"), numsWrap = box.querySelector(".dg-nums");
  const prevBtn = box.querySelector("[data-dg=prev]"), nextBtn = box.querySelector("[data-dg=next]"), playBtn = box.querySelector("[data-dg=play]");
  let current = 0, update = null, t = 0, last = null, raf = null, visible = false, playing = !reduce;
  const nums = STEPS.map((s, k) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dg-num";
    b.textContent = String(k + 1);
    b.setAttribute("aria-label", `Step ${k + 1}: ${s.title}`);
    b.addEventListener("click", () => go(k));
    numsWrap.append(b);
    return b;
  });
  function frameLoop(now) {
    if (last !== null) t += Math.min(0.25, (now - last) / 1000);
    last = now;
    update(t);
    if (playing && visible) raf = requestAnimationFrame(frameLoop); else { raf = null; last = null; }
  }
  function kick() { if (!raf && playing && visible && !reduce) { last = null; raf = requestAnimationFrame(frameLoop); } }
  function go(k) {
    current = (k + STEPS.length) % STEPS.length;
    const s = STEPS[current];
    box.dataset.step = String(current + 1);
    countEl.textContent = `Step ${current + 1} of ${STEPS.length}`;
    titleEl.textContent = `${current + 1}. ${s.title}`;
    bodyEl.innerHTML = s.html; // static, authored content
    srcEl.replaceChildren();
    if (s.src.length) {
      srcEl.append(document.createTextNode("SOLIDWORKS help: "));
      s.src.forEach(([label, url], i) => { const a = document.createElement("a"); a.href = url; a.className = "text-link"; a.textContent = label; a.rel = "noopener"; if (i) srcEl.append(document.createTextNode(" · ")); srcEl.append(a); });
    }
    nums.forEach((b, j) => { b.classList.toggle("is-active", j === current); if (j === current) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
    svg.setAttribute("aria-label", `Illustration for step ${current + 1}: ${s.title}`);
    update = render(svg, current);
    t = reduce ? s.still : 0;
    update(t);
    kick();
  }
  prevBtn.addEventListener("click", () => go(current - 1));
  nextBtn.addEventListener("click", () => go(current + 1));
  box.addEventListener("keydown", (e) => {
    if (e.target.closest("a")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); go(current + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(current - 1); }
  });
  function syncPlay() { playBtn.textContent = playing ? "Pause" : "Play"; playBtn.setAttribute("aria-pressed", String(playing)); }
  playBtn.addEventListener("click", () => { playing = !playing && !reduce; syncPlay(); if (playing) kick(); });
  if (reduce) { playBtn.disabled = true; playBtn.title = "Animation off (reduced motion)"; }
  syncPlay();
  if ("IntersectionObserver" in window) new IntersectionObserver((es) => es.forEach((e) => { visible = e.isIntersecting; kick(); }), { threshold: 0.1 }).observe(box);
  else { visible = true; }
  go(0);
  if (params.has("debuganim")) window.__dxfGuide = { go, set: (v) => { t = v; update(t); }, stop: () => { playing = false; syncPlay(); } };
})();
