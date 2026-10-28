/*
 * ClayBreeze procedural 3D model.
 *
 * Builds the assembly from the documented geometry (docs/design-and-dimensions.md
 * and the dimensioned SolidWorks drawing). Values marked APPROX are estimated
 * from the photographs/CAD screenshots and are listed in the page's "Model notes"
 * (window.CLAYBREEZE_PROJECT.modelNotes). Units: 1 scene unit = 1 metre; the
 * constants below are in millimetres.
 *
 * Axes: x = width (left/right), y = height, z = depth (+z is the front face).
 * Parts are grouped as frame, rods, fanMount, fans, pots, water.
 */
import * as THREE from "three";

const MM = 0.001;

// ---- Documented values ----------------------------------------------------
export const DIM = {
  width: 480,          // outer W
  height: 560,         // outer H
  depth: 150,          // outer D (main frame)
  pipe: 20,            // square pipe section
  openingW: 440,       // front opening
  openingH: 520,
  rodDia: 12,
  rodCount: 6,
  potCols: 5,
  potRows: 6,
  overallDepth: 270,   // side view of drawing, incl. rear extension
  extInset: 132.5      // extension members from the inner face of each side member (front view of drawing)
};

// ---- Measured from the SolidWorks GLB export (assets/models/claybreeze-assembly.glb) ----
export const CAD = {
  rodDepthFromFront: 75,  // rod axis = centre of the 150 mm main frame
  rodPitch: 90,           // six rods at ±45, ±135, ±225 mm about the frame centre
  rodLength: 480,         // ⌀12 mm shaft, plus a ⌀20 × 1 mm head at the +x end
  rodHeadDia: 20,
  potXs: [-168.3, -88.3, -8.3, 71.7, 151.7], // 80 mm pitch; the CAD array sits 8.3 mm left of centre
  potMaxDia: 80,
  potLength: 80,
  potOpeningDia: 40       // open at both ends (hollow-through)
};

// ---- Approximate values (see Model notes) ---------------------------------
export const APPROX = {
  fanPlate: 190,
  fanDuctDia: 118,
  fanDuctLen: 70,
  fanY: [150, -45],       // centres of upper and lower fan
  paint: 0xa9aeb0,
  rawSteel: 0x7d6a4c,
  terracotta: 0xb8673f
};

const W = DIM.width, H = DIM.height, D = DIM.depth, P = DIM.pipe;
const EXT = DIM.overallDepth - D; // 120 mm rear extension

// Rod centres (CAD export): 90 mm pitch, symmetric about the frame centre.
export function rodYs() {
  return Array.from({ length: DIM.rodCount }, (_, i) => (i - (DIM.rodCount - 1) / 2) * CAD.rodPitch);
}
export function potXs() {
  return CAD.potXs.slice();
}
export const ROD_Z = D / 2 - CAD.rodDepthFromFront;

// Shared geometry cache so several views reuse buffers.
const geoCache = new Map();
function cached(key, make) {
  if (!geoCache.has(key)) geoCache.set(key, make());
  return geoCache.get(key);
}

function tube(len, axis) {
  // 20 mm square member of length len (mm) along axis.
  const size = axis === "x" ? [len, P, P] : axis === "y" ? [P, len, P] : [P, P, len];
  return cached(`box:${size.join("x")}`, () => new THREE.BoxGeometry(size[0] * MM, size[1] * MM, size[2] * MM));
}

