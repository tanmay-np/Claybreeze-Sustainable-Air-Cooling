# ClayBreeze — A Sustainable Clay-Based Air-Cooling System

> **Project status: Build complete — control logic running; next: performance testing.** The metal frame is fabricated, painted, fitted with the six 12 mm pot-retaining rods and the rear fan-mount extension, both fans are mounted, and 30 clay pots (5 × 6) are fixed in place. The water pump with tubing and the reservoir are installed. An ESP32, a DHT11 sensor and a 3-channel relay module are integrated, and the control logic is running (see `docs/electronics-and-control.md`). Performance testing, as-built measurement and the SolidWorks update remain to be done.

## Student

Group 17, Sanjivani University Makerspace.

Tanmay Nilesh Pendbhaje  
FY B.Tech Mechanical Engineering  
Sanjivani University

Project Guide: Dr. Kiran Wakchaure

## 1. Introduction and Purpose

**ClayBreeze** is a Makerspace prototype aimed at a real-world problem: summer heat in Indian homes, classrooms and workshops, where affordable cooling is limited. It uses porous, unglazed terracotta pots — a natural, locally made, reusable and biodegradable material — as the wetted evaporative medium instead of a replaceable pad. The build combines a fabricated metal frame, 30 hollow clay pots, a recirculating water system (tub, pump and tubing) and two rear-mounted exhaust fans, switched by an ESP32 that stages the fans by temperature and runs the pump by humidity.

The **design aim** is a cooler that is low-cost, low-power, needs no pad replacement and is built from eco-friendly materials. These are aims, not established results: performance has **not yet been measured**, and no cooling performance, operating-cost reduction or environmental advantage is claimed until ClayBreeze has been tested and compared fairly with a suitable baseline.

## 2. Background and Motivation

Summers in much of India are hot, and many homes, government-school classrooms and small workshops have little or no mechanical cooling. The Government of India's *India Cooling Action Plan* notes that India has one of the lowest levels of access to cooling in the world, and that cooling demand — and with it refrigerant use and energy use for cooling — is set to rise. [13]

During a summer internship at **Tinkerers' Lab, Sanjivani University**, we looked at the options a household, school or workshop actually has:

- **Air conditioners** are expensive to buy and to run, draw high electrical power, and use refrigerants with a climate impact. For many households and schools they are out of reach. [9][10][13]
- **Pad-type evaporative coolers** (honeycomb / cellulose pads) are cheaper, but the pads clog with scale and dust, degrade, and need periodic replacement; the bodies are usually plastic. [3][8]
- **Grass-pad coolers** (khus / wood-wool) can harbour mould and bacteria when kept damp, cause odour and attract insects, are combustible when dry, and need frequent pad replacement. [11][12]

Pad coolers do cool — the issue is the upkeep and the consumable pad, not whether evaporation works. We became interested in hollow, unglazed clay pots as a wetted medium that is natural, locally made and reusable, arranged in a frame and supplied with recirculating water.

These approaches serve different needs and cannot be ranked fairly without considering the climate, design, purchase cost, maintenance, airflow, water availability, electricity supply, and required level of temperature and humidity control.

