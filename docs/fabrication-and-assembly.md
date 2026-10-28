# Fabrication and Assembly Log

## Current Status

- Metal frame: fabricated (20 mm square pipe, cut and welded).
- Frame inspection: visual inspection done; as-built measurements **pending**.
- Pot-retaining rods: holes drilled and six 12 mm rods **attached**.
- Fan mount: rear extension frame fabricated; both exhaust fans mounted on it.
- Frame finish: spray-painted.
- Clay pots: 30 pots (5 columns × 6 rows, observed in the assembly photographs) fixed into the frame.
- Electronics: ESP32 + relay module + DHT11 wired on a breadboard; fan rule **IMPLEMENTED (reported)** — firmware not yet in this repository; not verified (see `docs/electronics-and-control.md`).
- Pump, reservoir and tubing: **installed (reported by team; photo evidence pending)**.
- Water circulation: **PENDING** — not yet commissioned or verified.
- Commissioning: **PENDING**.
- CAD update to the as-built assembly: **PENDING**.
- Observed in the assembly photographs: the fan supply cable is loose at the top of the frame with unterminated ends. Secure and terminate it before any powered testing.

## Recommended Assembly Sequence

### 1. Inspect the Frame — visual inspection done; as-built measurements pending

Measure and record the as-built width, height, depth and clear opening. Check squareness, joints, wobble, sharp edges and coating condition. Resolve structural concerns before adding wet clay pots or powered components.

### 2. Fabricate and Attach the Retaining Rods — done

Confirm the final rod layout, cut lengths, attachment locations and clearances from the actual pots and frame. Keep a record of the final measurements and attachment method. Holes were drilled and the six 12 mm rods attached; inspect the joints and check that rods retain pots securely without putting damaging stress on them.

### 3. Fabricate and Attach the Fan Mount — done

The fan mount is a rear extension frame welded behind the main frame; both exhaust fans are mounted on it. Record each fan's outside dimensions, hole pattern, airflow direction, model and electrical rating. Fit appropriate guards over accessible moving blades and check that the mounting arrangement does not obstruct the intended air path. Prevent water spray and runoff from reaching motors, connectors or controls.

### 4. Finish the Frame — done

The frame has been spray-painted. Allow the finish to cure fully, in a ventilated area, before fitting electronics or wet components, and check the finish doesn't flake into the clean water path.

### 5. Fit the Clay Pots — done

Arrange the actual pots without forcing them into place. Check spacing, alignment, opening clearance and access for cleaning. Ceramic pots can crack if point-loaded or clamped too tightly; use suitable support or padding where necessary. 30 pots are fixed into the frame in 5 columns × 6 rows (observed in the assembly photographs); record the measured spacing.

### 6. Wire and Program the Control Electronics — reported done (fan control only); not verified

Wire the DHT11 to the ESP32, and the ESP32 to the relay module driving the two fans, on the breadboard. The fan rule reported as programmed switches both fans on above 35 °C and off below it; behaviour at exactly 35.0 °C is unconfirmed (see `docs/electronics-and-control.md`). The firmware source is not yet in this repository. Keep breadboard and connections away from any splash or runoff path.

### 7. Update CAD to Match the As-Built Assembly — pending

Measure the actual components (frame, rods, fan mount, pot layout) and update the SolidWorks model and drawing. Mark provisional features as revised and do not represent unmeasured attachment geometry as final. Save dated versions or use Git commits to record significant revisions.

### 8. Install the Water Circuit — installed (reported by team; photo evidence pending)

The pump, tubing and reservoir are reported as installed. Water circulation has not been commissioned or verified. Record the tub, tubing and pump specifications, photograph the installation, and leak-check the circuit during commissioning (step 9). Integrate pump switching with the ESP32/relay system only once the PROPOSED humidity-based logic in `docs/electronics-and-control.md` has been reviewed and implemented.

### 9. Commission in Stages — pending

1. With electrical equipment off, inspect mechanical assembly and all connections, including the breadboard wiring. Secure and terminate the loose fan cable.
2. Test the fan-control electronics on their own (pump disconnected), checking that fans switch at the programmed temperature threshold and that there is no rapid relay chatter near the boundary.
3. Test the water circuit in a controlled manner, checking every distribution outlet, leakage and return flow, with fans off.
4. Switch off and isolate power before adjusting tubing or handling the wet assembly.
5. Test airflow with the water pump off and check fan direction, vibration, obstructions and bypass paths.
6. Only after separate inspections, test the combined system using suitable electrical protection and supervision.
7. Record any changes made and update the CAD and assembly log.

## Fabrication Log Template

| Date | Task | Parts / dimensions changed | Issue observed | Action taken | Photo or drawing link |
|---|---|---|---|---|---|
| To record | Pipe cut to length | As-built lengths to be measured | To record | To record | `media/photos/Frame_pipe_cutting_1.jpeg`, `_2.jpeg`, `_3.jpeg`, `Pipes_Cut_All_1.jpeg` |
| To record | Frame welded | As-built dimensions to be measured | To record | To record | `media/photos/Frame_Welding_Stage1.jpeg`, `Frame_Welded_1.jpeg` |
| To record | Drill points centre-punched on the square pipe | — | To record | To record | `media/photos/Drill_Point_Marking_1.jpeg`, `_2.jpeg` |
| To record | Rods and fan-mount extension attached | Final layout/cut length to be measured | To record | To record | `media/photos/Frame_Rod_Assembled_1.jpeg`, `Frame_Rod_assembled_With_Fan_Extension1.jpeg` |
| To record | Frame spray-painted; fans mounted on the rear extension frame | — | To record | To record | `media/photos/Frame_with_Rod_And_Exhaust_Fan_Colourd.jpeg` |
| To record | 30 clay pots fixed into frame (5 × 6) | Spacing to be measured | Loose, unterminated fan cable visible in photo | To record | `media/photos/Frame_Completely_Assembled_Front_View.jpeg`, `Frame_Completely_Assembled_Side_View.jpeg` |
| To record | ESP32/relay/DHT11 wired; fan rule programmed (reported) | Firmware not yet in repository | To record | To record | Add real photo |

No dates are recorded yet: the photo filenames contain no dates and the image files carry no date metadata. Fill in dates only from a real record (phone gallery, workshop register, messages). "Issue observed" and "Action taken" are still to record for most rows. Do not record planned work as completed work.
