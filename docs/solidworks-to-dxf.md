# From SolidWorks to Laser Cutter — exporting DXF files

Part of the **Makerspace Workbench** (website section B, before laser cutting). A laser cutter reads flat 2D outlines, usually as a DXF (Drawing Exchange Format) file. These eight steps take a panel from a SolidWorks part to a cut piece.

**Worked example — the ClayBreeze electronics enclosure:** 6 finger-jointed panels for a 120 × 150 × 100 mm box in 3 mm MDF, file [`cad/dxf-enclosure/basic-box-120x150x100-3mm.dxf`](../cad/dxf-enclosure/basic-box-120x150x100-3mm.dxf). One panel (the 150 × 100 mm long side) is rendered from the DXF as [`media/diagrams/enclosure-panel-150x100.svg`](../media/diagrams/enclosure-panel-150x100.svg) by `python tools/dxf-panel-preview.py` (76 line segments, one closed contour).

Menu paths follow the official SOLIDWORKS help pages listed at the end (2024 release unless noted), paraphrased in our own words. On the website each step has an original, stylised animated illustration (a generic CAD window, not a screenshot of any program); the report shows one key frame per step.

## The eight steps

1. **Model each panel at 1:1 in millimetres.** Set the part to millimetres (**Tools › Options › Document Properties › Units**, unit system **MMGS**). Sketch the panel outline at full size (our long side: 150 × 100 mm) and extrude it to the sheet thickness — **3 mm** for our MDF. One part per panel keeps each DXF simple. *[Help: Document Properties – Units]*
2. **Add finger joints and allow for kerf.** Cut tabs and slots along the mating edges so the panels press together — our DXF has 13 mm fingers, 3 mm deep (the sheet thickness). The beam burns away a thin strip (the **kerf**), so tabs come out slightly narrow and slots wide. Offset the outline by half the kerf in CAD, or use kerf compensation in the laser software (see the kerf demo in the Workbench and [digital-fabrication.md](digital-fabrication.md)).
3. **Method A — export a face from the part.** Select the panel's flat face, then **File › Save As** and choose **Dxf (\*.dxf)** as *Save as type*. In the **DXF/DWG Output** PropertyManager, under *Export*, choose **Faces / loops / edges** (or **Annotation views** for a named view such as Front), check the preview in the *DXF/DWG Cleanup* window, remove unwanted entities and click **Save**. Alternatively, right-click the selected face and choose **Export to DXF / DWG**. A face exported from a part keeps its true size; the *Scale output 1:1* option applies to drawings only. *[Help: DXF/DWG Output PropertyManager]*
4. **Method B — export from a drawing.** Make a drawing of the panel with one **Front** view at **scale 1:1**, then hide dimensions and annotations. **File › Save As**, *Save as type* **Dxf (\*.dxf)**, click **Options** and under **Scale output 1:1 (Drawings only)** tick **Enable**, so geometry is written at model size whatever the sheet scale. *[Help: DXF/DWG File Export Options]*
5. **Method C — sheet metal flat pattern (only if the panel is a sheet-metal part).** In the FeatureManager design tree, right-click **Flat-Pattern › Export to DXF/DWG** (or **File › Save As › Dxf (\*.dxf)**). Under *Entities To Export*, clear **Bend lines**. Our MDF panels are ordinary parts, so we use method A or B. *[Help: Saving Sheet Metal Flat Patterns as DXF Files]*
6. **Export settings — what the laser needs.** Millimetres, **1:1**, no title block or border, only the cutting geometry. In the Save As **Options**: **Enable merging** (end point merging) closes tiny gaps between line ends; **Export all splines as polylines** helps laser software that handles splines badly. Put cut and engrave lines on separate layers or colours (**Custom Map SOLIDWORKS to DXF/DWG** can map them to layers). *[Help: DXF/DWG File Export Options]*
7. **Check the DXF before cutting.** Open it in a DXF viewer or the laser software and confirm the overall size (our long side: 150 × 100 mm), that every contour is **closed**, and that there are **no duplicate lines** (a doubled line is cut twice and chars the edge). Reading our DXF with `ezdxf` gives six closed outlines.
8. **Import into the laser software and cut.** Give each layer its job — **cut** (red) and **engrave** (blue) — with its own power and speed, focus on the sheet, test on scrap, then cut, staying with the machine for the whole job.

## Common mistakes

| Mistake | What happens | Fix |
|---|---|---|
| Wrong scale | A drawing exported at sheet scale (e.g. 1:2) cuts half-size parts | Export at 1:1; check one known dimension in the laser software |
| Dimensions exported as lines | Dimension text and arrows are cut too | Hide dimensions and annotations, or export faces from the part |
| Open contours | A tiny gap between line ends; the part never drops out | Enable end point merging; look for closed shapes in the viewer |
| Spline issues | Curves misread or cut as jagged segments | Export splines as polylines, or redraw curves as arcs |
| Duplicate lines | Shared or overlapping edges are cut twice and char | Delete duplicates before cutting |

## SOLIDWORKS help pages used

- DXF/DWG Output PropertyManager (2024): <https://help.solidworks.com/2024/english/SolidWorks/sldworks/HIDD_DVE_PART_EXPORT_OPTIONS.htm>
- DXF/DWG File Export Options (2024): <https://help.solidworks.com/2024/English/SolidWorks/sldworks/r_dxf_dwg_export_options.htm>
- Saving Sheet Metal Flat Patterns as DXF Files (2024): <https://help.solidworks.com/2024/English/solidworks/sldworks/t_Saving_Sheet_Metal_Flat_Patterns_DXF_Files.htm>
- Document Properties – Units (2023): <https://help.solidworks.com/2023/english/SolidWorks/sldworks/HIDD_OPTIONS_UNITS_NEW.htm>

Menu paths were checked against these pages on 27 November 2026. 3DEXPERIENCE users may see a *Save As New* dialog first (the help says to click *Save to This PC*); newer releases may use *File › Export As* for SOLIDWORKS installed from the 3DEXPERIENCE platform.