| Approach | Potential advantages | Limitations and considerations |
|---|---|---|
| **Traditional grass- or natural-fibre evaporative coolers** | May use locally available media; construction can be relatively straightforward; uses evaporation rather than a refrigeration compressor. | Performance and service life depend on the fibre, packing, water distribution, air velocity, water quality, and cleaning. Organic media can deteriorate if kept wet and poorly maintained, but this is not true of every grass-based design. Cooling is limited by ambient humidity and adds moisture to the air. Published comparisons of natural fibres and manufactured pads show that performance and degradation vary with the exact media and test conditions; they do not establish that all grass-based pads are inferior or inherently riskier. [3][11][12] |
| **Cellulose / honeycomb-pad evaporative coolers** | Engineered pad geometry can provide repeatable air passages and a large wetted area; established designs are available. | Pads need even wetting and periodic cleaning or replacement. Mineral deposits and dirt can obstruct airflow and reduce performance. Water is consumed through evaporation and possibly bleed-off or drainage. As with other direct evaporative systems, humid incoming air reduces the available cooling potential. Performance comparisons depend on pad geometry, packing, airflow, water distribution, and test conditions; it is not accurate to claim that cellulose pads always cool less than natural fibres. [3][8][11][12] |
| **Vapour-compression air conditioners** | Can provide controlled cooling across a wider range of outdoor humidity conditions and can remove moisture from indoor air. Performance varies with equipment efficiency, sizing, settings, climate, and building conditions. | Uses a compressor and refrigeration circuit, so its electrical demand and maintenance requirements differ from a simple fan-and-pump arrangement. Actual energy use and operating cost depend on equipment efficiency, sizing, runtime, climate, and local energy prices. Installation, filters, coils, and refrigerant-system maintenance matter. Refrigerant climate impact depends on the refrigerant and leakage control; lower-global-warming-potential options are available. An air conditioner is not inherently environmentally unsafe, and a fair comparison must include efficiency and refrigerant choice. [9][10] |
| **ClayBreeze (this prototype)** | Tests whether readily available hollow unglazed clay pots can serve as the wetted medium in a fabricated frame. The build also provides an opportunity to study water distribution, airflow, and maintainability. | Performance is unknown. Pot porosity, wetting uniformity, fan operating point, bypass airflow, water use, leakage, material cost, cleaning needs, and service life must be measured or assessed. It remains a prototype and is not yet a validated alternative to other cooling systems. |

Direct evaporative cooling generally has greater potential when the incoming air is relatively dry, because more water can evaporate before the air approaches its wet-bulb condition. When relative humidity is high, the wet-bulb temperature is closer to the dry-bulb temperature, so the theoretical temperature-reduction opportunity is smaller. Direct evaporative devices also increase the moisture content of the air. [3]

## 3. Inspiration: Project Vaayu

ClayBreeze was also inspired by reporting about **Project Vaayu**, a student initiative described in *The Times of India* as using clay tea cups (*kulhads*), scrap wood and metal, water circulation, and evaporative cooling to develop cooling units for government-school classrooms. The report explains how the project was motivated by unequal access to classroom cooling and discusses a recirculating water arrangement. [1] The initiative is also listed by the environmental education organisation Action For Nature. [2]

Project Vaayu is an **inspiration and reference project**, not evidence of ClayBreeze performance. The article describes results for that separate project, but the geometry, clay material, airflow, test conditions, installation, and measurement methods may differ from this prototype. Those outcomes are not used as a prediction or performance target for ClayBreeze. Our own temperature, humidity, water-use, airflow, and power measurements will be recorded independently.

## 4. Problem Statement

Summer heat in Indian homes, classrooms and workshops is a real problem, and affordable cooling is limited. Air conditioners are expensive to buy and run, draw high power and use refrigerants with climate impact. Pad-type coolers need their honeycomb or cellulose pads replaced as they clog with scale and dust, and grass (khus / wood-wool) pads can grow mould and bacteria, smell, attract insects, become a fire risk when dry and need frequent replacement. [3][8][9][11][12][13]

**Can a low-cost, low-power cooler that uses porous, unglazed terracotta pots — with recirculating water and automatic fan and pump control — replace the consumable pad and produce a measurable reduction in air temperature under defined conditions?** If so, what water use, airflow, humidity change and electrical input go with that result?

The project must also establish whether the pots wet consistently, whether excess water returns safely to the tub, whether the frame stays stable when loaded and wet, and whether the system can be operated and maintained safely. The answer is not yet known; it will be based on testing rather than assumption.

### Proposed solution

ClayBreeze replaces the pad with **30 porous, unglazed terracotta pots** (5 × 6) held on six ⌀12 mm rods in a welded 20 mm square-pipe frame. A pump in a tub under the frame lifts water through tubing to the top of the pots; excess water drains back to the tub. Two exhaust fans on a rear extension frame blow room air forward through and around the wet pots. An **ESP32** reads a **DHT11** sensor and switches the fans and pump through a **3-channel relay**: both fans off at or below 28 °C, one fan above 28 °C, both above 35 °C; pump on below 60 % RH. Clay is natural, locally made, reusable and biodegradable, so there is no pad to replace. Low cost, low power and an eco-friendly build are the **design aims**; they will be checked by testing.

## 5. Working Principle: Evaporative Cooling with Porous Clay

