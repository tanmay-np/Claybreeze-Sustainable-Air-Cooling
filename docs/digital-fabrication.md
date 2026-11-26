# Digital Fabrication — 3D Printing and Laser Cutting

What the team learned and practised on the digital-fabrication machines at Tinkerers' Lab, Sanjivani University, alongside the ClayBreeze build.

> **Learning reference:** [Dr. Kiran Wakchaure's Fab Academy documentation](https://fabacademy.org/2022/labs/vigyanashram/students/kiran-wakchaure/about.html) (Fab Academy 2022, Vigyan Ashram). Everything on this page is written in our own words; no text or images are copied from it.

**Relevance to ClayBreeze**

| Process | Status in the prototype |
|---|---|
| 3D printing (FDM) | **Not used in the prototype.** Learned and practised at Tinkerers' Lab; none of the lab photographs shows a ClayBreeze part. |
| Laser cutting | **Planned components.** No laser-cut part has been designed or cut for ClayBreeze yet; parts and settings will be recorded here once they exist. |

Lab machines: Bambu Lab **H2D**, **P1S**, **A1** and **A1 mini** (FDM 3D printers) and a **SIL CO2 laser cutter, 100 W**.

---

## 1. 3D printing (FDM)

Fused deposition modelling (FDM) melts a plastic filament in a heated nozzle and lays it down line by line, layer by layer, until the part is built.

### 1.1 Workflow

1. **CAD** — model the part (for example in SolidWorks). Design for printing: a flat face on the plate, overhangs kept to about 45° or less where possible, and clearance between parts that must fit together.
2. **Export** — save as **STL** (a triangle mesh) or **3MF** (mesh plus units, colours and plate settings; Bambu Studio's native project format).
3. **Slice** — in **Bambu Studio**, choose the printer, nozzle, plate and filament profile, set the parameters below, then preview the layers and check time and material before sending the job.
4. **Print** — clean the build plate, load the filament (or the AMS), start the job and watch the first layer; it decides whether the print succeeds.
5. **Post-process** — let the plate cool, flex it to release the part, remove supports and brim, deburr or sand, and test-fit.

### 1.2 Key parameters

| Parameter | What it does |
|---|---|
| Layer height | Thickness of each layer; thinner layers give smoother curves but take longer (0.2 mm is the usual default for a 0.4 mm nozzle). |
| First-layer height | Height of the first layer; kept equal to or a little thicker than normal layers so it tolerates small bed variations and sticks well. |
| Nozzle diameter | Sets the line width; 0.4 mm is the default, 0.2 mm for fine detail, 0.6–0.8 mm for faster, stronger prints. |
| Nozzle temperature | Must match the filament: too cold gives weak layers and under-extrusion, too hot gives stringing and oozing. |
| Extruder | Direct drive: the feed motor sits on the toolhead and pushes filament straight into the hotend, which controls retraction well and handles flexible TPU (Bambu Lab describes the P1 series this way); the H2D has two nozzles, so one job can use two materials or colours. |
| Heatbed temperature | A warm bed holds the first layer down and reduces warping; the value depends on the material. |
| Build plate | The plate surface (textured PEI, smooth PEI, cool or high-temperature plate) is chosen to suit the material and the finish wanted on the bottom face. |
| Infill % and pattern | How solid the inside is; 10–20 % is enough for display parts, more for loaded parts; patterns such as grid, gyroid or cubic trade speed against strength in different directions. |
| Wall / perimeter count | Number of outline loops; most of a part's strength comes from its walls, so adding walls often helps more than adding infill. |
| Top / bottom layers | Solid skin layers that close the part; too few leave gaps or a bumpy top surface over the infill. |
| Supports | Temporary structures under steep overhangs and long bridges; they leave marks where they are removed, so orient the part to need as few as possible. |
| Brim / raft | A brim adds flat loops around the first layer to help small, tall or warp-prone parts stick; a raft is a sacrificial base under the part, rarely needed on PEI plates. |
| Print speed | Faster printing saves time but can cost surface quality and accuracy; the slicer profile limits speed to what the hotend can melt. |
| Cooling fan | The part-cooling fan solidifies each line quickly: high for PLA (crisp overhangs), low for ABS/ASA (stops layers splitting). |

### 1.3 Common materials

Typical ranges only — always use the values printed on the filament spool or in its slicer profile.

| Material | Nozzle (°C) | Bed (°C) | Notes |
|---|---|---|---|
| PLA | 190–230 | 35–65 | Easiest to print, stiff, little warping; softens at around 55–60 °C, so not for hot places. |
| PETG | 220–260 | 65–80 | Tougher and more heat- and water-tolerant than PLA; strings more. |
| ABS / ASA | 240–280 | 90–110 | Heat-resistant (ASA is also UV-stable); needs an enclosed printer and ventilation because of warping and fumes. |
| TPU | 210–240 | 30–60 | Flexible; print slowly with a direct-drive extruder. |

### 1.4 Lab printers — comparison

Values are from official Bambu Lab pages (URLs in [references.md](references.md), items 15–20). Where a value was not stated on those pages, it says "see manufacturer".

| | H2D | P1S | A1 | A1 mini |
|---|---|---|---|---|
| Build volume (W × D × H) | 325 × 320 × 325 mm (one nozzle); 300 × 320 × 320 mm (both nozzles); 350 × 320 × 320 mm total | 256 × 256 × 256 mm | 256 × 256 × 256 mm | 180 × 180 × 180 mm |
| Enclosure | Enclosed, active chamber heating to 65 °C | Enclosed (plastic and glass) | Open frame — see manufacturer | Open frame — see manufacturer |
| Nozzle(s) | Two; 0.4 mm included (0.2 / 0.6 / 0.8 mm supported) | One; 0.4 mm included (0.2 / 0.6 / 0.8 mm optional) | One; 0.4 mm included (0.2 / 0.6 / 0.8 mm optional) | One; 0.4 mm included (0.2 / 0.6 / 0.8 mm optional) |
| Max nozzle temperature | 350 °C | 300 °C | 300 °C | 300 °C |
| Max bed temperature | 120 °C | 100 °C | 100 °C | 80 °C |
| AMS support | Yes — AMS 2 Pro, AMS HT | Yes — AMS (up to 16 colours with 4 units) | Yes — AMS lite | Yes — AMS lite |

"Open frame" for the A1 and A1 mini is what the photographs show; the official spec tables list no enclosure for either.

---

## 2. Laser cutting

A CO2 laser focuses an infrared beam onto a sheet to vaporise or burn a narrow line through it (cutting) or into its surface (engraving).

### 2.1 Workflow

1. **2D design** — draw closed outlines in CAD or Inkscape and export **DXF** or **SVG**; put cut lines, score lines and engraved areas on separate colours or layers, and remove duplicate lines.
2. **Laser software** — import the file into the machine's laser software (for example RDWorks or LightBurn) and assign power, speed and the operation to each layer.
3. **Material setup** — confirm the sheet is laser-safe (see 2.3), measure its thickness and lay it flat on the honeycomb bed, weighing down any warp.
4. **Focus** — set the lens-to-material distance with the focus gauge so the beam is smallest at the material surface.
5. **Cut / engrave** — trace the job boundary, close the lid, switch on extraction and air assist, run a small test on scrap, then run the job and stay with the machine.
6. **Inspect** — check that parts are cut through before moving the sheet, measure the kerf and test the fits, and note the settings that worked.

### 2.2 Laser parameters

| Parameter | What it does |
|---|---|
| Power % | Share of the tube's maximum output; more power cuts deeper but widens the kerf and chars edges. |
| Speed | How fast the head moves; slower means more energy per millimetre. Power and speed are tuned together on a test grid for each material. |
| Frequency / PPI | Pulse rate (Hz) or pulses per inch; lower values tend to reduce charring on wood, higher values give smoother edges on acrylic. |
| Focus / focal length | The lens focal length sets where the beam is narrowest; the material surface must sit at that point. A shorter lens gives a finer spot but less depth for thick sheets. |
| Kerf | The width of material the beam removes, usually a few tenths of a millimetre; it makes holes slightly larger and parts slightly smaller than drawn. |
| Kerf compensation | Offsetting the cut path by half the measured kerf so press-fit slots and tabs come out at the drawn size; measure kerf by cutting a known pattern and measuring with callipers. |
| Vector cut vs raster engrave | A vector cut follows a line and goes through the sheet (or scores it at low power); a raster engrave sweeps back and forth line by line to burn an image or filled area into the surface. |
| Air assist | A jet of air at the nozzle blows away smoke and flame, gives cleaner edges and protects the lens. |
| Passes | Repeating the same path; two moderate passes can cut thicker stock with less charring than one slow pass, provided the sheet does not move. |

The learning reference characterised its own 80 W SIL laser this way: cutting a grid of test squares at different power and speed settings, then measuring the parts to find each material's kerf (roughly 0.1–0.3 mm for MDF, plywood, cardboard and acrylic on that machine). The same test should be repeated on the Tinkerers' Lab machine before cutting any press-fit part.

### 2.3 Materials

| Suitable | Never cut |
|---|---|
| MDF | PVC and vinyl — release chlorine gas, which is toxic and corrodes the machine |
| Plywood | Polycarbonate — burns and discolours instead of cutting cleanly |
| Acrylic (PMMA) | Coated metals — a CO2 laser does not cut metal, and coatings can reflect the beam or give off fumes |
| Cardboard | Any sheet whose material is unknown |
| Paper | |

### 2.4 Lab machine

| | SIL CO2 laser cutter |
|---|---|
| Type | CO2 laser cutter |
| Laser power | 100 W |
| Bed size | [to confirm from machine label] |
| Model / other specifications | [to confirm from machine label] |

---

## 3. Safety (both machines)

- **Ventilation and fume extraction** — run the laser's exhaust whenever it cuts, and wait for the fumes to clear before opening the lid; print ABS/ASA only in an enclosed printer in a ventilated room.
- **Never leave a laser unattended** while it is running, even for a moment.
- **Fire-watch** — stay with the laser, keep the bed clear of offcuts, know where the extinguisher is, and stop the job if a flame does not go out by itself.
- **PPE** — keep the laser lid closed (it is the beam shield); wear safety glasses and gloves when removing supports, sanding or handling sharp offcuts; tie back hair and loose clothing.
- **Hot-end and bed burns** — nozzles reach 300–350 °C and beds up to 120 °C; do not touch the toolhead or plate during or right after a print, and let parts cool before removing them.
- Use only approved materials and the settings recorded for them.

---

## 4. Lab photographs

All photographs are in [`media/fabrication-lab/`](../media/fabrication-lab/) and in the website gallery under **3D Printing** and **Laser Cutting**. They show the lab's machines and practice or demonstration work made at Tinkerers' Lab — **none shows a part made for ClayBreeze**.

- 3D printing: the four Bambu Lab printers, and printed practice pieces (figurines, an articulated dragon, a university-emblem plaque, framed motifs, a rocket model and a small mechanism wired to a microcontroller on a breadboard). Two short videos show printed parts.
- Laser cutting: the SIL laser cutter and its bed and head, an engraving in progress, edge-lit engraved acrylic pieces, an engraved acrylic badge, cut lettering and an MDF finger-joint pen holder.
