/*
 * ClayBreeze website data.
 * Keep these values aligned with the current engineering documentation.
 * Do not mark a task complete or add measured results without real evidence.
 *
 * Status vocabulary used everywhere on the site:
 *   COMPLETED   — physically done, visible in photographs
 *   REPORTED    — reported by the team, evidence not yet in this repository
 *   IMPLEMENTED (reported) — firmware reported as programmed; not in repo, not verified
 *   PLANNED     — intended next revision, not implemented
 *   PROPOSED    — a starting idea to evaluate, not implemented or tested
 *   PENDING     — not yet done
 */
window.CLAYBREEZE_PROJECT = {
  title: "ClayBreeze",
  fullTitle: "A Sustainable Clay-Based Air-Cooling System",
  statusHeadline: "Prototype assembled — testing pending",
  group: "Group 17",
  institution: "Sanjivani University",
  subject: "Makerspace",
  student: { name: "Tanmay Nilesh Pendbhaje", programme: "FY B.Tech Mechanical Engineering", institution: "Sanjivani University" },

  // SolidWorks GLB export of the assembly (frame incl. rear extension, six rods,
  // 30 pots; no fans). The hero crossfades to it once loaded and the explorer
  // offers it as "SolidWorks model". Set to null to use only the procedural model;
  // on any load error the procedural model is used.
  modelGLB: "assets/models/claybreeze-assembly.glb",

  specifications: [
    { label: "Frame outer size", value: "480 W × 560 H × 150 D mm", note: "Design value (SolidWorks drawing); as-built measurement pending" },
    { label: "Front inner opening", value: "440 × 520 mm", note: "440 mm on the drawing; 520 mm follows from 560 − 2 × 20 mm" },
    { label: "Frame section", value: "20 mm square pipe", note: "Wall thickness to be confirmed" },
    { label: "Overall depth with rear extension", value: "270 mm", note: "Read from the side view of the drawing" },
    { label: "Pot-retaining rods", value: "6 × ⌀12 mm", note: "Drilled and attached; CAD part file is misleadingly named “20mm_rod”" },
    { label: "Pot layout", value: "5 columns × 6 rows (30 pots)", note: "Observed in the assembly photographs" },
    { label: "Air movement", value: "2 exhaust fans", note: "Mounted at the rear, blowing room air forward through the pot array" }
  ],

  // Component list for the Electronics section — purpose only, no GPIO pins, ratings or wiring.
  components: [
    { name: "ESP32 microcontroller", status: "WIRED", tone: "reported", role: "Reads the DHT11 sensor, runs the control logic and drives the relay module. Wired on a breadboard. Firmware not yet in this repository." },
    { name: "DHT11 sensor", status: "WIRED", tone: "reported", role: "Measures ambient temperature and relative humidity for the ESP32. Sensor placement has not been documented." },
    { name: "Relay module", status: "WIRED", tone: "reported", role: "Switches the two exhaust fans under ESP32 control. Switching the water pump is PROPOSED, not implemented." },
    { name: "Breadboard + jumper wires", status: "WIRED", tone: "reported", role: "Current prototyping platform connecting the ESP32, relay module and DHT11. Not water-resistant; needs an enclosure." },
    { name: "Two exhaust fans", status: "COMPLETED", role: "Physically mounted on the rear extension frame (photographed), blowing room air forward through the pot array. Temperature switching is IMPLEMENTED — not yet verified by testing. The supply cable is loose in the photographs — secure it before powered testing." },
    { name: "Water pump", status: "INSTALLED", tone: "reported", role: "Installed — photo evidence pending. Not switched by the relay; automatic humidity-based control is PROPOSED. Water circulation is PENDING." }
  ],

  // Current status, grouped in plain English (Section 11). Do not repeat the journey here.
  statusGroups: [
    {
      heading: "Physically completed",
      tone: "done",
      items: [
        "Frame cut, welded and spray-painted (20 mm square pipe).",
        "Six ⌀12 mm pot-retaining rods drilled and attached.",
        "Rear fan-mount extension fabricated; both exhaust fans mounted on it.",
        "30 clay pots fitted, 5 columns × 6 rows (observed in photographs).",
        "Frame visual inspection done — as-built measurements pending.",
        "Pump, reservoir and tubing: installed (reported by team; photo evidence pending)."
      ]
    },
    {
      heading: "Programmed (reported, unverified)",
      tone: "reported",
      items: [
        "ESP32 + relay module + DHT11 wired on a breadboard.",
        "Fan rule: both fans ON above 35 °C, OFF below it — IMPLEMENTED (reported). Firmware not yet in this repository; not verified.",
        "Behaviour at exactly 35.0 °C: unconfirmed."
      ]
    },
    {
      heading: "Planned or proposed",
      tone: "proposed",
      items: [
        "Two-stage fan logic (28 °C / 35 °C) — PLANNED, not implemented.",
        "Automatic humidity-based pump control (60 % / 70 % RH hysteresis) — PROPOSED, not implemented or tested."
      ]
    },
    {
      heading: "Testing still outstanding",
      tone: "pending",
      items: [
        "Secure and terminate the loose fan cable before powered testing.",
        "Staged commissioning — PENDING.",
        "Water circulation — PENDING: not yet commissioned or verified.",
        "As-built measurement of the frame, then the SolidWorks/CAD update — PENDING.",
        "Performance tests: temperature, humidity, airflow, water use, power — PENDING. No results recorded."
      ]
    }
  ],

  nextSteps: [
    "Secure and terminate the loose fan cable before powered testing.",
    "Photograph the pump, reservoir and tubing, and record their specifications.",
    "Add the ESP32 firmware source to this repository and confirm the 35 °C rule, including exactly 35.0 °C.",
    "Commission in stages: fans alone, water circuit alone (leaks, distribution, return flow), then the combined system.",
    "Measure the as-built frame and update the SolidWorks model and drawing.",
    "Run the baseline (dry pots) and wetted-pot tests and record raw data in the CSV template."
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
      text: "We cut 20 mm square pipe to length on an abrasive chop saw and sorted the pieces by length. The pieces were then welded into a box frame, designed at 480 × 560 × 150 mm with a 440 × 520 mm front opening. The frame has had a visual inspection; as-built measurements are still pending."
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
      title: "Wire the control electronics",
      buildStage: 7,
      insetNote: "electronics not modelled",
      photos: [],
      text: "An ESP32, a relay module and a DHT11 sensor were wired on a breadboard. The team reports that the fans are programmed to switch on above 35 °C. The firmware is not yet in this repository and the behaviour has not been verified. No photograph of the electronics has been added yet, and the 3D model does not include them."
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
      ["Water system", "All positions and sizes", "Schematic only — not documented"]
    ]
  }
};