Evaporative cooling uses the energy absorbed when liquid water changes into water vapour. At the wetted clay surface, evaporation draws latent heat from the water, clay, and surrounding air. If the water remains distributed over an exposed surface and air moves across it, some of the air's sensible heat can be converted into latent energy associated with water vapour. The measured air temperature may therefore decrease while its moisture content and relative humidity increase. This is the basis of direct evaporative cooling. [3][5]

Unglazed clay can contain connected pores that absorb and transport water by capillary action. Research on porous ceramic evaporative walls and pottery-based cooling pads shows that porous ceramic media can be investigated as wetted evaporative surfaces. However, water absorption and surface wetting depend on the clay body, firing, porosity, geometry, and operating arrangement; those properties must not be assumed for the pots used in ClayBreeze. [4][5][6]

In the ClayBreeze arrangement:

1. The pump lifts water from the bottom reservoir to a distribution arrangement at the top.
2. Water is intended to spread over the exposed clay surfaces. The consistency of this distribution is a key item to inspect and test.
3. The two exhaust fans, mounted at the rear on the extension frame, blow room air forward through and around the pots and out of the front. The final assembly must be checked for airflow bypass, blocked openings, and uneven flow.
4. Water that does not evaporate is intended to drain back into the reservoir for recirculation.
5. Evaporation and the fan-driven airflow are expected to affect outlet temperature and humidity, but the magnitude and stability of those changes are **pending testing**.

### Effect of ambient relative humidity

Relative humidity describes how close the air is to saturation at its current temperature. In general, drier incoming air has a larger gap between dry-bulb and wet-bulb temperatures and can accept more moisture through evaporation. As incoming relative humidity rises, the available evaporative cooling potential decreases. Direct evaporative cooling also adds moisture to the airstream, so outlet humidity must be measured alongside temperature. The wet-bulb temperature provides a useful theoretical reference for direct evaporative cooling, but it is not a prediction of ClayBreeze's actual outlet temperature. [3][7]

ClayBreeze's actual behaviour will also depend on the pot material and exposed area, water-distribution uniformity, airflow rate and direction, contact time, ambient conditions, water temperature, and any air bypass around the assembly. Results from other pottery or evaporative-pad prototypes cannot be transferred directly because their dimensions, materials, and test conditions differ. [4][5]

## 6. Design and Architecture (CAD first)

The current concept places the clay-pot array inside a fabricated square-pipe frame. A pump in a bottom reservoir is intended to deliver water through tubing to a distribution arrangement above the pots. Water will wet the clay surfaces; excess water is intended to drain back into the reservoir. Two exhaust fans mounted at the rear, behind the pot array, take in room air and blow it forward through and around the pots, out of the front into the room. The actual airflow path, water coverage, and return-flow behaviour must be verified during assembly and commissioning.

### Current design information

| Item | Current information | Status |
|---|---|---|
| Frame outer dimensions | **480 mm wide × 560 mm high × 150 mm deep** | Updated design dimensions; verify against the fabricated frame before finalising the CAD model. |
| Front inner opening | **440 × 520 mm** | Updated design dimension; verify after fabrication. |
| Frame section | **20 mm square metal pipe** | Wall thickness: **To be confirmed**. |
| Pot-retaining rods | **12 mm diameter rods** | Holes drilled and rods **attached to the frame — completed**. |
| Frame finish | Spray-painted | **Completed**. |
| Pot arrangement | **5 columns × 6 rows (30 pots)** | Clay pots are **fixed into the frame — completed**; layout observed in the assembly photographs. Spacing not yet measured. |
| Clay elements | Small hollow-through, unglazed clay pots | Pots are fixed in place. Dimensions, mass, porosity, and water absorption: **To be measured / confirmed**. |
| Fan mount | Rear extension frame | **Completed**; both exhaust fans are mounted on it. |
| Electronics | ESP32, relay module, DHT11 sensor, breadboard and jumper wires | Integrated (with a 3-channel relay module); two-stage fan control and humidity-based pump control **IMPLEMENTED** and running. See `docs/electronics-and-control.md`. |
| Water delivery | Pump, tubing, and a top distribution arrangement | Pump and tubing: **installed**. Pump ON below 60 % RH, OFF at or above 60 %. Tubing/distribution specifications still to be recorded. |
| Reservoir | Bottom tub to collect return water | **Installed**; capacity, dimensions and removability still to be recorded. |
| Air movement | Two exhaust fans on the rear extension frame, behind the pots | Switched in two temperature stages (28 °C / 35 °C) by the ESP32 + relay; electrical ratings and model: **To be recorded**. |

