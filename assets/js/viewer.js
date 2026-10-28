/*
 * ClayBreeze 3D views: hero background, journey build-up inset, and the
 * interactive Assembly Explorer.
 *
 * Contexts: at most two WebGL renderers — one for the hero, one "roaming"
 * renderer whose canvas moves between the journey inset and the explorer
 * (never on screen together). Views render only while visible and the tab
 * is shown. ?nowebgl or a missing WebGL context shows the real CAD screenshot.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { buildAssembly, BOUNDS, DIM, APPROX, ROD_Z, rodYs } from "./model.js";

const root = document.documentElement;
const params = new URLSearchParams(location.search);
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
// ?reducedmotion forces the reduced-motion behaviour (useful for testing and projectors).
let reduceMotion = motionQuery.matches || params.has("reducedmotion");
const project = window.CLAYBREEZE_PROJECT || {};
const PIXEL_RATIO = Math.min(window.devicePixelRatio || 1, 1.75);

function webglAvailable() {
  if (params.has("nowebgl")) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}


// ---------------------------------------------------------------------------
function makeRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(PIXEL_RATIO);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("role", "img");
  return renderer;
}

function makeScene() {
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfffaf2, 0xb8ad9a, 1.15));
  const key = new THREE.DirectionalLight(0xfff4e6, 2.1);
  key.position.set(1.1, 1.9, 1.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -0.7; key.shadow.camera.right = 0.7;
  key.shadow.camera.top = 0.7; key.shadow.camera.bottom = -0.7;
  key.shadow.camera.near = 0.5; key.shadow.camera.far = 5;
  key.shadow.bias = -0.0005;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe8eef2, 0.55);
  fill.position.set(-1.6, 0.7, -0.4);
  scene.add(fill);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.ShadowMaterial({ opacity: 0.12 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -DIM.height / 2 * 0.001 - 0.001;
  ground.receiveShadow = true;
  ground.userData.ground = true;
  scene.add(ground);
  return scene;
}

// ---------------------------------------------------------------------------
// SolidWorks GLB export (project.modelGLB): frame incl. rear extension, six rods
// and 30 pots — no fans. It is loaded once, given restrained materials matching
// the photographs (the export has a single glossy grey), and aligned to the
// procedural origin (centre of the 150 mm main frame). Its nodes do not map
// cleanly to the explorer's part groups (frame and fan mount are one mesh, no
// fans), so explode, layers and part-click stay on the procedural model.
// On any load error the procedural model is used everywhere.
const cadInfo = { requested: Boolean(project.modelGLB), loaded: false, loadMs: null, triangles: 0, meshes: 0, error: null };
window.__claybreezeGLB = cadInfo;
let cadPromise = null;
function loadCad() {
  if (!project.modelGLB) return Promise.resolve(null);
  if (cadPromise) return cadPromise;
  const t0 = performance.now();
  cadPromise = new GLTFLoader().loadAsync(project.modelGLB).then((gltf) => {
    const src = gltf.scene;
    const cameras = [];
    src.traverse((o) => { if (o.isCamera) cameras.push(o); });
    cameras.forEach((c) => c.parent.remove(c));
    src.updateMatrixWorld(true);
    const frameNode = src.getObjectByName("20mm_frame-1");
    if (!frameNode) throw new Error("GLB has no 20mm_frame-1 node");
    const origin = new THREE.Vector3();
    frameNode.getWorldPosition(origin);
    src.position.sub(origin);
    const wrap = new THREE.Group();
    wrap.name = "SolidWorks export";
    wrap.add(src);
    const terracotta = new THREE.Color(APPROX.terracotta);
    const mats = {
      frame: new THREE.MeshStandardMaterial({ color: APPROX.paint, roughness: 0.62, metalness: 0.18 }),
      rods: new THREE.MeshStandardMaterial({ color: 0x3d3f42, roughness: 0.55, metalness: 0.45 }),
      pots: [0, 1, 2, 3].map((i) => new THREE.MeshStandardMaterial({ color: terracotta.clone().offsetHSL((i - 1.5) * 0.006, 0, (i - 1.5) * 0.018), roughness: 0.96, metalness: 0, side: THREE.DoubleSide }))
    };
    let potIndex = 0;
    wrap.traverse((o) => {
      if (!o.isMesh) return;
      let name = "";
      for (let p = o; p; p = p.parent) if (/^(20mm_frame|20mm_rod|kullad_part)/.test(p.name)) { name = p.name; break; }
      const part = name.startsWith("20mm_rod") ? "rods" : name.startsWith("kullad_part") ? "pots" : "frame";
      o.userData.cadPart = part;
      o.material = part === "pots" ? mats.pots[(potIndex += 1) % 4] : mats[part];
      o.castShadow = true;
      o.receiveShadow = true;
      const g = o.geometry;
      cadInfo.triangles += (g.index ? g.index.count : g.attributes.position.count) / 3;
      cadInfo.meshes += 1;
    });
    cadInfo.loaded = true;
    cadInfo.loadMs = Math.round(performance.now() - t0);
    root.classList.add("model-glb");
    return wrap;
  }).catch((err) => {
    cadInfo.error = String(err && err.message ? err.message : err);
    return null;
  });
  return cadPromise;
}

// Per-view copy of the CAD model with its own materials (so each view can fade it).
function attachCad(view, template) {
  const group = template.clone(true);
  const matMap = new Map();
  group.traverse((o) => {
    if (!o.isMesh) return;
    if (!matMap.has(o.material)) matMap.set(o.material, o.material.clone());
    o.material = matMap.get(o.material);
  });
  group.visible = false;
  view.spin.children[0].add(group);
  const procMats = new Set();
  for (const name of ["frame", "fanMount", "rods", "pots"]) {
    view.assembly.groups[name].traverse((o) => { if (o.isMesh) procMats.add(o.material); });
  }
  return { group, cadMats: [...matMap.values()], procMats: [...procMats], mode: "interactive", f: 0, target: 0 };
}

// Crossfade between the procedural frame/rods/pots and the CAD export.
// Fans (not in the export) and the water schematic always come from the procedural model.
function setModelMode(view, cad, mode, instant) {
  cad.mode = mode;
  cad.target = mode === "cad" ? 1 : 0;
  cad.group.visible = true;
  for (const name of ["frame", "fanMount", "rods", "pots"]) view.assembly.groups[name].visible = true;
  if (instant) cad.f = cad.target;
  applyFade(view, cad);
}
function applyFade(view, cad) {
  const f = cad.f;
  const fading = f > 0.001 && f < 0.999;
  for (const m of cad.cadMats) { m.transparent = fading; m.opacity = f; m.depthWrite = !fading || f > 0.5; }
  for (const m of cad.procMats) { m.transparent = fading || m.userData.baseTransparent; m.opacity = 1 - f; m.depthWrite = !fading || f < 0.5; }
  if (fading) {
    cad.group.visible = true;
    for (const name of ["frame", "fanMount", "rods", "pots"]) view.assembly.groups[name].visible = view.layerOn?.(name) !== false;
  } else {
    cad.group.visible = f >= 0.5;
    for (const name of ["frame", "fanMount", "rods", "pots"]) view.assembly.groups[name].visible = f < 0.5 && view.layerOn?.(name) !== false;
    for (const m of cad.procMats) { m.opacity = 1; m.transparent = Boolean(m.userData.baseTransparent); m.depthWrite = true; }
    for (const m of cad.cadMats) { m.opacity = 1; m.transparent = false; m.depthWrite = true; }
  }
  [...cad.cadMats, ...cad.procMats].forEach((m) => { m.needsUpdate = true; });
  view.dirty = true;
}
function stepFade(view, cad, dt) {
  if (!cad || Math.abs(cad.f - cad.target) < 0.001) return false;
  const step = dt / 1.2; // 1.2 s crossfade
  cad.f = cad.f < cad.target ? Math.min(cad.target, cad.f + step) : Math.max(cad.target, cad.f - step);
  applyFade(view, cad);
  return true;
}

// ---------------------------------------------------------------------------
function init() {
  root.classList.add("webgl-on");
  const views = [];
  let rafId = null;
  let last = performance.now();
  let heroRenderer = null;
  let roamRenderer = null;
  let roamOwner = null;

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    for (const v of views) {
      if (!v.visible) continue;
      if (v.roaming && roamOwner !== v && !(roamOwner && roamOwner.visible)) claimRoaming(v);
      v.tick(dt);
    }
  }
  function start() { if (!rafId && !document.hidden) { last = performance.now(); rafId = requestAnimationFrame(frame); } }
  function stop() { if (rafId) cancelAnimationFrame(rafId); rafId = null; }
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  motionQuery.addEventListener?.("change", (e) => { reduceMotion = e.matches || params.has("reducedmotion"); views.forEach((v) => v.onMotionChange?.()); });

  function claimRoaming(view) {
    if (!roamRenderer) roamRenderer = makeRenderer();
    if (roamOwner !== view) {
      roamOwner = view;
      view.canvasSlot.append(roamRenderer.domElement);
      roamRenderer.domElement.setAttribute("aria-label", view.label);
    }
    view.renderer = roamRenderer;
    view.resize();
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const v = views.find((x) => x.host === entry.target);
      if (!v) continue;
      v.visible = entry.isIntersecting && entry.target.offsetParent !== null;
      if (v.visible && v.roaming) claimRoaming(v);
      if (v.visible) v.dirty = true;
    }
    if (views.some((v) => v.visible)) start(); else stop();
  }, { rootMargin: "120px 0px" });

  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) { const v = views.find((x) => x.host === entry.target); if (v) v.resize(); }
  });

  // ---- shared view base --------------------------------------------------
  function createView({ host, canvasSlot, label, roaming, cameraPos, fov = 30 }) {
    const scene = makeScene();
    scene.children.find((o) => o.userData.ground).position.y = -DIM.height / 2 * 0.001 - BOUNDS.center.y - 0.001;
    const assembly = buildAssembly();
    const pivot = new THREE.Group();
    pivot.add(assembly.root);
    pivot.position.copy(BOUNDS.center).multiplyScalar(-1);
    const spin = new THREE.Group();
    spin.add(pivot);
    scene.add(spin);
    const camera = new THREE.PerspectiveCamera(fov, 1, 0.05, 20);
    camera.position.copy(cameraPos);
    camera.lookAt(0, 0, 0);
    const view = {
      host, canvasSlot: canvasSlot || host, label, roaming, scene, camera, assembly, spin,
      renderer: null, visible: false, dirty: true, width: 1, height: 1,
      resize() {
        const r = this.canvasSlot.getBoundingClientRect();
        this.width = Math.max(1, Math.round(r.width));
        this.height = Math.max(1, Math.round(r.height));
        this.camera.aspect = this.width / this.height;
        this.applyOffset?.();
        this.camera.updateProjectionMatrix();
        if (this.renderer && (!this.roaming || roamOwner === this)) this.renderer.setSize(this.width, this.height, false);
        this.dirty = true;
      },
      draw() {
        if (!this.renderer || (this.roaming && roamOwner !== this)) return;
        this.renderer.render(this.scene, this.camera);
        root.classList.add("webgl-ready");
        this.dirty = false;
      }
    };
    views.push(view);
    io.observe(host);
    ro.observe(view.canvasSlot);
    return view;
  }

  // ---- HERO --------------------------------------------------------------
  function initHero() {
    const host = document.getElementById("hero-model");
    if (!host) return;
    heroRenderer = makeRenderer();
    heroRenderer.domElement.setAttribute("aria-label", "3D visualisation of the assembled ClayBreeze cooler, slowly rotating");
    host.append(heroRenderer.domElement);
    const view = createView({ host, label: "", roaming: false, cameraPos: new THREE.Vector3(0, 0.16, 1.75) });
    view.renderer = heroRenderer;
    view.spin.rotation.y = -0.55;
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
    view.applyOffset = function applyOffset() {
      const w = this.width, h = this.height;
      if (w >= 1000) {
        this.camera.setViewOffset(w, h, -w * 0.2, 0, w, h);
        this.camera.position.z = 1.75;
      } else {
        // Narrow screens: the copy sits on top; the model fills the space reserved
        // below it (about 46% of the viewport), sized to ~40% of the viewport height.
        const vh = window.innerHeight;
        const centreY = h - vh * 0.23 - 70;
        this.camera.setViewOffset(w, h, 0, -(centreY - h / 2), w, h);
        const tan = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
        this.camera.position.z = (0.66 * h / (0.4 * vh)) / (2 * tan);
      }
      this.camera.lookAt(0, 0, 0);
    };
    view.tick = function tick(dt) {
      stepFade(this, this.cad, dt);
      if (!reduceMotion) {
        this.spin.rotation.y += dt * 0.16;
        pointer.sx += (pointer.x - pointer.sx) * 0.05;
        pointer.sy += (pointer.y - pointer.sy) * 0.05;
        this.spin.rotation.x = pointer.sy * 0.12;
        this.camera.position.x = pointer.sx * 0.12;
        this.camera.lookAt(0, 0, 0);
        this.draw();
      } else if (this.dirty) {
        this.draw();
      }
    };
    view.onMotionChange = function () { this.dirty = true; };
    view.resize();
    // Procedural model first; crossfade to the SolidWorks export once it has loaded.
    loadCad().then((template) => {
      if (!template) return;
      view.cad = attachCad(view, template);
      setModelMode(view, view.cad, "cad", reduceMotion);
    });
  }

  // ---- JOURNEY INSET -----------------------------------------------------
  function initInset() {
    const host = document.getElementById("journey-inset");
    if (!host) return;
    const slot = host.querySelector(".inset-canvas");
    const caption = host.querySelector(".inset-caption");
    const view = createView({ host, canvasSlot: slot, label: "3D model building up step by step with the engineering journey", roaming: true, cameraPos: new THREE.Vector3(0, 0.2, 1.55) });
    view.spin.rotation.y = -0.5;
    view.assembly.setStage(1);
    view.tick = function tick(dt) {
      if (!reduceMotion) { this.spin.rotation.y += dt * 0.22; this.draw(); }
      else if (this.dirty) this.draw();
    };
    const steps = [...document.querySelectorAll(".journey-step[data-stage]")];
    const stageObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const stage = Number(entry.target.dataset.stage);
        view.assembly.setStage(stage);
        view.dirty = true;
        if (caption) caption.textContent = entry.target.dataset.insetCaption || "";
      }
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach((s) => stageObserver.observe(s));
  }

  // ---- EXPLORER ----------------------------------------------------------
  function initExplorer() {
    const host = document.getElementById("explorer");
    if (!host) return;
    const stage = host.querySelector(".explorer-stage");
    const overlay = host.querySelector(".explorer-overlay");
    const homePos = new THREE.Vector3(1.22, 0.42, 1.02);
    const view = createView({ host, canvasSlot: stage, label: "Interactive 3D assembly explorer. Drag to orbit, scroll or pinch to zoom, click a part for details.", roaming: true, cameraPos: homePos.clone(), fov: 32 });
    const { assembly, camera } = view;
    let currentMode = "interactive";

    const controls = new OrbitControls(camera, stage);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 0.55;
    controls.maxDistance = 3.4;
    controls.target.set(0, 0, 0);
    // Narrow (portrait) stages need the camera further back to fit the model's width.
    const homeFor = () => {
      const aspect = view.width / view.height;
      return homePos.clone().multiplyScalar(aspect < 1 ? 1.5 : aspect < 1.4 ? 1.15 : 1);
    };
    view.resize();
    camera.position.copy(homeFor());
    controls.update();
    controls.addEventListener("change", () => { view.dirty = true; });

    // Keyboard orbit on the focused stage.
    stage.addEventListener("keydown", (e) => {
      const sph = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      const step = 0.12;
      if (e.key === "ArrowLeft") sph.theta -= step;
      else if (e.key === "ArrowRight") sph.theta += step;
      else if (e.key === "ArrowUp") sph.phi = Math.max(0.2, sph.phi - step);
      else if (e.key === "ArrowDown") sph.phi = Math.min(Math.PI - 0.2, sph.phi + step);
      else if (e.key === "+" || e.key === "=") sph.radius = Math.max(controls.minDistance, sph.radius * 0.9);
      else if (e.key === "-") sph.radius = Math.min(controls.maxDistance, sph.radius * 1.1);
      else return;
      e.preventDefault();
      camera.position.setFromSpherical(sph).add(controls.target);
      controls.update();
    });

    // --- dimension overlay (documented values only) ---
    const dims = new THREE.Group();
    const dimMat = new THREE.LineBasicMaterial({ color: 0x2c2a26 });
    const mm = 0.001, hw = DIM.width / 2 * mm, hh = DIM.height / 2 * mm, hd = DIM.depth / 2 * mm;
    function seg(a, b) { const g = new THREE.BufferGeometry().setFromPoints([a, b]); dims.add(new THREE.Line(g, dimMat)); }
    function dimLine(a, b, tickDir) {
      seg(a, b);
      const t = tickDir.clone().multiplyScalar(0.012);
      seg(a.clone().sub(t), a.clone().add(t));
      seg(b.clone().sub(t), b.clone().add(t));
    }
    dimLine(new THREE.Vector3(-hw, hh + 0.035, hd), new THREE.Vector3(hw, hh + 0.035, hd), new THREE.Vector3(0, 1, 0));
    dimLine(new THREE.Vector3(-hw - 0.035, -hh, hd), new THREE.Vector3(-hw - 0.035, hh, hd), new THREE.Vector3(1, 0, 0));
    dimLine(new THREE.Vector3(hw + 0.035, -hh, hd), new THREE.Vector3(hw + 0.035, -hh, -hd), new THREE.Vector3(0, 1, 0));
    const ow = DIM.openingW / 2 * mm, oh = DIM.openingH / 2 * mm, oz = hd + 0.002;
    const openingPts = [[-ow, -oh], [ow, -oh], [ow, oh], [-ow, oh], [-ow, -oh]].map(([x, y]) => new THREE.Vector3(x, y, oz));
    const openingLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(openingPts), new THREE.LineDashedMaterial({ color: 0xb5633f, dashSize: 0.012, gapSize: 0.008 }));
    openingLine.computeLineDistances();
    dims.add(openingLine);
    dims.visible = false;
    view.spin.children[0].add(dims);
    const topRodY = rodYs()[rodYs().length - 1] * mm;
    const dimLabels = [
      { text: "480 mm", at: new THREE.Vector3(0, hh + 0.05, hd) },
      { text: "560 mm", at: new THREE.Vector3(-hw - 0.05, 0, hd) },
      { text: "150 mm", at: new THREE.Vector3(hw + 0.05, -hh, 0) },
      { text: "Opening 440 × 520 mm", at: new THREE.Vector3(0, -oh + 0.02, oz) },
      { text: "⌀12 mm rod", at: new THREE.Vector3(hw + 0.01, topRodY, ROD_Z * mm) }
    ].map((d) => {
      const el = document.createElement("span");
      el.className = "dim-label";
      el.textContent = d.text;
      el.hidden = true;
      overlay.append(el);
      return { ...d, el };
    });

    // --- conceptual airflow particles ---
    // Direction confirmed by the team: room air is taken in behind the two rear
    // fans, blown forward through AND around the pots, and leaves at the front.
    const N = 260;
    const pPos = new Float32Array(N * 3);
    const pVel = new Float32Array(N);
    const pFan = new Uint8Array(N);       // which fan the particle passes through
    const pTarget = new Float32Array(N * 2); // where it crosses the pot array (x, y)
    const fanYs = APPROX.fanY.map((y) => y * mm);
    const fanZ = -0.172;                  // fan plate plane (rear extension)
    const spawnZ = -0.46, exitZ = 0.42;
    function respawn(i, z) {
      pFan[i] = Math.random() < 0.5 ? 0 : 1;
      const bypass = Math.random() < 0.18;
      if (bypass) {
        // passes around the pot array, just outside the frame edges
        const side = Math.floor(Math.random() * 4);
        const a = (Math.random() - 0.5) * 2;
        pTarget[i * 2] = side < 2 ? (side === 0 ? -1 : 1) * (hw + 0.02 + Math.random() * 0.03) : a * hw;
        pTarget[i * 2 + 1] = side >= 2 ? (side === 2 ? -1 : 1) * (hh + 0.02 + Math.random() * 0.03) : a * hh;
      } else {
        pTarget[i * 2] = (Math.random() - 0.5) * 2 * (hw - 0.03);
        pTarget[i * 2 + 1] = (Math.random() - 0.5) * 2 * (hh - 0.03);
      }
      pPos[i * 3 + 2] = z;
      if (z < fanZ) {
        // room air behind the fans, spread out
        pPos[i * 3] = (Math.random() - 0.5) * 0.5;
        pPos[i * 3 + 1] = fanYs[pFan[i]] + (Math.random() - 0.5) * 0.4;
      } else {
        pPos[i * 3] = pTarget[i * 2];
        pPos[i * 3 + 1] = pTarget[i * 2 + 1];
      }
      pVel[i] = 0.13 + Math.random() * 0.08;
    }
    for (let i = 0; i < N; i += 1) respawn(i, spawnZ + Math.random() * (exitZ - spawnZ));
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x2f6479, size: 0.012, transparent: true, opacity: 0.85, depthWrite: false }));
    particles.visible = false;
    particles.frustumCulled = false;
    view.spin.children[0].add(particles);
    const frontZ = DIM.depth / 2 * mm, backZ = -DIM.depth / 2 * mm;
    function stepParticles(dt) {
      for (let i = 0; i < N; i += 1) {
        const ix = i * 3;
        let x = pPos[ix], y = pPos[ix + 1], z = pPos[ix + 2];
        z += pVel[i] * dt; // forward: rear → front
        if (z < fanZ) {
          // converging into the fan intake behind the frame
          const k = Math.min(1, dt * 3.5);
          x += (0 - x) * k;
          y += (fanYs[pFan[i]] - y) * k;
        } else if (z < backZ) {
          // blown out of the fan and spreading to cover the pot array (or around it)
          const k = Math.min(1, dt * 7);
          x += (pTarget[i * 2] - x) * k;
          y += (pTarget[i * 2 + 1] - y) * k;
        } else if (z < frontZ) {
          // through the pot array, weaving between the pots
          x += Math.sin(z * 90 + i) * dt * 0.03;
        } else {
          // out of the front into the room, slowly spreading
          x *= 1 + dt * 0.25;
          y *= 1 + dt * 0.25;
        }
        pPos[ix] = x; pPos[ix + 1] = y; pPos[ix + 2] = z;
        if (z > exitZ) respawn(i, spawnZ);
      }
      pGeo.attributes.position.needsUpdate = true;
    }

    // --- part picking ---
    const partInfo = {
      frame: { name: "Frame", status: "COMPLETED", text: "Welded 20 mm square-pipe frame, 480 × 560 × 150 mm (design values), 440 × 520 mm front opening. Spray-painted grey. Visual inspection done; as-built measurements pending." },
      fanMount: { name: "Rear fan-mount extension", status: "COMPLETED", text: "Extension frame welded behind the main frame; carries both fans. Overall side depth 270 mm on the SolidWorks drawing." },
      rods: { name: "Pot-retaining rods", status: "COMPLETED", text: "Six ⌀12 mm rods, drilled and attached across the frame width: 90 mm apart, on the centre plane of the frame (from the SolidWorks export)." },
      pots: { name: "Clay pots", status: "COMPLETED", text: "30 unglazed clay pots, 5 columns × 6 rows, mouths facing the front (observed in photographs). Size from the SolidWorks export (⌀80 × 80 mm, ⌀40 openings); the profile curve is approximate." },
      fans: { name: "Exhaust fans", status: "COMPLETED · CONTROL REPORTED", text: "Two exhaust fans mounted at the rear, blowing room air forward through the pot array. Temperature switching above 35 °C: IMPLEMENTED (reported) — firmware not in repository; not verified. Fan size is approximate." },
      water: { name: "Water system (schematic)", status: "INSTALLED (REPORTED) · CIRCULATION PENDING", text: "Pump, reservoir and tubing are installed (reported by team; photo evidence pending). Circulation not yet commissioned. Positions and sizes shown are NOT documented." }
    };
    const infoPanel = host.querySelector(".part-info");
    const infoName = infoPanel.querySelector(".part-name");
    const infoStatus = infoPanel.querySelector(".part-status");
    const infoText = infoPanel.querySelector(".part-text");
    const allMaterials = new Set();
    assembly.root.traverse((o) => { if (o.isMesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => allMaterials.add(m)); });
    const matBase = new Map([...allMaterials].map((m) => [m, { transparent: m.transparent, opacity: m.opacity, depthWrite: m.depthWrite }]));
    let selected = null;
    function select(part) {
      selected = part;
      const partMats = new Set();
      if (part) assembly.groups[part]?.traverse((o) => { if (o.isMesh) partMats.add(o.material); });
      for (const [m, b] of matBase) {
        const dim = part && !partMats.has(m);
        m.transparent = dim ? true : b.transparent;
        m.opacity = dim ? Math.min(b.opacity, 0.16) : b.opacity;
        m.depthWrite = dim ? false : b.depthWrite;
        m.needsUpdate = true;
      }
      if (part && partInfo[part]) {
        infoName.textContent = partInfo[part].name;
        infoStatus.textContent = partInfo[part].status;
        infoText.textContent = partInfo[part].text;
        infoPanel.hidden = false;
      } else {
        infoPanel.hidden = true;
      }
      view.dirty = true;
    }
    host.querySelector(".part-info-close")?.addEventListener("click", () => select(null));
    const ray = new THREE.Raycaster();
    let downAt = null;
    stage.addEventListener("pointerdown", (e) => { downAt = [e.clientX, e.clientY]; });
    stage.addEventListener("pointerup", (e) => {
      if (currentMode === "cad") return; // part selection uses the interactive model
      if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
      const r = stage.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
      const hits = ray.intersectObject(assembly.root, true).filter((h) => h.object.visible && isShown(h.object) && h.object.userData.part);
      select(hits.length ? hits[0].object.userData.part : null);
    });
    function isShown(o) { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; }

    // --- controls (real buttons) ---
    let explodeTarget = 0;
    const explodeButtons = [...host.querySelectorAll("[data-explode]")];
    explodeButtons.forEach((b) => b.addEventListener("click", () => {
      explodeTarget = Number(b.dataset.explode);
      explodeButtons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      if (reduceMotion) assembly.setExplode(explodeTarget);
      view.dirty = true;
    }));
    const layerButtons = [...host.querySelectorAll("[data-layer]")];
    const layerState = { frame: true, fanMount: true, rods: true, pots: true, fans: true, water: false };
    const CAD_PARTS = ["frame", "fanMount", "rods", "pots"];
    view.layerOn = (name) => layerState[name];
    function setLayer(name, on) {
      layerState[name] = on;
      const g = assembly.groups[name];
      if (g) g.visible = on && !(currentMode === "cad" && CAD_PARTS.includes(name));
      const b = layerButtons.find((x) => x.dataset.layer === name);
      if (b) b.setAttribute("aria-pressed", String(on));
      if (name === "water") host.querySelector(".water-note").hidden = !on;
      if (!on && selected === name) select(null);
      view.dirty = true;
    }
    layerButtons.forEach((b) => b.addEventListener("click", () => setLayer(b.dataset.layer, b.getAttribute("aria-pressed") !== "true")));
    const dimButton = host.querySelector("[data-toggle='dims']");
    function setDims(on) {
      dims.visible = on;
      dimLabels.forEach((d) => { d.el.hidden = !on; });
      dimButton.setAttribute("aria-pressed", String(on));
      view.dirty = true;
    }
    dimButton.addEventListener("click", () => setDims(dimButton.getAttribute("aria-pressed") !== "true"));
    const airButton = host.querySelector("[data-toggle='airflow']");
    function setAirflow(on) {
      particles.visible = on && !reduceMotion;
      airButton.setAttribute("aria-pressed", String(on && !reduceMotion));
      host.querySelector(".airflow-note").hidden = !(on && !reduceMotion);
      view.dirty = true;
    }
    airButton.addEventListener("click", () => setAirflow(airButton.getAttribute("aria-pressed") !== "true"));
    function updateMotionUI() {
      airButton.disabled = reduceMotion;
      airButton.title = reduceMotion ? "Disabled because reduced motion is requested" : "";
      if (reduceMotion) setAirflow(false);
    }
    view.onMotionChange = updateMotionUI;
    updateMotionUI();

    // --- SolidWorks model / Interactive model toggle ---
    const modelButtons = [...host.querySelectorAll("[data-model]")];
    const cadButton = modelButtons.find((b) => b.dataset.model === "cad");
    const cadNote = host.querySelector(".cad-note");
    function setMode(mode) {
      if (mode === "cad" && !view.cad) return;
      if (mode === "cad") {
        select(null);
        explodeTarget = 0;
        assembly.setExplode(0);
        explodeButtons.forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.explode === "0")));
      }
      currentMode = mode;
      if (view.cad) setModelMode(view, view.cad, mode, reduceMotion);
      modelButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.model === mode)));
      const lock = mode === "cad";
      explodeButtons.forEach((b) => { b.disabled = lock; });
      layerButtons.forEach((b) => { if (CAD_PARTS.includes(b.dataset.layer)) b.disabled = lock; });
      if (cadNote) cadNote.hidden = !lock;
      view.dirty = true;
    }
    modelButtons.forEach((b) => b.addEventListener("click", () => setMode(b.dataset.model)));
    if (cadButton) {
      cadButton.disabled = true;
      cadButton.title = project.modelGLB ? "Loading the SolidWorks export…" : "No SolidWorks export configured";
    }
    loadCad().then((template) => {
      if (!template || !cadButton) {
        if (cadButton && project.modelGLB) cadButton.title = "The SolidWorks export could not be loaded";
        return;
      }
      view.cad = attachCad(view, template);
      setModelMode(view, view.cad, "interactive", true);
      cadButton.disabled = false;
      cadButton.title = "";
    });

    function reset() {
      setMode("interactive");
      camera.position.copy(homeFor());
      controls.target.set(0, 0, 0);
      controls.update();
      explodeTarget = 0;
      assembly.setExplode(0);
      explodeButtons.forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.explode === "0")));
      ["frame", "fanMount", "rods", "pots", "fans"].forEach((n) => setLayer(n, true));
      setLayer("water", false);
      setDims(false);
      view.dirty = true;
      setAirflow(false);
      select(null);
    }
    host.querySelector("[data-action='reset']").addEventListener("click", reset);

    const tmp = new THREE.Vector3();
    function placeLabels() {
      if (!dims.visible) return;
      const w = view.width, h = view.height;
      for (const d of dimLabels) {
        tmp.copy(d.at);
        view.spin.children[0].localToWorld(tmp);
        tmp.project(camera);
        d.el.style.transform = `translate(-50%, -50%) translate(${((tmp.x + 1) / 2) * w}px, ${((1 - tmp.y) / 2) * h}px)`;
        d.el.hidden = tmp.z > 1;
      }
    }

    view.tick = function tick(dt) {
      let animating = false;
      const cur = assembly.getExplode();
      if (Math.abs(cur - explodeTarget) > 0.001) {
        assembly.setExplode(reduceMotion ? explodeTarget : cur + (explodeTarget - cur) * Math.min(1, dt * 5));
        animating = true;
      }
      if (particles.visible) { stepParticles(dt); animating = true; }
      if (stepFade(this, this.cad, dt)) animating = true;
      const moved = controls.update();
      if (animating || moved || this.dirty) { this.draw(); placeLabels(); }
    };
    // Compile shaders ahead of time so the first visible frame is not delayed.
    if (!roamRenderer) roamRenderer = makeRenderer();
    roamRenderer.compile(view.scene, camera);
    // Expose for automated checks in the browser console.
    window.__claybreezeExplorer = { select, setLayer, setDims, setAirflow, setMode, reset, assembly, camera, controls, view, particles: pPos };
  }

  // Hero now (procedural first, SolidWorks export crossfades in when loaded);
  // the inset and explorer are built about one viewport before they scroll in,
  // so a jump straight to the explorer never lands on an empty stage.
  initHero();
  const started = new Set();
  function initOnce(id) {
    if (started.has(id)) return;
    started.add(id);
    lazy.unobserve(document.getElementById(id));
    if (id === "journey-inset") initInset();
    if (id === "explorer") initExplorer();
  }
  const lazy = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) initOnce(entry.target.id);
  }, { rootMargin: "100% 0px" });
  const ids = ["journey-inset", "explorer"].filter((id) => document.getElementById(id));
  ids.forEach((id) => lazy.observe(document.getElementById(id)));
  // Also build them in idle time after load, so a jump straight to the explorer
  // (e.g. from the navigation) lands on a ready scene with compiled shaders.
  const idle = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 1500));
  window.addEventListener("load", () => idle(() => ids.forEach(initOnce), { timeout: 4000 }), { once: true });

  window.addEventListener("pagehide", () => {
    stop();
    for (const v of views) v.scene.traverse((o) => {
      if (o.isMesh || o.isLine || o.isPoints) { o.geometry?.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m?.dispose()); }
    });
    heroRenderer?.dispose();
    roamRenderer?.dispose();
  });
}

// Start once every module-level declaration above is initialised.
if (!webglAvailable()) {
  root.classList.add("no-webgl");
} else {
  root.classList.remove("no-webgl");
  init();
}
