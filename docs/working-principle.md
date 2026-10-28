# Working Principle: ClayBreeze

## 1. Concept

ClayBreeze investigates direct evaporative cooling using wetted, unglazed clay pots and fan-driven airflow. A pump is intended to move water from a bottom reservoir to a distribution arrangement above the pot array. Two exhaust fans on the rear extension frame, wired to an ESP32 + relay module and reported as programmed to switch on temperature, are mounted at the rear, blowing room air forward through and around the pot array. Excess water is intended to return to the reservoir, if the drainage arrangement supports this in practice.

The frame, rod attachment, fan mount, paint finish and pot installation are physically complete. The pump, reservoir and tubing are installed (reported by team; photo evidence pending), but water circulation is PENDING — not yet commissioned or verified. The fan rule is IMPLEMENTED (reported); the firmware is not yet in this repository and has not been verified (see `docs/electronics-and-control.md`). Commissioning, flow uniformity, bypass airflow, temperature change, humidity change and water consumption remain to be checked and measured — see `docs/testing-and-results.md`.

### 1a. Clay-Pot Orientation and Intended Airflow Path

Based on the assembled frame (see the project gallery) and the SolidWorks pot model, the pots are mounted in rows with their open mouths facing the front of the frame, and each row is threaded onto a horizontal retaining rod running through the pot body. The airflow path, confirmed by the team, is: room air is taken in behind the two exhaust fans on the rear extension frame, blown forward through and around the wetted pots, and leaves through the open front into the room.

Because the pots do not form a sealed surface against the frame or against each other, some incoming air can bypass the pots rather than pass through or directly across their wetted surface. **This bypass has not yet been measured** and must be evaluated during commissioning — see the open design questions in `docs/design-and-dimensions.md` (whether a shroud or plenum is needed) and the verification plan in `docs/testing-and-results.md`.

## 2. Evaporative Cooling

When liquid water evaporates, it absorbs latent heat from the water, surrounding surface and nearby air. If an exposed porous surface stays wet and air moves across it, evaporation can reduce the temperature of the surface and may reduce the temperature of the air leaving the assembly. Direct evaporative cooling also adds moisture to the air.

Unglazed clay may absorb and transport water through connected pores, but the behaviour depends on the clay body, firing, porosity, geometry and actual wetting. The pots used in ClayBreeze should therefore be checked and measured rather than assumed to have uniform porosity or water absorption.

## 3. Intended Operating Sequence

1. The pump draws water from the bottom reservoir.
2. Tubing carries water to a top distribution arrangement.
3. Water is intended to wet the clay surfaces. Dry patches or excessive runoff should be recorded.
4. The rear fans blow room air forward through and around the pot array and out of the front. The final airflow path must be checked for bypass around the pot assembly.
5. Unevaporated water should drain back to the reservoir if the return path is correctly designed.
6. Inlet and outlet temperature and relative humidity are measured to evaluate the result.

## 4. Relative Humidity and Wet-Bulb Temperature

The potential for direct evaporative cooling depends strongly on incoming air conditions. Drier air generally has a greater difference between dry-bulb and wet-bulb temperature and can accept more moisture through evaporation. As incoming relative humidity increases, the theoretical cooling opportunity generally decreases. The wet-bulb temperature is a useful reference, not a forecast of the actual ClayBreeze outlet temperature.

## 5. Other Factors That Affect Performance

- **Pot material and porosity:** affect absorption, wetting and evaporation.
- **Exposed wet area:** more wetted area may increase contact, but geometry and drainage matter.
- **Water distribution:** dry spots reduce useful wetted area; excessive flow may increase water loss without proportionate cooling.
- **Airflow and contact time:** high airflow can increase delivery but may reduce the time air contacts the wetted medium. The best setting must be tested.
- **Air bypass:** air taking an easier path around the pots reduces contact with the cooling medium.
- **Ambient conditions:** temperature, humidity, sunlight and wind can affect comparisons.
- **Maintenance:** deposits, debris, biological growth and stagnant water may affect reliability and hygiene.

## 6. What Must Be Measured

At minimum, record inlet and outlet air temperature, inlet and outlet relative humidity, ambient conditions, fan/pump configuration and test duration. Where possible, also measure airflow, water consumed and electrical power. Use repeated trials when feasible and note sensor accuracy and location.

Calculate `ΔT = inlet temperature − outlet temperature`. A positive value means the measured outlet air was cooler than the inlet during that run; by itself, this does not prove room-wide cooling or overall superiority to another cooler.

## References

- University of Florida IFAS, [Fan and Pad Greenhouse Evaporative Cooling Systems](https://edis.ifas.ufl.edu/AE069).
- El-Said et al. (2024), [Experimental investigation of earth-air heat exchanger using porous clay vessels for eco-friendly buildings](https://www.nature.com/articles/s41598-024-67212-5).
- Laknizi et al., [Performance characterization of a direct evaporative cooling pad based on pottery material](https://doi.org/10.1080/19397038.2019.1677800).
- Mittal et al. (2006), [Evaporative Cooling of Water in a Small Vessel Under Varying Ambient Humidity](https://doi.org/10.1080/01971520600704654).
