/*
 * ClayBreeze — Circuit & Control Lab (Section 07).
 *
 * An original SVG drawing of our breadboard wiring (ESP32, DHT11, 3-channel relay,
 * two fans and the water motor), matching the wiring table in index.html, plus a
 * SOFTWARE SIMULATION of the control logic running on the ESP32. Nothing here is
 * connected to the real hardware.
 *
 * Control logic (thresholds from window.CLAYBREEZE_CONTROL, same as the sketch in
 * firmware/claybreeze_controller): each output switches ON past one limit and OFF
 * past the other, and keeps its previous state in between (hysteresis).
 *
 * Animation runs only while the figure is on screen and stops under
 * prefers-reduced-motion or the ?reducedmotion test flag.
 */
(() => {
  "use strict";
  const C = window.CLAYBREEZE_CONTROL;
  const host = document.getElementById("circuit-svg");
  const tempSlider = document.getElementById("sim-temp-slider");
  if (!C || !host || !tempSlider) return;

  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduce = motionQuery.matches || params.has("reducedmotion");
  const NS = "http://www.w3.org/2000/svg";
  const deg = " °C";
  const fmt = (v) => (Math.round(v * 10) / 10).toFixed(1);

  // ------------------------------------------------------------------ logic
  const state = { t: 25, rh: 50, fan1: false, fan2: false, pump: false };
  function applyReading(t, rh) {
    state.t = t; state.rh = rh;
    if (t > C.fan1.onAboveC) state.fan1 = true; else if (t <= C.fan1.offAtOrBelowC) state.fan1 = false;
    if (t > C.fan2.onAboveC) state.fan2 = true; else if (t <= C.fan2.offAtOrBelowC) state.fan2 = false;
    if (rh < C.pump.onBelowRH) state.pump = true; else if (rh >= C.pump.offAtOrAboveRH) state.pump = false;
    return { fan1: state.fan1, fan2: state.fan2, pump: state.pump };
  }
  function resetLogic() { state.fan1 = state.fan2 = state.pump = false; } // the sketch starts with every relay OFF

  // ------------------------------------------------------------------ drawing
  // Breadboard grid: rows 1–19 top to bottom (antenna end at the top), columns A–J.
  const Y = (r) => 58 + (r - 1) * 19;
  const COL = { A: 66, B: 84, C: 102, D: 120, E: 138, F: 162, G: 180, H: 198, I: 216, J: 234 };
  const RAIL = { lp: 24, ln: 42, rn: 258, rp: 276 }; // left +3.3V, left GND, right GND, right +5V

  const WIRES = [
    { id: "v5", cls: "w-5v", d: `M${COL.J},${Y(1)} H${RAIL.rp}`, info: "1J · V5 (5V) → right positive rail (5V)" },
    { id: "g3v3", cls: "w-3v3", d: `M${COL.B},${Y(19)} H${RAIL.lp}`, info: "19B · 3V3 → left positive rail (3.3V)" },
    { id: "gndL", cls: "w-gnd", d: `M${COL.B},${Y(14)} H${RAIL.ln}`, info: "14B · GND → left negative rail (GND)" },
    { id: "gndR", cls: "w-gnd", d: `M${COL.J},${Y(7)} H${RAIL.rn}`, info: "7J · GND → right negative rail (GND)" },
    { id: "g4", cls: "w-data", d: `M340,${Y(13)} H${COL.J}`, info: "13J · GPIO4 (G4) → DHT11 DATA" },
    { id: "g19", cls: "w-sig", out: "fan1", d: `M${COL.J},${Y(8)} H330`, info: "8J · GPIO19 (G19) → Relay IN1 – Fan 1" },
    { id: "g21", cls: "w-sig", out: "fan2", d: `M${COL.J},${Y(6)} H330`, info: "6J · GPIO21 (G21) → Relay IN2 – Fan 2" },
    { id: "g22", cls: "w-sig", out: "pump", d: `M${COL.J},${Y(3)} H330`, info: "3J · GPIO22 (G22) → Relay IN3 – Water motor" },
    { id: "dhtGnd", cls: "w-gnd", d: `M340,${Y(14)} H${RAIL.rn}`, info: "DHT11 GND → GND rail (the ground rails are connected together)" },
    { id: "dhtVcc", cls: "w-3v3", d: `M340,${Y(15)} H310 V458 H${RAIL.lp} V430`, info: "DHT11 VCC → 3.3V rail" },
    { id: "rlyVcc", cls: "w-5v", d: `M330,44 H${RAIL.rp}`, info: "Relay VCC/DC+ → 5V rail" },
    { id: "rlyGnd", cls: "w-gnd", d: `M330,66 H${RAIL.rn}`, info: "Relay GND/DC− → common GND" },
    { id: "out1", cls: "w-load", out: "fan1", d: `M444,${Y(8)} H482 V470 H90 V514`, info: "Relay channel 1 (IN1) contacts → Fan 1 (supply wiring simplified)" },
    { id: "out2", cls: "w-load", out: "fan2", d: `M444,${Y(6)} H494 V478 H250 V514`, info: "Relay channel 2 (IN2) contacts → Fan 2 (supply wiring simplified)" },
    { id: "out3", cls: "w-load", out: "pump", d: `M444,${Y(3)} H506 V486 H420 V560`, info: "Relay channel 3 (IN3) contacts → water motor (supply wiring simplified)" }
  ];
  // Labelled ESP32 header pins (from the wiring table); the other pins are left unconnected.
  const PINS = [
    { side: "R", r: 1, t: "V5" }, { side: "R", r: 3, t: "G22" }, { side: "R", r: 6, t: "G21" }, { side: "R", r: 7, t: "GND" },
    { side: "R", r: 8, t: "G19" }, { side: "R", r: 13, t: "G4" }, { side: "L", r: 14, t: "GND" }, { side: "L", r: 19, t: "3V3" }
  ];
  const CHANNELS = [ // relay channels, drawn at the height of their IN pin
    { out: "fan1", y: Y(8), pin: "IN1", load: "Fan 1" },
    { out: "fan2", y: Y(6), pin: "IN2", load: "Fan 2" },
    { out: "pump", y: Y(3), pin: "IN3", load: "Pump" }
  ];

  let svg = "";
  svg += `<defs><filter id="cl-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="520" height="650"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
  // breadboard
  svg += `<rect class="cl-board" x="10" y="20" width="280" height="420" rx="6"/>`;
  svg += `<rect class="cl-gap" x="144" y="24" width="12" height="412"/>`;
  [["lp", "cl-rail-3v3", "+"], ["ln", "cl-rail-gnd", "−"], ["rn", "cl-rail-gnd", "−"], ["rp", "cl-rail-5v", "+"]].forEach(([k, cls, sign]) => {
    svg += `<line class="cl-rail ${cls}" x1="${RAIL[k]}" y1="30" x2="${RAIL[k]}" y2="430"/>`;
    svg += `<text class="cl-t cl-sign ${cls}-t" x="${RAIL[k]}" y="14" text-anchor="middle">${sign}</text>`;
  });
  for (let r = 1; r <= 19; r++) {
    const y = Y(r);
    ["A", "B", "I", "J"].forEach((c) => { svg += `<circle class="cl-hole" cx="${COL[c]}" cy="${y}" r="2.3"/>`; });
    Object.values(RAIL).forEach((x) => { svg += `<circle class="cl-hole" cx="${x}" cy="${y}" r="2"/>`; });
  }
  ["A", "B", "I", "J"].forEach((c) => { svg += `<text class="cl-t cl-xs cl-muted" x="${COL[c]}" y="45" text-anchor="middle">${c}</text>`; });
  // ESP32 board (straddles the centre gap; antenna at top, USB at bottom)
  svg += `<g class="cl-esp"><rect class="cl-pcb" x="94" y="26" width="112" height="410" rx="4"/>`;
  svg += `<path class="cl-antenna" d="M118,34 h8 v8 h8 v-8 h8 v8 h8 v-8 h8 v8 h8 v-8 h6"/>`;
  svg += `<rect class="cl-can" id="cl-can" x="116" y="52" width="52" height="98" rx="2"/>`;
  svg += `<text class="cl-t cl-chip-t" x="142" y="98" text-anchor="middle">ESP32</text>`;
  svg += `<text class="cl-t cl-xs cl-muted" x="150" y="14" text-anchor="middle">▲ antenna</text>`;
  svg += `<rect class="cl-usb" x="134" y="422" width="32" height="16" rx="2"/><text class="cl-t cl-xs cl-on-dark" x="150" y="414" text-anchor="middle">USB</text>`;
  for (let r = 1; r <= 19; r++) svg += `<circle class="cl-pin" cx="${COL.C}" cy="${Y(r)}" r="2.6"/><circle class="cl-pin" cx="${COL.H}" cy="${Y(r)}" r="2.6"/>`;
  PINS.forEach((p) => {
    svg += p.side === "R"
      ? `<text class="cl-t cl-pin-t" x="${COL.H - 6}" y="${Y(p.r) + 4}" text-anchor="end">${p.t}</text>`
      : `<text class="cl-t cl-pin-t" x="${COL.C + 6}" y="${Y(p.r) + 4}">${p.t}</text>`;
  });
  svg += `</g>`;
  // relay module
  svg += `<g class="cl-relay"><rect class="cl-relay-pcb" x="330" y="30" width="110" height="190" rx="5"/>`;
  [["DC+", 44], ["DC−", 66]].forEach(([t, y]) => { svg += `<circle class="cl-pin" cx="330" cy="${y}" r="3"/><text class="cl-t cl-pin-t" x="337" y="${y + 4}">${t}</text>`; });
  CHANNELS.forEach((ch) => {
    svg += `<circle class="cl-pin" cx="330" cy="${ch.y}" r="3"/><text class="cl-t cl-pin-t" x="337" y="${ch.y + 4}">${ch.pin}</text>`;
    svg += `<circle class="cl-led" data-out="${ch.out}" cx="371" cy="${ch.y}" r="4.5"/>`;
    svg += `<rect class="cl-cube" x="382" y="${ch.y - 15}" width="48" height="30" rx="2"/><text class="cl-t cl-pin-t" x="406" y="${ch.y + 4}" text-anchor="middle">${ch.load}</text>`;
    svg += `<rect class="cl-term" x="432" y="${ch.y - 8}" width="12" height="16" rx="1"/>`;
  });
  svg += `</g><text class="cl-t cl-sm" x="385" y="238" text-anchor="middle">3-channel relay</text>`;
  // DHT11
  svg += `<g class="cl-dht"><rect class="cl-dht-body" x="340" y="268" width="84" height="74" rx="4"/>`;
  for (let gx = 0; gx < 4; gx++) for (let gy = 0; gy < 5; gy++) svg += `<rect class="cl-grille" x="${380 + gx * 10}" y="${276 + gy * 12}" width="6" height="8" rx="1"/>`;
  [["DATA", Y(13)], ["GND", Y(14)], ["VCC", Y(15)]].forEach(([t, y]) => { svg += `<circle class="cl-pin" cx="340" cy="${y}" r="3"/><text class="cl-t cl-pin-t" x="346" y="${y + 4}">${t}</text>`; });
  svg += `</g><text class="cl-t cl-sm" x="382" y="360" text-anchor="middle">DHT11</text>`;
  svg += `<text class="cl-t cl-sm cl-reading" id="cl-reading" x="382" y="378" text-anchor="middle"></text>`;
  // wires (halo + visible + wide invisible hit area)
  WIRES.forEach((w) => {
    svg += `<g class="cl-wire ${w.cls}" data-wire="${w.id}"${w.out ? ` data-out="${w.out}"` : ""} tabindex="0" aria-label="${w.info}">`;
    svg += `<path class="halo" d="${w.d}"/><path class="vis" d="${w.d}"/><path class="hit" d="${w.d}"/>`;
    svg += `<circle class="end" cx="${w.d.match(/^M([\d.]+),([\d.]+)/)[1]}" cy="${w.d.match(/^M([\d.]+),([\d.]+)/)[2]}" r="3.4"/></g>`;
  });
  // row numbers on top of the wires, with a halo so a jumper never hides them
  for (let r = 1; r <= 19; r++) svg += `<text class="cl-t cl-xs cl-muted cl-rownum" x="54" y="${Y(r) + 3.5}" text-anchor="middle">${r}</text>`;
  // loads
  const fan = (out, cx, label) => {
    let g = `<g class="cl-load" data-out="${out}"><circle class="cl-fan-ring" cx="${cx}" cy="560" r="46"/><g class="cl-blades" id="cl-blades-${out}">`;
    for (let k = 0; k < 4; k++) g += `<ellipse class="cl-blade" cx="${cx}" cy="538" rx="10" ry="20" transform="rotate(${k * 90} ${cx} 560)"/>`;
    g += `</g><circle class="cl-hub" cx="${cx}" cy="560" r="7"/>`;
    g += `<text class="cl-t cl-md" x="${cx}" y="626" text-anchor="middle">${label}</text><text class="cl-t cl-sm cl-state" x="${cx}" y="644" text-anchor="middle">OFF</text></g>`;
    return g;
  };
  svg += fan("fan1", 90, "Fan 1") + fan("fan2", 250, "Fan 2");
  svg += `<g class="cl-load" data-out="pump"><rect class="cl-tub" x="372" y="548" width="96" height="56" rx="4"/><rect class="cl-tub-water" x="374" y="570" width="92" height="32" rx="3"/>`;
  svg += `<rect class="cl-pump" x="402" y="560" width="36" height="34" rx="5"/><text class="cl-t cl-sm" x="420" y="582" text-anchor="middle">M</text>`;
  svg += `<path class="cl-tube" d="M438,568 H458 Q474,568 474,552 V520"/><path class="cl-tube-flow" id="cl-flow" d="M438,568 H458 Q474,568 474,552 V520"/>`;
  svg += `<text class="cl-t cl-xs cl-muted" x="474" y="512" text-anchor="middle">to pots</text>`;
  svg += `<text class="cl-t cl-md" x="420" y="626" text-anchor="middle">Water motor</text><text class="cl-t cl-sm cl-state" x="420" y="644" text-anchor="middle">OFF</text></g>`;
  // pulses
  svg += `<path id="cl-path-data" class="cl-ghost" d="M340,${Y(13)} H${COL.H} L142,150"/>`;
  CHANNELS.forEach((ch) => { svg += `<path id="cl-path-${ch.out}" class="cl-ghost" d="M142,150 L${COL.H},${ch.y} H330"/>`; });
  svg += `<circle class="cl-pulse cl-pulse-data" id="cl-pulse-data" r="5" cx="-20" cy="-20"/>`;
  CHANNELS.forEach((ch) => { svg += `<circle class="cl-pulse cl-pulse-sig" id="cl-pulse-${ch.out}" r="5" cx="-20" cy="-20"/>`; });

  host.innerHTML = `<svg class="cl-svg" viewBox="0 0 520 650" xmlns="${NS}" role="group" aria-label="Breadboard wiring of the ClayBreeze controller: ESP32, DHT11 on GPIO4, 3-channel relay on GPIO19, 21 and 22, two fans and the water motor">${svg}</svg>`;
  const root = host.firstElementChild;
  const q = (sel) => root.querySelector(sel);
  const qa = (sel) => [...root.querySelectorAll(sel)];

  // ------------------------------------------------------------------ wire info (hover / tap / focus)
  const info = $("circuit-wire-info");
  const DEFAULT_INFO = info ? info.textContent : "";
  const table = $("wiring-table");
  let pinned = null;
  function highlight(id) {
    qa(".cl-wire").forEach((g) => g.classList.toggle("is-hl", g.dataset.wire === id));
    if (table) [...table.querySelectorAll("tr[data-wire]")].forEach((tr) => tr.classList.toggle("is-hl", tr.dataset.wire === id));
    const w = WIRES.find((x) => x.id === id);
    if (info) info.textContent = w ? w.info : DEFAULT_INFO;
  }
  qa(".cl-wire").forEach((g) => {
    const id = g.dataset.wire;
    g.addEventListener("pointerenter", () => highlight(id));
    g.addEventListener("pointerleave", () => highlight(pinned));
    g.addEventListener("focus", () => highlight(id));
    g.addEventListener("blur", () => highlight(pinned));
    g.addEventListener("click", () => { pinned = pinned === id ? null : id; highlight(pinned || id); });
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); g.dispatchEvent(new Event("click")); } });
  });
  if (table) [...table.querySelectorAll("tr[data-wire]")].forEach((tr) => {
    tr.addEventListener("pointerenter", () => highlight(tr.dataset.wire));
    tr.addEventListener("pointerleave", () => highlight(pinned));
  });

  // ------------------------------------------------------------------ simulator UI
  const tempNumber = $("sim-temp-number"), rhSlider = $("sim-rh-slider"), rhNumber = $("sim-rh-number");
  const fanOutputs = $("sim-fan-outputs"), pumpOutputs = $("sim-pump-outputs");
  const fanExplain = $("sim-fan-explain"), pumpExplain = $("sim-pump-explain");
  const readout = $("sim-readout"), ruleNote = $("sim-rule-note");
  if (ruleNote) ruleNote.textContent = C.note || "";

  function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function buildTable(tbl, head, rows) {
    if (!tbl) return [];
    const thead = el("thead"), tr = el("tr");
    head.forEach((h) => { const th = el("th", "", h); th.scope = "col"; tr.append(th); });
    thead.append(tr);
    const tbody = el("tbody");
    rows.forEach((r) => { const row = el("tr"); r.forEach((c) => row.append(el("td", "", c))); tbody.append(row); });
    tbl.append(thead, tbody);
    return [...tbody.rows];
  }
  const fanRows = buildTable($("sim-fan-table"), ["Output", "ON", "OFF", "Now"], [
    ["Fan 1", `> ${C.fan1.onAboveC}${deg}`, `≤ ${C.fan1.offAtOrBelowC}${deg}`, ""],
    ["Fan 2", `> ${C.fan2.onAboveC}${deg}`, `≤ ${C.fan2.offAtOrBelowC}${deg}`, ""]
  ]);
  const pumpRows = buildTable($("sim-pump-table"), ["Output", "ON", "OFF", "Now"], [
    ["Water motor", `< ${C.pump.onBelowRH} %`, `≥ ${C.pump.offAtOrAboveRH} %`, ""]
  ]);
  function chip(label, on) {
    const c = el("div", `sim-chip ${on ? "is-on" : "is-off"}`);
    c.append(el("span", "sim-chip-label", label), el("span", "sim-chip-value", on ? "ON" : "OFF"));
    return c;
  }
  // zone: "on" (past the ON limit), "off" (past the OFF limit) or "hold" (between them)
  const zoneFan = (t, cfg) => (t > cfg.onAboveC ? "on" : t <= cfg.offAtOrBelowC ? "off" : "hold");
  const zonePump = (rh) => (rh < C.pump.onBelowRH ? "on" : rh >= C.pump.offAtOrAboveRH ? "off" : "hold");
  function paintRow(row, zone, on) {
    row.cells[1].classList.toggle("is-zone", zone === "on");
    row.cells[2].classList.toggle("is-zone", zone === "off");
    row.cells[3].textContent = zone === "hold" ? `holds ${on ? "ON" : "OFF"}` : on ? "ON" : "OFF";
    row.cells[3].classList.toggle("is-on", on);
  }
  function fanSentence(name, t, cfg, on) {
    const z = zoneFan(t, cfg), tt = `${fmt(t)}${deg}`;
    if (z === "on") return `${tt} is above ${cfg.onAboveC}${deg}, so ${name} is ON.`;
    if (z === "off") return `${tt} is at or below ${cfg.offAtOrBelowC}${deg}, so ${name} is OFF.`;
    return `${tt} is between ${cfg.offAtOrBelowC} and ${cfg.onAboveC}${deg}, so ${name} keeps its previous state: ${on ? "ON" : "OFF"}.`;
  }

  function render() {
    const { t, rh, fan1, fan2, pump } = state;
    fanOutputs.replaceChildren(chip("Fan 1", fan1), chip("Fan 2", fan2));
    pumpOutputs.replaceChildren(chip("Water motor", pump));
    paintRow(fanRows[0], zoneFan(t, C.fan1), fan1);
    paintRow(fanRows[1], zoneFan(t, C.fan2), fan2);
    paintRow(pumpRows[0], zonePump(rh), pump);
    fanExplain.textContent = `${fanSentence("Fan 1", t, C.fan1, fan1)} ${fanSentence("Fan 2", t, C.fan2, fan2)}`;
    const z = zonePump(rh), rr = `${fmt(rh)} % RH`;
    pumpExplain.textContent = z === "on" ? `${rr} is below ${C.pump.onBelowRH} %, so the water motor is ON.`
      : z === "off" ? `${rr} is at or above ${C.pump.offAtOrAboveRH} %, so the water motor is OFF.`
        : `${rr} is between ${C.pump.onBelowRH} and ${C.pump.offAtOrAboveRH} %, so the water motor keeps its previous state: ${pump ? "ON" : "OFF"}.`;
    if (readout) readout.textContent = `Reading ${fmt(t)}${deg} · ${fmt(rh)} % RH → Fan 1 ${fan1 ? "ON" : "OFF"} · Fan 2 ${fan2 ? "ON" : "OFF"} · Water motor ${pump ? "ON" : "OFF"}`;
    // circuit
    const on = { fan1, fan2, pump };
    qa("[data-out]").forEach((n) => n.classList.toggle("is-on", !!on[n.dataset.out]));
    qa(".cl-load").forEach((g) => { g.querySelector(".cl-state").textContent = on[g.dataset.out] ? "ON" : "OFF"; });
    q("#cl-reading").textContent = `${fmt(t)}${deg} · ${fmt(rh)} %`;
    kick();
  }

  function setT(v) { applyReading(v, state.rh); render(); }
  function setRH(v) { applyReading(state.t, v); render(); }
  // Sliders apply every value they pass through, like a changing room reading. The number
  // boxes apply on Enter / leaving the box, so typing "25.5" never applies "2" or "25" first.
  tempSlider.addEventListener("input", () => { tempNumber.value = tempSlider.value; setT(parseFloat(tempSlider.value)); });
  rhSlider.addEventListener("input", () => { rhNumber.value = rhSlider.value; setRH(parseFloat(rhSlider.value)); });
  function bindNumber(num, slider, min, max, set) {
    num.addEventListener("change", () => {
      const v = parseFloat(num.value);
      if (Number.isNaN(v)) { num.value = String(slider === tempSlider ? state.t : state.rh); return; }
      const c = Math.min(max, Math.max(min, v));
      num.value = String(c); slider.value = String(c);
      set(c);
    });
  }
  bindNumber(tempNumber, tempSlider, 15, 45, setT);
  bindNumber(rhNumber, rhSlider, 30, 90, setRH);
  $("sim-reset")?.addEventListener("click", () => {
    resetLogic();
    tempSlider.value = tempNumber.value = "25";
    rhSlider.value = rhNumber.value = "50";
    applyReading(25, 50);
    render();
  });

  // ------------------------------------------------------------------ animation
  const PERIOD = 2000; // the sketch reads the DHT11 every 2 s
  const paths = { data: q("#cl-path-data") };
  CHANNELS.forEach((ch) => { paths[ch.out] = q(`#cl-path-${ch.out}`); });
  const lens = Object.fromEntries(Object.entries(paths).map(([k, p]) => [k, p.getTotalLength()]));
  const pulses = { data: q("#cl-pulse-data") };
  CHANNELS.forEach((ch) => { pulses[ch.out] = q(`#cl-pulse-${ch.out}`); });
  const can = q("#cl-can"), flow = q("#cl-flow");
  const blades = { fan1: q("#cl-blades-fan1"), fan2: q("#cl-blades-fan2") };
  const angle = { fan1: 0, fan2: 0 };
  const centres = { fan1: 90, fan2: 250 };
  let visible = false, raf = 0, last = 0, clock = 0;

  function place(c, key, frac) {
    if (frac < 0 || frac > 1) { c.setAttribute("cx", -20); c.setAttribute("cy", -20); return; }
    const pt = paths[key].getPointAtLength(frac * lens[key]);
    c.setAttribute("cx", pt.x.toFixed(1)); c.setAttribute("cy", pt.y.toFixed(1));
  }
  function frame(ms, dt) {
    const tc = ms % PERIOD;
    place(pulses.data, "data", tc < 700 ? tc / 700 : -1);
    can.classList.toggle("is-busy", tc >= 650 && tc < 1050);
    CHANNELS.forEach((ch) => place(pulses[ch.out], ch.out, state[ch.out] && tc >= 1000 && tc < 1600 ? (tc - 1000) / 600 : -1));
    ["fan1", "fan2"].forEach((k) => {
      if (state[k]) angle[k] = (angle[k] + dt * 420) % 360;
      blades[k].setAttribute("transform", `rotate(${angle[k].toFixed(1)} ${centres[k]} 560)`);
    });
    flow.style.strokeDashoffset = state.pump ? String(-(ms / 40) % 24) : "0";
  }
  function loop(now) {
    raf = 0;
    if (!visible || reduce || document.hidden) return;
    const dt = last ? Math.min(0.25, (now - last) / 1000) : 0;
    last = now; clock += dt * 1000;
    frame(clock, dt);
    raf = requestAnimationFrame(loop);
  }
  function still() { // reduced motion: no pulses or spinning; states shown by colour and labels
    Object.values(pulses).forEach((c) => { c.setAttribute("cx", -20); c.setAttribute("cy", -20); });
    can.classList.remove("is-busy");
    flow.style.strokeDashoffset = "0";
  }
  function kick() {
    root.classList.toggle("is-reduced", reduce);
    if (reduce) { still(); return; }
    if (visible && !raf && !document.hidden) { last = 0; raf = requestAnimationFrame(loop); }
  }
  if ("IntersectionObserver" in window) new IntersectionObserver((es) => es.forEach((e) => { visible = e.isIntersecting; kick(); }), { threshold: 0.05 }).observe(host);
  else visible = true;
  document.addEventListener("visibilitychange", kick);
  motionQuery.addEventListener?.("change", (e) => { reduce = e.matches || params.has("reducedmotion"); kick(); });

  applyReading(state.t, state.rh);
  render();

  // Test hooks: the hysteresis logic and the current state.
  window.__claybreezeControl = { applyReading, reset: () => { resetLogic(); applyReading(25, 50); render(); }, state };
  if (params.has("debuganim")) window.__circuitLab = { frame: (ms) => frame(ms, 0.05), state };
})();