### Build status and CAD approach

- **Method — CAD first:** every part was modelled and checked in SolidWorks (parts, assembly, dimensioned drawing) before any material was cut; the frame was then fabricated step by step from the drawing. The laser-cut electronics enclosure follows the same path: SolidWorks panels → DXF → laser cutter (see [`solidworks-to-dxf.md`](solidworks-to-dxf.md)).

- **Completed:** the metal frame is fabricated and spray-painted; the six 12 mm pot-retaining rods are drilled and attached; the rear fan-mount extension is fabricated and both fans are mounted on it; 30 clay pots (5 × 6) are fixed into the frame. The water pump with tubing and the reservoir are installed. The ESP32, DHT11 and 3-channel relay module are integrated, and the control logic is running on the ESP32.
- **Next:** performance testing and results — temperature, humidity, airflow and water use (see `docs/testing-and-results.md`). Secure and terminate all fan and pump cables before powered testing.
- **Still to record:** tubing/reservoir specifications and a leak-check; pot spacing and the as-built frame dimensions have not been measured (visual inspection done; as-built measurements pending).
- **CAD update (to do):** the SolidWorks model and engineering drawing are to be revised to match the **actual fabricated parts and measured dimensions**. This is a documentation task catching up to the build — it does not mean the physical prototype is incomplete.
- **Electronics:** see `docs/electronics-and-control.md` for component roles and the implemented two-stage fan and humidity-based pump control logic.

Photographs of the fabricated frame, the actual pots, the attachment process, and the revised SolidWorks model should be added to the repository as the work progresses. Images should show real project evidence and be labelled with dates or captions where practical.

## 7. Project Objectives

The project aims to:

1. Design and build a clay-pot evaporative cooler from natural, locally available and reusable materials, with a stable frame, secured pot-retaining rods and rear-mounted fans. **(Frame, rods, fan mount, paint and 30 pots complete.)**
2. Build a recirculating water system — tub, pump and tubing — that wets the pots without a consumable pad. **(Installed; specifications and a leak-check still to record.)**
3. Add smart, low-power control: ESP32 + DHT11 + relay, staging the fans by temperature and running the pump only below 60 % RH. **(Implemented and running.)**
4. Update the SolidWorks model and engineering drawing to match the as-built assembly.
5. Observe whether the pots wet consistently and remain securely supported during operation.
6. Measure inlet and outlet air temperature and relative humidity, airflow, water use and electrical input under documented conditions, against a dry-pot (fan-only) baseline.
7. Evaluate cost, maintenance (no pad replacement) and safety from measurements and records before drawing conclusions about affordability or sustainability.
8. Document design changes, unsuccessful trials, limitations and improvements so the work is reproducible.

## 8. Scope and Limitations

### Included in the current scope

- Mechanical frame completion, rod retention, and fan mounting. **(Complete.)**
- Installation and inspection of the pump, tubing, top distribution, reservoir, and return-water path. **(Pump, reservoir and tubing installed; leak-check and tubing/reservoir specifications still to record.)**
- SolidWorks and drawing updates based on as-built measurements.
- Controlled prototype testing of temperature, relative humidity, airflow, water use, and electrical input where measurement equipment is available.
- Basic evaluation of assembly, operation, cleaning, durability, and practical constraints.

### Outside the current scope / unresolved questions

- A claim that ClayBreeze can replace an air conditioner or any existing evaporative cooler.
- A guaranteed temperature reduction, cooling capacity, energy saving, financial payback, carbon reduction, or water-efficiency advantage.
- A validated whole-room cooling assessment. Air temperature measured immediately at the outlet is not the same as a room-wide comfort or temperature reduction.
- Long-term durability, hygiene, corrosion resistance, and service life. These require extended use and inspection.
- Final dimensions for the reservoir, pump tubing, distributor, rod cuts, fan mounts, and pot spacing until they have been measured and confirmed.

## 9. Expected Outcomes and Planned Testing

The expected outcome at this stage is a completed and documented prototype plus a test dataset—not a guaranteed level of cooling. Testing should compare a **fan-only / dry-media baseline** with a **wetted-pot operating condition** where practical, keeping fan settings, sensor positions, and test duration consistent. Record the ambient conditions for each run and repeat trials where time and equipment allow. Do not compare runs as if conditions were identical when temperature, humidity, wind, or solar exposure have changed substantially.

