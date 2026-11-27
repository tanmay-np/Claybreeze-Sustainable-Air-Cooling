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

  // WebP copies made by tools/make-web-images.py: media/web/<name>-<width>.webp at
  // 800 px and up to 1600 px (never upscaled). The original file stays as the fallback.
  function webSrcset(item) {
    const m = /^media\/(?:photos|cad-screenshots|fabrication-lab|Laser Cutting for project)\/(.+)\.(?:jpe?g|png)$/i.exec(item.src);
    if (!m || !item.width) return "";
    const base = `media/web/${m[1].replace(/ /g, "-")}`;
    return [...new Set([Math.min(800, item.width), Math.min(1600, item.width)])].map((w) => `${base}-${w}.webp ${w}w`).join(", ");
  }

  function imageFor(item, { lazy = true, sizes } = {}) {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt || item.title || "ClayBreeze project image";
    if (item.width) img.width = item.width;
    if (item.height) img.height = item.height;
    if (lazy) img.loading = "lazy";
    img.decoding = "async";
    const srcset = webSrcset(item);
    if (!srcset) return img;
    const picture = document.createElement("picture");
    const source = document.createElement("source");
    source.type = "image/webp";
    source.srcset = srcset;
    source.sizes = sizes || "100vw";
    picture.append(source, img);
    return picture;
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
  // The viewer steps only through the group it was opened from (one gallery's current filter,
  // or one grid of photos); a single image shows no arrows.
  const prevButton = $("#dialog-prev");
  const nextButton = $("#dialog-next");
  const posLabel = $("#dialog-pos");
  let viewerGroup = [];
  let viewerIndex = 0;
  function showInViewer(item) {
    dialogImage.src = item.src;
    dialogImage.alt = item.alt || item.title || "";
    $("#dialog-title").textContent = item.title || "";
    $("#dialog-kind").textContent = KIND_LABEL[item.kind] || "Image";
    $("#dialog-description").textContent = item.description || "";
    const many = viewerGroup.length > 1;
    if (prevButton) prevButton.hidden = !many;
    if (nextButton) nextButton.hidden = !many;
    if (posLabel) { posLabel.hidden = !many; posLabel.textContent = many ? `${viewerIndex + 1} / ${viewerGroup.length}` : ""; }
    setZoom(false);
  }
  function stepViewer(delta) {
    if (viewerGroup.length < 2) return;
    viewerIndex = (viewerIndex + delta + viewerGroup.length) % viewerGroup.length;
    showInViewer(viewerGroup[viewerIndex]);
  }
  function openViewer(item, group) {
    if (!dialog || !item) return;
    const list = typeof group === "function" ? group() : group;
    viewerGroup = Array.isArray(list) && list.includes(item) ? list.slice() : [item];
    viewerIndex = viewerGroup.indexOf(item);
    showInViewer(item);
    if (typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
  }
  prevButton?.addEventListener("click", () => stepViewer(-1));
  nextButton?.addEventListener("click", () => stepViewer(1));
  dialog?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); stepViewer(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); stepViewer(1); }
  });
  zoomButton?.addEventListener("click", () => setZoom(!dialogWrap.classList.contains("is-zoomed")));
  dialogImage?.addEventListener("click", () => setZoom(!dialogWrap.classList.contains("is-zoomed")));
  $("#dialog-close")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  $$("[data-gallery-src]").forEach((button) => button.addEventListener("click", () => openViewer(bySrc(button.dataset.gallerySrc))));

  // group: the array (or a function returning it) the viewer may step through from this image.
  function viewerButton(item, className, opts, group) {
    const button = el("button", className);
    button.type = "button";
    button.setAttribute("aria-label", `Open ${KIND_LABEL[item.kind] ? KIND_LABEL[item.kind].toLowerCase() : "image"}: ${item.title}`);
    button.append(imageFor(item, opts));
    button.addEventListener("click", () => openViewer(item, group));
    return button;
  }

  // Tables that stack into cards on narrow screens (no horizontal scrolling): each cell
  // carries its column heading so it can be shown above the value.
  $$("table.stack-sm").forEach((table) => {
    const heads = $$("thead th", table).map((th) => th.textContent.trim());
    $$("tbody tr", table).forEach((tr) => [...tr.children].forEach((cell, i) => { if (cell.tagName === "TD" && heads[i]) cell.dataset.label = heads[i]; }));
  });

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
        figure.append(viewerButton(main, "step-photo", { sizes: main.width > main.height ? "(min-width: 1200px) 990px, 100vw" : "(min-width: 1200px) 580px, (min-width: 900px) 55vw, 100vw" }, items));
        const cap = el("figcaption", "step-caption");
        cap.append(el("span", "label-chip", KIND_LABEL[main.kind] || "Photo"), document.createTextNode(` ${main.description}`));
        figure.append(cap);
        li.append(figure);
        if (rest.length) {
          const strip = el("div", "step-more");
          rest.forEach((item) => {
            const wrap = el("div", "step-more-item");
            wrap.append(viewerButton(item, "step-thumb", { sizes: "(min-width: 900px) 220px, 50vw" }, items), el("span", "step-thumb-caption", item.title));
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
  const cadItems = galleryItems.filter((g) => g.category === "cad" && g.src !== "media/cad-screenshots/Drawing Sheet_With_Dimensions.png");
  cadItems.forEach((item) => {
    const fig = el("figure", "cad-item");
    fig.append(viewerButton(item, "cad-thumb", { sizes: "(min-width: 1180px) 380px, (min-width: 700px) 50vw, 100vw" }, cadItems));
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
    notesBody.append(el("h3", "", "Documented or confirmed"));
    const ul = el("ul");
    n.documented.forEach((d) => ul.append(el("li", "", d)));
    notesBody.append(ul);
    notesBody.append(el("h3", "", "Values used in the interactive model, and their source"));
    const table = el("table", "notes-table");
    table.innerHTML = "<thead><tr><th scope=\"col\">Item</th><th scope=\"col\">Value used</th><th scope=\"col\">Source</th></tr></thead>";
    const tbody = el("tbody");
    n.approximate.forEach((row) => { const tr = el("tr"); row.forEach((c) => tr.append(el("td", "", c))); tbody.append(tr); });
    table.append(tbody);
    notesBody.append(table);
    notesBody.append(el("p", "", "The electronics are not modelled: their placement is not documented."));
  }

  // Shared with assets/js/workbench.js (Makerspace Workbench), which reuses the image viewer.
  window.ClayBreezeUI = { viewerButton, bySrc, el, imageFor };

  // ---------------- Footer: team photo ----------------
  const teamPhoto = $("#team-photo");
  const teamItem = bySrc("media/photos/Team_With_Prototype.jpeg");
  if (teamPhoto && teamItem) {
    teamPhoto.append(viewerButton(teamItem, "team-thumb", { sizes: "300px" }));
    const cap = el("figcaption");
    cap.append(el("span", "label-chip", "Team"), document.createTextNode(` ${teamItem.description}`));
    teamPhoto.append(cap);
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

  // ---------------- Galleries: project (Sec 11) and Makerspace Workbench (end of Part II) ----------------
  // Each gallery has its own filters, and the viewer steps only through that gallery's current filter.
  const PROJECT_CATEGORIES = ["frame-fabrication", "rods-mounts", "painting", "clay-pots", "cad", "electronics", "water-system", "enclosure", "testing", "team"];
  const WORKBENCH_FILTERS = { "3d-printing": ["3d-printing"], "laser-cutting": ["laser-cutting", "enclosure"], printers: ["printers"] };
  const WORKBENCH_ORDER = ["printers", "3d-printing", "laser-cutting", "enclosure"];
  const GALLERIES = {
    project: { items: galleryItems.filter((g) => PROJECT_CATEGORIES.includes(g.category)), match: (item, f) => item.category === f },
    workbench: {
      items: galleryItems.filter((g) => WORKBENCH_ORDER.includes(g.category))
        .sort((a, b) => WORKBENCH_ORDER.indexOf(a.category) - WORKBENCH_ORDER.indexOf(b.category)),
      match: (item, f) => (WORKBENCH_FILTERS[f] || [f]).includes(item.category)
    }
  };
  $$("[data-gallery]").forEach((box) => {
    const cfg = GALLERIES[box.dataset.gallery];
    if (!cfg) return;
    const grid = $(".gallery-grid", box), count = $(".gallery-count", box);
    const buttons = $$(".gallery-filter", box);
    let activeFilter = "all";
    const visibleItems = () => cfg.items.filter((item) => activeFilter === "all" || cfg.match(item, activeFilter));
    function render() {
      const visible = visibleItems();
      grid.replaceChildren();
      count.textContent = `${visible.length} ${visible.length === 1 ? "image" : "images"}`;
      visible.forEach((item) => {
        const card = el("figure", "gallery-card");
        card.append(viewerButton(item, "gallery-thumb", { sizes: "(min-width: 1200px) 290px, (min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw" }, visibleItems));
        const cap = el("figcaption");
        cap.append(el("span", "label-chip", KIND_LABEL[item.kind] || "Image"), el("strong", "gallery-title", item.title));
        card.append(cap);
        grid.append(card);
      });
    }
    buttons.forEach((button) => {
      const value = button.dataset.filter;
      const n = value === "all" ? cfg.items.length : cfg.items.filter((item) => cfg.match(item, value)).length;
      button.dataset.count = String(n);
      if (!n) { button.remove(); return; } // never show a filter with no images
      button.addEventListener("click", () => {
        if (button.disabled) return;
        activeFilter = value;
        buttons.forEach((b) => { b.classList.toggle("is-active", b === button); b.setAttribute("aria-pressed", String(b === button)); });
        render();
      });
    });
    render();
  });

  // ---------------- 10 Status ----------------
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

  // Dark (default) / light theme, remembered per browser.
  const themeButton = $("#theme-toggle");
  const themeMeta = $('meta[name="theme-color"]');
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }
  function applyTheme(theme, save) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "light" ? "#ffffff" : "#0d1117");
    if (themeButton) {
      const other = theme === "light" ? "dark" : "light";
      themeButton.setAttribute("aria-label", `Switch to ${other} theme`);
      $(".theme-toggle-text", themeButton).textContent = other === "light" ? "Light" : "Dark";
    }
    if (save) {
      try { localStorage.setItem("claybreeze-theme", theme); } catch { /* storage unavailable */ }
    }
    window.dispatchEvent(new CustomEvent("claybreeze-theme", { detail: { theme } }));
  }
  applyTheme(currentTheme(), false);
  themeButton?.addEventListener("click", () => applyTheme(currentTheme() === "light" ? "dark" : "light", true));

  // Share: the native share sheet where available, otherwise copy the link.
  const toast = $("#toast");
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2600);
  }
  async function copyLink(url) {
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied");
    } catch {
      showToast(`Copy this link: ${url}`);
    }
  }
  $("#share-button")?.addEventListener("click", async () => {
    const url = (document.querySelector('link[rel="canonical"]') || {}).href || location.href;
    const data = { title: document.title, text: "ClayBreeze — a clay-pot evaporative cooling prototype", url };
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      try { await navigator.share(data); } catch (err) { if (err && err.name !== "AbortError") copyLink(url); }
    } else {
      copyLink(url);
    }
  });

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

  // The CAD screenshots behind the 3D views (data-src) are only downloaded when they can be
  // seen: without WebGL, or when printing.
  function loadFallbackImages() {
    $$("img.model-fallback[data-src]").forEach((img) => { img.src = img.dataset.src; img.removeAttribute("data-src"); });
  }
  if (document.documentElement.classList.contains("no-webgl")) loadFallbackImages();
  new MutationObserver(() => {
    if (document.documentElement.classList.contains("no-webgl")) loadFallbackImages();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("beforeprint", () => {
    loadFallbackImages();
    $$('img[loading="lazy"]').forEach((img) => { img.loading = "eager"; });
  });

  // If the 3D module never starts (old browser, blocked module), show the CAD fallback.
  window.addEventListener("load", () => {
    window.setTimeout(() => {
      const root = document.documentElement;
      if (!root.classList.contains("webgl-on")) root.classList.add("no-webgl");
    }, 6000);
  });

  // The Circuit & Control Lab lives in assets/js/circuit-lab.js.
})();
