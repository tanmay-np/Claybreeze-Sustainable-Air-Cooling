/*
 * Real ClayBreeze media gallery.
 *
 * Add photographs to media/photos/ (or CAD screenshots to media/cad-screenshots/),
 * then add one object per image below. Use repository-relative paths from the root.
 * Never use stock or AI-generated images as if they were photographs of the build.
 *
 * category must be one of:
 *   frame-fabrication | rods-mounts | painting | clay-pots | electronics | water-system | cad | testing
 *
 * kind labels what the image is: "photo" | "cad-drawing" | "cad-render".
 * width/height are the file's pixel size (lets the browser reserve space).
 *
 * Only add a date when it comes from a real record; no date field is shown otherwise.
 *
 * Example (remove the comment markers and replace the values):
 * {
 *   src: "media/photos/frame-front.jpg",
 *   title: "Fabricated metal frame",
 *   category: "frame-fabrication",
 *   kind: "photo",
 *   width: 960, height: 1280,
 *   alt: "Front view of the fabricated ClayBreeze metal frame",
 *   description: "Front view taken during workshop inspection."
 * }
 */
window.CLAYBREEZE_GALLERY = [
  {
    src: "media/photos/Frame_pipe_cutting_1.jpeg",
    title: "Cutting the 20 mm square pipe",
    category: "frame-fabrication",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A workshop supervisor and two students in Sanjivani University uniforms cutting lengths of square pipe with an abrasive chop saw, sparks flying",
    description: "Cutting square pipe to length for the frame, with students observing and holding the stock steady."
  },
  {
    src: "media/photos/Frame_pipe_cutting_2.jpeg",
    title: "Cutting the frame pipe, second angle",
    category: "frame-fabrication",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A wider view of the same pipe-cutting setup, showing the chop saw, cut lengths and workshop surroundings",
    description: "A second view of the same cutting session, showing the chop saw and the lengths of pipe being prepared."
  },
  {
    src: "media/photos/Frame_pipe_cutting_3.jpeg",
    title: "Measuring and marking a pipe length",
    category: "frame-fabrication",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A student in a dark blazer marking a cut line on a length of square pipe resting on the chop saw",
    description: "A student marking a pipe section to length on the chop saw before cutting it."
  },
  {
    src: "media/photos/Pipes_Cut_All_1.jpeg",
    title: "Cut pipe sections, sorted by length",
    category: "frame-fabrication",
    kind: "photo",
    width: 960, height: 1280,
    alt: "Several groups of cut square-pipe sections of different lengths laid out on the workshop floor",
    description: "The cut pipe sections grouped by length, ready for welding into the frame."
  },
  {
    src: "media/photos/Frame_Welding_Stage1.jpeg",
    title: "Welding a frame joint",
    category: "frame-fabrication",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A small welded square-pipe rectangle on a steel welding table, with a welding mask, tape measure and electrode holder nearby",
    description: "A frame face being welded on the workshop's welding table."
  },
  {
    src: "media/photos/Frame_Welded_1.jpeg",
    title: "A welded frame assembly",
    category: "frame-fabrication",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A standing welded square-pipe frame with visible corner welds, in a workshop with other metal stock in the background",
    description: "The welded square-pipe frame, before the rods and the rear extension were added."
  },
  {
    src: "media/photos/Drill_Point_Marking_1.jpeg",
    title: "Centre-punching drill points on the square pipe",
    category: "rods-mounts",
    kind: "photo",
    width: 1280, height: 960,
    alt: "A student in a Sanjivani University polo shirt using a hammer and centre punch to mark a drill point on a length of square pipe, with round rods lying on the bench, in the Tin Smithy Shop workshop",
    description: "Marking the rod-hole positions on a square-pipe member with a centre punch and hammer. The round rods lie on the bench beside it."
  },
  {
    src: "media/photos/Drill_Point_Marking_2.jpeg",
    title: "Centre-punching the square pipe, close-up",
    category: "rods-mounts",
    kind: "photo",
    width: 960, height: 1280,
    alt: "Close-up of a student centre-punching a length of square pipe on a workbench, with a second pipe section and round rods nearby",
    description: "A closer view of centre-punch marking on the square pipe, before the rod holes were drilled."
  },
  {
    src: "media/photos/Frame_Rod_Assembled_1.jpeg",
    title: "Rods fitted to the frame (unpainted)",
    category: "rods-mounts",
    kind: "photo",
    width: 960, height: 1280,
    alt: "The welded frame, still unpainted, with six horizontal retaining rods fitted across its width",
    description: "The welded frame with the six 12 mm retaining rods attached, before painting."
  },
  {
    src: "media/photos/Frame_Rod_assembled_With_Fan_Extension1.jpeg",
    title: "Rods and rear fan-mount extension fitted",
    category: "rods-mounts",
    kind: "photo",
    width: 960, height: 1280,
    alt: "The unpainted frame with its six retaining rods installed and the welded rear extension frame for the fans visible behind it",
    description: "The frame with the rods attached and the rear fan-mount extension welded on, before the frame was painted."
  },
  {
    src: "media/photos/Frame_with_Rod_And_Exhaust_Fan_Colourd.jpeg",
    title: "Frame painted, fans on the rear extension",
    category: "painting",
    kind: "photo",
    width: 960, height: 1280,
    alt: "The spray-painted grey frame standing outdoors, with two white exhaust fans mounted one above the other on the rear extension frame, behind the six retaining rods",
    description: "The frame after spray-painting, with the two exhaust fans mounted on the rear extension frame behind the rods. Photographed outdoors."
  },
  {
    src: "media/photos/Frame_Completely_Assembled_Front_View.jpeg",
    title: "30 clay pots fixed into the painted frame",
    category: "clay-pots",
    kind: "photo",
    width: 960, height: 1280,
    alt: "Front view of the painted grey frame with 30 unglazed clay pots fixed on the rods in 5 columns by 6 rows, the fans visible behind them and a loose white cable at the top",
    description: "Front view of the assembled frame: 30 pots in 5 columns × 6 rows. Note the loose, unterminated fan cable at the top — to be secured before powered testing."
  },
  {
    src: "media/photos/Frame_Completely_Assembled_Side_View.jpeg",
    title: "Pots and fans, side view",
    category: "clay-pots",
    kind: "photo",
    width: 960, height: 1280,
    alt: "Side view of the assembled frame showing a column of clay pots on the rods and the two white exhaust fans mounted on the rear extension frame",
    description: "A side view of the same assembly, showing the clay pots, the rod ends and the two fans on the rear extension frame."
  },
  // --- SolidWorks CAD screenshots (media/cad-screenshots/) ---
  {
    src: "media/cad-screenshots/Drawing Sheet_With_Dimensions.png",
    title: "Engineering drawing — key dimensions",
    category: "cad",
    kind: "cad-drawing",
    width: 1917, height: 1018,
    alt: "SolidWorks dimensioned engineering drawing showing a 480 by 560 millimetre outer frame, 440 millimetre opening, 150 millimetre depth, 270 millimetre overall side depth and a 12 millimetre diameter rod callout",
    description: "Dimensioned drawing: 480 × 560 mm outer frame, 440 mm opening width, 150 mm depth, 270 mm overall side depth with the rear extension, and a ⌀12 mm rod."
  },
  {
    src: "media/cad-screenshots/Drawing Sheet1.png",
    title: "Engineering drawing — multi-view layout",
    category: "cad",
    kind: "cad-drawing",
    width: 1917, height: 1018,
    alt: "SolidWorks engineering drawing sheet with orthographic and isometric views of the frame, undimensioned",
    description: "Multi-view engineering drawing sheet for the frame (titled 20mm_frame), before dimensions were added."
  },
  {
    src: "media/cad-screenshots/Assembly_Isometric_View.png",
    title: "Full assembly concept, isometric view",
    category: "cad",
    kind: "cad-render",
    width: 1917, height: 1021,
    alt: "SolidWorks isometric view of the complete assembly with frame, rear extension, rods and all 30 pots",
    description: "Isometric view of the full design concept — frame, rear extension, rods and the complete pot array."
  },
  {
    src: "media/cad-screenshots/Assebly_Front_View.png",
    title: "Pot array, front view",
    category: "cad",
    kind: "cad-render",
    width: 1917, height: 1020,
    alt: "SolidWorks front orthographic view of the frame with a 5-column by 6-row grid of pots",
    description: "Front view of the assembly concept, showing the 5 × 6 pot layout."
  },
  {
    src: "media/cad-screenshots/Frame.png",
    title: "Frame concept, isometric view",
    category: "cad",
    kind: "cad-render",
    width: 1917, height: 1020,
    alt: "SolidWorks isometric view of the welded square-pipe frame model with its rear extension and a column of rod-mounting holes down each side",
    description: "The frame concept model, including the rear fan-mount extension — compare with the fabricated frame in the workshop photos."
  },
  {
    src: "media/cad-screenshots/Rod.png",
    title: "Pot-retaining rod, part model",
    category: "cad",
    kind: "cad-render",
    width: 1917, height: 1020,
    alt: "SolidWorks part view of a single cylindrical pot-retaining rod",
    description: "The rod part model. The file is named \"20mm_rod\" in the CAD tree, but the dimensioned drawing calls it out at ⌀12 mm, which matches the physical rods — a naming discrepancy, not a dimension conflict."
  },
  {
    src: "media/cad-screenshots/Clay_Pot.png",
    title: "Clay pot (kullad) part model",
    category: "cad",
    kind: "cad-render",
    width: 1917, height: 1020,
    alt: "SolidWorks part view of a double-cone clay pot model, named kullad_part, with a top opening and a smaller side hole",
    description: "The clay-pot part model (kullad_part): a double-cone body with an open mouth and a small side hole for the rod."
  }
];
