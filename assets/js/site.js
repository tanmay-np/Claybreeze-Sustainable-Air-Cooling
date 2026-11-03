(() => {
  "use strict";

  const project = window.CLAYBREEZE_PROJECT || {};
  const galleryItems = Array.isArray(window.CLAYBREEZE_GALLERY) ? window.CLAYBREEZE_GALLERY : [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const bySrc = (src) => galleryItems.find((g) => g.src === src);
  const KIND_LABEL = { photo: "Photo", "cad-drawing": "CAD drawing", "cad-render": "CAD render" };

  function el(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function imageFor(item, { lazy = true, sizes } = {}) {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt || item.title || "ClayBreeze project image";
    if (item.width) img.width = item.width;
    if (item.height) img.height = item.height;
    if (lazy) img.loading = "lazy";
    img.decoding = "async";
    if (sizes) img.sizes = sizes;
    return img;
  }

  // ---------------- Image viewer (shared) ----------------
  const dialog = $("#photo-dialog");
  const dialogImage = $("#dialog-image");
  const dialogWrap = $("#dialog-image-wrap");
  const zoomButton = $("#dialog-zoom");
  function setZoom(on) {
    dialogWrap.classList.toggle("is-zoomed", on);
    zoomButton.setAttribute("aria-pressed", String(on));
    zoomButton.textContent = on ? "Fit" : "Zoom";
  }
  function openViewer(item) {
    if (!dialog || !item) return;
    dialogImage.src = item.src;
    dialogImage.alt = item.alt || item.title || "";
    $("#dialog-title").textContent = item.title || "";
    $("#dialog-kind").textContent = KIND_LABEL[item.kind] || "Image";
    $("#dialog-description").textContent = item.description || "";
    setZoom(false);
    if (typeof dialog.showModal === "function") dialog.showModal();
  }
  zoomButton?.addEventListener("click", () => setZoom(!dialogWrap.classList.contains("is-zoomed")));
  dialogImage?.addEventListener("click", () => setZoom(!dialogWrap.classList.contains("is-zoomed")));
  $("#dialog-close")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  $$("[data-gallery-src]").forEach((button) => button.addEventListener("click", () => openViewer(bySrc(button.dataset.gallerySrc))));

  function viewerButton(item, className, opts) {
    const button = el("button", className);
    button.type = "button";
    button.setAttribute("aria-label", `Open ${KIND_LABEL[item.kind] ? KIND_LABEL[item.kind].toLowerCase() : "image"}: ${item.title}`);
    button.append(imageFor(item, opts));
    button.addEventListener("click", () => openViewer(item));
    return button;
  }

  // ---------------- 04 Engineering journey ----------------
  const stepsList = $("#journey-steps");
  if (stepsList && Array.isArray(project.journeySteps)) {
    project.journeySteps.forEach((step) => {
      const li = el("li", "journey-step");
      li.dataset.stage = String(step.buildStage);
      li.dataset.insetCaption = `Step ${step.number} · ${step.title}${step.insetNote ? ` (${step.insetNote})` : ""}`;
      const head = el("div", "step-head");
      head.append(el("span", "step-number", step.number), el("h3", "step-title", step.title));
      li.append(head);
      const items = step.photos.map(bySrc).filter(Boolean);
      if (items.length) {
        const [main, ...rest] = items;
        if (main.width > main.height) li.classList.add("step-landscape");
        const figure = el("figure", "step-figure");
        figure.append(viewerButton(main, "step-photo"));
        const cap = el("figcaption", "step-caption");
        cap.append(el("span", "label-chip", KIND_LABEL[main.kind] || "Photo"), document.createTextNode(` ${main.description}`));
        figure.append(cap);
        li.append(figure);
        if (rest.length) {
          const strip = el("div", "step-more");
          rest.forEach((item) => {
            const wrap = el("div", "step-more-item");
            wrap.append(viewerButton(item, "step-thumb"), el("span", "step-thumb-caption", item.title));
            strip.append(wrap);
          });
          li.append(strip);
        }
      } else {
        li.append(el("p", "step-nophoto", "No photograph of this step has been added yet."));
      }
      li.append(el("p", "step-text", step.text));
      stepsList.append(li);
    });
  }

  // ---------------- 05 Design: spec table + CAD grid ----------------
  const specRows = $("#spec-rows");
  (project.specifications || []).forEach((spec) => {
    const tr = document.createElement("tr");
    const th = el("th", "", spec.label);
    th.scope = "row";
    const td = document.createElement("td");
    td.append(el("strong", "", spec.value), el("span", "spec-note", spec.note));
    tr.append(th, td);
    specRows?.append(tr);
  });
  const cadGrid = $("#cad-grid");
  galleryItems.filter((g) => g.category === "cad" && g.src !== "media/cad-screenshots/Drawing Sheet_With_Dimensions.png").forEach((item) => {
    const fig = el("figure", "cad-item");
    fig.append(viewerButton(item, "cad-thumb"));
    const cap = el("figcaption", "");
    cap.append(el("span", "label-chip", KIND_LABEL[item.kind]), document.createTextNode(` ${item.title}`));
    fig.append(cap);
    cadGrid?.append(fig);
  });

  // ---------------- 06 Model notes ----------------
  const notesBody = $("#model-notes-body");
  if (notesBody && project.modelNotes) {
    const n = project.modelNotes;
    notesBody.append(el("p", "", n.summary));
    notesBody.append(el("h4", "", "Documented or confirmed"));
    const ul = el("ul");
    n.documented.forEach((d) => ul.append(el("li", "", d)));
    notesBody.append(ul);
    notesBody.append(el("h4", "", "Values used in the interactive model, and their source"));
    const table = el("table", "notes-table");
    table.innerHTML = "<thead><tr><th scope=\"col\">Item</th><th scope=\"col\">Value used</th><th scope=\"col\">Source</th></tr></thead>";
    const tbody = el("tbody");
    n.approximate.forEach((row) => { const tr = el("tr"); row.forEach((c) => tr.append(el("td", "", c))); tbody.append(tr); });
    table.append(tbody);
    notesBody.append(table);
    notesBody.append(el("p", "", "The electronics are not modelled: their placement is not documented."));
  }

  // ---------------- 07 Components ----------------
  const componentList = $("#component-list");
  (project.components || []).forEach((comp, index) => {
    const details = el("details", "component");
    if (index === 0) details.open = true;
    const summary = el("summary");
    summary.append(el("span", "component-name", comp.name), el("span", `status-chip status-${(comp.tone || comp.status).toLowerCase()}`, comp.status), el("span", "component-icon"));
    details.append(summary, el("p", "", comp.role));
    componentList?.append(details);
  });

  // ---------------- 10 Gallery ----------------
  const galleryGrid = $("#gallery-grid");
  const galleryCount = $("#gallery-count");
  const emptyNote = $("#gallery-empty-note");
  let activeFilter = "all";
  function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.replaceChildren();
    const visible = galleryItems.filter((item) => activeFilter === "all" || item.category === activeFilter);
    galleryCount.textContent = `${visible.length} ${visible.length === 1 ? "image" : "images"}`;
    visible.forEach((item) => {
      const card = el("figure", "gallery-card");
      card.append(viewerButton(item, "gallery-thumb"));
      const cap = el("figcaption");
      cap.append(el("span", "label-chip", KIND_LABEL[item.kind] || "Image"), el("strong", "gallery-title", item.title));
      card.append(cap);
      galleryGrid.append(card);
    });
  }
  const emptyCategories = [];
  $$(".gallery-filter").forEach((button) => {
    const value = button.dataset.filter;
    if (value !== "all" && !galleryItems.some((item) => item.category === value)) {
      button.disabled = true;
      button.title = "No images in this category yet";
      emptyCategories.push(button.textContent);
    }
    button.addEventListener("click", () => {
      if (button.disabled) return;
      activeFilter = value;
      $$(".gallery-filter").forEach((b) => { b.classList.toggle("is-active", b === button); b.setAttribute("aria-pressed", String(b === button)); });
      renderGallery();
    });
  });
  if (emptyNote) emptyNote.textContent = emptyCategories.length ? `${emptyCategories.join(", ")}: no photographs added yet, so these filters are disabled.` : "";
  renderGallery();

  // ---------------- 11 Status ----------------
  const statusGroups = $("#status-groups");
  function statusList(items) {
    const ul = el("ul");
    items.forEach((item) => ul.append(el("li", "", item)));
    return ul;
  }
  (project.statusGroups || []).forEach((group) => {
    const box = el("article", `status-group tone-${group.tone}`);
    const head = el("div", "status-group-head");
    if (group.badge) head.append(el("span", `status-chip status-${group.badge.toLowerCase()}`, group.badge));
    head.append(el("h3", "", group.heading));
    box.append(head);
    if (Array.isArray(group.subgroups)) {
      group.subgroups.forEach((sub) => {
        box.append(el("h4", "status-subhead", sub.label), statusList(sub.items));
      });
    } else {
      box.append(statusList(group.items || []));
    }
    statusGroups?.append(box);
  });

  // ---------------- Navigation, progress, presentation ----------------
  const menuToggle = $("#menu-toggle");
  const nav = $("#main-nav");
  function setMenu(open) {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("is-open", open);
  }
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
    $$("a", nav).forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); menuToggle.focus(); } });
  }

  const progressBar = $("#scroll-progress-bar");
  function updateScrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  }
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  const presentationButton = $("#presentation-toggle");
  let presentationMode = false;
  function setPresentationMode(enabled) {
    presentationMode = enabled;
    document.body.classList.toggle("presentation-mode", enabled);
    presentationButton.textContent = enabled ? "Exit presentation" : "Presentation mode";
    presentationButton.setAttribute("aria-pressed", String(enabled));
  }
  presentationButton?.addEventListener("click", () => setPresentationMode(!presentationMode));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && presentationMode && !(dialog && dialog.open)) setPresentationMode(false);
  });

  // If the 3D module never starts (old browser, blocked module), show the CAD fallback.
  window.addEventListener("load", () => {
    window.setTimeout(() => {
      const root = document.documentElement;
      if (!root.classList.contains("webgl-on")) root.classList.add("no-webgl");
    }, 6000);
  });

  // ---------------- Control Logic Lab ----------------
  // A SOFTWARE SIMULATION of the logic running on the ESP32 (thresholds from
  // window.CLAYBREEZE_CONTROL). It has no connection to the real ESP32, DHT11
  // or relay hardware.
  const CONTROL = window.CLAYBREEZE_CONTROL || { oneFanAboveC: 28, bothFansAboveC: 35, pumpOnBelowRH: 60 };
  const tempSlider = $("#sim-temp-slider");
  const tempNumber = $("#sim-temp-number");
  const rhSlider = $("#sim-rh-slider");
  const rhNumber = $("#sim-rh-number");
  const fanOutputs = $("#sim-fan-outputs");
  const pumpOutputs = $("#sim-pump-outputs");
  const fanTable = $("#sim-fan-table");
  const pumpTable = $("#sim-pump-table");
  const fanExplain = $("#sim-fan-explain");
  const pumpExplain = $("#sim-pump-explain");
  const simRuleNote = $("#sim-rule-note");
  const simReset = $("#sim-reset");

  if (tempSlider && fanOutputs && pumpOutputs) {
    const LOW = CONTROL.oneFanAboveC;
    const HIGH = CONTROL.bothFansAboveC;
    const RH = CONTROL.pumpOnBelowRH;
    const state = { t: 25, rh: 50 };

    // Exactly the implemented comparisons: <= LOW off, > LOW one fan, > HIGH both; RH < RH_ON pump on.
    function evaluateFans(t) {
      if (t > HIGH) return { stage: 2, fan1: true, fan2: true };
      if (t > LOW) return { stage: 1, fan1: true, fan2: false };
      return { stage: 0, fan1: false, fan2: false };
    }
    function evaluatePump(rh) {
      return rh < RH;
    }
    window.__claybreezeControl = { evaluateFans, evaluatePump };

    function chip(label, isOn) {
      const c = el("div", `sim-chip ${isOn ? "is-on" : "is-off"}`);
      c.append(el("span", "sim-chip-label", label), el("span", "sim-chip-value", isOn ? "ON" : "OFF"));
      return c;
    }
    function buildTable(table, head, rows) {
      const thead = el("thead");
      const tr = el("tr");
      head.forEach((h) => { const th = el("th", "", h); th.scope = "col"; tr.append(th); });
      thead.append(tr);
      const tbody = el("tbody");
      rows.forEach((r) => { const row = el("tr"); r.forEach((c) => row.append(el("td", "", c))); tbody.append(row); });
      table.append(thead, tbody);
      return [...tbody.rows];
    }
    const fanRows = buildTable(fanTable, ["Temperature", "Fans"], [[`≤ ${LOW}\u00a0°C`, "Both OFF"], [`> ${LOW}\u00a0°C and ≤ ${HIGH}\u00a0°C`, "One fan ON"], [`> ${HIGH}\u00a0°C`, "Both ON"]]);
    const pumpRows = buildTable(pumpTable, ["Relative humidity", "Pump"], [[`< ${RH}\u00a0%`, "ON"], [`≥ ${RH}\u00a0%`, "OFF"]]);
    if (simRuleNote) simRuleNote.textContent = CONTROL.note || "";

    function render() {
      const { t, rh } = state;
      const fans = evaluateFans(t);
      fanOutputs.replaceChildren(chip("Fan stage 1", fans.fan1), chip("Fan stage 2", fans.fan2));
      fanRows.forEach((row, i) => row.classList.toggle("is-active", i === fans.stage));
      const tt = `${t.toFixed(1)}\u00a0°C`;
      if (fans.stage === 0) fanExplain.textContent = `${tt} is at or below ${LOW}\u00a0°C, so both fans are OFF.`;
      else if (fans.stage === 1) fanExplain.textContent = `${tt} is above ${LOW}\u00a0°C and at or below ${HIGH}\u00a0°C, so one fan is ON.`;
      else fanExplain.textContent = `${tt} is above ${HIGH}\u00a0°C, so both fans are ON.`;

      const pumpOn = evaluatePump(rh);
      pumpOutputs.replaceChildren(chip("Water pump", pumpOn));
      pumpRows.forEach((row, i) => row.classList.toggle("is-active", i === (pumpOn ? 0 : 1)));
      const rr = `${rh.toFixed(1)}\u00a0% RH`;
      pumpExplain.textContent = pumpOn ? `${rr} is below ${RH}\u00a0%, so the pump is ON.` : `${rr} is at or above ${RH}\u00a0%, so the pump is OFF.`;
    }

    function bind(slider, number, key, min, max) {
      slider.addEventListener("input", () => { state[key] = parseFloat(slider.value); number.value = slider.value; render(); });
      number.addEventListener("input", () => {
        const v = parseFloat(number.value);
        if (Number.isNaN(v)) return;
        state[key] = Math.min(max, Math.max(min, v));
        slider.value = String(state[key]);
        render();
      });
      number.addEventListener("change", () => { number.value = String(state[key]); });
    }
    bind(tempSlider, tempNumber, "t", 15, 45);
    bind(rhSlider, rhNumber, "rh", 30, 90);
    if (simReset) simReset.addEventListener("click", () => {
      state.t = 25; state.rh = 50;
      tempSlider.value = "25"; tempNumber.value = "25";
      rhSlider.value = "50"; rhNumber.value = "50";
      render();
    });

    render();
  }
})();
