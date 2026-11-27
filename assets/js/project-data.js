/*
 * ClayBreeze website data.
 * Keep these values aligned with the current engineering documentation.
 * Do not mark a task complete or add measured results without real evidence.
 *
 * Status vocabulary used everywhere on the site:
 *   COMPLETED   — physically built and installed
 *   IMPLEMENTED — control logic running on the ESP32
 *   FUTURE      — future scope (not started)
 */
window.CLAYBREEZE_PROJECT = {
  title: "ClayBreeze",
  fullTitle: "A Sustainable Clay-Based Air-Cooling System",
  statusHeadline: "Build complete — control logic running",
  group: "Group 17",
  institution: "Sanjivani University",
  subject: "Makerspace",
  student: { name: "Tanmay Nilesh Pendbhaje", programme: "FY B.Tech Mechanical Engineering", institution: "Sanjivani University" },

  // SolidWorks GLB export of the assembly (frame incl. rear extension, six rods,
  // 30 pots; no fans). The hero crossfades to it once loaded and the explorer
  // offers it as "SolidWorks model". Set to null to use only the procedural model;
  // on any load error the procedural model is used.
  modelGLB: "assets/models/claybreeze-assembly.glb",
  modelGLBSize: "4.9 MB", // shown on the button when the download is deferred (small screens, Save-Data)

  specifications: [
    { label: "Frame outer size", value: "480 W × 560 H × 150 D mm", note: "Design value from the SolidWorks drawing" },
    { label: "Front inner opening", value: "440 × 520 mm", note: "440 mm on the drawing; 520 mm follows from 560 − 2 × 20 mm" },
    { label: "Frame section", value: "20 mm square pipe", note: "Wall thickness to be confirmed" },
    { label: "Overall depth with rear extension", value: "270 mm", note: "Read from the side view of the drawing" },
    { label: "Pot-retaining rods", value: "6 × ⌀12 mm", note: "Drilled and attached; CAD part file is misleadingly named “20mm_rod”" },
    { label: "Pot layout", value: "5 columns × 6 rows (30 pots)", note: "Observed in the assembly photographs" },
    { label: "Air movement", value: "2 exhaust fans", note: "Mounted at the rear, blowing room air forward through the pot array" }
  ],

  // Component list for the Electronics section. Pins follow the confirmed wiring table (Section 07).
  components: [
    { name: "ESP32 microcontroller", status: "COMPLETED", role: "Straddles the breadboard centre gap (antenna at top, USB at bottom). Reads the DHT11 on GPIO4, runs the control logic and drives the relay inputs on GPIO19, GPIO21 and GPIO22." },
    { name: "DHT11 sensor", status: "COMPLETED", role: "Measures temperature and relative humidity. VCC on the 3.3 V rail, GND on the ground rail, DATA to 13J (GPIO4)." },
    { name: "3-channel relay module", status: "COMPLETED", role: "VCC/DC+ on the 5 V rail, GND/DC− on common ground. IN1 (8J, GPIO19) switches Fan 1, IN2 (6J, GPIO21) Fan 2 and IN3 (3J, GPIO22) the water motor." },
    { name: "Two exhaust fans", status: "COMPLETED", role: "Mounted on the rear extension frame, blowing room air forward through the pot array. Each fan has its own relay channel and its own temperature thresholds." },
    { name: "Water pump, tubing and reservoir", status: "COMPLETED", role: "The water motor (pump) and its tubing are installed with the reservoir. The pump is switched on humidity by the ESP32 and relay." },
    { name: "Control logic", status: "IMPLEMENTED", role: "Running on the ESP32, with hysteresis. Fan 1: ON above 26 °C, OFF at or below 25 °C. Fan 2: ON above 30 °C, OFF at or below 29 °C. Water motor: ON below 60 % RH, OFF at or above 62 % RH. Between the two limits each output keeps its previous state." }
  ],

  // Current status, grouped in plain English (Section 10). Do not repeat the journey here.
  // A group either lists items directly or splits them into labelled subgroups.
  statusGroups: [
    {
      heading: "Completed build",
      badge: "COMPLETED",
      tone: "done",
      subgroups: [
        { label: "Structure", items: ["Frame cut, welded and spray-painted (20 mm square pipe).", "Six ⌀12 mm pot-retaining rods and the rear fan-mount extension.", "30 clay pots, 5 columns × 6 rows."] },
        { label: "Air and water", items: ["Two exhaust fans on the rear extension.", "Water pump (motor) with tubing, plus reservoir."] },
        { label: "Electronics", items: ["ESP32, DHT11 sensor and 3-channel relay module integrated.", "Prototype fully assembled."] }
      ]
    },
    {
      heading: "Control logic running",
      badge: "IMPLEMENTED",
      tone: "done",
      items: [
        "Fan 1: ON above 26 °C, OFF at or below 25 °C.",
        "Fan 2: ON above 30 °C, OFF at or below 29 °C.",
        "Water motor: ON below 60 % RH, OFF at or above 62 % RH.",
        "Between the two limits each output keeps its previous state (hysteresis)."
      ]
    },
    {
      heading: "Future scope",
      badge: "FUTURE",
      tone: "next",
      items: [
        "Performance measurement: a dry-pot baseline and wetted-pot runs measuring inlet and outlet temperature and humidity, airflow and water use.",
        "Data logging: record the DHT11 readings and relay states over time (CSV template in data/).",
        "IoT monitoring: use the ESP32's Wi-Fi to show readings and fan/pump states on a phone.",
        "Improvements: a water-level sensor with a dry-run cut-out for the pump, as-built measurements fed back into the SolidWorks model, and the electronics fitted in the laser-cut 3 mm MDF enclosure (DXF files)."
      ]
    }
  ],

  // Engineering journey, in chronological order. photos[] holds exact src values
  // from window.CLAYBREEZE_GALLERY (first = large photo). buildStage drives the
  // sticky 3D inset, which adds parts cumulatively as each step scrolls into view.
  journeySteps: [
    {
      number: "01",
      title: "Cut and weld the frame",
      buildStage: 1,
      photos: [
        "media/photos/Frame_pipe_cutting_1.jpeg",
        "media/photos/Pipes_Cut_All_1.jpeg",
        "media/photos/Frame_Welded_1.jpeg"
      ],
      text: "We cut 20 mm square pipe to length on an abrasive chop saw and sorted the pieces by length. The pieces were then welded into a box frame, designed at 480 × 560 × 150 mm with a 440 × 520 mm front opening. The frame has had a visual inspection."
    },
    {
      number: "02",
      title: "Mark and drill the rod holes",
      buildStage: 2,
      photos: [
        "media/photos/Drill_Point_Marking_1.jpeg",
        "media/photos/Drill_Point_Marking_2.jpeg"
      ],
      text: "The rod-hole positions were centre-punched on the square-pipe members, so the drill would start in the right place. The holes take the ⌀12 mm rods that carry the pots."
    },
    {
      number: "03",
      title: "Fit the six retaining rods",
      buildStage: 3,
      photos: [
        "media/photos/Frame_Rod_Assembled_1.jpeg"
      ],
      text: "Six ⌀12 mm rods were passed through the drilled holes across the width of the frame. Each rod later carries one row of five pots."
    },
    {
      number: "04",
      title: "Weld on the rear fan-mount extension",
      buildStage: 4,
      photos: [
        "media/photos/Frame_Rod_assembled_With_Fan_Extension1.jpeg"
      ],
      text: "A rear extension frame was welded behind the main frame to carry the two exhaust fans. On the SolidWorks drawing it brings the overall side depth to 270 mm."
    },
    {
      number: "05",
      title: "Paint the frame and mount the fans",
      buildStage: 5,
      photos: [
        "media/photos/Frame_with_Rod_And_Exhaust_Fan_Colourd.jpeg"
      ],
      text: "The frame was spray-painted grey. The two exhaust fans were then mounted one above the other on the rear extension frame, behind the rods, facing forward so they blow room air through the pot array."
    },
    {
      number: "06",
      title: "Fit the 30 clay pots",
      buildStage: 6,
      photos: [
        "media/photos/Frame_Completely_Assembled_Front_View.jpeg",
        "media/photos/Frame_Completely_Assembled_Side_View.jpeg"
      ],
      text: "Thirty unglazed clay pots were threaded onto the rods: 5 columns × 6 rows, mouths facing the front. The photographs also show the fan cable loose at the top, which must be secured before powered testing."
    },
    {
      number: "07",
      title: "Water system & electronics integration",
      buildStage: 7,
      insetNote: "tub, pump and tubing approximate; electronics not modelled",
      photos: [
        "media/photos/Water_System_Tub_Front_Right_View.jpeg",
        "media/photos/Water_System_Tub_Front_Left_View.jpeg",
        "media/photos/Water_System_Tub_Side_View.jpeg"
      ],
      text: "The water motor (pump) and its tubing were installed with the reservoir, and an ESP32, a DHT11 sensor and a 3-channel relay module were integrated to switch the fans and the pump. The control logic now runs on the ESP32 with hysteresis: Fan 1 ON above 26 °C and OFF at or below 25 °C, Fan 2 ON above 30 °C and OFF at or below 29 °C, and the pump ON below 60 % relative humidity and OFF at or above 62 %. With this step the prototype is fully assembled."
    }
  ],

  // Shown in the "Model notes" disclosure next to every 3D view.
  modelNotes: {
    summary: "Interactive model built from documented dimensions and measurements of the SolidWorks GLB export; the remaining approximate items are estimated from photographs. The “SolidWorks model” view shows the export itself (frame, rods, pots) with the approximate fans added, because the export contains no fans.",
    documented: [
      "Frame 480 × 560 × 150 mm, 20 mm square pipe, 440 × 520 mm front opening (drawing; confirmed by the CAD export)",
      "Overall depth with rear extension 270 mm (drawing; confirmed by the CAD export)",
      "Six ⌀12 mm rods (drawing; ⌀12 mm shaft confirmed by the CAD export)",
      "30 pots in 5 columns × 6 rows (photos; confirmed by the CAD export)",
      "Airflow direction: room air in behind the rear fans, blown forward through and around the pots, out of the front (confirmed by the team)"
    ],
    approximate: [
      ["Rod depth", "Rod axis 75 mm behind the front face (centre plane of the frame)", "CAD export"],
      ["Rod spacing", "90 mm pitch, ±45 / ±135 / ±225 mm about the centre", "CAD export"],
      ["Rod length and head", "480 mm, ⌀20 × 1 mm head at one end", "CAD export"],
      ["Pot size", "⌀80 mm max, 80 mm long, ⌀40 mm openings at both ends", "CAD export"],
      ["Pot positions", "80 mm pitch; array 8.3 mm left of centre", "CAD export"],
      ["Pot profile curve", "Double cone, widest about 60 % back from the mouth", "CAD pot screenshot (approximate)"],
      ["Rear extension members", "Centres ±77.5 mm, 120 mm deep", "CAD export"],
      ["Fan size", "190 mm square plate, ⌀118 mm duct", "Photos (approximate; fans not in CAD export)"],
      ["Fan positions", "Stacked, upper and middle of extension, blowing forward", "Photos (approximate)"],
      ["Frame colour", "Light grey paint", "Photos"],
      ["Tub (reservoir)", "Grey plastic tub about 620 × 440 mm at the rim, 120 mm deep; the frame stands inside it", "Approximate, estimated from photographs"],
      ["Pump", "Small green unit, about ⌀50 × 55 mm, in the front-right corner of the tub", "Approximate, estimated from photographs"],
      ["Tubing", "Clear tube from the pump, up the front-left post and across the top of the frame", "Approximate, estimated from photographs"]
    ]
  }
};

/*
 * Circuit & Control Lab — single source of truth for the implemented fan/pump
 * thresholds (same values as firmware/claybreeze_controller). The simulator
 * (assets/js/circuit-lab.js) reads these values rather than hard-coding them,
 * so the displayed thresholds and the simulated behaviour can never drift apart.
 *
 * This powers a SOFTWARE SIMULATION ONLY. It has no connection to the
 * actual ESP32, DHT11 or relay hardware.
 */
window.CLAYBREEZE_CONTROL = {
  label: "Implemented control logic",
  status: "IMPLEMENTED",
  // Hysteresis: ON past the first limit, OFF past the second, previous state in between.
  fan1: { onAboveC: 26, offAtOrBelowC: 25 },
  fan2: { onAboveC: 30, offAtOrBelowC: 29 },
  pump: { onBelowRH: 60, offAtOrAboveRH: 62 },
  readIntervalS: 2,
  note: "The same thresholds and hysteresis as the sketch running on the ESP32."
};
