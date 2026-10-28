# ClayBreeze — A Sustainable Clay-Based Air-Cooling System

> A Makerspace prototype exploring porous clay as a wetted medium for direct evaporative cooling.

**Project status:** Prototype in progress. The metal frame has been fabricated. Pot-retaining rod attachments and rear fan mounting remain to be completed. Cooling-performance testing has not yet been completed.

## Overview

ClayBreeze investigates whether hollow, unglazed clay pots, supplied with recirculating water and ventilated by two rear-mounted fans, can reduce the temperature of air passing through the assembly. The project focuses on practical fabrication, water distribution, airflow, measurement, and evidence-based evaluation.

Affordability, maintainability, water use, electricity use, and environmental considerations are evaluation goals—not proven advantages. No cooling-performance or cost-saving result is claimed until the prototype is tested.

## Current Design Snapshot

| Parameter | Current information |
|---|---|
| Frame outer dimensions | 480 mm wide × 560 mm high × 150 mm deep |
| Front inner opening | 440 × 520 mm |
| Frame section | 20 mm square pipe; wall thickness to be confirmed |
| Pot-retaining rods | Six planned; 12 mm diameter; final cuts to be confirmed |
| Pot layout | Provisionally 5 columns × 6 rows; verify during fit-up |
| Water circuit | Pump, bottom reservoir, tubing and top distribution intended; installation status to be confirmed |
| Airflow | Two rear-mounted exhaust fans; final mounts and ratings to be confirmed |

## Repository Guide

- [`docs/project-overview.md`](docs/project-overview.md) — project motivation, design, working principle, scope and research references.
- [`docs/working-principle.md`](docs/working-principle.md) — evaporative-cooling explanation and factors affecting performance.
- [`docs/design-and-dimensions.md`](docs/design-and-dimensions.md) — dimensions, design assumptions and CAD update plan.
- [`docs/materials-and-components.md`](docs/materials-and-components.md) — components, known specifications and confirmation checklist.
- [`docs/fabrication-and-assembly.md`](docs/fabrication-and-assembly.md) — build sequence and assembly inspection points.
- [`docs/testing-and-results.md`](docs/testing-and-results.md) — test protocol, record sheet and calculation guidance.
- [`docs/safety-and-maintenance.md`](docs/safety-and-maintenance.md) — practical safety and maintenance considerations.
- [`docs/references.md`](docs/references.md) — research and background sources.
- [`data/test-data-template.csv`](data/test-data-template.csv) — blank CSV header for recording real measurements.

## Current Build Status

- [x] SolidWorks concept/design created
- [x] Metal frame fabricated
- [ ] Pot-retaining rods fabricated and attached
- [ ] Two fan mounts fabricated and fans securely fitted
- [ ] CAD model updated to match the as-built assembly
- [ ] Tub/reservoir and tubing requirements confirmed
- [ ] Water distribution and return path assembled and leak-checked
- [ ] Airflow direction and bypass checked
- [ ] Baseline and wetted-pot testing completed
- [ ] Test data analysed and results documented

Checkboxes are project tracking notes and should be updated only when the relevant step is completed.

## Suggested First Test

Once the assembly is safe to operate, compare a fan-only/dry-media condition with a wetted-pot condition where practical. Keep sensor positions, fan setting, test duration and setup as consistent as possible. Record inlet/outlet temperature and relative humidity, ambient conditions, pump/fan settings, reservoir levels and any leakage or uneven wetting. Do not enter estimated values as measured results.

## Project Media and CAD

Add real, dated photographs and SolidWorks screenshots to `media/`. Export drawings or neutral CAD formats into `cad/exports/` where useful. Keep native CAD files in `cad/native-files/` only if you intend to version them in this repository; large binaries may be better stored separately or via Git LFS. See the folder README files for guidance.

## Research Context

ClayBreeze was inspired in part by reporting on Project Vaayu, a separate student initiative using upcycled clay cups and recirculating water. That project's reported results are not evidence of ClayBreeze performance. Refer to [`docs/project-overview.md`](docs/project-overview.md) and [`docs/references.md`](docs/references.md) for sources.

## License

No license has been selected yet. Before making the repository public, decide how you want others to be allowed to reuse your documentation, designs and any original code.
