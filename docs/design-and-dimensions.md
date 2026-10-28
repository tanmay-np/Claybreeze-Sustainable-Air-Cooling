# Design and Dimensions

## 1. Current Mechanical Envelope

| Parameter | Current value | Status / note |
|---|---:|---|
| Frame outer width | 480 mm | Updated design dimension; verify against fabricated frame |
| Frame outer height | 560 mm | Updated design dimension; verify against fabricated frame |
| Frame depth | 150 mm | Updated design dimension; verify against fabricated frame |
| Front inner opening | 440 × 520 mm | Verify after rod and mount fit-up |
| Frame section | 20 mm square pipe | Wall thickness not yet confirmed |
| Pot-retaining rods | 12 mm diameter | Holes drilled and rods attached — **completed** |
| Frame finish | Spray-painted | **Completed** |
| Pot arrangement | 5 columns × 6 rows (30 pots) | Clay pots are fixed into the frame — **completed**; layout observed in the assembly photographs. Spacing not yet measured |
| Fans | Two exhaust fans on the rear extension frame, blowing room air forward through the pot array | Fan-mount extension fabricated — **completed**; reported as switched by ESP32 + relay on temperature (firmware not yet in repository; not verified — see `docs/electronics-and-control.md`). Model, size, rated airflow and electrical rating still to be recorded |
| Reservoir | Bottom tub | **Installed (reported by team; photo evidence pending)**; capacity, dimensions and mounting still to be confirmed |
| Rear extension (from drawing) | Overall side-view depth 270 mm; extension members 132.5 mm in from each side | Read from the dimensioned SolidWorks drawing; not yet measured on the fabricated frame |

All dimensions should be labelled as design or measured values. Do not describe a design dimension as an as-built measurement until the fabricated part has been measured.

## 2. Design Status

The physical prototype is assembled: the metal frame is fabricated, spray-painted, fitted with the six drilled-and-attached 12 mm pot-retaining rods and the rear fan-mount extension, and 30 clay pots are fixed in place. The pump, reservoir and tubing are installed (reported by team; photo evidence pending); water circulation is PENDING. An ESP32 + relay module + DHT11 sensor are wired, with the fan rule reported as programmed (firmware not yet in repository; not verified). The frame has had a visual inspection; as-built measurements are pending. The remaining work is commissioning, performance testing and control-behaviour verification (see `docs/testing-and-results.md`). Updating the SolidWorks model and engineering drawing to the as-built parts is PENDING — a documentation task, not unfinished construction.

## 3. CAD and Drawing Workflow

1. Measure the fabricated frame, including outer dimensions, clear opening, depth and pipe wall thickness if accessible.
2. Fit the real pots and determine safe retaining points, spacing and clearances. **(Pots are now fixed into the frame — 30 pots, 5 × 6, observed in photographs; record the as-installed spacing.)**
3. Fabricate and attach the rods; record actual rod count, cut length and attachment method. **(Completed — rods drilled and attached.)**
4. Establish fan orientation, mounting-hole pattern, clearances, guards and airflow direction from the actual fan hardware. **(Fan mount fabricated — completed; record model, rating and final orientation.)**
5. Measure the completed assembly and update the SolidWorks model to match it. **(Design-concept screenshots are now available — see Section 5 below — but they have not yet been checked against as-built measurements of the fabricated frame.)**
6. Update the drawing dimensions and identify any differences from the original design. **(The available dimensioned drawing shows 480 × 560 × 150 mm, a 440 mm opening and a ⌀12 mm rod, matching the documented design values. This confirms the CAD design matches the written spec — it is not yet a confirmation that the physical frame measures the same.)**
7. Export a viewable drawing (PDF) and, if useful, a neutral 3D file such as STEP for the repository.

**Naming discrepancy — rod part:** the rod part file is named `20mm_rod` in the SolidWorks model tree, which could be misread as a 20 mm rod diameter. The dimensioned drawing calls the rod out at ⌀12.00 mm, and ⌀12 mm matches the physical rods fitted to the frame. The name is a leftover naming discrepancy (the frame is built from 20 mm square pipe), not a dimension conflict — rename the part in the CAD project when the model is updated; no documented dimension needs to change.