### Planned measurements

| Measurement | Suggested method / record | Why it matters |
|---|---|---|
| Inlet air temperature | Place a temperature sensor upstream of the pot array (behind the rear fans, where room air enters), away from direct contact with wet clay and direct radiant heating. Record sensor type and position. | Establishes the incoming air condition. |
| Outlet air temperature | Measure downstream of the array (in front of the pots, where air leaves into the room) at a documented point; consider multiple points if outlet flow is uneven. | Allows calculation of the temperature difference across the assembly. |
| Inlet and outlet relative humidity | Measure alongside temperatures with suitable sensors; record model and resolution if known. | Indicates moisture change and helps interpret cooling performance. |
| Ambient conditions | Record time, ambient temperature/RH, and whether the setup is indoors or outdoors; note sun exposure and wind when relevant. | Provides context for comparisons and the humidity effect. |
| Air velocity / airflow | Use an anemometer at documented measurement points if available. A single velocity reading is not automatically the total volumetric flow rate. | Helps characterise fan-driven air movement and compare runs. |
| Water consumption | Record initial and final reservoir volume or mass for a timed run; separately note leaks, splashes, drain losses, and refill events. | Helps estimate net water use during the test. |
| Electrical input | Record fan and pump nameplate ratings; measure actual power with an appropriate meter if available and safe to do so. | Distinguishes rated input from measured operating input. |
| Distribution and return flow | Photograph wetting patterns, observe dry spots, inspect return flow, and check for leakage. | Identifies uneven wetting, drainage problems, and water losses. |

For each run, record the date, start/end time, setup configuration, pot arrangement, fan setting, pump setting, initial/final reservoir level, sensor locations, and any issues. If instruments or calibrated sensors are unavailable, state this limitation rather than presenting unverified readings as precise data.

Useful calculated quantities, once reliable measurements exist, include:

- **Air-temperature difference:** `ΔT = inlet temperature − outlet temperature`. A positive value indicates that the measured outlet air is cooler than the measured inlet air for that run; it does not, by itself, establish whole-room cooling performance.
- **Relative-humidity difference:** `ΔRH = outlet RH − inlet RH`, expressed in percentage points. Interpret this with the simultaneous temperature readings because relative humidity changes with temperature.
- **Water-use rate:** measured net water loss divided by the test duration, with leaks and other losses recorded separately where possible.
- **Electrical energy per test:** measured average electrical power multiplied by operating time, if suitable power measurements are available.

**Results status:** Cooling performance, water consumption, airflow, electrical energy use, cost comparison, and environmental impacts are **Pending testing**. No ClayBreeze test results have been recorded in this overview. Add a dated results table and plots only when the underlying data are available; retain raw measurements and explain uncertainty, sensor accuracy, test conditions, and repeatability.

## 10. Research References

The references below provide background on the inspiration project, the physics of evaporative cooling, porous clay/ceramic evaporative media, conventional evaporative pads, and air-conditioning considerations. They provide context for designing the test plan; they do **not** establish ClayBreeze's performance.