/*
 * Control Logic Lab — single source of truth for the fan/pump threshold
 * simulation. The simulator (assets/js/site.js) reads these values rather
 * than hard-coding them, so the displayed thresholds and the simulated
 * behaviour can never drift apart.
 *
 * This powers a SOFTWARE SIMULATION ONLY. It has no connection to the
 * actual ESP32, DHT11 or relay hardware.
 */
window.CLAYBREEZE_CONTROL = {
  currentFan: {
    label: "Current fan-control logic",
    status: "IMPLEMENTED — not yet verified by testing; firmware not yet in this repository",
    thresholdC: 35,
    note: "Not yet verified by testing; the firmware is not yet in this repository. Behaviour at exactly 35.0 °C is unconfirmed; this simulator shows exactly 35 °C as OFF for demonstration only."
  },
  plannedFan: {
    label: "Planned two-stage fan logic",
    status: "PLANNED — not implemented on the hardware",
    lowC: 28,
    highC: 35,
    note: "Hysteresis around 28 °C and 35 °C should be evaluated before implementing this, to avoid rapid relay switching near a boundary. No specific hysteresis band has been decided."
  },
  proposedPump: {
    label: "Proposed humidity-based pump logic",
    status: "PROPOSED — not implemented or tested; pump installed but not relay-controlled",
    onAtOrBelow: 60,
    offAtOrAbove: 70,
    note: "Provisional bench-testing starting values, not validated thresholds. Direct evaporative cooling has less potential at high incoming humidity, and stopping the pump does not instantly dry the clay pots."
  }
};
