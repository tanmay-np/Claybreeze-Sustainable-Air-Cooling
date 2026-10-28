# ClayBreeze — A Sustainable Clay-Based Air-Cooling System

**Live site:** https://tanmay-np.github.io/Claybreeze-Sustainable-Air-Cooling/

> A Makerspace prototype exploring porous clay as a wetted medium for direct evaporative cooling.

**Project status: Prototype assembled — testing pending.** The metal frame is fabricated and painted, the six 12 mm pot-retaining rods are attached, the rear fan-mount extension is fabricated with both exhaust fans mounted on it, and 30 clay pots (5 columns × 6 rows, observed in the assembly photographs) are fixed into the frame. The pump, reservoir and tubing are installed (reported by team; photo evidence pending); water circulation is **PENDING** — not yet commissioned or verified. An ESP32 + relay module + DHT11 sensor are wired on a breadboard, and the fan rule is IMPLEMENTED (reported) — the firmware is not yet in this repository and the behaviour has not been verified. Remaining work: staged commissioning, control-behaviour verification, as-built measurement, performance testing, and updating the SolidWorks model (PENDING). No cooling-performance result is claimed until the prototype is tested.

## Student

Group 17, Sanjivani University Makerspace.

Tanmay Nilesh Pendbhaje  
PRN 2126UMEM1002  
FY B.Tech Mechanical Engineering  
Sanjivani University

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
| Electronics | ESP32 + relay module + DHT11, wired on breadboard; fan rule IMPLEMENTED (reported) — firmware not yet in repository; not verified (see `docs/electronics-and-control.md`) |
| Water circuit | Pump, reservoir and tubing: installed (reported by team; photo evidence pending). Water circulation: **PENDING** — not yet commissioned or verified |
| Airflow | Two exhaust fans on the rear extension frame, blowing room air forward through and around the pots and out of the front (direction confirmed by the team); reported as switched on temperature by the ESP32 + relay (not verified) |

## Repository Guide

- [`docs/project-overview.md`](docs/project-overview.md) — project motivation, design, working principle, scope and research references.
- [`docs/working-principle.md`](docs/working-principle.md) — evaporative-cooling explanation and factors affecting performance.
- [`docs/design-and-dimensions.md`](docs/design-and-dimensions.md) — dimensions, design assumptions and CAD update plan.
- [`docs/materials-and-components.md`](docs/materials-and-components.md) — components, known specifications and confirmation checklist.
- [`docs/fabrication-and-assembly.md`](docs/fabrication-and-assembly.md) — build sequence and assembly inspection points.
- [`docs/electronics-and-control.md`](docs/electronics-and-control.md) — ESP32/relay/DHT11 roles, current fan-control logic, and planned/proposed control logic.
- [`docs/testing-and-results.md`](docs/testing-and-results.md) — test protocol, record sheet and calculation guidance.
- [`docs/safety-and-maintenance.md`](docs/safety-and-maintenance.md) — practical safety and maintenance considerations.
- [`docs/references.md`](docs/references.md) — research and background sources.
- [`data/test-data-template.csv`](data/test-data-template.csv) — blank CSV header for recording real measurements.

## Current Build Status

- [x] SolidWorks concept/design created
- [x] Metal frame fabricated
- [x] Holes drilled and 12 mm pot-retaining rods attached
- [x] Fan mount fabricated
- [x] Frame spray-painted
- [x] Clay pots fixed into the frame
- [x] ESP32 + relay + DHT11 wired; fan rule programmed (reported — firmware not yet in repository, not verified)
- [x] Pump, reservoir and tubing installed (reported by team; photo evidence pending)
- [ ] Loose fan cable secured and terminated before powered testing
- [ ] As-built measurements of the frame recorded (visual inspection done)
- [ ] CAD model updated to match the as-built assembly (pending)
- [ ] Staged commissioning completed (pending)
- [ ] Water circulation commissioned: distribution and return path leak-checked and verified
- [ ] Airflow direction and bypass checked
- [ ] Humidity-based pump control implemented and validated (currently only proposed)
- [ ] Baseline and wetted-pot testing completed
- [ ] Test data analysed and results documented

Checkboxes are project tracking notes and should be updated only when the relevant step is completed.

## Suggested First Test

Once the assembly is safe to operate, compare a fan-only/dry-media condition with a wetted-pot condition where practical. Keep sensor positions, fan setting, test duration and setup as consistent as possible. Record inlet/outlet temperature and relative humidity, ambient conditions, pump/fan settings, reservoir levels and any leakage or uneven wetting. Do not enter estimated values as measured results.

## Project Media and CAD

Real workshop photographs are in `media/photos/`, and real SolidWorks screenshots are in `media/cad-screenshots/` (see that folder's README for the current list) — both are integrated into the website's galleries.

## Website

`index.html` is a static presentation website (no build step, no external requests). It includes an interactive 3D visualisation of the assembly built procedurally in `assets/js/model.js` from the documented dimensions and measurements of the SolidWorks GLB export (`assets/models/claybreeze-assembly.glb`), which the hero crossfades to and the explorer can show as "SolidWorks model". The export contains no fans, so fan size/position and all water-system positions remain approximate; see the page's "Model notes". The 3D library is three.js 0.160.0, vendored in `assets/vendor/three/` with its MIT `LICENSE`. See `WEBSITE_GUIDE.md`. Export drawings or neutral CAD formats into `cad/exports/` where useful. Keep native CAD files in `cad/native-files/` only if you intend to version them in this repository; large binaries may be better stored separately or via Git LFS. See the folder README files for guidance.

## Research Context

ClayBreeze was inspired in part by reporting on Project Vaayu, a separate student initiative using upcycled clay cups and recirculating water. That project's reported results are not evidence of ClayBreeze performance. Refer to [`docs/project-overview.md`](docs/project-overview.md) and [`docs/references.md`](docs/references.md) for sources.

## License

No license has been selected yet. Before making the repository public, decide how you want others to be allowed to reuse your documentation, designs and any original code.