function addMember(group, material, len, axis, x, y, z) {
  const mesh = new THREE.Mesh(tube(len, axis), material);
  mesh.position.set(x * MM, y * MM, z * MM);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function potGeometry() {
  return cached("pot", () => {
    // Double-cone "kulhad" profile, hollow-through, mouth at axial 0 (front).
    // Extents from the CAD export: ⌀80 max, 80 long, ⌀40 openings at both ends;
    // the position of the widest point is estimated from the CAD pot screenshot.
    const r = (v) => v * MM;
    const pts = [
      [20, 0], [23, 0], [26, 5], [34, 26], [40, 48], [39, 55], [30, 70], [23, 80],
      [20, 80], [26, 70], [35, 55], [36, 48], [30, 27], [22, 7], [20, 0]
    ].map(([rad, ax]) => new THREE.Vector2(r(rad), r(ax)));
    const g = new THREE.LatheGeometry(pts, 40);
    // Lathe axis is +y; turn it so the mouth faces +z (front) and centre it.
    g.translate(0, -r(CAD.potLength / 2), 0);
    g.rotateX(-Math.PI / 2);
    g.computeVertexNormals();
    return g;
  });
}

function makeMaterials() {
  return {
    frame: new THREE.MeshStandardMaterial({ color: APPROX.paint, roughness: 0.62, metalness: 0.18 }),
    fanMount: new THREE.MeshStandardMaterial({ color: APPROX.paint, roughness: 0.62, metalness: 0.18 }),
    rods: new THREE.MeshStandardMaterial({ color: 0x3d3f42, roughness: 0.55, metalness: 0.45 }),
    fanBody: new THREE.MeshStandardMaterial({ color: 0xeceae4, roughness: 0.7, metalness: 0 }),
    fanBlade: new THREE.MeshStandardMaterial({ color: 0xe2dfd8, roughness: 0.75, metalness: 0, side: THREE.DoubleSide }),
    water: new THREE.MeshStandardMaterial({ color: 0x5f8496, roughness: 0.4, metalness: 0, transparent: true, opacity: 0.22, depthWrite: false })
  };
}

/**
 * Build the full assembly. Returns { root, groups, materials, setStage, setExplode, ... }.
 */
export function buildAssembly() {
  const root = new THREE.Group();
  root.name = "ClayBreeze";
  const M = makeMaterials();
  const groups = {};
  for (const name of ["frame", "fanMount", "rods", "pots", "fans", "water"]) {
    const g = new THREE.Group();
    g.name = name;
    g.userData.part = name;
    groups[name] = g;
    root.add(g);
  }

  // ---- Frame: front ring, back ring, depth members, rod-hole posts --------
  const fx = W / 2 - P / 2, fy = H / 2 - P / 2, fz = D / 2 - P / 2;
  for (const z of [fz, -fz]) {
    addMember(groups.frame, M.frame, W, "x", 0, fy, z);
    addMember(groups.frame, M.frame, W, "x", 0, -fy, z);
    addMember(groups.frame, M.frame, H - 2 * P, "y", -fx, 0, z);
    addMember(groups.frame, M.frame, H - 2 * P, "y", fx, 0, z);
  }
  for (const x of [-fx, fx]) for (const y of [-fy, fy]) addMember(groups.frame, M.frame, D - 2 * P, "z", x, y, 0);
  // Vertical members carrying the rod holes, one per side, at the rod plane (CAD).
  for (const x of [-fx, fx]) addMember(groups.frame, M.frame, H - 2 * P, "y", x, 0, ROD_Z);

  // ---- Rear fan-mount extension: two U-frames behind the main frame -------
  // Centres at ±77.5 mm: 132.5 mm in from the inner face of each side member (drawing + CAD).
  const ex = W / 2 - P - DIM.extInset - P / 2;
  const armZ = -D / 2 - EXT / 2;
  const rearZ = -D / 2 - EXT + P / 2;
  for (const x of [-ex, ex]) {
    addMember(groups.fanMount, M.fanMount, EXT, "z", x, fy, armZ);
    addMember(groups.fanMount, M.fanMount, EXT, "z", x, -fy, armZ);
    addMember(groups.fanMount, M.fanMount, H - 2 * P, "y", x, 0, rearZ);
  }

  // ---- Rods ----------------------------------------------------------------
  const rodGeo = cached("rod", () => {
    const g = new THREE.CylinderGeometry(DIM.rodDia / 2 * MM, DIM.rodDia / 2 * MM, CAD.rodLength * MM, 20);
    g.rotateZ(Math.PI / 2);
    return g;
  });
  const headGeo = cached("rodHead", () => {
    const g = new THREE.CylinderGeometry(CAD.rodHeadDia / 2 * MM, CAD.rodHeadDia / 2 * MM, 1 * MM, 20);
    g.rotateZ(Math.PI / 2);
    return g;
  });
  for (const y of rodYs()) {
    const rod = new THREE.Mesh(rodGeo, M.rods);
    rod.position.set(1 * MM, y * MM, ROD_Z * MM); // CAD rods sit 1 mm right of centre
    const head = new THREE.Mesh(headGeo, M.rods);
    head.position.set((CAD.rodLength / 2 - 0.5) * MM, 0, 0);
    rod.add(head);
    rod.castShadow = true;
    groups.rods.add(rod);
  }

  // ---- Pots (5 × 6), slight colour variation like hand-made terracotta -----
  const potGeo = potGeometry();
  const base = new THREE.Color(APPROX.terracotta);
  const potMats = [0, 1, 2, 3].map((i) => {
    const c = base.clone().offsetHSL((i - 1.5) * 0.006, 0, (i - 1.5) * 0.018);
    return new THREE.MeshStandardMaterial({ color: c, roughness: 0.96, metalness: 0, side: THREE.DoubleSide });
  });
  const ys = rodYs(), xs = potXs();
  ys.forEach((y, r) => xs.forEach((x, c) => {
    const pot = new THREE.Mesh(potGeo, potMats[(r * 3 + c * 7) % potMats.length]);
    pot.position.set(x * MM, y * MM, ROD_Z * MM);
    pot.castShadow = true;
    pot.receiveShadow = true;
    pot.userData.row = r;
    groups.pots.add(pot);
  }));

  // ---- Fans on the rear extension -----------------------------------------
  const plateGeo = cached("fanPlate", () => new THREE.BoxGeometry(APPROX.fanPlate * MM, APPROX.fanPlate * MM, 6 * MM));
  const ductGeo = cached("fanDuct", () => {
    const g = new THREE.CylinderGeometry(APPROX.fanDuctDia / 2 * MM, APPROX.fanDuctDia / 2 * MM, APPROX.fanDuctLen * MM, 40, 1, true);
    g.rotateX(Math.PI / 2);
    return g;
  });
  const hubGeo = cached("fanHub", () => { const g = new THREE.CylinderGeometry(20 * MM, 20 * MM, 30 * MM, 24); g.rotateX(Math.PI / 2); return g; });
  const bladeGeo = cached("fanBlade", () => new THREE.BoxGeometry(36 * MM, 14 * MM, 1.5 * MM));
  const plateZ = rearZ + P / 2 + 3; // plate on the front face of the rear verticals
  for (const fy0 of APPROX.fanY) {
    const fan = new THREE.Group();
    fan.position.set(0, fy0 * MM, plateZ * MM);
    const plate = new THREE.Mesh(plateGeo, M.fanBody);
    const duct = new THREE.Mesh(ductGeo, M.fanBody);
    duct.position.z = (APPROX.fanDuctLen / 2 + 3) * MM;
    const hub = new THREE.Mesh(hubGeo, M.fanBody);
    hub.position.z = 30 * MM;
    fan.add(plate, duct, hub);
    const rotor = new THREE.Group();
    rotor.position.z = 30 * MM;
    for (let i = 0; i < 7; i += 1) {
      const blade = new THREE.Mesh(bladeGeo, M.fanBlade);
      const a = (i / 7) * Math.PI * 2;
      blade.position.set(Math.cos(a) * 38 * MM, Math.sin(a) * 38 * MM, 0);
      blade.rotation.set(0.5, 0, a);
      rotor.add(blade);
    }
    fan.add(rotor);
    fan.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    groups.fans.add(fan);
  }

  // ---- Water system: schematic ghost (positions NOT documented) -----------
  const tankW = 520, tankH = 110, tankD = 230, tankY = -H / 2 - tankH / 2 - 15;
  const tank = new THREE.Mesh(cached("tank", () => new THREE.BoxGeometry(tankW * MM, tankH * MM, tankD * MM)), M.water);
  tank.position.set(0, tankY * MM, -10 * MM);
  const pump = new THREE.Mesh(cached("pump", () => new THREE.BoxGeometry(60 * MM, 60 * MM, 60 * MM)), M.water);
  pump.position.set(200 * MM, (tankY - 15) * MM, 0);
  const pipeGeo = (len) => cached(`pipe:${len}`, () => new THREE.CylinderGeometry(6 * MM, 6 * MM, len * MM, 12));
  const riserLen = H / 2 + 22 - tankY;
  const riser = new THREE.Mesh(pipeGeo(riserLen), M.water);
  riser.position.set(262 * MM, (tankY + riserLen / 2) * MM, 0);
  const header = new THREE.Mesh(pipeGeo(W + 44), M.water);
  header.rotation.z = Math.PI / 2;
  header.position.set(0, (H / 2 + 22) * MM, ROD_Z * MM);
  groups.water.add(tank, pump, riser, header);
  groups.water.visible = false;

  root.traverse((o) => {
    if (o.isMesh) {
      let p = o.parent;
      while (p && !p.userData.part) p = p.parent;
      o.userData.part = p ? p.userData.part : null;
    }
  });

  // Base positions for explode animation.
  const explodeOffset = {
    frame: new THREE.Vector3(0, 0, 0),
    rods: new THREE.Vector3(0, 0, 0.13),
    pots: new THREE.Vector3(0, 0, 0.27),
    fanMount: new THREE.Vector3(0, 0, -0.12),
    fans: new THREE.Vector3(0, 0, -0.26),
    water: new THREE.Vector3(0, -0.1, 0)
  };

  let explode = 0;
  function setExplode(t) {
    explode = Math.max(0, Math.min(1, t));
    for (const [name, g] of Object.entries(groups)) g.position.copy(explodeOffset[name]).multiplyScalar(explode);
    // Stagger pots by row so the exploded view reads as layers.
    for (const pot of groups.pots.children) pot.position.z = ROD_Z * MM + explode * pot.userData.row * 0.008;
  }

  // Build-up stages used by the journey inset:
  // 1 frame (raw) · 2 frame (holes marked) · 3 + rods · 4 + extension · 5 painted + fans · 6 + pots · 7 electronics (not modelled)
  const raw = new THREE.Color(APPROX.rawSteel), painted = new THREE.Color(APPROX.paint);
  function setStage(stage) {
    groups.frame.visible = stage >= 1;
    groups.rods.visible = stage >= 3;
    groups.fanMount.visible = stage >= 4;
    groups.fans.visible = stage >= 5;
    groups.pots.visible = stage >= 6;
    const c = stage >= 5 ? painted : raw;
    M.frame.color.copy(c);
    M.fanMount.color.copy(c);
  }

  function rotors() {
    return groups.fans.children.map((f) => f.children[f.children.length - 1]);
  }

  return { root, groups, materials: M, setExplode, setStage, rotors, getExplode: () => explode };
}

// Overall bounds for camera framing (metres), incl. extension and water ghost.
export const BOUNDS = {
  center: new THREE.Vector3(0, -0.02, -0.04),
  radius: 0.46
};
