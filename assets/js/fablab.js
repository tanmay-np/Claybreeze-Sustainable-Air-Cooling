/*
 * Fab Lab Notebook (Part II of the page): 3D printing and laser cutting at Tinkerers' Lab.
 * Interactive pieces: abbreviation tooltips, printer cards, lab photo strips, H2D labelled view,
 * FDM and laser steppers, layer-height slider, material picker, cut/engrave demo, kerf demo,
 * lab videos and the safety checklist. No external requests; all images are local.
 * Respects prefers-reduced-motion and the ?reducedmotion test flag.
 */
(() => {
  "use strict";
  const root = document.getElementById("fablab");
  if (!root) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduce = motionQuery.matches || params.has("reducedmotion");
  document.documentElement.classList.toggle("fl-reduce", reduce);
  motionQuery.addEventListener?.("change", (e) => {
    reduce = e.matches || params.has("reducedmotion");
    document.documentElement.classList.toggle("fl-reduce", reduce);
  });
  const SVGNS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs) => { const n = document.createElementNS(SVGNS, tag); Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v)); return n; };
  const make = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
  function whenVisible(el, onIn, onOut, threshold = 0.35) {
    if (!("IntersectionObserver" in window)) { onIn(); return; }
    new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? onIn() : onOut && onOut())), { threshold }).observe(el);
  }

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
    let left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
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

  // ---------------- "In our lab" photo strips (team's own photos) ----------------
  const ui = window.ClayBreezeUI;
  const gallery = Array.isArray(window.CLAYBREEZE_GALLERY) ? window.CLAYBREEZE_GALLERY : [];
  function fillStrip(id, category) {
    const strip = document.getElementById(id);
    if (!strip || !ui) return;
    gallery.filter((g) => g.category === category).forEach((item) => {
      const fig = make("figure", "fl-strip-item");
      fig.append(ui.viewerButton(item, "fl-strip-thumb", { sizes: "240px" }), make("figcaption", "", item.title));
      strip.append(fig);
    });
  }
  fillStrip("fl-strip-3dp", "3d-printing");
  fillStrip("fl-strip-laser", "laser-cutting");

  // ---------------- H2D labelled view ----------------
  // Positions are percentages of the official 1:1 front image (approximate).
  const H2D_PARTS = [
    { x: 50.0, y: 49.7, name: "Dual nozzles and hotend", text: "Two nozzles sit side by side on one print head. The hotend melts the filament (up to 350 °C on the H2D), and each nozzle can carry a different material or colour — for example the part plastic plus an easy-to-remove support material." },
    { x: 50.0, y: 42.5, name: "Extruder", text: "Small hardened-steel gears grip the filament and push it into the hotend at a precisely controlled rate. Pulling back a little (retraction) stops drips while the head travels." },
    { x: 44.6, y: 67.0, name: "Heated build plate", text: "The removable plate the part is built on. It is heated (up to 120 °C) so the first layer sticks and the part does not warp; flexing the plate releases the finished print." },
    { x: 59.5, y: 44.0, name: "Motion system (gantry)", text: "Rails, belts and motors move the print head left–right and front–back, while the plate steps down by one layer height after each layer." },
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

  // ---------------- Steppers (How FDM works, laser workflow) ----------------
  const STEPS = {
    fdm: [
      { title: "Spool", text: "Filament — a plastic wire 1.75 mm thick — is wound on a spool. The printer pulls it off only as fast as it needs it." },
      { title: "Extruder gears", text: "Two small gears grip the filament and push it forward at an exact rate. Reversing a little (retraction) stops drips when the head moves between areas." },
      { title: "Hotend", text: "A heater block melts the plastic. Each material has its own temperature — Bambu Lab's guide gives about 190–240 °C for PLA." },
      { title: "Nozzle deposits", text: "The soft plastic squeezes out of a narrow nozzle (usually 0.4 mm) as a thin bead, drawn along the path the slicer planned." },
      { title: "Layers stack", text: "When a layer is finished, the plate moves down by one layer height and the next layer is drawn on top, bonding to the one below." },
      { title: "Part cools", text: "A fan blows on the fresh plastic so it hardens straight away and holds its shape, ready for the next layer." }
    ],
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
        [["Heat resistance", heat], ["Impact", impact], ["Tensile strength", tensile]].forEach(([label, n]) => {
          const s = make("span", "", `${label} `);
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

  // ---------------- Lab videos: muted, looped, play only while visible ----------------
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
      $$(".mode-btn", root).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
      modeSvg.dataset.mode = m;
      modeText.textContent = TEXT[m];
      t0 = performance.now();
      if (m === "vector") rows.forEach((l) => l.setAttribute("x2", l.getAttribute("x1")));
      else { cut.style.strokeDashoffset = `${L}`; }
      if (!raf) raf = requestAnimationFrame(frame);
    }
    $$(".mode-btn", root).forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
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
