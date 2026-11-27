# Electronics and Control

This document covers the control electronics integrated into ClayBreeze and the control logic now running on the ESP32. It does not document GPIO pin assignments, relay-channel mapping, relay logic levels (active-high/active-low), power ratings or wiring connections — none of that has been supplied, and none of it should be assumed. Take those details from the firmware source and the component datasheets, not from this document.

Firmware source will be added to this repository.

## 1. Components and Their Roles

| Component | Role |
|---|---|
| **ESP32 microcontroller** | Reads the DHT11 sensor, runs the control logic, and drives the relay module. |
| **3-channel relay module** | Switches the two exhaust fans and the water pump under ESP32 control. Which channel drives which load is not documented here. |
| **DHT11 sensor** | Measures temperature and relative humidity for the ESP32. |
| **Breadboard + jumper wires** | Prototyping platform connecting the ESP32, relay module and DHT11. Not water-resistant; keep it away from splashes. |
| **Two exhaust fans** | Mounted at the rear, blowing room air forward through the pot array. Switched in two stages on temperature (Section 3). |
| **Water pump (motor) + tubing + reservoir** | Installed. Lifts water from the reservoir to the pots. Switched on humidity (Section 4). |

**Electronics enclosure — laser cutting in progress.** A laser-cut box will house the ESP32, the relay module and the DHT11 wiring: six finger-jointed panels for a 120 × 150 × 100 mm box in 3 mm MDF (material from the file names). DXF: [`cad/dxf-enclosure/basic-box-120x150x100-3mm.dxf`](../cad/dxf-enclosure/basic-box-120x150x100-3mm.dxf). Details: [digital-fabrication.md, section C](digital-fabrication.md#d-applied-in-claybreeze-electronics-enclosure).

## 2. System Architecture (Functional, Not a Wiring Diagram)

The diagram below shows the functional relationship between the components — what reads what, and what controls what. It is **not** a wiring or pin-connection diagram, and it does not specify voltages, logic levels, GPIO numbers or relay channels.

```
  DHT11 (temperature, RH)
        │
        ▼
     ESP32  ── runs the control logic (Sections 3–4)
        │
        ▼
  3-channel relay module
    │        │        │
    ▼        ▼        ▼
  Fan 1    Fan 2   Water pump
  (temperature stages)  (humidity)
```

## 3. Fan Control — IMPLEMENTED

| Temperature | Fans |
|---|---|
| **≤ 28 °C** | Both fans OFF |
| **> 28 °C and ≤ 35 °C** | One fan ON |
| **> 35 °C** | Both fans ON |

At exactly 28.0 °C both fans are off; at exactly 35.0 °C one fan is on.

## 4. Water-Pump Control — IMPLEMENTED

| Relative humidity | Pump |
|---|---|
| **< 60 %** | ON |
| **≥ 60 %** | OFF |

At exactly 60.0 % RH the pump is off.

Two physical effects are worth keeping in mind when interpreting this logic:

- **Direct evaporative cooling generally has less cooling potential at high incoming relative humidity** — as the incoming air gets closer to saturation, there is less room for additional moisture to evaporate, so switching the pump off at high RH avoids pumping water with little cooling benefit, not because high humidity itself is unsafe.
- **Stopping the pump does not instantly dry the clay pots.** Their wetted surfaces can continue to evaporate water for some time after the pump switches off, so the system's humidity and cooling behaviour will lag behind the pump's on/off state. Account for this when interpreting test results.

## 5. Open Engineering Questions

These are not yet documented — do not treat any of them as decided:

- **Sensor placement:** where the DHT11 sits (ambient, inlet or outlet air) affects what the thresholds respond to.
- **Startup behaviour:** what the fans and pump do after power-on, before a valid sensor reading is available.
- **Rapid switching:** whether readings close to 28 °C, 35 °C or 60 % RH cause the relays to switch on and off quickly; observe this during testing.
- **Threshold choice:** whether 28 °C, 35 °C and 60 % RH give a useful result is a question for the performance tests in `docs/testing-and-results.md`.

## 6. Status Summary

| Item | Status |
|---|---|
| ESP32 + DHT11 + 3-channel relay module | **Integrated** |
| Two-stage fan control (Section 3) | **IMPLEMENTED** — running on the ESP32 |
| Humidity-based pump control (Section 4) | **IMPLEMENTED** — running on the ESP32 |
| Water pump, tubing and reservoir | **Installed** |
| Laser-cut electronics enclosure (3 mm MDF) | **Laser cutting in progress** |
| Firmware source in this repository | To be added |
| Performance testing | **Next** — see `docs/testing-and-results.md` |

A browser-based simulation of the logic above — for walking through the thresholds during a presentation — is available on the project website under **Control Logic Lab**. It is a software simulation only; it has no connection to the actual ESP32, DHT11 or relay hardware.
