# Testing and Results

> **Results status: Pending testing.** The physical prototype (frame, rods, fan mount, finish and 30 pots) is assembled. The pump, reservoir and tubing are installed (reported by team; photo evidence pending); water circulation and commissioning are PENDING. The fan rule is IMPLEMENTED (reported) — firmware not yet in repository; not verified. This file defines the proposed test plan. It contains no measured ClayBreeze performance data.

## 1. Test Objectives

- Determine whether outlet air temperature differs from inlet air temperature in the assembled system.
- Record how inlet/outlet relative humidity changes during operation.
- Check water-distribution uniformity, drainage and leakage.
- Measure or estimate airflow and record pump/fan electrical input where suitable instruments are available.
- Estimate water use over a defined operating period.
- Compare operating modes only when setup and ambient conditions are sufficiently similar.
- Verify the programmed fan-control electronics against their intended behaviour (see Section 1a) before relying on them during cooling tests.

## 1a. Electronics and Control Verification (planned, not yet performed)

These checks have not been performed yet; this is the plan, not a result. See `docs/electronics-and-control.md` for full details of the current, planned and proposed control logic.

- Compare DHT11 readings against a separate reference thermometer/hygrometer at the same location, to characterise sensor accuracy.
- Add the firmware source to the repository, then confirm that both fans switch on above 35 °C and off below it, as reported; behaviour at exactly 35.0 °C is unconfirmed — check it against the actual code and on the bench.
- Watch for relay chatter (rapid on/off switching) when the temperature sits close to the 35 °C threshold, and note whether hysteresis is needed.
- Once implemented, verify the planned two-stage fan logic (28 °C and 35 °C thresholds) the same way.
- Once the proposed humidity-based control is implemented on the installed pump, verify the 60 %/70 % switching band and its hysteresis behaviour, and record whether the chosen thresholds give a usable result — they are starting values, not validated ones.
- Check sensor placement (whether the DHT11 reads representative inlet or outlet air), startup behaviour, switching delay, and whether a manual override exists and works.

## 2. Suggested Operating Conditions

Where practical, compare:

1. **Fan-only / dry-media baseline:** fans operating with the pots dry and pump off.
2. **Wetted-pot condition:** pump and fans operating with the pot array wetted.
3. **Optional pump-only observation:** assess water distribution and return flow without running fans, if useful for setup checks.

Use the same sensor locations, fan settings, test duration and general installation for comparisons. Record ambient temperature, relative humidity, indoor/outdoor location, solar exposure, wind and any changes in settings. If conditions change substantially between runs, note that the runs are not a controlled comparison. Repeat trials where feasible.

## 3. Instrument Placement

- **Inlet temperature/RH:** upstream of the pot array — behind the rear fans, where room air enters — away from direct contact with wet clay and abnormal radiant heat sources.
- **Outlet temperature/RH:** downstream of the array — in front of the pots, where air leaves into the room — at a documented location. Consider several points if outlet flow is uneven.
- **Ambient conditions:** record temperature and relative humidity near the setup, without placing the sensor in the wet airflow unless that is the intended measurement.
- **Air velocity:** if an anemometer is available, record measurement position and direction. One point velocity is not automatically total volumetric flow.
- **Water volume/mass:** record starting and ending reservoir levels/volume or mass and note refills, leaks, splashes and drainage losses.
- **Electrical power:** record nameplate ratings separately from actual measured input. Use an appropriate meter only when safe and suitable for the electrical setup.

## 4. Data Table

Use [`../data/test-data-template.csv`](../data/test-data-template.csv) to collect raw readings. Also keep any handwritten notes or instrument screenshots needed to trace the measurements. Note each sensor's model, resolution and known accuracy where available.

## 5. Calculations

### Air-temperature difference

`ΔT = inlet temperature − outlet temperature`

A positive result means the measured outlet air was cooler than the measured inlet air for that run. It does not by itself establish room-wide cooling, comfort improvement or superiority to another cooler.

### Relative-humidity difference

`ΔRH = outlet relative humidity − inlet relative humidity`

Report this in percentage points. Interpret RH together with the simultaneous temperature readings because relative humidity depends on temperature.

### Water-use rate

`Water-use rate = measured net water loss / test duration`

Report units and test duration. Separate measured evaporation from leaks, splashes or other losses where possible. A reservoir level change alone does not prove that all lost water evaporated.

### Electrical energy

If measured average electrical power is available:

`Electrical energy = average power × operating time`

Report whether the value includes both fans and the pump, and state whether power was measured or merely estimated from nameplates.

## 6. Results Table Template

| Test ID | Date/time | Mode | Ambient T (°C) | Ambient RH (%) | Inlet T (°C) | Outlet T (°C) | Inlet RH (%) | Outlet RH (%) | Water change (L) | Air velocity (m/s) | Electrical input (W) | Notes |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Pending | — | — | — | — | — | — | — | — | — | — | — | No test results recorded yet |

Delete the placeholder row when actual testing begins and add one row per run. Do not fill missing readings with estimates without explicitly identifying them as estimates.

## 7. Interpretation and Reporting

Report all relevant conditions and limitations alongside results. Include repeated runs and variation where available. Avoid using a single outlet-temperature reading to claim a guaranteed reduction, whole-room cooling, savings, payback or environmental benefits. Compare ClayBreeze with another product only when the comparison method, operating conditions and costs are clearly defined.

## 8. Commissioning Checklist

- [x] Frame, rods, fan mount, paint and pot installation mechanically complete
- [ ] As-built frame measurements recorded (visual inspection done)
- [ ] Loose fan cable secured and terminated before powered testing
- [ ] Fans secure and guarded
- [ ] Pump, reservoir and tubing photographed and specifications recorded
- [ ] Fan-control electronics (ESP32/relay/DHT11) verified against the programmed rule
- [ ] Pump and tubing secured
- [ ] No leaks or uncontrolled splashing
- [ ] Distribution outlets wet the intended areas
- [ ] Return water flows into the reservoir
- [ ] Humidity-based pump control implemented and checked against the proposed thresholds
- [ ] Airflow direction verified
- [ ] Bypass and blocked openings inspected
- [ ] Sensors placed and identified
- [ ] Ambient conditions recorded
- [ ] Raw data saved and backed up
