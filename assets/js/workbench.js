/*
 * Makerspace Workbench (Part II of the page): 3D printing and laser cutting at Tinkerers' Lab.
 * Interactive pieces: abbreviation tooltips, printer cards, photo grids, H2D labelled view,
 * the two FDM motion types (bed-slinger vs CoreXY), the FDM walkthrough, laser head motion,
 * uni- vs bidirectional engraving, layer-height slider, material picker, cut/engrave demo,
 * kerf demo, lab videos and the safety checklist. No external requests; all images are local.
 * Animations run on requestAnimationFrame only while on screen, and stop for
 * prefers-reduced-motion or the ?reducedmotion test flag (a still frame is drawn instead).
 */
(() => {
  "use strict";
  // Old links to the former section id keep working.
  if (location.hash === "#fablab") location.replace("#workbench");
  const root = document.getElementById("workbench");
  if (!root) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduce = motionQuery.matches || params.has("reducedmotion");
  document.documentElement.classList.toggle("fl-reduce", reduce);
  const SVGNS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs, parent) => {
    const n = document.createElementNS(SVGNS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v));
    if (parent) parent.append(n);
    return n;
  };
  const svgText = (x, y, text, cls, parent, extra) => { const t = svgEl("text", { x, y, class: cls, ...(extra || {}) }, parent); t.textContent = text; return t; };
  const make = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
  const clamp01 = (u) => (u < 0 ? 0 : u > 1 ? 1 : u);
  const ease = (u) => { u = clamp01(u); return u * u * (3 - 2 * u); };
  const lerp = (a, b, u) => a + (b - a) * u;
  const f1 = (v) => v.toFixed(1);
  function whenVisible(el, onIn, onOut, threshold = 0.35) {
    if (!("IntersectionObserver" in window)) { onIn(); return; }
    new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? onIn() : onOut && onOut())), { threshold }).observe(el);
  }

  // Animation clock: time only advances while playing AND on screen; draw(t) is called every frame.
  const animators = [];
  function makeAnimator(el, draw, stillT = 0) {
    let playing = !reduce, visible = false, raf = null, last = null, t = reduce ? stillT : 0;
    function frame(now) {
      if (last !== null) t += Math.min(0.25, (now - last) / 1000);
      last = now;
      draw(t);
      if (playing && visible) raf = requestAnimationFrame(frame);
      else { raf = null; last = null; }
    }
    function kick() { if (!raf && playing && visible) { last = null; raf = requestAnimationFrame(frame); } }
    whenVisible(el, () => { visible = true; kick(); }, () => { visible = false; }, 0.1);
    draw(t);
    const api = {
      get playing() { return playing; },
      set(on) { playing = on && !reduce; if (playing) kick(); else draw(t); },
      reset(v = 0) { t = reduce ? stillT : v; draw(t); },
      redraw() { draw(t); }
    };
    animators.push(api);
    if (params.has("debuganim")) (window.__wbAnimators = window.__wbAnimators || {})[el.id] = api;
    return api;
  }
  function bindPlayButton(btn, anim, onChange) {
    if (!btn) return;
    const sync = () => { btn.textContent = anim.playing ? "Pause" : "Play"; btn.setAttribute("aria-pressed", String(anim.playing)); };
    btn.addEventListener("click", () => { anim.set(!anim.playing); sync(); if (onChange) onChange(anim.playing); });
    if (reduce) { btn.disabled = true; btn.title = "Animation off (reduced motion)"; }
    sync();
    return sync;
  }
  motionQuery.addEventListener?.("change", (e) => {
    reduce = e.matches || params.has("reducedmotion");
    document.documentElement.classList.toggle("fl-reduce", reduce);
    animators.forEach((a) => a.set(!reduce));
  });

  // Arrow markers shared by the generated diagrams (one set per SVG, ids prefixed).
  function addMarkers(svg, prefix) {
    const defs = svgEl("defs", {}, svg);
    ["x", "y", "z", "n"].forEach((k) => {
      const m = svgEl("marker", { id: `${prefix}-${k}`, viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse", class: `mk mk-${k}` }, defs);
      svgEl("path", { d: "M0 0 L10 5 L0 10 z" }, m);
    });
  }
  const arrow = (parent, prefix, axis, x1, y1, x2, y2, both) => svgEl("line", { x1: f1(x1), y1: f1(y1), x2: f1(x2), y2: f1(y2), class: `axis-line ax-${axis}`, "marker-end": `url(#${prefix}-${axis})`, ...(both ? { "marker-start": `url(#${prefix}-${axis})` } : {}) }, parent);

  // ---------------- Abbreviations: tap / hover / focus tooltips ----------------
  const tip = make("div", "fl-tip");
  tip.id = "fl-tip";
  tip.setAttribute("role", "tooltip");
  tip.hidden = true;
  document.body.append(tip);
  let tipFor = null;
  function placeTip(target) {
    const r = target.getBoundingClientRect();
    const w = tip.offsetWidth, h = tip.offsetHeight;
    const left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
    let top = r.bottom + 8;
    if (top + h > window.innerHeight - 8) top = r.top - h - 8;
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  }
  function showTip(target) {
    tipFor = target;
    tip.textContent = target.dataset.tip;
    tip.hidden = false;
    target.setAttribute("aria-describedby", "fl-tip");
    placeTip(target);
  }
  function hideTip() {
    if (tipFor) tipFor.removeAttribute("aria-describedby");
    tipFor = null;
    tip.hidden = true;
  }
  $$("abbr[title]", root).forEach((ab) => {
    if (ab.closest("button, label, summary, a")) return; // keep the native title inside other controls
    ab.dataset.tip = ab.title;
    ab.removeAttribute("title");
    ab.tabIndex = 0;
    ab.classList.add("fl-abbr");
    ab.setAttribute("role", "button");
    ab.setAttribute("aria-label", `${ab.textContent}: ${ab.dataset.tip}`);
    ab.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") showTip(ab); });
    ab.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse" && tipFor === ab) hideTip(); });
    ab.addEventListener("focus", () => showTip(ab));
    ab.addEventListener("blur", () => { if (tipFor === ab) hideTip(); });
    ab.addEventListener("click", (e) => { e.stopPropagation(); if (tipFor === ab && !tip.hidden) hideTip(); else showTip(ab); });
    ab.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (tipFor === ab) hideTip(); else showTip(ab); } });
  });
  document.addEventListener("click", () => hideTip());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideTip(); });
  window.addEventListener("scroll", () => { if (tipFor) placeTip(tipFor); }, { passive: true });
  window.addEventListener("resize", () => { if (tipFor) placeTip(tipFor); });

  // ---------------- Printer showcase: expand to key specs ----------------
  $$(".printer-toggle", root).forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (panel) panel.hidden = !open;
      const sign = btn.querySelector("span");
      if (sign) sign.textContent = open ? "−" : "+";
      btn.closest(".printer-card")?.classList.toggle("is-open", open);
    });
  });

  // ---------------- Photo grids (wrapping; each grid is its own viewer group) ----------------
  const ui = window.ClayBreezeUI;
  const gallery = Array.isArray(window.CLAYBREEZE_GALLERY) ? window.CLAYBREEZE_GALLERY : [];
  $$(".wb-grid", root).forEach((grid) => {
    if (!ui) return;
    let items = [];
    if (grid.dataset.categories) { const cats = grid.dataset.categories.split(","); items = gallery.filter((g) => cats.includes(g.category)); }
    if (grid.dataset.srcs) items = grid.dataset.srcs.split("|").map((src) => ui.bySrc(src)).filter(Boolean);
    items.forEach((item) => {
      const fig = make("figure", "wb-card");
      fig.append(ui.viewerButton(item, "wb-thumb", { sizes: "(min-width: 1200px) 290px, (min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw" }, items), make("figcaption", "", item.title));
      grid.append(fig);
    });
  });

  // ---------------- Lab videos (from window.CLAYBREEZE_VIDEOS) ----------------
  const videoWrap = $("#fl-videos");
  (Array.isArray(window.CLAYBREEZE_VIDEOS) ? window.CLAYBREEZE_VIDEOS : []).forEach((v) => {
    if (!videoWrap) return;
    const fig = make("figure", "fl-video");
    const video = make("video", "fl-autoplay");
    Object.assign(video, { muted: true, loop: true, playsInline: true, preload: "none", controls: true, poster: v.poster, width: v.width, height: v.height });
    video.setAttribute("muted", "");
    video.setAttribute("aria-label", v.label);
    const source = make("source");
    source.src = v.src;
    source.type = "video/mp4";
    video.append(source);
    fig.append(video, make("figcaption", "", v.title));
    videoWrap.append(fig);
  });
  const videoObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries) => entries.forEach((e) => {
    const v = e.target;
    if (e.intersectionRatio >= 0.5) { if (!reduce && v.paused && !v.dataset.userPaused) v.play().catch(() => {}); }
    else if (e.intersectionRatio === 0 && !v.paused) v.pause();
  }), { threshold: [0, 0.5] }) : null;
  $$("video.fl-autoplay", root).forEach((v) => {
    // Respect a pause the viewer makes with the controls while the video is on screen.
    v.addEventListener("pause", () => { const r = v.getBoundingClientRect(); if (r.bottom > 0 && r.top < window.innerHeight) v.dataset.userPaused = "1"; });
    v.addEventListener("play", () => { delete v.dataset.userPaused; });
    videoObserver?.observe(v);
  });

  // ---------------- H2D labelled view ----------------
  // Positions are percentages of the official 1:1 front image (approximate).
  const H2D_PARTS = [
    { x: 50.0, y: 49.7, name: "Dual nozzles and hotend", text: "Two nozzles sit side by side on one print head. The hotend melts the filament (up to 350 °C on the H2D), and each nozzle can carry a different material or colour — for example the part plastic plus an easy-to-remove support material." },
    { x: 50.0, y: 42.5, name: "Extruder", text: "Small hardened-steel gears grip the filament and push it into the hotend at a precisely controlled rate. Pulling back a little (retraction) stops drips while the head travels." },
    { x: 44.6, y: 67.0, name: "Heated build plate", text: "The removable plate the part is built on. It is heated (up to 120 °C) so the first layer sticks and the part does not warp; flexing the plate releases the finished print." },
    { x: 59.5, y: 44.0, name: "Motion system (CoreXY)", text: "Two fixed motors and crossed belts move the print head left–right (X) and front–back (Y), while the plate steps down by one layer height (Z) after each layer." },
    { x: 65.2, y: 60.7, name: "Enclosure and door", text: "Closed walls and a glass door keep the warm air in — the H2D can heat its chamber to 65 °C — which stops materials such as ABS and ASA warping and keeps fumes inside for the exhaust fan to handle." },
    { x: 42.9, y: 36.7, name: "Touchscreen", text: "Start and stop prints, load filament, set temperatures and read error messages. Prints can also be sent from the Bambu Studio slicer on a computer." },
    { x: 50.0, y: 20.5, name: "Filament and AMS", text: "The AMS 2 Pro (Automatic Material System) on top holds four spools, keeps them dry and feeds the right one to the nozzle by itself — that is how multicolour prints work." },
    { x: 35.7, y: 41.5, name: "Camera and lighting", text: "Built-in cameras (the spec sheet lists a nozzle camera) and chamber lighting let you watch the print through the app without opening the door. The marked position is approximate." }
  ];
  const stage = $("#h2d-stage");
  const legend = $("#h2d-legend");
  const info = $("#h2d-info");
  if (stage && legend && info) {
    const spotButtons = [];
    const legendButtons = [];
    function selectPart(i, focusLegend) {
      const p = H2D_PARTS[i];
      spotButtons.forEach((b, k) => { b.classList.toggle("is-active", k === i); b.setAttribute("aria-pressed", String(k === i)); });
      legendButtons.forEach((b, k) => { b.classList.toggle("is-active", k === i); b.setAttribute("aria-pressed", String(k === i)); });
      info.replaceChildren(make("h5", "", `${i + 1}. ${p.name}`), make("p", "", p.text));
      if (focusLegend) legendButtons[i].focus();
    }
    H2D_PARTS.forEach((p, i) => {
      const b = make("button", "hotspot", String(i + 1));
      b.type = "button";
      b.style.left = `${p.x}%`;
      b.style.top = `${p.y}%`;
      b.setAttribute("aria-label", `${i + 1}: ${p.name}`);
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => selectPart(i));
      stage.append(b);
      spotButtons.push(b);
      const li = make("li");
      const lb = make("button", "legend-btn");
      lb.type = "button";
      lb.setAttribute("aria-pressed", "false");
      lb.append(make("span", "legend-num", String(i + 1)), document.createTextNode(p.name));
      lb.addEventListener("click", () => selectPart(i));
      lb.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") { e.preventDefault(); selectPart((i + 1) % H2D_PARTS.length, true); }
        if (e.key === "ArrowUp") { e.preventDefault(); selectPart((i - 1 + H2D_PARTS.length) % H2D_PARTS.length, true); }
      });
      li.append(lb);
      legend.append(li);
      legendButtons.push(lb);
    });
    selectPart(0);
  }

  // ---------------- Shared motion type (bed-slinger / CoreXY) ----------------
  let motionMode = "bedslinger";
  const motionListeners = [];
  function setMotion(m) {
    motionMode = m;
    $$("[data-motion]", root).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.motion === m)));
    $$("[data-motion-panel]", root).forEach((p) => p.classList.toggle("is-active", p.dataset.motionPanel === m));
    motionListeners.forEach((fn) => fn(m));
  }
  $$("[data-motion]", root).forEach((b) => b.addEventListener("click", () => setMotion(b.dataset.motion)));

  // ---------------- Two ways an FDM printer moves (oblique 3D view, same toolpath in both) ----------------
  const motionBox = $("#motion-compare");
  if (motionBox) {
    const LAYERS = 7, LH = 10, T_LAYER = 2.4, T_Z = 0.45, T_END = 1.4, HALF = 36;
    const PER = T_LAYER + T_Z, CYCLE = LAYERS * PER + T_END;
    const OX = 16, OY = 262, KX = 0.5, KY = 0.32;
    const P = (x, y, z) => [OX + x + KX * y, OY - z - KY * y];
    const pts = (list) => list.map(([x, y, z]) => P(x, y, z).map(f1).join(",")).join(" ");
    const SQ = [[-HALF, -HALF], [HALF, -HALF], [HALF, HALF], [-HALF, HALF], [-HALF, -HALF]];
    function perim(f) {
      const s = clamp01(f) * 4, side = Math.min(3, Math.floor(s)), u = s - side;
      return [lerp(SQ[side][0], SQ[side + 1][0], u), lerp(SQ[side][1], SQ[side + 1][1], u)];
    }
    function stateAt(t) {
      const tc = t % CYCLE;
      const k = Math.floor(tc / PER);
      if (k >= LAYERS) return { done: LAYERS, frac: 0, zc: LAYERS - 1, printing: false, zMoving: false };
      const u = tc - k * PER;
      if (u < T_LAYER) return { done: k, frac: u / T_LAYER, zc: k, printing: true, zMoving: false };
      return { done: k + 1, frac: 0, zc: k + ease((u - T_LAYER) / T_Z), printing: false, zMoving: true };
    }
    // A pool of layer slabs (front, right and top faces) drawn on a moving base.
    function makeLayers(parent) {
      const g = svgEl("g", { class: "mc-part" }, parent);
      const slabs = [];
      for (let i = 0; i < LAYERS; i++) {
        const s = svgEl("g", { class: "mc-slab" }, g);
        slabs.push({ g: s, front: svgEl("polygon", { class: "mc-front" }, s), side: svgEl("polygon", { class: "mc-side" }, s), top: svgEl("polygon", { class: "mc-top" }, s) });
      }
      const bead = svgEl("polyline", { class: "mc-bead" }, parent);
      return { slabs, bead };
    }
    function drawLayers(L, cx, cy, zb, st) {
      L.slabs.forEach((s, i) => {
        if (i >= st.done) { s.g.setAttribute("display", "none"); return; }
        s.g.removeAttribute("display");
        const z0 = zb + i * LH, z1 = z0 + LH;
        const x0 = cx - HALF, x1 = cx + HALF, y0 = cy - HALF, y1 = cy + HALF;
        s.front.setAttribute("points", pts([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]));
        s.side.setAttribute("points", pts([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]]));
        s.top.setAttribute("points", pts([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]));
      });
      if (st.printing) {
        const zt = zb + (st.done + 1) * LH;
        const list = [];
        const steps = Math.max(2, Math.ceil(st.frac * 40));
        for (let j = 0; j <= steps; j++) { const [px, py] = perim((st.frac * j) / steps); list.push([cx + px, cy + py, zt]); }
        L.bead.setAttribute("points", pts(list));
        L.bead.removeAttribute("display");
      } else L.bead.setAttribute("display", "none");
    }
    function drawHead(H, nx, ny, nz) {
      const w = 14, d = 12, zb = nz + 9, zt = nz + 40;
      H.front.setAttribute("points", pts([[nx - w, ny - d, zb], [nx + w, ny - d, zb], [nx + w, ny - d, zt], [nx - w, ny - d, zt]]));
      H.side.setAttribute("points", pts([[nx + w, ny - d, zb], [nx + w, ny + d, zb], [nx + w, ny + d, zt], [nx + w, ny - d, zt]]));
      H.top.setAttribute("points", pts([[nx - w, ny - d, zt], [nx + w, ny - d, zt], [nx + w, ny + d, zt], [nx - w, ny + d, zt]]));
      H.nozzle.setAttribute("points", pts([[nx - 6, ny, zb], [nx + 6, ny, zb], [nx, ny, nz]]));
    }
    function makeHead(parent) {
      const g = svgEl("g", { class: "mc-head" }, parent);
      return { g, front: svgEl("polygon", { class: "mc-head-front" }, g), side: svgEl("polygon", { class: "mc-head-side" }, g), top: svgEl("polygon", { class: "mc-head-top" }, g), nozzle: svgEl("polygon", { class: "mc-nozzle" }, g) };
    }
    function drawBed(B, x0, x1, y0, y1, z) {
      B.top.setAttribute("points", pts([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]));
      B.front.setAttribute("points", pts([[x0, y0, z - 6], [x1, y0, z - 6], [x1, y0, z], [x0, y0, z]]));
    }
    function makeBed(parent) {
      const g = svgEl("g", { class: "mc-bed" }, parent);
      return { front: svgEl("polygon", { class: "mc-bed-front" }, g), top: svgEl("polygon", { class: "mc-bed-top" }, g) };
    }
    const lineP = (parent, a, b, cls) => { const [x1, y1] = P(...a), [x2, y2] = P(...b); return svgEl("line", { x1: f1(x1), y1: f1(y1), x2: f1(x2), y2: f1(y2), class: cls }, parent); };
    const setLine = (ln, a, b) => { const [x1, y1] = P(...a), [x2, y2] = P(...b); ln.setAttribute("x1", f1(x1)); ln.setAttribute("y1", f1(y1)); ln.setAttribute("x2", f1(x2)); ln.setAttribute("y2", f1(y2)); };
    const label = (parent, at, text, cls = "mc-label", anchor = "start") => { const [x, y] = P(...at); return svgText(f1(x), f1(y), text, cls, parent, { "text-anchor": anchor }); };

    // --- Bed-slinger scene ---
    const bedSvg = $("#motion-bed");
    addMarkers(bedSvg, "mb");
    const bs = svgEl("g", {}, bedSvg);
    svgEl("polygon", { class: "mc-base", points: pts([[0, -22, 0], [240, -22, 0], [240, 162, 0], [0, 162, 0]]) }, bs);
    lineP(bs, [120, -22, 3], [120, 162, 3], "mc-rail");
    lineP(bs, [-6, 70, 0], [-6, 70, 160], "mc-upright");
    lineP(bs, [246, 70, 0], [246, 70, 160], "mc-upright");
    const bsBed = makeBed(bs);
    const bsLayers = makeLayers(bs);
    const bsCross = lineP(bs, [-6, 70, 50], [246, 70, 50], "mc-gantry");
    const bsHead = makeHead(bs);
    const bsAxes = svgEl("g", { class: "mc-axes" }, bs);
    const bsX = arrow(bsAxes, "mb", "x", 0, 0, 0, 0, true);
    const bsXL = svgText(0, 0, "X", "mc-axis-label ax-x", bsAxes);
    { const [x1, y1] = P(214, -8, 10), [x2, y2] = P(214, 148, 10); arrow(bsAxes, "mb", "y", x1, y1, x2, y2, true); const [lx, ly] = P(222, 40, 12); svgText(f1(lx), f1(ly), "Y", "mc-axis-label ax-y", bsAxes); }
    const bsZ = (() => { const [x1, y1] = P(262, 70, 40), [x2, y2] = P(262, 70, 120); arrow(bsAxes, "mb", "z", x1, y1, x2, y2, false); const [lx, ly] = P(268, 70, 74); svgText(f1(lx), f1(ly), "Z", "mc-axis-label ax-z", bsAxes); })();
    void bsZ;
    label(bs, [4, -22, -22], "heatbed slides in Y", "mc-label");
    const bsHeadLabel = svgText(0, 0, "toolhead", "mc-label", bs, { "text-anchor": "end" });

    // --- CoreXY scene ---
    const cxSvg = $("#motion-corexy");
    addMarkers(cxSvg, "mx");
    const cs = svgEl("g", {}, cxSvg);
    const W = 240, D = 150, HZ = 200, RZ = 190, ZT = 126;
    const frame = svgEl("g", { class: "mc-frame" }, cs);
    [[[0, D, 0], [W, D, 0]], [[0, D, 0], [0, D, HZ]], [[W, D, 0], [W, D, HZ]], [[0, D, HZ], [W, D, HZ]], [[0, 0, 0], [0, D, 0]], [[W, 0, 0], [W, D, 0]], [[0, 0, HZ], [0, D, HZ]], [[W, 0, HZ], [W, D, HZ]]].forEach(([a, b]) => lineP(frame, a, b, "mc-frame-back"));
    lineP(cs, [30, 140, 0], [30, 140, RZ], "mc-screw");
    lineP(cs, [210, 140, 0], [210, 140, RZ], "mc-screw");
    lineP(cs, [120, 12, 0], [120, 12, RZ], "mc-screw");
    lineP(cs, [8, 0, RZ], [8, D, RZ], "mc-rail");
    lineP(cs, [232, 0, RZ], [232, D, RZ], "mc-rail");
    const cxBed = makeBed(cs);
    const cxLayers = makeLayers(cs);
    const cxBeam = lineP(cs, [8, 75, RZ], [232, 75, RZ], "mc-gantry");
    const cxCarriage = lineP(cs, [120, 75, RZ], [120, 75, ZT + 40], "mc-carriage");
    const cxHead = makeHead(cs);
    const frontFrame = svgEl("g", { class: "mc-frame" }, cs);
    [[[0, 0, 0], [W, 0, 0]], [[0, 0, 0], [0, 0, HZ]], [[W, 0, 0], [W, 0, HZ]], [[0, 0, HZ], [W, 0, HZ]]].forEach(([a, b]) => lineP(frontFrame, a, b, "mc-frame-front"));
    const cxAxes = svgEl("g", { class: "mc-axes" }, cs);
    { const [x1, y1] = P(70, 0, HZ + 12), [x2, y2] = P(170, 0, HZ + 12); arrow(cxAxes, "mx", "x", x1, y1, x2, y2, true); const [lx, ly] = P(176, 0, HZ + 8); svgText(f1(lx), f1(ly), "X", "mc-axis-label ax-x", cxAxes); }
    { const [x1, y1] = P(W + 12, 20, RZ), [x2, y2] = P(W + 12, 130, RZ); arrow(cxAxes, "mx", "y", x1, y1, x2, y2, true); const [lx, ly] = P(W + 16, 70, RZ + 8); svgText(f1(lx), f1(ly), "Y", "mc-axis-label ax-y", cxAxes); }
    { const [x1, y1] = P(W + 14, 0, 120), [x2, y2] = P(W + 14, 0, 50); arrow(cxAxes, "mx", "z", x1, y1, x2, y2, false); const [lx, ly] = P(W + 18, 0, 84); svgText(f1(lx), f1(ly), "Z", "mc-axis-label ax-z", cxAxes); }
    label(cs, [4, 0, -22], "heatbed moves down in Z", "mc-label");

    function drawMotion(t) {
      const st = stateAt(t);
      const [px, py] = st.printing ? perim(st.frac) : perim(0);
      // Bed-slinger: nozzle fixed in Y (gantry plane y = 70); bed slides in Y; gantry rises in Z.
      const bc = 70 - py;
      const zbBed = 10;
      const nzB = zbBed + (st.zc + 1) * LH;
      drawBed(bsBed, 45, 195, bc - 62, bc + 62, zbBed);
      drawLayers(bsLayers, 120, bc, zbBed, st);
      const zg = nzB + 52;
      setLine(bsCross, [-6, 70, zg], [246, 70, zg]);
      drawHead(bsHead, 120 + px, 70, nzB);
      { const [x1, y1] = P(64, 70, zg + 16), [x2, y2] = P(176, 70, zg + 16); bsX.setAttribute("x1", f1(x1)); bsX.setAttribute("y1", f1(y1)); bsX.setAttribute("x2", f1(x2)); bsX.setAttribute("y2", f1(y2)); const [lx, ly] = P(182, 70, zg + 12); bsXL.setAttribute("x", f1(lx)); bsXL.setAttribute("y", f1(ly)); }
      { const [lx, ly] = P(120 + px - 20, 58, nzB + 20); bsHeadLabel.setAttribute("x", f1(lx)); bsHeadLabel.setAttribute("y", f1(ly)); }
      // CoreXY: head moves in X and Y at a fixed height; bed steps down in Z.
      const bedZ = ZT - (st.zc + 1) * LH;
      drawBed(cxBed, 45, 195, 13, 137, bedZ);
      drawLayers(cxLayers, 120, 75, bedZ, st);
      const hy = 75 + py, hx = 120 + px;
      setLine(cxBeam, [8, hy, RZ], [232, hy, RZ]);
      setLine(cxCarriage, [hx, hy, RZ], [hx, hy, ZT + 40]);
      drawHead(cxHead, hx, hy, ZT);
      motionBox.classList.toggle("z-moving", st.zMoving);
    }
    const motionAnim = makeAnimator(motionBox, drawMotion, 3 * PER + 0.55 * T_LAYER);
    bindPlayButton($(".motion-play", motionBox), motionAnim);
  }

  // ---------------- How FDM works: walkthrough with a running printer and a toolhead cut-away ----------------
  const walk = $("#fdm-walk");
  const walkSvg = $("#fdm2-svg");
  if (walk && walkSvg) {
    const LH = 12, PLATE_BOTTOM = 320, LAYERS = 10, SPEED = 170, T_Z = 0.3, T_END = 1.6, COOL = 1.6;
    const shapeOf = (i) => (i < 4 ? [180, 380] : [220, 340]);
    // Timeline of layers: each prints left-right or right-left, preceded by a Z move (+ travel to the start).
    const plan = [];
    let tt = 0, prevEnd = 180;
    for (let i = 0; i < LAYERS; i++) {
      const [a, b] = shapeOf(i);
      const ltr = i % 2 === 0;
      const start = ltr ? a : b, end = ltr ? b : a;
      plan.push({ i, a, b, start, end, from: prevEnd, tz: tt, tp: tt + T_Z, tEnd: tt + T_Z + (b - a) / SPEED });
      tt = plan[i].tEnd;
      prevEnd = end;
    }
    const CYCLE = tt + T_END;
    let eBefore = 0;
    plan.forEach((L) => { L.e0 = eBefore; eBefore += L.b - L.a; });
    function walkState(t) {
      const tc = t % CYCLE;
      let L = plan.find((p) => tc < p.tEnd);
      if (!L) { const last = plan[LAYERS - 1]; return { layer: LAYERS - 1, zc: LAYERS - 1, hx: last.end, printed: LAYERS, partial: null, e: eBefore, tc, extruding: false }; }
      if (tc < L.tp) { // Z move and travel to the layer start
        const u = ease((tc - L.tz) / T_Z);
        return { layer: L.i, zc: L.i - 1 + u, hx: lerp(L.from, L.start, u), printed: L.i, partial: null, e: L.e0, tc, extruding: false };
      }
      const hx = L.start + Math.sign(L.end - L.start) * (tc - L.tp) * SPEED;
      return { layer: L.i, zc: L.i, hx, printed: L.i, partial: [Math.min(L.start, hx), Math.max(L.start, hx)], e: L.e0 + Math.abs(hx - L.start), tc, extruding: true };
    }

    addMarkers(walkSvg, "fw");
    const G = (cls) => svgEl("g", { class: cls }, walkSvg);
    // Frame (rebuilt on mode change)
    const frameG = G("fw-frame");
    // Spool and filament tube
    const spoolG = G("fg fg-spool");
    svgEl("circle", { cx: 58, cy: 70, r: 40, class: "fw-spool" }, spoolG);
    svgEl("circle", { cx: 58, cy: 70, r: 12, class: "fw-hub" }, spoolG);
    const spokes = svgEl("g", {}, spoolG);
    [0, 60, 120].forEach((a) => svgEl("line", { x1: 58, y1: 34, x2: 58, y2: 106, class: "fw-spoke", transform: `rotate(${a} 58 70)` }, spokes));
    const tube = svgEl("path", { class: "fw-tube" }, spoolG);
    const fil = svgEl("path", { class: "fw-filament" }, spoolG);
    // Plate, part layers, current bead
    const plateG = G("fg fg-layers");
    const plate = svgEl("rect", { x: 110, width: 340, height: 9, class: "fw-plate" }, plateG);
    const layerEls = [];
    for (let i = 0; i < LAYERS; i++) {
      const g = svgEl("g", {}, plateG);
      layerEls.push({ g, base: svgEl("rect", { class: "fw-layer", rx: 5 }, g), hot: svgEl("rect", { class: "fw-hot", rx: 5 }, g) });
    }
    const beadG = G("fg fg-nozzle");
    const bead = svgEl("rect", { class: "fw-hot fw-bead", rx: 5, height: LH - 1.5 }, beadG);
    // Z indicator
    const zG = G("fg fg-layers fw-zind");
    const zArrow = arrow(zG, "fw", "z", 0, 0, 0, 0, false);
    const zText = svgText(0, 0, "", "fw-label fw-zlabel", zG);
    // Toolhead (main view)
    const head = G("fw-head");
    const headGears = svgEl("g", { class: "fg fg-gears" }, head);
    svgEl("rect", { x: -22, y: -94, width: 44, height: 34, rx: 3, class: "fw-box" }, headGears);
    const miniL = svgEl("circle", { cx: -7, cy: -77, r: 6, class: "fw-minigear" }, headGears);
    const miniR = svgEl("circle", { cx: 7, cy: -77, r: 6, class: "fw-minigear" }, headGears);
    void miniL; void miniR;
    const sink = svgEl("g", { class: "fw-sink" }, head);
    for (let k = 0; k < 4; k++) svgEl("rect", { x: -14, y: -58 + k * 6, width: 28, height: 3, class: "fw-fin" }, sink);
    const hotG = svgEl("g", { class: "fg fg-hot" }, head);
    const glow = svgEl("ellipse", { cx: 0, cy: -24, rx: 26, ry: 18, class: "fw-glow" }, hotG);
    svgEl("rect", { x: -16, y: -34, width: 32, height: 20, rx: 2, class: "fw-heater" }, hotG);
    const tempTxt = svgText(-22, -24, "≈ 220 °C", "fw-label fw-temp", hotG, { "text-anchor": "end" });
    void tempTxt;
    const nozG = svgEl("g", { class: "fg fg-nozzle" }, head);
    svgEl("polygon", { points: "-8,-14 8,-14 2,0 -2,0", class: "fw-nozzle" }, nozG);
    const fanG = svgEl("g", { class: "fg fg-fan" }, head);
    svgEl("circle", { cx: 34, cy: -36, r: 13, class: "fw-fanbody" }, fanG);
    const blades = svgEl("g", {}, fanG);
    [0, 90, 180, 270].forEach((a) => svgEl("path", { d: "M34 -36 L34 -47 A 5 5 0 0 1 40 -41 Z", class: "fw-blade", transform: `rotate(${a} 34 -36)` }, blades));
    const air = svgEl("path", { d: "M24 -26 Q 16 -10 6 2 M30 -23 Q 24 -6 14 4", class: "fw-air" }, fanG);
    // Number tags on the main view
    const tags = G("fw-tags");
    const tag = (n) => { const g = svgEl("g", { class: `fw-tag fw-tag-${n}` }, tags); svgEl("circle", { r: 10 }, g); svgText(0, 4.5, String(n), "", g, { "text-anchor": "middle" }); return g; };
    const tagEls = [1, 2, 3, 4, 5, 6].map(tag);

    // Toolhead cut-away inset
    const inset = G("fw-inset");
    svgEl("rect", { x: 488, y: 14, width: 222, height: 352, rx: 4, class: "fw-inset-frame" }, inset);
    svgText(599, 34, "Toolhead cut-away", "fw-label fw-inset-title", inset, { "text-anchor": "middle" });
    const iFil = svgEl("line", { x1: 599, y1: 44, x2: 599, y2: 196, class: "fw-ifil" }, inset);
    const iGears = svgEl("g", { class: "fg fg-gears" }, inset);
    function gearPath(cx, cy, r, teeth) {
      const pts2 = [];
      for (let k = 0; k < teeth * 2; k++) {
        const a0 = (k / (teeth * 2)) * Math.PI * 2, a1 = ((k + 1) / (teeth * 2)) * Math.PI * 2;
        const rr = k % 2 ? r : r + 4;
        pts2.push(`${f1(cx + rr * Math.cos(a0))},${f1(cy + rr * Math.sin(a0))}`, `${f1(cx + rr * Math.cos(a1))},${f1(cy + rr * Math.sin(a1))}`);
      }
      return `M${pts2.join(" L")} Z`;
    }
    const gearL = svgEl("path", { d: gearPath(577, 98, 17, 12), class: "fw-gear" }, iGears);
    const gearR = svgEl("path", { d: gearPath(621, 98, 17, 12), class: "fw-gear" }, iGears);
    svgEl("circle", { cx: 577, cy: 98, r: 4, class: "fw-hub" }, iGears);
    svgEl("circle", { cx: 621, cy: 98, r: 4, class: "fw-hub" }, iGears);
    svgText(648, 92, "Extruder", "fw-label", iGears);
    svgText(648, 108, "gears", "fw-label", iGears);
    const iSink = svgEl("g", { class: "fw-sink" }, inset);
    for (let k = 0; k < 5; k++) svgEl("rect", { x: 572, y: 136 + k * 9, width: 54, height: 4, class: "fw-fin" }, iSink);
    svgText(632, 158, "Heat break", "fw-label", iSink);
    const iHot = svgEl("g", { class: "fg fg-hot" }, inset);
    const iGlow = svgEl("ellipse", { cx: 599, cy: 213, rx: 58, ry: 34, class: "fw-glow" }, iHot);
    svgEl("rect", { x: 562, y: 190, width: 74, height: 44, rx: 3, class: "fw-heater" }, iHot);
    svgEl("rect", { x: 595, y: 190, width: 8, height: 44, class: "fw-melt" }, iHot);
    svgText(599, 182, "Heater block ≈ 220 °C", "fw-label fw-onfill", iHot, { "text-anchor": "middle" });
    const iNoz = svgEl("g", { class: "fg fg-nozzle" }, inset);
    svgEl("polygon", { points: "580,234 618,234 603,266 595,266", class: "fw-nozzle" }, iNoz);
    svgEl("rect", { x: 596, y: 234, width: 6, height: 32, class: "fw-melt" }, iNoz);
    const iLine = svgEl("line", { x1: 504, y1: 274, x2: 600, y2: 274, class: "fw-iline" }, iNoz);
    svgText(624, 262, "Nozzle 0.4 mm", "fw-label", iNoz);
    svgEl("line", { x1: 500, y1: 281, x2: 698, y2: 281, class: "fw-iplate" }, inset);
    svgText(500, 300, "← fresh line", "fw-label", iNoz);
    const iFan = svgEl("g", { class: "fg fg-fan" }, inset);
    const iAir = svgEl("path", { d: "M700 306 Q 652 300 610 278", class: "fw-air" }, iFan);
    svgText(700, 322, "cooling-fan air", "fw-label", iFan, { "text-anchor": "end" });
    svgText(599, 340, "Filament: 1.75 mm", "fw-label fw-muted", inset, { "text-anchor": "middle" });

    function buildFrame() {
      frameG.replaceChildren();
      if (motionMode === "corexy") {
        svgEl("rect", { x: 100, y: 40, width: 370, height: 300, class: "fw-encl" }, frameG);
        svgText(462, 58, "enclosure", "fw-label fw-muted", frameG, { "text-anchor": "end" });
        svgEl("line", { x1: 100, y1: 125, x2: 470, y2: 125, class: "fw-rail" }, frameG);
      } else {
        svgEl("line", { x1: 104, y1: 110, x2: 104, y2: 336, class: "fw-upright" }, frameG);
        svgEl("line", { x1: 456, y1: 110, x2: 456, y2: 336, class: "fw-upright" }, frameG);
        svgEl("line", { x1: 96, y1: 336, x2: 464, y2: 336, class: "fw-upright" }, frameG);
      }
    }
    let railBS = null;
    function drawWalk(t) {
      const st = walkState(t);
      const corexy = motionMode === "corexy";
      const nozY = corexy ? 200 : PLATE_BOTTOM - (st.zc + 1) * LH;
      const plateTop = corexy ? 200 + (st.zc + 1) * LH : PLATE_BOTTOM;
      plate.setAttribute("y", f1(plateTop));
      // Gantry rail for the bed-slinger moves with Z.
      if (!corexy) {
        if (!railBS || !railBS.isConnected) railBS = svgEl("line", { x1: 104, x2: 456, class: "fw-rail" }, frameG);
        railBS.setAttribute("y1", f1(nozY - 75)); railBS.setAttribute("y2", f1(nozY - 75));
      }
      layerEls.forEach((L, i) => {
        if (i >= st.printed) { L.g.setAttribute("display", "none"); return; }
        L.g.removeAttribute("display");
        const [a, b] = shapeOf(i);
        const y = plateTop - (i + 1) * LH;
        [L.base, L.hot].forEach((r) => { r.setAttribute("x", a); r.setAttribute("y", f1(y + 0.75)); r.setAttribute("width", b - a); r.setAttribute("height", LH - 1.5); });
        const doneAt = plan[i].tEnd;
        const age = st.tc - doneAt;
        L.hot.setAttribute("opacity", f1(clamp01(1 - age / COOL)));
      });
      if (st.partial) {
        bead.removeAttribute("display");
        bead.setAttribute("x", f1(st.partial[0])); bead.setAttribute("width", f1(Math.max(0.1, st.partial[1] - st.partial[0])));
        bead.setAttribute("y", f1(plateTop - (st.layer + 1) * LH + 0.75));
      } else bead.setAttribute("display", "none");
      head.setAttribute("transform", `translate(${f1(st.hx)} ${f1(nozY)})`);
      // Filament path from the spool to the extruder on the head.
      const hxTop = st.hx, hyTop = nozY - 94;
      const d = `M98 70 C 170 70, ${f1(hxTop - 30)} ${f1(hyTop - 70)}, ${f1(hxTop)} ${f1(hyTop)}`;
      tube.setAttribute("d", d); fil.setAttribute("d", d);
      fil.style.strokeDashoffset = f1(-st.e * 0.35);
      spokes.setAttribute("transform", `rotate(${f1(-st.e * 0.5)} 58 70)`);
      const ga = st.e * 3;
      gearL.setAttribute("transform", `rotate(${f1(ga)} 577 98)`);
      gearR.setAttribute("transform", `rotate(${f1(-ga)} 621 98)`);
      iFil.style.strokeDashoffset = f1(-st.e * 0.35);
      iLine.style.strokeDashoffset = f1(st.e * 0.35);
      iLine.classList.toggle("is-on", st.extruding);
      const pulse = 0.55 + 0.25 * Math.sin(t * 3.2);
      glow.setAttribute("opacity", f1(pulse)); iGlow.setAttribute("opacity", f1(pulse));
      blades.setAttribute("transform", `rotate(${f1(t * 900)} 34 -36)`);
      air.style.strokeDashoffset = f1(-t * 40); iAir.style.strokeDashoffset = f1(-t * 40);
      // Z indicator next to whatever moves in Z.
      if (corexy) {
        zArrow.setAttribute("x1", "92"); zArrow.setAttribute("x2", "92"); zArrow.setAttribute("y1", f1(plateTop - 26)); zArrow.setAttribute("y2", f1(plateTop + 6));
        zText.setAttribute("x", "80"); zText.setAttribute("y", f1(plateTop - 4)); zText.setAttribute("text-anchor", "end"); zText.textContent = "Z";
      } else {
        zArrow.setAttribute("x1", "474"); zArrow.setAttribute("x2", "474"); zArrow.setAttribute("y1", f1(nozY - 50)); zArrow.setAttribute("y2", f1(nozY - 90));
        zText.setAttribute("x", "474"); zText.setAttribute("y", f1(nozY - 96)); zText.setAttribute("text-anchor", "middle"); zText.textContent = "Z";
      }
      // Number tags follow their parts.
      const tagAt = [[58, 22], [st.hx - 34, nozY - 100], [st.hx - 54, nozY - 6], [st.hx + 2, nozY + 18], [160, plateTop - 22], [st.hx + 58, nozY - 52]];
      tagEls.forEach((g, k) => g.setAttribute("transform", `translate(${f1(tagAt[k][0])} ${f1(tagAt[k][1])})`));
    }

    const STEPS_FDM = [
      { title: "Filament feeds from the spool", text: () => "A plastic filament, 1.75 mm thick, is pulled off the spool and through a tube to the toolhead — only as fast as the nozzle uses it. The spool turns only while plastic is being laid down." },
      { title: "Extruder gears push it", text: () => "Two toothed gears grip the filament and push it down at an exact rate (see the cut-away). They pause while the head travels without printing, and pull back slightly (retraction) so the nozzle does not drip." },
      { title: "The hotend melts it", text: () => "The heater block melts the plastic — about 190–240 °C for PLA in Bambu Lab's guide. Above it, a cooled heat break keeps the filament solid until it reaches the hot zone." },
      { title: "The nozzle traces the toolpath", text: () => "Molten plastic squeezes out of the 0.4 mm nozzle as a thin line while the head follows the path planned by the slicer — here back and forth across each layer. The fresh line glows orange while it is still hot." },
      { title: "Layers stack", text: (m) => (m === "corexy" ? "CoreXY (P1S, H2D): when a layer is finished, the heatbed moves down by one layer height (Z) and the next layer is drawn on top. The toolhead stays at the same height and moves in X and Y." : "Bed-slinger (A1, A1 mini): when a layer is finished, the toolhead and gantry rise by one layer height (Z) and the next layer is drawn on top. The bed itself slides front–back (Y), which this front view cannot show.") + " Ten layers here build a small stepped part." },
      { title: "The cooling fan sets each line", text: () => "A part-cooling fan blows on the fresh plastic so it hardens straight away and holds its shape for the next layer — shown here as orange (hot) turning blue (cooled)." }
    ];
    const title = $(".stepper-title", walk), text = $(".stepper-text", walk), index = $(".stepper-index", walk);
    const dotsWrap = $(".stepper-dots", walk), playBtn = $(".stepper-play", walk);
    $(".stepper-total", walk).textContent = String(STEPS_FDM.length);
    let current = 0, stepTimer = null, userPaused = false;
    const dots = STEPS_FDM.map((s, k) => {
      const d = make("button", "stepper-dot");
      d.type = "button";
      d.setAttribute("aria-label", `Step ${k + 1}: ${s.title}`);
      d.addEventListener("click", () => { go(k); restartTimer(); });
      dotsWrap.append(d);
      return d;
    });
    function go(k) {
      current = (k + STEPS_FDM.length) % STEPS_FDM.length;
      walk.dataset.step = String(current + 1);
      title.textContent = `${current + 1}. ${STEPS_FDM[current].title}`;
      text.textContent = STEPS_FDM[current].text(motionMode);
      index.textContent = String(current + 1);
      dots.forEach((d, j) => { d.classList.toggle("is-active", j === current); if (j === current) d.setAttribute("aria-current", "step"); else d.removeAttribute("aria-current"); });
    }
    buildFrame();
    const walkAnim = makeAnimator(walk, drawWalk, 6.2);
    function setPlaying(on) {
      clearInterval(stepTimer);
      stepTimer = on && !reduce ? setInterval(() => go(current + 1), 5200) : null;
      walkAnim.set(on);
      playBtn.textContent = on && !reduce ? "Pause" : "Play";
      playBtn.setAttribute("aria-pressed", String(on && !reduce));
    }
    function restartTimer() { if (stepTimer) setPlaying(true); }
    $$("[data-act]", walk).forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.act === "prev") { go(current - 1); restartTimer(); }
      if (b.dataset.act === "next") { go(current + 1); restartTimer(); }
      if (b.dataset.act === "play") { const on = !stepTimer; userPaused = !on; setPlaying(on); }
    }));
    walk.addEventListener("keydown", (e) => {
      if (e.target.closest("input")) return;
      if (e.key === "ArrowRight") { go(current + 1); restartTimer(); }
      if (e.key === "ArrowLeft") { go(current - 1); restartTimer(); }
    });
    if (reduce) { playBtn.disabled = true; playBtn.title = "Animation off (reduced motion)"; }
    go(0);
    setPlaying(false);
    whenVisible(walk, () => { if (!reduce && !userPaused && !stepTimer) setPlaying(true); }, () => { if (stepTimer) { clearInterval(stepTimer); stepTimer = null; playBtn.textContent = "Play"; playBtn.setAttribute("aria-pressed", "false"); } }, 0.3);
    motionListeners.push(() => { railBS = null; buildFrame(); walkAnim.reset(reduce ? 6.2 : 0); go(current); });
  }
  setMotion("bedslinger");

  // ---------------- Laser stepper (workflow) ----------------
  const STEPS = {
    laser: [
      { title: "Design", text: "Draw closed outlines in 2D CAD or Inkscape and save them as DXF (Drawing Exchange Format) or SVG (Scalable Vector Graphics). Put cut, score and engrave lines on separate colours." },
      { title: "Laser software", text: "Open the file in the laser software and give each colour its job — cut, score or engrave — with its own power and speed." },
      { title: "Material setup", text: "Check the sheet is on the allowed list, measure its thickness, and lay it flat on the honeycomb bed, weighing down any warp." },
      { title: "Focus", text: "Set the gap between the lens and the sheet so the beam is at its narrowest exactly on the surface." },
      { title: "Cut / engrave", text: "Close the lid, switch on extraction and air assist, run a small test on scrap, then run the job — and stay with the machine the whole time." },
      { title: "Inspect", text: "Check every part is cut through before moving the sheet, test the fit, measure the kerf and write down the settings that worked." }
    ]
  };
  $$("[data-stepper]", root).forEach((box) => {
    const steps = STEPS[box.dataset.stepper];
    if (!steps) return;
    const title = $(".stepper-title", box), text = $(".stepper-text", box), index = $(".stepper-index", box);
    const dotsWrap = $(".stepper-dots", box), playBtn = $(".stepper-play", box);
    $(".stepper-total", box).textContent = String(steps.length);
    let current = 0, timer = null, userPaused = false;
    const dots = steps.map((s, k) => {
      const d = make("button", "stepper-dot");
      d.type = "button";
      d.setAttribute("aria-label", `Step ${k + 1}: ${s.title}`);
      d.addEventListener("click", () => { go(k); restartTimer(); });
      dotsWrap.append(d);
      return d;
    });
    function go(k) {
      current = (k + steps.length) % steps.length;
      box.dataset.step = String(current + 1);
      title.textContent = `${current + 1}. ${steps[current].title}`;
      text.textContent = steps[current].text;
      index.textContent = String(current + 1);
      dots.forEach((d, j) => { d.classList.toggle("is-active", j === current); if (j === current) d.setAttribute("aria-current", "step"); else d.removeAttribute("aria-current"); });
    }
    function setPlaying(on) {
      clearInterval(timer);
      timer = on ? setInterval(() => go(current + 1), 4200) : null;
      playBtn.textContent = on ? "Pause" : "Play";
      playBtn.setAttribute("aria-pressed", String(on));
    }
    function restartTimer() { if (timer) setPlaying(true); }
    $$("[data-act]", box).forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.act === "prev") { go(current - 1); restartTimer(); }
      if (b.dataset.act === "next") { go(current + 1); restartTimer(); }
      if (b.dataset.act === "play") { const on = !timer; userPaused = !on; setPlaying(on); }
    }));
    box.addEventListener("keydown", (e) => {
      if (e.target.closest("input")) return;
      if (e.key === "ArrowRight") { go(current + 1); restartTimer(); }
      if (e.key === "ArrowLeft") { go(current - 1); restartTimer(); }
    });
    go(0);
    whenVisible(box, () => { if (!reduce && !userPaused && !timer) setPlaying(true); }, () => { if (timer) setPlaying(false); });
  });

  // ---------------- How the laser head moves (top view + head cut-away) ----------------
  const lmBox = $("#laser-motion");
  if (lmBox) {
    const top = $("#lm-top"), side = $("#lm-side");
    addMarkers(top, "lt");
    addMarkers(side, "ls");
    // Finger-jointed panel outline (the enclosure's 150 x 100 mm long side), drawn at 1.6 px per mm.
    const S = 1.6, PW = 150 * S, PH = 100 * S, X0 = 300 - PW / 2, Y0 = 212 - PH / 2, TAB = 3 * S;
    function fingerEdge(p0, p1, n, normal) {
      const out = [];
      for (let i = 0; i < n; i++) {
        const s0 = [lerp(p0[0], p1[0], i / n), lerp(p0[1], p1[1], i / n)], s1 = [lerp(p0[0], p1[0], (i + 1) / n), lerp(p0[1], p1[1], (i + 1) / n)];
        if (i % 2) out.push(s0, [s0[0] + normal[0] * TAB, s0[1] + normal[1] * TAB], [s1[0] + normal[0] * TAB, s1[1] + normal[1] * TAB], s1);
        else out.push(s0, s1);
      }
      return out;
    }
    const c = [[X0, Y0], [X0 + PW, Y0], [X0 + PW, Y0 + PH], [X0, Y0 + PH]];
    const outline = [...fingerEdge(c[0], c[1], 9, [0, -1]), ...fingerEdge(c[1], c[2], 7, [1, 0]), ...fingerEdge(c[2], c[3], 9, [0, 1]), ...fingerEdge(c[3], c[0], 7, [-1, 0])];
    const dPanel = `M${outline.map((p) => p.map(f1).join(" ")).join(" L")} Z`;

    svgEl("rect", { x: 20, y: 20, width: 520, height: 340, rx: 6, class: "lm-body" }, top);
    svgEl("rect", { x: 104, y: 82, width: 392, height: 262, class: "lm-sheet" }, top);
    svgEl("path", { d: dPanel, class: "lm-guide" }, top);
    const cut = svgEl("path", { d: dPanel, class: "lm-cut" }, top);
    svgEl("rect", { x: 150, y: 30, width: 330, height: 22, rx: 11, class: "lm-tube" }, top);
    svgText(315, 45, "CO₂ laser tube (fixed)", "lm-label lm-onfill", top, { "text-anchor": "middle" });
    svgText(280, 14, "back of the machine", "lm-label lm-muted", top, { "text-anchor": "middle" });
    svgEl("line", { x1: 40, y1: 64, x2: 40, y2: 348, class: "lm-rail" }, top);
    svgEl("line", { x1: 516, y1: 64, x2: 516, y2: 348, class: "lm-rail" }, top);
    const beam = svgEl("polyline", { class: "lm-beam" }, top);
    svgEl("rect", { x: 44, y: 34, width: 16, height: 16, class: "lm-mirror", transform: "rotate(45 52 42)" }, top);
    svgText(64, 70, "Mirror 1 (fixed)", "lm-label", top);
    const gantry = svgEl("g", {}, top);
    svgEl("rect", { x: 34, y: -7, width: 488, height: 14, rx: 3, class: "lm-gantry" }, gantry);
    svgEl("rect", { x: 44, y: -8, width: 16, height: 16, class: "lm-mirror", transform: "rotate(45 52 0)" }, gantry);
    const m2Label = svgText(64, -14, "Mirror 2 (rides on the gantry)", "lm-label lm-halo", gantry);
    void m2Label;
    top.append(beam);
    const headT = svgEl("g", {}, top);
    svgEl("rect", { x: -15, y: -15, width: 30, height: 30, rx: 4, class: "lm-head" }, headT);
    svgEl("circle", { r: 6, class: "lm-lens" }, headT);
    const spark = svgEl("circle", { r: 4, class: "lm-spark" }, headT);
    const headLabel = svgText(20, -18, "Head: mirror 3 + lens", "lm-label lm-halo", headT);
    const axG = svgEl("g", { class: "lm-axes" }, top);
    arrow(axG, "lt", "x", 150, 374, 450, 374, true);
    const xLab = svgText(300, 394, "X: head travels along the gantry", "lm-label ax-x lm-axis", axG, { "text-anchor": "middle" });
    arrow(axG, "lt", "y", 530, 100, 530, 320, true);
    const yLab = svgText(0, 0, "Y: gantry travels front–back", "lm-label ax-y lm-axis", axG, { "text-anchor": "middle", transform: "translate(548 210) rotate(90)" });

    // Side cut-away of the head
    svgEl("rect", { x: 70, y: 40, width: 80, height: 196, rx: 6, class: "lm-headbody" }, side);
    svgEl("polygon", { points: "84,236 136,236 120,280 100,280", class: "lm-headbody" }, side);
    const sBeamIn = svgEl("line", { x1: 0, y1: 84, x2: 110, y2: 84, class: "lm-beam" }, side);
    const sBeamDown = svgEl("line", { x1: 110, y1: 84, x2: 110, y2: 196, class: "lm-beam lm-beam-wide" }, side);
    svgEl("polygon", { points: "100,204 120,204 110,300", class: "lm-cone" }, side);
    svgEl("line", { x1: 92, y1: 66, x2: 128, y2: 102, class: "lm-mirror-line" }, side);
    svgEl("ellipse", { cx: 110, cy: 200, rx: 30, ry: 7, class: "lm-lens" }, side);
    svgEl("rect", { x: 10, y: 300, width: 200, height: 18, class: "lm-sheet" }, side);
    const sSpark = svgEl("circle", { cx: 110, cy: 300, r: 5, class: "lm-spark" }, side);
    svgEl("path", { d: "M180 250 L136 258", class: "lm-airline", "marker-end": "url(#ls-n)" }, side);
    svgText(6, 76, "beam from mirror 2", "lm-label", side);
    svgText(134, 66, "mirror 3", "lm-label", side);
    svgText(134, 80, "(45°)", "lm-label", side);
    svgText(146, 196, "focusing", "lm-label", side);
    svgText(146, 210, "lens", "lm-label", side);
    svgText(184, 246, "air", "lm-label", side, { "text-anchor": "middle" });
    svgText(110, 342, "focal point on the surface", "lm-label", side, { "text-anchor": "middle" });
    svgText(110, 358, "of the sheet", "lm-label", side, { "text-anchor": "middle" });

    const L = cut.getTotalLength();
    cut.style.strokeDasharray = `${f1(L)} ${f1(L + 10)}`;
    const T_TRACE = 11, T_HOLD = 1.6, LCYCLE = T_TRACE + T_HOLD;
    function drawLaser(t) {
      const tc = t % LCYCLE;
      const p = clamp01(tc / T_TRACE);
      cut.style.strokeDashoffset = f1(L * (1 - p));
      const pt = cut.getPointAtLength(L * p);
      const pt2 = cut.getPointAtLength(Math.min(L, L * p + 2));
      const hx = pt.x, gy = pt.y;
      gantry.setAttribute("transform", `translate(0 ${f1(gy)})`);
      headT.setAttribute("transform", `translate(${f1(hx)} ${f1(gy)})`);
      headLabel.setAttribute("x", hx > 380 ? "-20" : "20");
      headLabel.setAttribute("text-anchor", hx > 380 ? "end" : "start");
      beam.setAttribute("points", `150,41 52,41 52,${f1(gy)} ${f1(hx)},${f1(gy)}`);
      const firing = p < 1;
      beam.classList.toggle("is-off", !firing); sBeamIn.classList.toggle("is-off", !firing); sBeamDown.classList.toggle("is-off", !firing);
      spark.setAttribute("opacity", firing ? f1(0.6 + 0.4 * Math.sin(t * 30)) : "0");
      sSpark.setAttribute("opacity", firing ? f1(0.6 + 0.4 * Math.sin(t * 30)) : "0");
      const flow = f1(-t * 60);
      beam.style.strokeDashoffset = flow; sBeamIn.style.strokeDashoffset = flow; sBeamDown.style.strokeDashoffset = flow;
      const dx = Math.abs(pt2.x - pt.x), dy = Math.abs(pt2.y - pt.y);
      xLab.classList.toggle("is-live", firing && dx > dy * 0.5);
      yLab.classList.toggle("is-live", firing && dy > dx * 0.5);
    }
    const lmAnim = makeAnimator(lmBox, drawLaser, T_TRACE * 0.62);
    bindPlayButton($(".lm-play", lmBox), lmAnim);
  }

  // ---------------- Unidirectional vs bidirectional raster engraving ----------------
  const scanBox = $("#scan-demo");
  if (scanBox) {
    const svg = $("#scan-svg");
    const CX = 260, CY = 150, R = 108, RI = 46, Y_TOP = 46, STEP = 8, XL = 128, XR = 392, SPEED = 820, T_STEP = 0.06, OFFSET = 3;
    svgEl("rect", { x: 20, y: 20, width: 480, height: 262, class: "scan-sheet" }, svg);
    svgEl("circle", { cx: CX, cy: CY, r: R, class: "scan-guide" }, svg);
    svgEl("circle", { cx: CX, cy: CY, r: RI, class: "scan-guide" }, svg);
    const rowsG = svgEl("g", {}, svg);
    const travel = svgEl("line", { class: "scan-travel" }, svg);
    const headEl = svgEl("circle", { r: 7, class: "scan-head" }, svg);
    const rows = [];
    for (let y = Y_TOP; y <= CY * 2 - Y_TOP; y += STEP) {
      const dy = y - CY;
      if (Math.abs(dy) >= R) continue;
      const xo = Math.sqrt(R * R - dy * dy);
      const segs = Math.abs(dy) < RI ? [[CX - xo, CX - Math.sqrt(RI * RI - dy * dy)], [CX + Math.sqrt(RI * RI - dy * dy), CX + xo]] : [[CX - xo, CX + xo]];
      rows.push({ y, segs, lines: segs.map(() => svgEl("line", { y1: y, y2: y, class: "scan-line" }, rowsG)) });
    }
    const PASS = (XR - XL) / SPEED;
    let scanMode = "uni";
    const offsetBox = $("#scan-offset");
    const timeOut = $(".scan-time", scanBox), textOut = $(".scan-text", scanBox);
    const totalFor = (m) => rows.length * (m === "uni" ? 2 * PASS : PASS) + rows.length * T_STEP;
    const TEXT = {
      uni: "Unidirectional: the laser fires only on the left-to-right pass, then the head returns without firing (dashed) and steps down. Every line starts from the same side, so edges line up cleanly — but the empty return passes make the job slower.",
      bi: "Bidirectional: the laser fires on both passes, so there are no empty returns and the job takes about half the time. Lines engraved in opposite directions only line up if the scan offset (a timing correction) is calibrated; tick the box to see doubled, jagged edges without it."
    };
    function drawScan(t) {
      const total = totalFor(scanMode);
      const tc = Math.min(t, total);
      const perRow = (scanMode === "uni" ? 2 * PASS : PASS) + T_STEP;
      const rowIdx = Math.min(rows.length - 1, Math.floor(tc / perRow));
      const u = tc - rowIdx * perRow;
      const off = scanMode === "bi" && offsetBox.checked ? OFFSET : 0;
      let hx = XL, hy = rows[rowIdx].y, firing = false, returning = false;
      rows.forEach((row, i) => {
        const ltr = scanMode === "uni" || i % 2 === 0;
        const shift = ltr ? off : -off;
        let reach; // how far along this row's firing pass the head has got (0..1)
        if (i < rowIdx || tc >= total) reach = 1;
        else if (i > rowIdx) reach = 0;
        else reach = clamp01(u / PASS);
        const headX = ltr ? lerp(XL, XR, reach) : lerp(XR, XL, reach);
        row.segs.forEach(([a, b], k) => {
          const ln = row.lines[k];
          let x1 = a, x2 = b;
          if (reach <= 0) { x2 = x1; }
          else if (reach < 1) { if (ltr) x2 = Math.min(b, headX); else x1 = Math.max(a, headX); }
          if (x2 < x1) x2 = x1;
          ln.setAttribute("x1", f1(x1 + shift)); ln.setAttribute("x2", f1(x2 + shift));
        });
        if (i === rowIdx && tc < total) {
          if (u < PASS) { hx = headX; firing = row.segs.some(([a, b]) => headX >= a && headX <= b); }
          else if (scanMode === "uni" && u < 2 * PASS) { hx = lerp(XR, XL, (u - PASS) / PASS); returning = true; }
          else { hx = ltr ? XR : XL; hy = row.y + STEP * clamp01((u - (scanMode === "uni" ? 2 * PASS : PASS)) / T_STEP); }
        }
      });
      if (tc >= total) { hx = scanMode === "uni" || rows.length % 2 === 1 ? XR : XL; hy = rows[rows.length - 1].y; }
      headEl.setAttribute("cx", f1(hx)); headEl.setAttribute("cy", f1(hy));
      headEl.classList.toggle("is-firing", firing);
      headEl.setAttribute("opacity", reduce ? "0" : "1");
      if (returning) { travel.removeAttribute("display"); travel.setAttribute("x1", f1(hx)); travel.setAttribute("x2", f1(XR)); travel.setAttribute("y1", f1(hy)); travel.setAttribute("y2", f1(hy)); }
      else travel.setAttribute("display", "none");
      const other = scanMode === "uni" ? "bi" : "uni";
      timeOut.textContent = `Engraving time (simulated): ${tc.toFixed(1)} s of ${total.toFixed(1)} s. The ${other === "bi" ? "bidirectional" : "unidirectional"} job would take ${totalFor(other).toFixed(1)} s.`;
      if (t > total + 2.4 && !reduce) scanAnim.reset(0);
    }
    const scanAnim = makeAnimator(scanBox, drawScan, 999);
    function setScan(m) {
      scanMode = m;
      $$("[data-scan]", scanBox).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.scan === m)));
      offsetBox.disabled = m !== "bi";
      offsetBox.closest("label").classList.toggle("is-disabled", m !== "bi");
      textOut.textContent = TEXT[m];
      scanAnim.reset(reduce ? 999 : 0);
    }
    $$("[data-scan]", scanBox).forEach((b) => b.addEventListener("click", () => setScan(b.dataset.scan)));
    offsetBox.addEventListener("change", () => scanAnim.redraw());
    bindPlayButton($(".scan-play", scanBox), scanAnim);
    $(".scan-replay", scanBox).addEventListener("click", () => scanAnim.reset(reduce ? 999 : 0));
    setScan("uni");
  }

  // ---------------- Layer-height slider ----------------
  const layerRange = $("#layer-range");
  if (layerRange) {
    const rects = $("#layer-rects"), outline = $("#layer-outline"), value = $("#layer-value"), readout = $("#layer-readout");
    const cx = 210, base = 200, rx = 160, ry = 170, PART_MM = 4;
    outline.setAttribute("d", `M ${cx - rx} ${base} A ${rx} ${ry} 0 0 1 ${cx + rx} ${base}`);
    function drawLayers() {
      const lh = Number(layerRange.value);
      const n = Math.round(PART_MM / lh);
      const h = ry / n;
      rects.replaceChildren();
      for (let k = 0; k < n; k++) {
        const zMid = (k + 0.5) * h;
        const half = rx * Math.sqrt(Math.max(0, 1 - (zMid / ry) ** 2));
        rects.append(svgEl("rect", { x: (cx - half).toFixed(2), y: (base - (k + 1) * h).toFixed(2), width: (2 * half).toFixed(2), height: h.toFixed(2), class: k % 2 ? "layer-rect alt" : "layer-rect" }));
      }
      value.textContent = `${lh.toFixed(2)} mm`;
      const feel = lh <= 0.12 ? "Smoother curves, but more layers to print." : lh <= 0.2 ? "A balance of smoothness and speed — 0.20 mm is the usual default for a 0.4 mm nozzle." : "Fewer layers and a faster print, with more visible steps on curves.";
      readout.textContent = `${n} layers for this 4 mm-tall demo dome. ${feel}`;
      layerRange.setAttribute("aria-valuetext", `${lh.toFixed(2)} millimetres, ${n} layers`);
    }
    layerRange.addEventListener("input", drawLayers);
    drawLayers();
  }

  // ---------------- Material picker (Bambu Lab Wiki filament guide) ----------------
  const MATERIALS = {
    PLA: { full: "Polylactic acid", nozzle: "190–240 °C", bed: "35–65 °C (35–45 °C on the Cool Plate)", printer: "Open-frame or enclosed", ratings: [2, 2, 3],
      strengths: "The easiest filament to print: stiff, sharp detail, very little warping.", uses: "Prototypes, models, jigs, display pieces.", note: "Softens at fairly low temperatures, so keep parts away from hot places." },
    PETG: { full: "Polyethylene terephthalate glycol-modified", nozzle: "240–270 °C (PETG HF: 230–260 °C)", bed: "60–80 °C", printer: "Open-frame or enclosed (enclosed recommended in a cold room)", ratings: [3, 3, 2],
      strengths: "Tougher and more heat-tolerant than PLA.", uses: "Functional parts, brackets, parts near water.", note: "Strings more than PLA; dry the spool before use." },
    ABS: { full: "Acrylonitrile butadiene styrene", nozzle: "240–280 °C", bed: "90–100 °C", printer: "Enclosed printer recommended", ratings: [3, 3, 3],
      strengths: "Heat-resistant and tough.", uses: "Parts that get warm, housings, mechanical parts.", note: "Gives off fumes (including styrene) while printing — enclosed printer and good ventilation." },
    ASA: { full: "Acrylonitrile styrene acrylate", nozzle: "240–280 °C", bed: "90–100 °C", printer: "Enclosed printer recommended", ratings: [3, 3, 3],
      strengths: "ABS-like toughness and heat resistance.", uses: "Parts that live outdoors, housings, brackets.", note: "Same fume care as ABS: enclosed printer and good ventilation." },
    TPU: { full: "Thermoplastic polyurethane", nozzle: "200–250 °C (TPU 95A HF)", bed: "30–45 °C", printer: "Open-frame or enclosed", ratings: null,
      strengths: "Flexible and rubber-like; bends and springs back.", uses: "Gaskets, grips, bumpers, soft feet.", note: "Most TPU is too soft for the AMS — feed it from an external spool (Bambu's \"TPU for AMS\" is the exception)." }
  };
  const matCard = $("#material-card");
  if (matCard) {
    const stars = (n) => "★".repeat(n);
    function showMat(key) {
      const m = MATERIALS[key];
      $$(".material-tab", root).forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.mat === key)));
      matCard.replaceChildren();
      matCard.append(make("h5", "", `${key} — ${m.full}`));
      const dl = make("dl", "material-facts");
      const add = (k, v, cls) => { dl.append(make("dt", "", k)); dl.append(make("dd", cls || "", v)); };
      add("Nozzle", m.nozzle, "mono");
      add("Bed", m.bed, "mono");
      add("Printer", m.printer);
      if (m.ratings) {
        const [heat, impact, tensile] = m.ratings;
        dl.append(make("dt", "", "Guide ratings"));
        const dd = make("dd", "material-stars");
        [["Heat resistance", heat], ["Impact", impact], ["Tensile strength", tensile]].forEach(([lbl, n]) => {
          const s = make("span", "", `${lbl} `);
          const st = make("span", "stars", stars(n));
          st.setAttribute("aria-label", `${n} stars`);
          s.append(st);
          dd.append(s);
        });
        dl.append(dd);
      } else {
        add("Guide ratings", "Not rated in the guide's strength table.");
      }
      add("Strengths", m.strengths);
      add("Good for", m.uses);
      add("Watch out", m.note);
      matCard.append(dl);
    }
    $$(".material-tab", root).forEach((t) => t.addEventListener("click", () => showMat(t.dataset.mat)));
    showMat("PLA");
  }

  // ---------------- Cut vs engrave ----------------
  const modeSvg = $("#mode-svg");
  if (modeSvg) {
    const cut = $("#mode-cut"), head = $("#mode-head"), raster = $("#mode-raster"), modeText = $("#mode-text");
    const L = cut.getTotalLength();
    const rows = [];
    for (let y = 34; y <= 222; y += 8) {
      const line = svgEl("line", { x1: 70, y1: y, x2: 70, y2: y, class: "mode-raster-line" });
      raster.append(line);
      rows.push(line);
    }
    const TEXT = {
      vector: "Vector cut: the head follows the outline once at high power and the beam goes right through the sheet, so the shape drops out.",
      raster: "Raster engrave: the head sweeps back and forth line by line, firing only inside the shape, and burns a shallow picture into the surface — nothing is cut out."
    };
    let mode = "vector", t0 = performance.now(), raf = null, visible = false;
    function frame(now) {
      const period = mode === "vector" ? 4200 : 5200;
      const p = reduce ? 1 : Math.min(1, ((now - t0) % (period + 900)) / period);
      if (mode === "vector") {
        cut.style.strokeDasharray = `${L}`;
        cut.style.strokeDashoffset = `${L * (1 - p)}`;
        const pt = cut.getPointAtLength(L * p);
        head.setAttribute("cx", pt.x); head.setAttribute("cy", pt.y);
      } else {
        const total = rows.length * p;
        rows.forEach((line, i) => {
          const leftToRight = i % 2 === 0;
          const frac = Math.max(0, Math.min(1, total - i));
          const xEnd = leftToRight ? 70 + 220 * frac : 290 - 220 * frac;
          line.setAttribute("x1", leftToRight ? 70 : 290);
          line.setAttribute("x2", frac > 0 ? xEnd : (leftToRight ? 70 : 290));
          if (frac > 0 && frac < 1) { head.setAttribute("cx", xEnd); head.setAttribute("cy", line.getAttribute("y1")); }
        });
        if (p >= 1) { head.setAttribute("cx", 290); head.setAttribute("cy", 222); }
      }
      head.style.opacity = reduce ? "0" : "1";
      if (!reduce && visible) raf = requestAnimationFrame(frame);
      else raf = null;
    }
    function setMode(m) {
      mode = m;
      $$(".mode-btn[data-mode]", root).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
      modeSvg.dataset.mode = m;
      modeText.textContent = TEXT[m];
      t0 = performance.now();
      if (m === "vector") rows.forEach((l) => l.setAttribute("x2", l.getAttribute("x1")));
      else { cut.style.strokeDashoffset = `${L}`; }
      if (!raf) raf = requestAnimationFrame(frame);
    }
    $$(".mode-btn[data-mode]", root).forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
    whenVisible(modeSvg, () => { visible = true; if (!raf) raf = requestAnimationFrame(frame); }, () => { visible = false; }, 0.2);
    setMode("vector");
  }

  // ---------------- Kerf demo (conceptual) ----------------
  const kerfRange = $("#kerf-range");
  if (kerfRange) {
    const parts = $("#kerf-parts"), comp = $("#kerf-comp"), out = $("#kerf-readout");
    const X0 = 30, X1 = 390, W = 50, CENTRES = [110, 210, 310];
    function topPiece(d, dy) { // part kept inside the path, offset inward by d, dropped by dy
      const pts = [[X0 + d, 70 + d], [X1 - d, 70 + d], [X1 - d, 120 - d]];
      [...CENTRES].reverse().forEach((c) => { pts.push([c + W / 2 - d, 120 - d], [c + W / 2 - d, 160 - d], [c - W / 2 + d, 160 - d], [c - W / 2 + d, 120 - d]); });
      pts.push([X0 + d, 120 - d]);
      return pts.map(([x, y]) => `${x.toFixed(1)},${(y + dy).toFixed(1)}`).join(" ");
    }
    function bottomPiece(d) { // slots are notches: material outside the slot path
      const pts = [[X0 + d, 120 + d]];
      CENTRES.forEach((c) => { pts.push([c - W / 2 - d, 120 + d], [c - W / 2 - d, 160 + d], [c + W / 2 + d, 160 + d], [c + W / 2 + d, 120 + d]); });
      pts.push([X1 - d, 120 + d], [X1 - d, 200 - d], [X0 + d, 200 - d]);
      return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    }
    function drawKerf() {
      const k = Number(kerfRange.value) * 1.2; // exaggerated drawing units, not millimetres
      const compensated = comp.checked;
      const d = compensated ? 0 : k / 2;
      const dy = 2 * d;
      parts.replaceChildren(
        svgEl("polygon", { points: bottomPiece(d), class: "kerf-bottom" }),
        svgEl("polygon", { points: topPiece(d, dy), class: "kerf-top" })
      );
      if (d > 0) {
        CENTRES.forEach((c) => {
          parts.append(svgEl("rect", { x: c - W / 2 - d, y: 120 + d, width: 2 * d, height: 40, class: "kerf-gap" }));
          parts.append(svgEl("rect", { x: c + W / 2 - d, y: 120 + d, width: 2 * d, height: 40, class: "kerf-gap" }));
        });
      }
      parts.append(svgEl("polygon", { points: topPiece(0, 0), class: "kerf-design" }), svgEl("polygon", { points: bottomPiece(0), class: "kerf-design" }));
      let msg;
      if (k === 0) msg = "No kerf: the parts match the drawing and the joint is snug.";
      else if (compensated) msg = "With compensation: each path is moved out (tabs) or in (slots) by half the kerf, so the parts come out at the drawn size and the joint is snug.";
      else msg = "Without compensation: tabs come out narrower and slots wider, so the joint is loose — the orange gaps are the lost material.";
      out.textContent = msg;
      kerfRange.setAttribute("aria-valuetext", `kerf ${kerfRange.value} of 10 (exaggerated)`);
    }
    kerfRange.addEventListener("input", drawKerf);
    comp.addEventListener("change", drawKerf);
    drawKerf();
  }

  // ---------------- Safety checklist ----------------
  const checklist = $("#fl-checklist");
  if (checklist) {
    const count = $("#fl-check-count");
    const boxes = $$("input[type=checkbox]", checklist);
    const update = () => {
      const n = boxes.filter((b) => b.checked).length;
      count.textContent = n === boxes.length ? "All checks done — ready to start." : `${n} of ${boxes.length} checks done.`;
    };
    boxes.forEach((b) => b.addEventListener("change", update));
    update();
  }
})();
