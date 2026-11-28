# ClayBreeze — A Sustainable Clay-Based Air-Cooling System

**Live site:** https://tanmay-np.github.io/Claybreeze-Sustainable-Air-Cooling/  
**Poster (PDF):** [poster/ClayBreeze_Poster_Stanford.pdf](poster/ClayBreeze_Poster_Stanford.pdf)  
**Project report (PDF):** [report/ClayBreeze_Project_Report.pdf](report/ClayBreeze_Project_Report.pdf)

> A Makerspace prototype exploring porous clay as a wetted medium for direct evaporative cooling.

**Project status: Build complete — control logic running.** The metal frame is fabricated and painted, the six 12 mm pot-retaining rods are attached, the rear fan-mount extension carries both exhaust fans, and 30 clay pots (5 columns × 6 rows) are fixed into the frame. The water pump with tubing and the reservoir are installed. An ESP32, a DHT11 sensor and a 3-channel relay module are integrated, and the control logic is running on the ESP32 with hysteresis: Fan 1 ON above 26 °C and OFF at or below 25 °C; Fan 2 ON above 30 °C and OFF at or below 29 °C; the water motor ON below 75 % RH and OFF at or above 77 % RH; between the limits each output keeps its previous state. The firmware is in [`firmware/`](firmware/). No cooling-performance result is claimed.

## Student

Group 17, Sanjivani University Makerspace.

Tanmay Nilesh Pendbhaje  
FY B.Tech Mechanical Engineering  
Sanjivani University

Project Guide: Dr. Kiran Wakchaure

## Overview

