# Safety and Maintenance

This document is a practical checklist for a small water-and-fan prototype. Follow component manuals and the workshop's rules. Any electrical installation near water should be reviewed by a qualified person and performed with appropriate supervision and protection.

## Mechanical Safety

- Inspect the frame, welds/joints and supports before loading the assembly.
- Verify that rods retain the pots without point-loading or cracking the ceramic. The rods are now attached and pots fixed in place — inspect this fit for secure retention and absence of cracking before further assembly.
- Remove sharp edges and burrs after fabrication.
- Ensure spray paint is fully cured, in a ventilated area, before the frame is handled extensively or electronics are fitted nearby.
- Keep the frame stable and prevent tipping or movement during use.
- Ensure the fans are securely mounted and accessible moving blades are guarded.
- Switch off and isolate power before adjusting rods, fans, tubing or pots.

## Water and Electrical Safety

- Keep water, splashes and runoff away from fan motors, switches, connectors and power supplies.
- Use equipment with ratings appropriate to the actual environment and setup; do not assume an indoor fan is suitable for wet exposure.
- Keep connectors elevated and protected from spills. Provide suitable drip paths so water cannot run along cables into electrical enclosures.
- Have mains-powered wiring, protective devices and any required grounding/RCD protection checked by a qualified person. Prefer an appropriate low-voltage arrangement when feasible, but verify the actual component ratings.
- Never handle plugs, wiring or electrical controls with wet hands or while standing in water.
- De-energize the system before refilling, cleaning, clearing blockages or repairing leaks.
- Do not run a pump below its required water level or against a blocked outlet; follow the pump manual.
- Do not operate the system unattended until it has been inspected and tested for leakage and electrical safety.

## Control Electronics Safety

- The breadboard, ESP32, relay module and DHT11 are not inherently water-resistant. Keep them physically separated from the pots, reservoir and any tubing, and out of the splash and drip path described above.
- A relay module typically switches mains-side fan/pump power from a low-voltage logic signal — verify the specific module's input/output ratings and isolation from its documentation before wiring anything; this repository does not document GPIO pins, logic levels or wiring connections, so do not assume any until they are recorded from the actual hardware and code.
- Fit an enclosure or secure mounting for the electronics once the layout is finalised, rather than leaving a bare breadboard exposed near a wet assembly.
- Before changing any wiring, isolate power at the source, not just through software — software control (including the ESP32 program) should not be relied on as the sole safety isolation method.
- When a water pump is eventually integrated with the relay/ESP32 system, apply the same isolation and enclosure precautions as for the fans, and re-check wiring before first use.
- See `docs/electronics-and-control.md` for the current and planned control logic; it documents behaviour, not wiring — have the actual wiring reviewed by a competent person before energising it.

## Water Hygiene and Maintenance

- Use clean water and empty the reservoir when the system will not be used for an extended period.
- Prevent standing water from becoming stagnant. Establish a routine for draining, cleaning and drying components.
- Inspect the reservoir, tubing and distributor for dirt, slime, mineral deposits, blockage or leaks.
- Check pump inlet screens and fan guards regularly, with power isolated.
- Clean deposits using materials and methods compatible with the pump, tubing, clay and frame.
- Record cracked pots, corrosion, loose fasteners, unusual vibration, changes in flow or fan noise.
- Avoid adding chemical treatments unless their compatibility and safety have been assessed.

## Operating Checks

Before each test, inspect the frame, pot supports, fan mounts, electrical separation and water connections. During commissioning, observe whether every intended region gets wet and whether return water reaches the tub. Stop and isolate the system if there is leakage onto electrical parts, unstable structure, unusual vibration, overheating, damaged wiring or cracked supports.

## Limitations

This checklist does not replace the component manuals, institutional workshop safety procedures or a competent electrical inspection. The safe design depends on the actual fan and pump ratings, electrical supply, reservoir placement and splash risk.
