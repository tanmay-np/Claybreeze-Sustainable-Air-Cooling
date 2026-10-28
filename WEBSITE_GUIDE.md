# ClayBreeze Website Guide

This website is a static HTML/CSS/JavaScript presentation layer for the ClayBreeze project. It has no build step, package manager, API key, database, or external JavaScript dependency. The documentation in `docs/` remains the detailed engineering record.

## Website files

- `index.html` — presentation website entry point; it is in the repository root for straightforward GitHub Pages publishing.
- `assets/css/site.css` — visual design and responsive layout (system fonts only; no external requests).
- `assets/js/project-data.js` — design values, components, status groups, next steps, the engineering-journey steps, the 3D "Model notes", the optional `modelGLB` path, and the `CLAYBREEZE_CONTROL` thresholds used by the Control Logic Lab simulator.
- `assets/js/gallery-data.js` — list of real project photos and CAD screenshots (with `kind` and pixel `width`/`height`).
- `assets/js/site.js` — page behaviour: journey, design/CAD, gallery and filters, image viewer with zoom, status, navigation, presentation mode and the Control Logic Lab simulator.
- `assets/js/model.js` — the procedural 3D model, built from the documented dimensions; approximate values are marked `APPROX`.
- `assets/js/viewer.js` — the 3D views: hero, journey build-up inset, and the Assembly Explorer.
- `assets/vendor/three/` — three.js 0.160.0 (build + OrbitControls + GLTFLoader), vendored locally with its MIT `LICENSE`, loaded through the import map in `index.html`. Nothing is fetched from a CDN, so the site works offline.

## 3D model

The 3D views use the procedural model in `assets/js/model.js`, whose rod, pot and extension positions are measured from the SolidWorks export `assets/models/claybreeze-assembly.glb` (set as `modelGLB` in `assets/js/project-data.js`). The hero starts with the procedural model and crossfades to the export once it loads; the explorer offers "Interactive model" / "SolidWorks model". The export has no fans, so the approximate fans are shown with it. Explode, layers and part details stay on the interactive model because the export's nodes (`20mm_frame-1`, `20mm_rod-*`, `kullad_part-*`) do not separate the frame from the fan mount. Set `modelGLB` to `null` to use only the procedural model; any load error falls back to it automatically.

Testing aids: `?nowebgl` shows the CAD-screenshot fallback; `?reducedmotion` forces the reduced-motion behaviour (no auto-rotate, parallax or particles).

## Add photographs as the build progresses

1. Copy an original photo or screenshot into the appropriate folder. Use short, descriptive filenames and dates, for example:
   - `media/photos/2026-10-28-frame-front.jpg`
   - `media/photos/2026-10-29-rod-attachment.jpg`
   - `media/photos/2026-10-30-fan-mount.jpg`
   - `media/photos/2026-10-31-electronics-breadboard.jpg`
   - `media/cad-screenshots/2026-10-30-updated-solidworks-assembly.png`
2. Open `assets/js/gallery-data.js` and add an object to `window.CLAYBREEZE_GALLERY`, following the commented example. Choose one category: `frame-fabrication`, `rods-mounts`, `painting`, `clay-pots`, `electronics`, `water-system`, `cad`, or `testing`.
3. Provide a meaningful `alt` description, a short caption, `kind` (`photo`, `cad-drawing` or `cad-render`) and the image's pixel `width`/`height`. The site does not show dates; record real dates in the fabrication log only when they come from a real record.
4. Refresh the site. The item will appear in the gallery and its category filter. Clicking a card opens the larger image.

Example entry:

```js
window.CLAYBREEZE_GALLERY = [
  {
    src: "media/photos/frame-front.jpg",
    title: "Fabricated metal frame",
    category: "frame-fabrication",
    kind: "photo",
    width: 960, height: 1280,
    alt: "Front view of the fabricated ClayBreeze metal frame",
    description: "Front view taken during workshop inspection."
  }
];
```

For multiple photos, separate objects with commas. Keep the paths relative to the repository root. Do not use stock images or synthetic images as if they show the actual build.

## Add images with Claude Code (low-effort workflow)

After copying real photos into `media/photos/`, use this prompt in Claude Code:

> I added new real ClayBreeze project photos to `media/photos/` and/or CAD screenshots to `media/cad-screenshots/`. Inspect only the new image files, identify their contents from what is visible, and add accurate entries to `assets/js/gallery-data.js`. Use descriptive titles, accessible alt text, dates only when known, and the correct category. Do not alter existing entries, invent details, or add images that are not present. Then verify each relative image path exists and report the changes.

If an image shows people or includes private information, decide whether it is appropriate to publish before adding it. Public GitHub Pages content can be viewed by anyone.

## Update project dimensions or status

Edit `assets/js/project-data.js` when a documented design value or status changes. Keep it aligned with `README.md` and the relevant file in `docs/`. Do not mark tasks complete until they are actually complete. Do not add cooling results until measurements have been recorded and reviewed.

Helpful prompt:

> Update the ClayBreeze website to reflect only these confirmed project changes: [describe the real changes]. Update `assets/js/project-data.js`, the relevant documentation and gallery entries as needed. Preserve unrelated content, do not invent measurements or test results, and show me a summary of changed files.

## Preview locally

**Recommended:** Open the repository folder in VS Code. Install/use a simple local preview extension such as Live Server, then right-click `index.html` and choose **Open with Live Server**. A local HTTP preview allows images and other browser features to work consistently. Alternatively, run `python -m http.server 8000` from the repository root and open `http://localhost:8000`. Opening `index.html` directly from disk (`file://`) blocks the 3D modules, so the page then shows the CAD-screenshot fallback instead of the 3D views.

You can double-click `index.html` to preview many parts of the site, but a local server is more reliable for browser behaviour.

## GitHub Pages publishing

The website entry point is `index.html` in the repository root. Once the repository is on GitHub and the website content has been reviewed:

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/(root)`, then save.
5. Wait for the Pages deployment to complete, and use the site link shown in Pages settings.

GitHub may take several minutes to publish changes. The site and its images are intended for public presentation; do not include confidential information, private documents, credentials or photos that you do not have permission to publish.

## Presentation mode

Use the **Presentation mode** button in the website header for a larger, cleaner layout during a project demonstration. Press Escape or use the exit button to return to the standard layout. For a full-screen browser view, press `F11` in most desktop browsers.

## Updating the Control Logic Lab thresholds

The Control Logic Lab simulator reads its thresholds from `window.CLAYBREEZE_CONTROL` in `assets/js/project-data.js` — the current fan threshold, the planned two-stage fan thresholds, and the proposed pump hysteresis band. Edit that object (not `site.js`) if a threshold changes, and update `docs/electronics-and-control.md` to match. The simulator is a software simulation only; keep its "not connected to real hardware" labelling intact if you edit the markup.

## Engineering truthfulness

The website marks the project as "Prototype assembled — testing pending." The frame, rods, rear fan-mount extension, paint, fans and 30 pots are physically complete and photographed. The pump, reservoir and tubing are "Installed (reported by team; photo evidence pending)"; water circulation and commissioning are PENDING. The fan rule is "IMPLEMENTED (reported) — firmware not yet in repository; not verified", and behaviour at exactly 35.0 °C is unconfirmed. The two-stage fan logic is PLANNED and the humidity-based pump control is PROPOSED. As-built measurement and the CAD update are PENDING. Replace any of these notes only after the underlying work or measurements support the change.