**The problem.** Summer heat in Indian homes, classrooms and workshops is a real problem, and affordable cooling is limited ([India Cooling Action Plan, 2019](https://ozonecell.nic.in/india-cooling-action-plan)). Air conditioners are expensive to buy and run, draw high power and use refrigerants with climate impact, so many households and schools cannot use them. Pad-type coolers do cool, but their honeycomb/cellulose pads clog with scale and dust and need replacing, and grass (khus / wood-wool) pads can grow mould and bacteria, smell, attract insects, become a fire risk when dry and need frequent replacement.

**Our solution.** ClayBreeze uses 30 porous, unglazed terracotta pots — natural, locally made, reusable and biodegradable — as the wetted evaporative medium, with a recirculating tub–pump–tubing water system and ESP32 control (each fan switched on temperature and the pump on humidity, with hysteresis). The design aim is low cost, low power, no pad replacement and an eco-friendly build. **These are aims, not results:** performance has not been measured, and no cooling or cost-saving result is claimed.

Inspired by reporting on Project Vaayu, a separate student initiative — see [`docs/project-overview.md`](docs/project-overview.md).

**Method — CAD first.** The prototype was modelled and checked in SolidWorks first (parts, assembly and a dimensioned drawing), then fabricated step by step. The website and the report follow the same order: problem → how it works → CAD and design → interactive 3D model → build journey → electronics (wiring, control and the laser-cut enclosure) → test method → safety → status → project gallery, followed by the separate Makerspace Workbench.

## Current Design Snapshot

| Parameter | Current information |
|---|---|
| Frame outer dimensions | 480 mm wide × 560 mm high × 150 mm deep |
| Front inner opening | 440 × 520 mm |
| Frame section | 20 mm square pipe |
| Pot-retaining rods | 12 mm diameter; holes drilled and rods attached to the frame |
| Pot layout | 5 columns × 6 rows (30 pots), observed in the assembly photographs |
| Frame finish | Spray-painted |
| Fan mount | Rear extension frame, fabricated; both exhaust fans mounted on it |
| Electronics | ESP32 + DHT11 + 3-channel relay module on a breadboard (wiring below); control logic running; firmware in `firmware/` |
| Water circuit | Water pump with tubing, plus reservoir: installed. Water motor ON below 75 % RH, OFF at or above 77 % RH |
| Airflow | Two exhaust fans on the rear extension frame, blowing room air forward through and around the pots and out of the front (direction confirmed by the team); Fan 1 ON above 26 °C / OFF at or below 25 °C, Fan 2 ON above 30 °C / OFF at or below 29 °C, via the ESP32 + relay |

## ESP32 Wiring

| Breadboard | ESP32 GPIO | Connected to |
|---|---|---|
| 7A | GPIO32 | DHT11 DATA |
| 9A | GPIO25 | Relay IN1 – Fan 1 |
| 10A | GPIO26 | Relay IN2 – Fan 2 |
| 11A | GPIO27 | Relay IN3 – Water motor |
| 14A | GND | Common ground |

DHT11:

- VCC → ESP32 3.3V; DATA → GPIO32 (7A); GND → common GND

Relay module:

- IN1/IN2/IN3 → GPIO25/26/27
- VCC → the module's rated supply (5 V typical); GND → common GND
- Active-low (LOW = ON)

## Control Logic (with hysteresis)

| Output | ON | OFF | Between the limits |
|---|---|---|---|
| Fan 1 (IN1, GPIO25) | above 26 °C | at or below 25 °C | keeps its previous state |
| Fan 2 (IN2, GPIO26) | above 30 °C | at or below 29 °C | keeps its previous state |
| Water motor (IN3, GPIO27) | below 75 % RH | at or above 77 % RH | keeps its previous state |

The website's **Circuit & Control Lab** animates this circuit and runs the same logic (simulator — not connected to hardware).

## Repository Guide

- [`docs/project-overview.md`](docs/project-overview.md) — project motivation, design, working principle, scope and research references.
- [`docs/working-principle.md`](docs/working-principle.md) — evaporative-cooling explanation and factors affecting performance.
- [`docs/design-and-dimensions.md`](docs/design-and-dimensions.md) — dimensions, design assumptions and CAD update plan.
- [`docs/materials-and-components.md`](docs/materials-and-components.md) — components, known specifications and confirmation checklist.
- [`docs/fabrication-and-assembly.md`](docs/fabrication-and-assembly.md) — build sequence and assembly inspection points.
- [`docs/digital-fabrication.md`](docs/digital-fabrication.md) — Makerspace Workbench — 3D Printing & Laser Cutting at Tinkerers' Lab: FDM motion types (bed-slinger vs CoreXY), laser head motion, uni- vs bidirectional engraving, and the laser-cut 3 mm MDF enclosure for the electronics (DXF files).
- [`docs/solidworks-to-dxf.md`](docs/solidworks-to-dxf.md) — From SolidWorks to Laser Cutter: exporting DXF files in eight steps (menu paths from the SOLIDWORKS help), with the enclosure as the worked example.
- [`cad/dxf-enclosure/`](cad/dxf-enclosure/) — DXF of the laser-cut electronics enclosure: 6 finger-jointed panels for a 120 × 150 × 100 mm box in 3 mm MDF.
- [`docs/electronics-and-control.md`](docs/electronics-and-control.md) — ESP32/relay/DHT11 roles, the breadboard wiring table and the implemented fan and pump control logic with hysteresis.
- [`firmware/`](firmware/) — the ESP32 sketch [`claybreeze_controller.ino`](firmware/claybreeze_controller/claybreeze_controller.ino) and its [README](firmware/README.md) (pins, active-low relays, libraries, upload).
- [`docs/testing-and-results.md`](docs/testing-and-results.md) — test method, record sheet and calculation guidance.
- [`docs/safety-and-maintenance.md`](docs/safety-and-maintenance.md) — practical safety and maintenance considerations.
- [`docs/references.md`](docs/references.md) — research and background sources.
- [`data/test-data-template.csv`](data/test-data-template.csv) — blank CSV header for recording real measurements.
- [`poster/`](poster/) — project poster [`ClayBreeze_Poster_Stanford.pdf`](poster/ClayBreeze_Poster_Stanford.pdf) (36 × 24 in, LaTeX source in `poster/stanford/`, built on the MIT-licensed [stanford_beamer_poster](https://github.com/sanhacheong/stanford_beamer_poster) template, without Stanford logos). The earlier A1 version is kept: [`ClayBreeze_Poster_A1.pdf`](poster/ClayBreeze_Poster_A1.pdf) (HTML source `claybreeze-poster.html`).
- [`report/`](report/) — final project report [`ClayBreeze_Project_Report.pdf`](report/ClayBreeze_Project_Report.pdf), LaTeX source `report/main.tex`. Shared LaTeX figures (schematic, CAD crops, QR) are in `latex-shared/`. Build with `pdflatex` (MiKTeX/TeX Live), run twice.

## Current Build Status

Completed:

- SolidWorks concept/design created
- Metal frame fabricated
- Holes drilled and 12 mm pot-retaining rods attached
- Fan mount fabricated
- Frame spray-painted
- Clay pots fixed into the frame
- Two exhaust fans mounted
- Water pump with tubing, plus reservoir, installed
- ESP32, DHT11 and 3-channel relay module integrated
- Prototype fully assembled
- Control logic running on the ESP32 with hysteresis (Fan 1: 26/25 °C, Fan 2: 30/29 °C, water motor: 75/77 % RH)
- ESP32 firmware in this repository (`firmware/claybreeze_controller/`), compiled for the ESP32 Dev Module

## Future Scope

- **Performance measurement:** dry-pot baseline and wetted-pot runs — inlet and outlet temperature and humidity, airflow, water use.
- **Data logging:** record DHT11 readings and relay states over time (CSV template in `data/`).
- **IoT monitoring:** use the ESP32's Wi-Fi to show readings and fan/pump states on a phone.
- **Improvements:** water-level sensor with a pump dry-run cut-out, as-built measurements fed back into the SolidWorks model, and the electronics fitted in the laser-cut 3 mm MDF enclosure (DXF files).

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