1. **The Times of India / ETimes Trending Desk.** “Inside Project Vayu: Delhi students turn kulhads and scrap wood into eco-coolers for underprivileged government school kids.” Published 8 May 2026. [Article](https://timesofindia.indiatimes.com/etimes/trending/inside-project-vayu-delhi-students-turn-kulhads-and-scrap-wood-into-eco-coolers-for-underprivileged-government-school-kids/articleshow/130960612.cms). *Media reporting about the separate Project Vaayu initiative; cited as inspiration, not as independent validation of ClayBreeze.*
2. **Action For Nature.** “Amaira Kapoor” — 2026 Eco-Hero winner information describing Project Vaayu. [Award listing](https://actionfornature.org/eco-hero-winners/tag/Terracotta%2BCooling). *A project profile, not a test report for ClayBreeze.*
3. **Watson, J. A., Gómez, C., Bucklin, R., Leary, J. D., & McConnell, D. B.** *Fan and Pad Greenhouse Evaporative Cooling Systems.* University of Florida, IFAS Extension, publication CIR1135/AE069. [Extension guide](https://edis.ifas.ufl.edu/AE069). Explains evaporative cooling, wet-bulb temperature, humidity, pad types, operation, and maintenance.
4. **El-Said, E. M. S., et al.** “Experimental investigation of earth-air heat exchanger using porous clay vessels for eco-friendly buildings.” *Scientific Reports*, 14, article 17548 (2024). [Open-access research article](https://www.nature.com/articles/s41598-024-67212-5). Experiments with porous clay vessels under defined conditions, including different airflow rates and inlet relative humidity. The system is not identical to ClayBreeze.
5. **Laknizi, A., Ben Abdellah, A., Faqir, M., Essadiqi, E., & Dhimdi, S.** “Performance characterization of a direct evaporative cooling pad based on pottery material.” *International Journal of Sustainable Engineering*, 14(1), 46–56 (2021; first published online in 2019). [https://doi.org/10.1080/19397038.2019.1677800](https://doi.org/10.1080/19397038.2019.1677800). Experimental study of a pottery-based tubular media arrangement and the influence of airflow. Its results apply to its tested design and conditions only.
6. **Mittal, A., Kataria, T., Das, G. K., & Chatterjee, S. G.** “Evaporative Cooling of Water in a Small Vessel Under Varying Ambient Humidity.” *International Journal of Green Energy*, 3(4), 347–368 (2006). [https://doi.org/10.1080/01971520600704654](https://doi.org/10.1080/01971520600704654). Experimental work on a small porous clay vessel showing that ambient humidity affects evaporative cooling.
7. **He, J., & Hoyano, A.** “Experimental study of cooling effects of a passive evaporative cooling wall constructed of porous ceramics with high water soaking-up ability.” *Building and Environment*, 45(2), 461–472 (2010). [https://doi.org/10.1016/j.buildenv.2009.07.002](https://doi.org/10.1016/j.buildenv.2009.07.002). Studies water absorption and evaporative behaviour of a porous ceramic wall; it is not the same configuration as ClayBreeze.
8. **U.S. Department of Energy, Federal Energy Management Program.** “Best Management Practice #13: Other Water-Intensive Processes.” [Guidance](https://www.energy.gov/cmei/femp/best-management-practice-13-other-water-intensive-processes). Includes discussion of evaporative coolers, recirculation, water use, mineral deposits, and maintenance.
9. **U.S. Environmental Protection Agency.** “Transitioning to Low-GWP Alternatives in Residential and Light Commercial Air Conditioning.” Updated 7 July 2026. [EPA guidance](https://www.epa.gov/snap/transitioning-low-gwp-alternatives-residential-and-light-commercial-air-conditioning). Explains refrigerant global-warming-potential considerations and the availability of lower-GWP alternatives.
10. **ENERGY STAR.** “Room Air Conditioners.” [Product guidance](https://www.energystar.gov/products/room_air_conditioners). Discusses equipment sizing and energy-efficiency considerations for room air conditioners.
11. **Jain, J. K., & Hindoliya, D. A.** “Experimental performance of new evaporative cooling pad materials.” *Sustainable Cities and Society*, 1(4), 252–256 (2011). [https://doi.org/10.1016/j.scs.2011.07.005](https://doi.org/10.1016/j.scs.2011.07.005). Laboratory comparison including khus and aspen fibres and other pad materials.
12. **Al-Sulaiman, F.** “Evaluation of the performance of local fibers in evaporative cooling.” *Energy Conversion and Management*, 43(16), 2267–2273 (2002). [https://doi.org/10.1016/S0196-8904(01)00121-2](https://doi.org/10.1016/S0196-8904(01)00121-2). Experimental comparison of natural fibre pad materials and a commercial wetted pad, including performance degradation and material maintenance considerations.
13. **Ministry of Environment, Forest & Climate Change (Ozone Cell), Government of India.** *India Cooling Action Plan.* New Delhi, March 2019. [Official page](https://ozonecell.nic.in/india-cooling-action-plan) · [PDF](https://ozonecell.nic.in/wp-content/uploads/2019/03/INDIA-COOLING-ACTION-PLAN-e-circulation-version080319.pdf). National plan on access to cooling, rising cooling demand, refrigerant transition and energy efficiency; cited qualitatively, no figures used.

---

*Documentation note: Update this overview when the SolidWorks model has been revised to match the as-built prototype, and when performance-testing results are available. Replace pending-status notes only when measurements, inspections, or other evidence support the change.*