**Other values read from the dimensioned drawing** (not yet measured on the fabricated frame): overall side-view depth 270 mm (150 mm frame plus the rear fan-mount extension); the extension members sit 132.5 mm in from each side of the 480 mm frame; the side view also shows 45, 100, 110 and 120 mm dimensions around the rod-hole member and extension. The drawing does not show a 520 mm dimension — the 440 × 520 mm opening follows from 480 × 560 mm less two 20 mm pipe sections.

## 4. Design Questions to Close

- What is the measured wall thickness of the 20 mm square pipe?
- What are the actual pot height, outer diameter, opening diameter and mass?
- Does the chosen rod layout support each pot securely without cracking the clay?
- How will the fans be guarded and kept clear of water spray?
- Will the rear fans push enough air through the pots (rather than around them), or will a shroud/plenum be needed to reduce bypass?
- What tub dimensions allow for pump submergence and runoff collection without flooding the frame?
- Where will water return to the reservoir, and how will the tub be removed for cleaning?
- Can the pump and fans be accessed separately for inspection and repair?

## 5. Media

`media/cad-screenshots/` now holds seven real SolidWorks screenshots, shown in the website's Design &amp; CAD gallery and under the CAD filter in the main photo gallery:

- `Frame.png` — frame concept, isometric view
- `Rod.png` — pot-retaining rod part model (see the naming discrepancy in Section 3)
- `Clay_Pot.png` — clay-pot (kullad) part model
- `Assebly_Front_View.png` — pot array, front view (5 × 6 layout)
- `Assembly_Isometric_View.png` — full assembly concept, isometric
- `Drawing Sheet1.png` — six-view engineering drawing, undimensioned
- `Drawing Sheet_With_Dimensions.png` — dimensioned drawing (480 × 560 × 150 mm, 440 mm opening, ⌀12 mm rod)

These are design-concept screenshots, not evidence that the physical prototype matches them exactly — as-built measurement against the fabricated frame is still outstanding (Section 3, steps 5–6).

Still to add:
- `cad/exports/`: shareable drawing PDFs and STEP exports.
- `media/photos/`: additional dated photographs as the project progresses (electronics, water system, testing).

Use real project evidence only. If a drawing or photo is not yet available, leave a TODO rather than generating a misleading placeholder image.

## 6. SolidWorks GLB Export (`assets/models/claybreeze-assembly.glb`)

Exported by SOLIDWORKS (glTF 2.0, metres, one material, about 113,000 triangles). It contains the frame with its rear extension (one mesh, `20mm_frame-1`), six rods (`20mm_rod-1…6`) and 30 pots (`kullad_part-1…30`); it contains **no fans**. Measured from the export (CAD values, not as-built measurements):

- Frame 480 × 560 mm, main frame 150 mm deep, overall depth 270 mm with the rear extension — matches the drawing.
- Rear extension members centred ±77.5 mm from the frame centre line (132.5 mm in from the inner face of each side member, as on the drawing), 120 mm deep.
- Rods: ⌀12 mm shaft with a ⌀20 × 1 mm head at one end, 480 mm long, 90 mm apart (±45, ±135, ±225 mm), on the centre plane of the frame — 75 mm behind the front face. (The earlier 45 mm reading of the drawing was wrong.)
- Pots: ⌀80 mm max, 80 mm long, ⌀40 mm openings at both ends, mouths facing the front, 80 mm pitch; the array sits 8.3 mm left of the frame centre in the CAD.

## 7. Website 3D Visualisation

The website's 3D model (`assets/js/model.js`) is built procedurally from the documented values above. Rod spacing and depth, pot size and positions, and the extension positions now come from the GLB export (Section 6). Fan size and position (not in the export), the pot profile curve and all water-system positions remain approximate and are listed in the "Model notes" disclosure on the page. It is a visualisation, not an as-built CAD model.
