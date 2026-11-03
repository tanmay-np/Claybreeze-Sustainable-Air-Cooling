# Materials and Components

This document separates confirmed items from specifications that still need to be recorded. Quantities and specifications should be updated after physical fit-up and before final testing.

| Item | Current information | Status / required confirmation |
|---|---|---|
| Square metal pipe | 20 mm square section used for frame | Frame fabricated and spray-painted; wall thickness and exact material grade to be confirmed if known |
| Pot-retaining rods | 12 mm diameter | **Completed** — holes drilled and rods attached to the frame |
| Fan mount | Rear extension frame welded behind the main frame; carries both fans | **Completed** |
| Clay pots | Small hollow-through, unglazed pots | **Fixed into the frame** — 30 pots, 5 × 6 (observed in photographs); measure spacing, dimensions, mass and fit |
| Electronics (control) | ESP32, 3-channel relay module, DHT11 sensor, breadboard, jumper wires | Integrated; control logic IMPLEMENTED and running. See `docs/electronics-and-control.md` for roles and logic; GPIO assignments, relay ratings and wiring details not documented here |
| Water pump / motor | Installed; switched on humidity by the ESP32 + relay | Record manufacturer/model, rated voltage, power, flow rate, maximum head and outlet size from label/manual |
| Rear fans | Two exhaust fans on the rear extension frame, blowing room air forward through the pot array | Switched in two temperature stages by the relay. Record model, dimensions, voltage, power, rated airflow and mounting details from label/manual. Secure the supply cables before powered testing |
| Reservoir/tub | Installed | Dimensions, capacity, pump clearance and removability to be recorded |
| Main tubing | Pump-to-distributor path; installed | Record length, inner diameter, material and pressure suitability |
| Distribution header/branches | Intended to wet pot array | Final layout and outlet count to be decided after wetting tests |
| Connectors and clamps | Needed as applicable | Match to selected tubing and pump outlet; avoid leaks and accidental release |
| Flow-control valve | Potentially useful | Select only if needed to control flow after testing |
| Pump inlet screen/filter | Potentially useful | Ensure it does not restrict pump flow beyond its instructions |
| Fan guards | Recommended for exposed moving blades | Fit suitable guard(s) that do not excessively block airflow |
| Electrical connectors/enclosure | Depends on pump/fan/relay ratings and layout | Keep away from splash/runoff; electrical setup must suit actual voltage and environment |

## Specifications to Record

For each component, record make/model (if present), rated voltage, rated power, dimensions, connection size, purchase/source, price if known, and any manual or datasheet link. Do not substitute estimates for nameplate values.

## Cost Record Template

| Component | Quantity | Unit cost | Total cost | Source / date | Notes |
|---|---:|---:|---:|---|---|
| Frame material | To record | To record | To record | To record | Fabricated and painted frame |
| Rods | To record | To record | To record | To record | 12 mm, attached to frame |
| Fan mount | To record | To record | To record | To record | Fabricated |
| Spray paint | To record | To record | To record | To record | Frame finish |
| Clay pots | To record | To record | To record | To record | Record any spare/broken pots separately |
| ESP32 | 1 | To record | To record | To record | Record actual model/board |
| Relay module | 1 (3-channel) | To record | To record | To record | Record rating |
| DHT11 sensor | 1 | To record | To record | To record | — |
| Breadboard | To record | To record | To record | To record | — |
| Jumper wires | To record | To record | To record | To record | — |
| Pump | 1 | To record | To record | To record | Installed |
| Fans | 2 | To record | To record | To record | Record actual model |
| Reservoir/tub | 1 | To record | To record | To record | Installed; specification to record |
| Tubing and fittings | To record | To record | To record | To record | Installed; layout to record |
| Other consumables | To record | To record | To record | To record | Welding/finishing/fasteners etc. |

A project cost comparison should use actual receipts or recorded prices and define what is included. Do not claim the prototype is cheaper than a commercial system until the scope and cost basis are comparable.
