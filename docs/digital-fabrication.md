# Fab Lab Notebook — 3D Printing and Laser Cutting

3D printing and laser cutting skills learned and practised at Tinkerers' Lab, Sanjivani University. On the website this is **Part II — Fab Lab Notebook**, placed after the ClayBreeze project story.

> **Learning reference:** [Dr. Kiran Wakchaure's Fab Academy documentation](https://fabacademy.org/2022/labs/vigyanashram/students/kiran-wakchaure/about.html) (Fab Academy 2022, Vigyan Ashram). Everything here is written in our own words; no text or images are copied from it. Bambu Lab text is paraphrased, and Bambu Lab images are used with credit.

| Process | Status |
|---|---|
| 3D printing | Skills learned and practised at Tinkerers' Lab on the Bambu Lab H2D, P1S, A1 and A1 mini. Photographs: `media/fabrication-lab/` and Drive folder 02. |
| Laser cutting | **Laser-cutting work in progress — photographs and details will be added.** |

**Lab machines:** Bambu Lab **H2D**, **P1S**, **A1** and **A1 mini** 3D printers, and a **SIL CO2 (carbon dioxide) laser cutter, 100 W**.

## Abbreviations

| Short form | Meaning |
|---|---|
| FDM | Fused Deposition Modelling — melting plastic filament and laying it down layer by layer |
| FFF | Fused Filament Fabrication — another name for FDM |
| CAD | Computer-Aided Design |
| STL | Stereolithography file — a 3D model stored as a mesh of triangles |
| 3MF | 3D Manufacturing Format — a 3D file that also keeps units, colours and plate settings |
| PLA | Polylactic acid |
| PETG | Polyethylene terephthalate glycol-modified |
| ABS | Acrylonitrile butadiene styrene |
| ASA | Acrylonitrile styrene acrylate |
| TPU | Thermoplastic polyurethane |
| AMS | Automatic Material System — Bambu Lab's multi-spool feeder |
| PEI | Polyetherimide — a common build-plate surface |
| DXF | Drawing Exchange Format — a 2D CAD file |
| SVG | Scalable Vector Graphics — a 2D vector file |
| CO2 | Carbon dioxide (the gas in the laser tube) |
| PPI | Pulses per inch — how often the laser fires along a path |
| PPE | Personal protective equipment |
| MDF | Medium-density fibreboard |
| PVC | Polyvinyl chloride |
| PMMA | Poly(methyl methacrylate), i.e. acrylic |

## A. 3D printing (FDM)

An FDM printer melts a plastic wire called filament in a heated nozzle and lays it down line by line, layer by layer.

### Workflow

1. **CAD model** — draw the part; give it a flat base, keep overhangs gentle and leave clearance where parts fit together.
2. **Export** — save as STL (a triangle mesh) or 3MF (mesh plus units, colours and plate settings).
3. **Slice** — Bambu Studio turns the model into layers and toolpaths; check the preview, time and material.
4. **Print** — clean the plate, load filament (or the AMS), start and watch the first layer.
5. **Post-process** — let it cool, flex the plate to release the part, remove supports and brim, smooth edges, test-fit.

### How FDM works (six steps, as animated on the site)

Spool → extruder gears push the filament → hotend melts it → nozzle lays a thin bead → layers stack as the plate steps down → the fan cools each layer so it holds its shape.

### Key settings, one line each

| Setting | What it does |
|---|---|
| Layer height | Thickness of each layer; thinner is smoother but slower (0.2 mm is the usual default for a 0.4 mm nozzle). |
| First-layer height | Equal to or a little thicker than normal layers, so the first layer sticks. |
| Nozzle diameter | Line width: 0.4 mm standard, 0.2 mm for detail, 0.6–0.8 mm for speed and strength. |
| Nozzle temperature | Set for the material; too cold gives weak layers, too hot gives strings. |
| Extruder | Gears that push filament into the hotend; "direct drive" means they sit on the print head. The H2D has two nozzles. |
| Bed and build plate | A heated plate keeps the first layer down; the surface is chosen for the material. |
| **Infill** | The inside fill of a part, as a percentage and a pattern; more infill is stronger but slower. |
| **Perimeter** (wall) | An outline loop around each layer; most strength comes from the perimeters. |
| Top / bottom layers | Solid skins that close the part. |
| **Support** | Temporary scaffolding printed under overhangs and removed afterwards. |
| **Brim** | Extra flat loops around the first layer that help small or tall parts stay stuck. |
| **Raft** | A throw-away base printed under the whole part; rarely needed on modern plates. |
| Speed and cooling fan | Faster saves time but can cost quality; the fan hardens each line — high for PLA, low for ABS/ASA. |

### Materials (from Bambu Lab's filament guide)

Values from the [Bambu Lab Wiki filament guide](https://wiki.bambulab.com/en/general/filament-guide-material-table) (nozzle ranges ±10 °C). Ratings are the guide's heat-resistance / impact / tensile-strength stars. "Good for" is our own summary.

| Material | Nozzle | Bed | Printer | Ratings (heat / impact / tensile) | Good for |
|---|---|---|---|---|---|
| PLA | 190–240 °C | 35–65 °C | Open or enclosed | ★★ / ★★ / ★★★ | Prototypes, models, jigs |
| PETG | 240–270 °C (PETG HF 230–260 °C) | 60–80 °C | Open or enclosed | ★★★ / ★★★ / ★★ | Functional parts, parts near water |
| ABS | 240–280 °C | 90–100 °C | Enclosed recommended | ★★★ / ★★★ / ★★★ | Parts that get warm, housings |
| ASA | 240–280 °C | 90–100 °C | Enclosed recommended | ★★★ / ★★★ / ★★★ | Outdoor parts, housings |
| TPU (95A HF) | 200–250 °C | 30–45 °C | Open or enclosed | not rated in the guide | Flexible parts: gaskets, grips |

ABS and ASA give off fumes (including styrene) while printing, so use an enclosed printer and good ventilation. Most TPU is too soft for the AMS.

### Lab printers — official values

Values from official Bambu Lab pages ([references.md](references.md), items 15–20). "See manufacturer": not stated on those pages.

| | H2D | P1S | A1 | A1 mini |
|---|---|---|---|---|
| Strength | Dual-nozzle enclosed flagship | Enclosed all-rounder | Open-frame workhorse | Compact starter |
| Build volume (W × D × H) | 325 × 320 × 325 mm (one nozzle); 300 × 320 × 320 mm (both) | 256 × 256 × 256 mm | 256 × 256 × 256 mm | 180 × 180 × 180 mm |
| Enclosure | Enclosed, chamber heating to 65 °C | Enclosed | Open frame (see manufacturer) | Open frame (see manufacturer) |
| Nozzle(s) | Two; 0.4 mm included | One; 0.4 mm included | One; 0.4 mm included | One; 0.4 mm included |
| Max nozzle temperature | 350 °C | 300 °C | 300 °C | 300 °C |
| Max bed temperature | 120 °C | 100 °C | 100 °C | 80 °C |
| AMS support | AMS 2 Pro, AMS HT | AMS (up to 16 colours) | AMS lite | AMS lite |

### H2D — labelled parts

The website marks these on Bambu Lab's official H2D front image (positions approximate; image © Bambu Lab, see references item 21):

1. **Dual nozzles and hotend** — two nozzles on one head; each can carry a different material or colour.
2. **Extruder** — gears that push filament into the hotend at a controlled rate.
3. **Heated build plate** — removable, heated plate the part is built on.
4. **Motion system (gantry)** — rails and belts that move the head; the plate steps down each layer.
5. **Enclosure and door** — keep warm air in (chamber heating to 65 °C) for ABS/ASA.
6. **Touchscreen** — start prints, load filament, read errors.
7. **Filament and AMS** — the AMS 2 Pro holds four spools and feeds them automatically.
8. **Camera and lighting** — built-in cameras (the spec lists a nozzle camera) and chamber light.

## B. Laser cutting (CO2)

**Laser-cutting work in progress — photographs and details will be added.**

A CO2 (carbon dioxide) laser focuses an infrared beam onto a sheet to burn a line through it (cutting) or mark its surface (engraving).

### Workflow

1. **Design** — closed 2D outlines saved as DXF or SVG; cut, score and engrave on separate colours.
2. **Laser software** — assign each colour its job, power and speed.
3. **Material setup** — confirm the sheet is allowed, measure thickness, lay it flat on the honeycomb bed.
4. **Focus** — set the lens-to-sheet gap so the beam is narrowest on the surface.
5. **Cut / engrave** — lid closed, extraction and air assist on, test on scrap, stay with the machine.
6. **Inspect** — check cut-through before moving the sheet, test fits, measure kerf, record settings.

### Key settings

| Setting | What it does |
|---|---|
| Power % | Share of the tube's full output; more cuts deeper but chars edges and widens the kerf. |
| Speed | How fast the head moves; slower puts more energy into each millimetre. |
| Frequency / PPI | How often the laser pulses; lower tends to char wood less, higher gives smoother acrylic edges. |
| Focus / focal length | The distance at which the beam is narrowest; the sheet surface must sit there. |
| **Kerf** | The width of material the beam burns away; half comes off each side of the line, so tabs shrink and slots grow. |
| Kerf compensation | Offsetting paths by half the measured kerf so press-fit parts come out at size. |
| Vector cut vs raster engrave | Vector follows a line (cut or score); raster sweeps back and forth to engrave an area. |
| Air assist | An air jet that blows away smoke and flame and protects the lens. |
| Passes | Repeating a path; two gentle passes can char less than one slow pass. |

The learning reference characterised its own laser by cutting a grid of test squares at different settings and measuring the parts to find each material's kerf. The same test should be done on the Tinkerers' Lab machine before cutting press-fit parts.

### Materials

| Allowed | Never cut |
|---|---|
| MDF | PVC / vinyl — gives off chlorine gas, toxic and corrosive |
| Plywood | Polycarbonate — burns and discolours |
| Acrylic (PMMA) | Coated metals — not cut by a CO2 laser; coatings reflect or fume |
| Cardboard, paper | Any sheet you cannot identify |

### Lab machine

| | SIL CO2 laser cutter |
|---|---|
| Type | CO2 laser cutter |
| Laser power | 100 W |
| Bed size | [to confirm from machine label] |
| Model / other specifications | [to confirm from machine label] |

## C. Safety checklist (both machines)

- [ ] Fume extraction / ventilation on; ABS/ASA only in an enclosed printer in a ventilated room.
- [ ] Sheet is on the allowed list — no PVC, vinyl, polycarbonate or coated metal.
- [ ] Never leave the laser unattended while it runs.
- [ ] Fire-watch: bed clear of offcuts, extinguisher location known, stop if a flame does not go out.
- [ ] PPE: lid closed as the beam shield; safety glasses and gloves for sanding, support removal and sharp offcuts; hair and loose clothing tied back.
- [ ] Hot parts: nozzle (300–350 °C) and bed (up to 120 °C) left to cool before touching.

## Photographs and videos

- Team photographs: `media/fabrication-lab/` (3D printing: `3DP_*`; laser lab practice: `Laser_*`), shown in the website gallery under **3D Printing** and **Laser Cutting** and in the "In our lab" strips.
- Two short lab videos of printed parts are embedded in the notebook.
- Official printer images: `media/fabrication-lab/bambu/` — **Image: © Bambu Lab**, from the official store pages (references item 21).
- Upcoming laser photographs: a ready-to-fill entry is at the end of `assets/js/gallery-data.js`.
