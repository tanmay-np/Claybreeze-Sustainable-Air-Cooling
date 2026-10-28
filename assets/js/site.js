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
  (project.statusGroups || []).forEach((group) => {
    const box = el("article", `status-group tone-${group.tone}`);
    box.append(el("h3", "", group.heading));
    const ul = el("ul");
    group.items.forEach((item) => ul.append(el("li", "", item)));
    box.append(ul);
    statusGroups?.append(box);
  });
  const nextSteps = $("#next-steps");
  (project.nextSteps || []).forEach((s) => nextSteps?.append(el("li", "", s)));

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

  // ---------------- Control Logic Lab (unchanged behaviour) ----------------
  // A SOFTWARE SIMULATION of the thresholds in docs/electronics-and-control.md.
  // It has no connection to the real ESP32, DHT11 or relay hardware.
  const CONTROL = window.CLAYBREEZE_CONTROL || {};
  const simTabs = $$(".sim-mode");
  const tempRow = $("#sim-temp-row");
  const rhRow = $("#sim-rh-row");
  const tempSlider = $("#sim-temp-slider");
  const tempNumber = $("#sim-temp-number");
  const rhSlider = $("#sim-rh-slider");
  const rhNumber = $("#sim-rh-number");
  const simOutputs = $("#sim-outputs");
  const simExplain = $("#sim-explain");
  const simStatusBadge = $("#sim-status-badge");
  const simRuleNote = $("#sim-rule-note");
  const simReset = $("#sim-reset");
  const simPanel = $(".sim-panel");

  if (simTabs.length && simOutputs) {
    let mode = "currentFan";
    let pumpPrevOn = false; // hysteresis memory for the proposed pump logic

    function badgeClass(status) {
      if (/IMPLEMENTED/i.test(status)) return "badge-implemented";
      if (/PLANNED/i.test(status)) return "badge-planned";
      return "badge-proposed";
    }

    function chip(label, isOn) {
      const c = el("div", `sim-chip ${isOn ? "is-on" : "is-off"}`);
      c.append(el("span", "sim-chip-label", label), el("span", "sim-chip-value", isOn ? "ON" : "OFF"));
      return c;
    }

    function evaluateCurrentFan(tempC) {
      const cfg = CONTROL.currentFan || { thresholdC: 35 };
      const on = tempC > cfg.thresholdC;
      return { fan1: on, fan2: on };
    }
    function evaluatePlannedFan(tempC) {
      const cfg = CONTROL.plannedFan || { lowC: 28, highC: 35 };
      if (tempC <= cfg.lowC) return { fan1: false, fan2: false };
      if (tempC <= cfg.highC) return { fan1: true, fan2: false };
      return { fan1: true, fan2: true };
    }
    function evaluatePump(rh) {
      const cfg = CONTROL.proposedPump || { onAtOrBelow: 60, offAtOrAbove: 70 };
      if (rh <= cfg.onAtOrBelow) pumpPrevOn = true;
      else if (rh >= cfg.offAtOrAbove) pumpPrevOn = false;
      return pumpPrevOn;
    }

    function render() {
      simOutputs.replaceChildren();
      const cfg = CONTROL[mode] || {};
      simStatusBadge.textContent = (cfg.status || "").split(" — ")[0] || "";
      simStatusBadge.className = `sim-status-badge ${badgeClass(cfg.status || "")}`;
      simRuleNote.textContent = cfg.note || "";

      if (mode === "currentFan") {
        tempRow.hidden = false; rhRow.hidden = true;
        const t = parseFloat(tempSlider.value);
        const { fan1, fan2 } = evaluateCurrentFan(t);
        simOutputs.append(chip("Fan 1", fan1), chip("Fan 2", fan2));
        const cmp = t > cfg.thresholdC ? "above" : (t < cfg.thresholdC ? "below" : "exactly at");
        simExplain.textContent = `${t.toFixed(1)}°C is ${cmp} the ${cfg.thresholdC}°C threshold, so both fans are ${fan1 ? "ON" : "OFF"}.`;
      } else if (mode === "plannedFan") {
        tempRow.hidden = false; rhRow.hidden = true;
        const t = parseFloat(tempSlider.value);
        const { fan1, fan2 } = evaluatePlannedFan(t);
        simOutputs.append(chip("Fan 1", fan1), chip("Fan 2", fan2));
        let reason;
        if (t <= cfg.lowC) reason = `${t.toFixed(1)}°C is at or below ${cfg.lowC}°C, so both fans are OFF.`;
        else if (t <= cfg.highC) reason = `${t.toFixed(1)}°C is above ${cfg.lowC}°C and at or below ${cfg.highC}°C, so Fan 1 is ON and Fan 2 is OFF.`;
        else reason = `${t.toFixed(1)}°C is above ${cfg.highC}°C, so both fans are ON.`;
        simExplain.textContent = reason;
      } else if (mode === "proposedPump") {
        tempRow.hidden = true; rhRow.hidden = false;
        const rh = parseFloat(rhSlider.value);
        const on = evaluatePump(rh);
        simOutputs.append(chip("Water pump", on));
        let reason;
        if (rh <= cfg.onAtOrBelow) reason = `${rh.toFixed(0)}% RH is at or below ${cfg.onAtOrBelow}%, so the pump is ON.`;
        else if (rh >= cfg.offAtOrAbove) reason = `${rh.toFixed(0)}% RH is at or above ${cfg.offAtOrAbove}%, so the pump is OFF.`;
        else reason = `${rh.toFixed(0)}% RH is between ${cfg.onAtOrBelow}% and ${cfg.offAtOrAbove}%, so the pump keeps its previous state (${on ? "ON" : "OFF"}) — this is the hysteresis band.`;
        simExplain.textContent = reason;
      }
    }

    simTabs.forEach((tab) => tab.addEventListener("click", () => {
      mode = tab.dataset.mode;
      simTabs.forEach((t) => {
        const selected = t === tab;
        t.classList.toggle("is-active", selected);
        t.setAttribute("aria-selected", String(selected));
      });
      if (simPanel) simPanel.setAttribute("aria-labelledby", tab.id);
      render();
    }));

    if (tempSlider && tempNumber) {
      tempSlider.addEventListener("input", () => { tempNumber.value = tempSlider.value; render(); });
      tempNumber.addEventListener("input", () => {
        const clamped = Math.min(45, Math.max(15, parseFloat(tempNumber.value) || 0));
        tempSlider.value = String(clamped);
        render();
      });
    }
    if (rhSlider && rhNumber) {
      rhSlider.addEventListener("input", () => { rhNumber.value = rhSlider.value; render(); });
      rhNumber.addEventListener("input", () => {
        const clamped = Math.min(90, Math.max(30, parseFloat(rhNumber.value) || 0));
        rhSlider.value = String(clamped);
        render();
      });
    }
    if (simReset) simReset.addEventListener("click", () => {
      tempSlider.value = "25"; tempNumber.value = "25";
      rhSlider.value = "50"; rhNumber.value = "50";
      pumpPrevOn = false;
      render();
    });

    render();
  }
})();
