# ClayBreeze — A Sustainable Clay-Based Air-Cooling System

**Live site:** https://tanmay-np.github.io/Claybreeze-Sustainable-Air-Cooling/  
**Poster (A1 PDF):** [poster/ClayBreeze_Poster_A1.pdf](poster/ClayBreeze_Poster_A1.pdf)

> A Makerspace prototype exploring porous clay as a wetted medium for direct evaporative cooling.

**Project status: Build complete — control logic running; next: performance testing.** The metal frame is fabricated and painted, the six 12 mm pot-retaining rods are attached, the rear fan-mount extension carries both exhaust fans, and 30 clay pots (5 columns × 6 rows) are fixed into the frame. The water pump with tubing and the reservoir are installed. An ESP32, a DHT11 sensor and a 3-channel relay module are integrated, and the control logic is running on the ESP32: both fans off at or below 28 °C, one fan above 28 °C, both fans above 35 °C, and the pump on below 60 % relative humidity (off at or above 60 %). Next: performance testing and results. No cooling-performance result is claimed until the prototype is tested.

## Student

Group 17, Sanjivani University Makerspace.

Tanmay Nilesh Pendbhaje  
FY B.Tech Mechanical Engineering  
Sanjivani University

Project Guide: Dr. Kiran Wakchaure

## Overview

ClayBreeze investigates whether hollow, unglazed clay pots, supplied with recirculating water and ventilated by two rear-mounted fans, can reduce the temperature of air passing through the assembly. The project focuses on practical fabrication, water distribution, airflow, measurement, and evidence-based evaluation.

Affordability, maintainability, water use, electricity use, and environmental considerations are evaluation goals—not proven advantages. No cooling-performance or cost-saving result is claimed until the prototype is tested.

## Current Design Snapshot

| Parameter | Current information |
|---|---|
| Frame outer dimensions | 480 mm wide × 560 mm high × 150 mm deep |
| Front inner opening | 440 × 520 mm |
| Frame section | 20 mm square pipe; wall thickness to be confirmed |
| Pot-retaining rods | 12 mm diameter; holes drilled and rods attached to the frame |
| Pot layout | 5 columns × 6 rows (30 pots), observed in the assembly photographs; spacing not yet measured |
| Frame finish | Spray-painted |
| Fan mount | Rear extension frame, fabricated; both exhaust fans mounted on it |
| Electronics | ESP32 + DHT11 + 3-channel relay module, integrated; control logic running (see `docs/electronics-and-control.md`) |
| Water circuit | Water pump with tubing, plus reservoir: installed. Pump ON below 60 % RH, OFF at or above 60 % |
| Airflow | Two exhaust fans on the rear extension frame, blowing room air forward through and around the pots and out of the front (direction confirmed by the team); switched in two temperature stages (28 °C / 35 °C) by the ESP32 + relay |

## Repository Guide

- [`docs/project-overview.md`](docs/project-overview.md) — project motivation, design, working principle, scope and research references.
- [`docs/working-principle.md`](docs/working-principle.md) — evaporative-cooling explanation and factors affecting performance.
- [`docs/design-and-dimensions.md`](docs/design-and-dimensions.md) — dimensions, design assumptions and CAD update plan.
- [`docs/materials-and-components.md`](docs/materials-and-components.md) — components, known specifications and confirmation checklist.
- [`docs/fabrication-and-assembly.md`](docs/fabrication-and-assembly.md) — build sequence and assembly inspection points.
- [`docs/electronics-and-control.md`](docs/electronics-and-control.md) — ESP32/relay/DHT11 roles and the implemented fan and pump control logic.
- [`docs/testing-and-results.md`](docs/testing-and-results.md) — test protocol, record sheet and calculation guidance.
- [`docs/safety-and-maintenance.md`](docs/safety-and-maintenance.md) — practical safety and maintenance considerations.
- [`docs/references.md`](docs/references.md) — research and background sources.
- [`data/test-data-template.csv`](data/test-data-template.csv) — blank CSV header for recording real measurements.
- [`poster/`](poster/) — A1 portrait project poster: [`ClayBreeze_Poster_A1.pdf`](poster/ClayBreeze_Poster_A1.pdf), a [preview PNG](poster/ClayBreeze_Poster_preview.png) and the HTML source (`claybreeze-poster.html`, printed to PDF with headless Chrome).

## Current Build Status

- [x] SolidWorks concept/design created
- [x] Metal frame fabricated
- [x] Holes drilled and 12 mm pot-retaining rods attached
- [x] Fan mount fabricated
- [x] Frame spray-painted
- [x] Clay pots fixed into the frame
- [x] Two exhaust fans mounted
- [x] Water pump with tubing, plus reservoir, installed
- [x] ESP32, DHT11 and 3-channel relay module integrated
- [x] Prototype fully assembled
- [x] Control logic running on the ESP32 (two-stage fans at 28 °C / 35 °C; pump below 60 % RH)
- [ ] Firmware source added to this repository
- [ ] As-built measurements of the frame recorded (visual inspection done)
- [ ] CAD model updated to match the as-built assembly
- [ ] Performance testing: baseline and wetted-pot runs (temperature, humidity, airflow, water use)
- [ ] Test data analysed and results documented

Checkboxes are project tracking notes and should be updated only when the relevant step is completed.

## Suggested First Test

Once the assembly is safe to operate, compare a fan-only/dry-media condition with a wetted-pot condition where practical. Keep sensor positions, fan setting, test duration and setup as consistent as possible. Record inlet/outlet temperature and relative humidity, ambient conditions, pump/fan settings, reservoir levels and any leakage or uneven wetting. Do not enter estimated values as measured results.

## Project Media and CAD

Real workshop photographs are in `media/photos/`, and real SolidWorks screenshots are in `media/cad-screenshots/` (see that folder's README for the current list) — both are integrated into the website's galleries.

## Website

`index.html` is a static presentation website (no build step, no external requests). It includes an interactive 3D visualisation of the assembly built procedurally in `assets/js/model.js` from the documented dimensions and measurements of the SolidWorks GLB export (`assets/models/claybreeze-assembly.glb`), which the hero crossfades to and the explorer can show as "SolidWorks model". The export contains no fans, so fan size/position and the tub, pump and tubing (estimated from photographs) remain approximate; see the page's "Model notes". The 3D library is three.js 0.160.0, vendored in `assets/vendor/three/` with its MIT `LICENSE`. See `WEBSITE_GUIDE.md`. Export drawings or neutral CAD formats into `cad/exports/` where useful. Keep native CAD files in `cad/native-files/` only if you intend to version them in this repository; large binaries may be better stored separately or via Git LFS. See the folder README files for guidance.

## Research Context

ClayBreeze was inspired in part by reporting on Project Vaayu, a separate student initiative using upcycled clay cups and recirculating water. That project's results are not evidence of ClayBreeze performance. Refer to [`docs/project-overview.md`](docs/project-overview.md) and [`docs/references.md`](docs/references.md) for sources.

## License

No license has been selected yet. Before making the repository public, decide how you want others to be allowed to reuse your documentation, designs and any original code.
