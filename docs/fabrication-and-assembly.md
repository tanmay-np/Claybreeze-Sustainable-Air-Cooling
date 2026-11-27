# Fabrication and Assembly Log

## Current Status

- Metal frame: fabricated (20 mm square pipe, cut and welded).
- Frame inspection: visual inspection done.
- Pot-retaining rods: holes drilled and six 12 mm rods **attached**.
- Fan mount: rear extension frame fabricated; both exhaust fans mounted on it.
- Frame finish: spray-painted.
- Clay pots: 30 pots (5 columns × 6 rows, observed in the assembly photographs) fixed into the frame.
- Water system: water pump (motor) with tubing, plus reservoir — **installed**.
- Electronics: ESP32, DHT11 and 3-channel relay module — **integrated**; control logic **IMPLEMENTED** and running (see `docs/electronics-and-control.md`).
- Prototype: **fully assembled**.
- Future scope: performance measurement, and updating the CAD model to the as-built assembly.
- Observed in the earlier assembly photographs: the fan supply cable was loose at the top of the frame. Check that all fan and pump cables are secured and terminated before powered testing.

## Recommended Assembly Sequence

### 1. Inspect the Frame — visual inspection done

Measure and record the as-built width, height, depth and clear opening. Check squareness, joints, wobble, sharp edges and coating condition. Resolve structural concerns before adding wet clay pots or powered components.

### 2. Fabricate and Attach the Retaining Rods — done

Confirm the final rod layout, cut lengths, attachment locations and clearances from the actual pots and frame. Keep a record of the final measurements and attachment method. Holes were drilled and the six 12 mm rods attached; inspect the joints and check that rods retain pots securely without putting damaging stress on them.

### 3. Fabricate and Attach the Fan Mount — done

The fan mount is a rear extension frame welded behind the main frame; both exhaust fans are mounted on it. Record each fan's outside dimensions, hole pattern, airflow direction, model and electrical rating. Fit appropriate guards over accessible moving blades and check that the mounting arrangement does not obstruct the intended air path. Prevent water spray and runoff from reaching motors, connectors or controls.

### 4. Finish the Frame — done

The frame has been spray-painted. Allow the finish to cure fully, in a ventilated area, before fitting electronics or wet components, and check the finish doesn't flake into the clean water path.

### 5. Fit the Clay Pots — done

Arrange the actual pots without forcing them into place. Check spacing, alignment, opening clearance and access for cleaning. Ceramic pots can crack if point-loaded or clamped too tightly; use suitable support or padding where necessary. 30 pots are fixed into the frame in 5 columns × 6 rows (observed in the assembly photographs); record the measured spacing.

### 6. Integrate the Control Electronics — done

The DHT11, ESP32 and 3-channel relay module are integrated and drive the two fans and the water pump. The control logic running on the ESP32 switches the outputs with hysteresis — Fan 1 ON above 26 °C and OFF at or below 25 °C; Fan 2 ON above 30 °C and OFF at or below 29 °C; the water motor ON below 60 % RH and OFF at or above 62 % RH; between the limits each output keeps its previous state (see `docs/electronics-and-control.md`, which also gives the breadboard wiring). Firmware: `firmware/claybreeze_controller/`. Keep breadboard and connections away from any splash or runoff path.

### 7. Update CAD to Match the As-Built Assembly — future scope

Measure the actual components (frame, rods, fan mount, pot layout) and update the SolidWorks model and drawing. Mark provisional features as revised and do not represent unmeasured attachment geometry as final. Save dated versions or use Git commits to record significant revisions.

### 8. Install the Water Circuit — done

The water pump (motor) with tubing and the reservoir are installed, and the pump is switched by the ESP32 + relay on humidity. Record the tub, tubing and pump specifications, photograph the installation, and leak-check the circuit during testing (step 9).

### 9. Performance Testing — test method

1. With electrical equipment off, inspect mechanical assembly and all connections, including the breadboard wiring. Secure and terminate the loose fan cable.
2. Check each fan on its own (pump disconnected) around its limits (Fan 1: 26/25 °C, Fan 2: 30/29 °C) and confirm the hysteresis: no rapid relay switching between the limits.
3. Test the water circuit in a controlled manner, checking every distribution outlet, leakage and return flow, with fans off.
4. Switch off and isolate power before adjusting tubing or handling the wet assembly.
5. Test airflow with the water pump off and check fan direction, vibration, obstructions and bypass paths.
6. Only after separate inspections, test the combined system using suitable electrical protection and supervision.
7. Record any changes made and update the CAD and assembly log.

## Fabrication Log

Tasks in build order. The photo filenames and image files carry no dates, so no dates are listed.

| Task | Observation | Photo or drawing link |
|---|---|---|
| Pipe cut to length | — | `media/photos/Frame_pipe_cutting_1.jpeg`, `_2.jpeg`, `_3.jpeg`, `Pipes_Cut_All_1.jpeg` |
| Frame welded | — | `media/photos/Frame_Welding_Stage1.jpeg`, `Frame_Welded_1.jpeg` |
| Drill points centre-punched on the square pipe | — | `media/photos/Drill_Point_Marking_1.jpeg`, `_2.jpeg` |
| Rods and fan-mount extension attached | — | `media/photos/Frame_Rod_Assembled_1.jpeg`, `Frame_Rod_assembled_With_Fan_Extension1.jpeg` |
| Frame spray-painted; fans mounted on the rear extension frame | — | `media/photos/Frame_with_Rod_And_Exhaust_Fan_Colourd.jpeg` |
| 30 clay pots fixed into frame (5 × 6) | Loose, unterminated fan cable visible in photo | `media/photos/Frame_Completely_Assembled_Front_View.jpeg`, `Frame_Completely_Assembled_Side_View.jpeg` |
| Water pump, tubing and reservoir installed | Loose supply cables beside the tub | `media/photos/Water_System_Tub_Front_Left_View.jpeg`, `Water_System_Tub_Front_Right_View.jpeg`, `Water_System_Tub_Side_View.jpeg` |
| ESP32, DHT11 and 3-channel relay module wired on the breadboard; control logic running | Wiring table in `docs/electronics-and-control.md`; firmware in `firmware/` | — |
