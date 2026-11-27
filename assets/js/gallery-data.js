/*
 * Real ClayBreeze media gallery.
 *
 * Add photographs to media/photos/ (or CAD screenshots to media/cad-screenshots/),
 * then add one object per image below. Use repository-relative paths from the root.
 * Never use stock or AI-generated images as if they were photographs of the build.
 *
 * category must be one of:
 *   Project gallery:   frame-fabrication | rods-mounts | painting | clay-pots | electronics | water-system
 *                      | cad | testing | team | enclosure
 *   Workbench gallery: 3d-printing | laser-cutting | printers
 *   (enclosure photos appear in both galleries; in the Workbench gallery they sit under Laser Cutting)
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
  {
    src: "media/photos/Water_System_Tub_Front_Left_View.jpeg",
    title: "Assembled prototype standing in the water tub",
    category: "water-system",
    kind: "photo",
    width: 960, height: 1280,
    alt: "The painted frame with 30 clay pots standing inside a grey plastic tub, clear tubing with a blue connector running down the front-left post into the tub and along the top of the frame",
    description: "The frame now stands inside a grey plastic tub. Clear tubing runs down the front-left post, where it joins at a blue connector, and along the top of the frame."
  },
  {
    src: "media/photos/Water_System_Tub_Front_Right_View.jpeg",
    title: "Tub, tubing and pump, front-right view",
    category: "water-system",
    kind: "photo",
    width: 960, height: 1280,
    alt: "Front-right view of the assembly in the grey tub, with clear tubing looped over the top of the frame and a small green unit with a black power cable in the right-hand corner of the tub",
    description: "Clear tubing runs over the top of the frame and down the side. A small green unit with a black power cable sits in the front-right corner of the tub — the water pump."
  },
  {
    src: "media/photos/Water_System_Tub_Side_View.jpeg",
    title: "Side view: fans, pots and tubing in the tub",
    category: "water-system",
    kind: "photo",
    width: 960, height: 1280,
    alt: "Side view of the assembly in the grey tub, showing the two white rear fans, a column of clay pots, and clear tubing running down a frame post into the water in the tub, with loose cables beside it",
    description: "Side view: the two rear fans, the pot column and the tubing running down a frame post into the tub, which has water in it. Loose supply cables are still visible beside the tub."
  },
  // --- Team photo ---
  {
    src: "media/photos/Team_With_Prototype.jpeg",
    title: "Group 17 with the ClayBreeze prototype",
    category: "team",
    kind: "photo",
    width: 1200, height: 1600,
    alt: "Four students in dark blazers and ties standing behind the finished ClayBreeze prototype, the painted frame with 30 clay pots in a grey tub, on a table in a glass-walled room",
    description: "Group 17 with the ClayBreeze prototype."
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
  },
  // --- ClayBreeze electronics enclosure (media/Laser Cutting for project/): shown in BOTH galleries ---
  {
    src: "media/Laser Cutting for project/Laser Cutting MDF to store electronics.jpeg",
    title: "Laser cutting MDF to store electronics",
    category: "enclosure",
    kind: "photo",
    width: 1280, height: 960,
    alt: "The laser head cutting finger-jointed box panels out of a brown MDF sheet on the honeycomb bed, with a bright spot where the beam meets the sheet",
    description: "Cutting the finger-jointed MDF panels of the ClayBreeze electronics enclosure (DXF: cad/dxf-enclosure/basic-box-120x150x100-3mm.dxf)."
  },
  // --- Makerspace Workbench (media/fabrication-lab/): 3D printing and laser cutting practised at Tinkerers' Lab ---
  // Titles are the cleaned-up file names. To relabel a photo, rename the file and update its entry here.
  // Printers
  {
    src: "media/fabrication-lab/3DP_Bambu_H2D_With_AMS.jpeg",
    title: "Bambu Lab H2D with AMS",
    category: "printers",
    kind: "photo",
    width: 960, height: 1280,
    alt: "An enclosed Bambu Lab H2D 3D printer with a touchscreen and a multi-spool AMS unit on top, and a yellow filament spool hanging on its side",
    description: "The lab's Bambu Lab H2D, an enclosed dual-nozzle CoreXY printer, with an AMS filament unit on top."
  },
  {
    src: "media/fabrication-lab/3DP_Bambu_P1S.jpeg",
    title: "Bambu Lab P1S",
    category: "printers",
    kind: "photo",
    width: 960, height: 1280,
    alt: "An enclosed black Bambu Lab P1S 3D printer with a glass door and a small display, beside a window",
    description: "The lab's Bambu Lab P1S, an enclosed single-nozzle CoreXY printer."
  },
  {
    src: "media/fabrication-lab/3DP_Bambu_A1_With_AMS_Lite.jpeg",
    title: "Bambu Lab A1 with AMS lite",
    category: "printers",
    kind: "photo",
    width: 1280, height: 960,
    alt: "An open-frame Bambu Lab A1 3D printer next to its AMS lite stand holding four filament spools, with tubes running to the print head",
    description: "The lab's Bambu Lab A1, an open-frame bed-slinger, with the AMS lite feeding four spools."
  },
  {
    src: "media/fabrication-lab/3DP_Bambu_A1_Mini.jpeg",
    title: "Bambu Lab A1 mini",
    category: "printers",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A compact open Bambu Lab A1 mini 3D printer with a single vertical column, a small build plate and a touchscreen, on a desk",
    description: "The lab's Bambu Lab A1 mini, a compact bed-slinger and the smallest of the four printers."
  },
  // 3D printing
  {
    src: "media/fabrication-lab/3D printed saraswati yantra.jpeg",
    title: "3D printed Saraswati yantra",
    category: "3d-printing",
    kind: "photo",
    width: 1280, height: 720,
    alt: "A black picture frame holding a white 3D-printed Saraswati yantra, a lattice of triangles and spirals, on a blue patterned background",
    description: "A framed 3D-printed Saraswati yantra in white on a blue background."
  },
  {
    src: "media/fabrication-lab/3D printed saraswati yantrawith mantra.jpeg",
    title: "3D printed Saraswati yantra with mantra",
    category: "3d-printing",
    kind: "photo",
    width: 1280, height: 960,
    alt: "A gold-edged picture frame held in a hand, with a white 3D-printed Saraswati yantra and two lines of white Devanagari text on an orange and maroon background",
    description: "A framed 3D-printed Saraswati yantra with a two-line mantra."
  },
  {
    src: "media/fabrication-lab/3DP_Crank Slider Mechanism along with electronics.jpeg",
    title: "Crank slider mechanism along with electronics",
    category: "3d-printing",
    kind: "photo",
    width: 1280, height: 960,
    alt: "A grey 3D-printed crank slider housing with a yellow printed crank arm on a desk, wired to a motor-driver board and a microcontroller on a breadboard, with a laptop and a bench power supply behind",
    description: "A 3D-printed crank slider mechanism wired to a motor driver and a microcontroller."
  },
  {
    src: "media/fabrication-lab/3DP_Humidifier.jpeg",
    title: "Humidifier",
    category: "3d-printing",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A white and yellow 3D-printed humidifier body made of several stacked parts with a pointed top and side vents, with a white cable plugged into it, on a desk",
    description: "A 3D-printed humidifier body assembled from several white and yellow printed parts."
  },
  {
    src: "media/fabrication-lab/3DP_Phone Stand Sanjivani University.jpeg",
    title: "Phone stand, Sanjivani University",
    category: "3d-printing",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A blue 3D-printed phone stand with a raised Sanjivani University emblem and lettering on its base, on a desk next to a keyboard",
    description: "A blue 3D-printed phone stand with the Sanjivani University emblem in relief."
  },
  {
    src: "media/fabrication-lab/3DP_Assorted_Prints_Tray.jpeg",
    title: "Assorted prints tray",
    category: "3d-printing",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A grey plastic tray full of colourful 3D-printed objects: horse sculptures, a bust, a vase, a rabbit, a textured column and other figurines",
    description: "Assorted 3D-printed practice and demonstration pieces collected in the lab."
  },
  {
    src: "media/fabrication-lab/3DP_Phoenix_On_P1S.jpeg",
    title: "Phoenix on P1S",
    category: "3d-printing",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A detailed blue 3D-printed phoenix figurine standing on top of a Bambu Lab P1S printer",
    description: "A blue printed phoenix figurine, photographed on top of the P1S."
  },
  {
    src: "media/fabrication-lab/3DP_Faceted_Turtle.jpeg",
    title: "Faceted turtle",
    category: "3d-printing",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A green 3D-printed turtle with a faceted, geometric shell on a wooden desk",
    description: "A green printed turtle with a faceted shell; the layer lines are visible on the facets."
  },
  {
    src: "media/fabrication-lab/3DP_Articulated_Dragon.jpeg",
    title: "Articulated dragon",
    category: "3d-printing",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A long lavender 3D-printed articulated dragon with many jointed segments lying on a wooden table",
    description: "A long, jointed dragon printed in lavender filament."
  },
  {
    src: "media/fabrication-lab/3DP_Textured_Egg.jpeg",
    title: "Textured egg",
    category: "3d-printing",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A red 3D-printed egg with an overlapping scale pattern on a desk in front of a keyboard",
    description: "A red printed egg with an overlapping scale pattern."
  },
  {
    src: "media/fabrication-lab/3DP_Balancing_Bird.jpeg",
    title: "Balancing bird",
    category: "3d-printing",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A dark-red 3D-printed bird with long drooping wings balanced by its beak on top of a printed tree-trunk stand",
    description: "A dark-red printed balancing bird resting by its beak on a printed stand."
  },
  // Laser cutting
  {
    src: "media/fabrication-lab/Laser_SIL_CO2_Cutter.jpeg",
    title: "Laser: SIL CO₂ cutter",
    category: "laser-cutting",
    kind: "photo",
    width: 1280, height: 960,
    alt: "A large grey SIL laser cutter with its blue lid raised, in a lab room with safety posters on the wall",
    description: "The lab's SIL CO₂ laser cutter (100 W) with the lid open."
  },
  {
    src: "media/fabrication-lab/Laser_Bed_And_Head.jpeg",
    title: "Laser bed and head",
    category: "laser-cutting",
    kind: "photo",
    width: 1280, height: 960,
    alt: "Inside the laser cutter: the honeycomb bed, the gantry rail and the laser head with its air-assist tube",
    description: "The work area: honeycomb bed, gantry and laser head, with the air-assist line to the nozzle."
  },
  {
    src: "media/fabrication-lab/Laser_Engraving_In_Progress.jpeg",
    title: "Laser engraving",
    category: "laser-cutting",
    kind: "photo",
    width: 960, height: 1280,
    alt: "The laser head engraving a light-coloured sheet on the honeycomb bed, with a bright spot where the beam meets the sheet and shapes already cut out around it",
    description: "An engraving job running on a light-coloured sheet; earlier shapes have been cut from the same sheet."
  },
  {
    src: "media/fabrication-lab/Laser Engraved Acrylic Trophy.jpeg",
    title: "Laser engraved acrylic trophy",
    category: "laser-cutting",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A clear acrylic trophy engraved with the Sanjivani University emblem and the words Smart Kopargaon Hackathon 2026 Winners, lit from an LED base",
    description: "A laser-engraved acrylic trophy, lit from its base."
  },
  {
    src: "media/fabrication-lab/Laser Engraved Acrylic Momento1.jpeg",
    title: "Laser engraved acrylic memento",
    category: "laser-cutting",
    kind: "photo",
    width: 720, height: 1280,
    alt: "A clear acrylic memento engraved with a detailed face motif, scrolls and campus buildings, glowing on a lit base against a dark background",
    description: "A laser-engraved acrylic memento, lit from its base."
  },
  {
    src: "media/fabrication-lab/Laser Cut Clock in Wood.jpeg",
    title: "Laser cut clock in wood",
    category: "laser-cutting",
    kind: "photo",
    width: 1280, height: 960,
    alt: "A large wall clock cut from wooden sheet, with many interlocking gears of different sizes around a circular spoked dial, mounted on a white wall",
    description: "A laser-cut wooden gear clock with interlocking gears around the dial."
  },
  {
    src: "media/fabrication-lab/Laser Cut Cardboard Stand to keep 3d printed items.jpeg",
    title: "Laser cut cardboard stand to keep 3D printed items",
    category: "laser-cutting",
    kind: "photo",
    width: 960, height: 1280,
    alt: "A painted red and black laser-cut cardboard display stand with two round top lobes and three shelves holding small colourful 3D-printed items, with more prints on the desk in front",
    description: "A laser-cut cardboard display stand holding 3D-printed items from the lab."
  },
  {
    src: "media/fabrication-lab/Laser_Acrylic_SKH_Bulb.jpeg",
    title: "Laser acrylic SKH bulb",
    category: "laser-cutting",
    kind: "photo",
    width: 720, height: 1280,
    alt: "A clear acrylic cut-out shaped like a light bulb made of connected dots and lines, engraved SKH, on a wooden table",
    description: "A clear acrylic bulb shape with an engraved network pattern and the letters SKH."
  },
  {
    src: "media/fabrication-lab/Laser_Acrylic_Lab_Badge.jpeg",
    title: "Laser acrylic lab badge",
    category: "laser-cutting",
    kind: "photo",
    width: 720, height: 1280,
    alt: "A round frosted acrylic badge engraved with the university emblem and the words Tinkerers Lab and Sanjivani University",
    description: "A round acrylic badge engraved with the Tinkerers' Lab name and the university emblem."
  },
  {
    src: "media/fabrication-lab/Laser_Cut_Lettering.jpeg",
    title: "Laser cut lettering",
    category: "laser-cutting",
    kind: "photo",
    width: 720, height: 1280,
    alt: "Large Devanagari lettering cut out of brown sheet material, with the matching cut-out sheet leaning against a wall",
    description: "Large Devanagari lettering cut from sheet material, next to the sheet it was cut from."
  },
  {
    src: "media/fabrication-lab/Laser_MDF_Pen_Holder.jpeg",
    title: "Laser MDF pen holder",
    category: "laser-cutting",
    kind: "photo",
    width: 720, height: 1280,
    alt: "A small square pen holder made of laser-cut MDF panels joined with finger joints, holding a pen, on a desk",
    description: "A pen holder assembled from laser-cut MDF panels with finger joints, a typical press-fit exercise."
  }
  // To add a photo: copy it into media/fabrication-lab/ (or media/Laser Cutting for project/), run
  // python tools/make-web-images.py, then add an entry above whose title is the cleaned file name.
];

/*
 * Lab videos ("Prints from the lab" in the Makerspace Workbench). Captions are the cleaned file names.
 */
window.CLAYBREEZE_VIDEOS = [
  { src: "media/fabrication-lab/Mahadev idol.mp4", poster: "media/fabrication-lab/3DP_Mahadev Idol.webp", title: "Mahadev idol", width: 576, height: 1024, label: "Short video turning around a black 3D-printed Mahadev idol" },
  { src: "media/fabrication-lab/3DP_Race_Car_Outline_Video.mp4", poster: "media/fabrication-lab/3DP_Race_Car_Outline_Video-poster.webp", title: "Race car outline", width: 576, height: 1024, label: "Short video of a red 3D-printed race-car outline held in front of a printer" }
];
