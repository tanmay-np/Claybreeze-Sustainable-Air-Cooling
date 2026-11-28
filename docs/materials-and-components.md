# Materials and Components

This document lists the materials and components of the prototype. Record nameplate specifications from the parts themselves, never estimates.

| Item | Current information | Status / required confirmation |
|---|---|---|
| Square metal pipe | 20 mm square section used for frame | Frame fabricated and spray-painted |
| Pot-retaining rods | 12 mm diameter | **Completed** — holes drilled and rods attached to the frame |
| Fan mount | Rear extension frame welded behind the main frame; carries both fans | **Completed** |
| Clay pots | Small hollow-through, unglazed pots | **Fixed into the frame** — 30 pots, 5 × 6 (observed in photographs); measure spacing, dimensions, mass and fit |
| Electronics (control) | ESP32, 3-channel relay module, DHT11 sensor, breadboard, jumper wires | Integrated; control logic IMPLEMENTED and running. Wiring table and logic: `docs/electronics-and-control.md`; firmware: `firmware/` |
| Water pump / motor | Installed; switched on humidity by the ESP32 + relay | Record manufacturer/model, rated voltage, power, flow rate, maximum head and outlet size from label/manual |
| Rear fans | Two exhaust fans on the rear extension frame, blowing room air forward through the pot array | Each fan has its own relay channel (Fan 1: ON above 26 °C, OFF at or below 25 °C; Fan 2: ON above 30 °C, OFF at or below 29 °C). Record model, dimensions, voltage, power, rated airflow and mounting details from label/manual. Secure the supply cables before powered testing |
| Reservoir/tub | Installed | Installed under the frame |
| Main tubing | Pump-to-distributor path; installed | Record length, inner diameter, material and pressure suitability |
| Distribution header/branches | Intended to wet pot array | Layout and outlet count chosen from wetting tests (future scope) |
| Connectors and clamps | Needed as applicable | Match to selected tubing and pump outlet; avoid leaks and accidental release |
| Flow-control valve | Potentially useful | Select only if needed to control flow after testing |
| Pump inlet screen/filter | Potentially useful | Ensure it does not restrict pump flow beyond its instructions |
| Fan guards | Recommended for exposed moving blades | Fit suitable guard(s) that do not excessively block airflow |
| Electrical connectors/enclosure | Depends on pump/fan/relay ratings and layout | Keep away from splash/runoff; electrical setup must suit actual voltage and environment |

## Recording Specifications

For each component, record make/model (if present), rated voltage, rated power, dimensions, connection size, purchase/source, price if known, and any manual or datasheet link. Do not substitute estimates for nameplate values.

## Cost Record

The full cost sheet is in [`cost-sheet.md`](cost-sheet.md) (data: `data/cost-sheet.csv`): about ₹4,793 in materials.

A project cost comparison should use actual receipts or recorded prices and define what is included. Do not claim the prototype is cheaper than a commercial system until the scope and cost basis are comparable.
