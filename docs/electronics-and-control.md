# Electronics and Control

This document covers the control electronics of ClayBreeze: the confirmed breadboard wiring, and the control logic running on the ESP32. The firmware is in [`firmware/claybreeze_controller/claybreeze_controller.ino`](../firmware/claybreeze_controller/claybreeze_controller.ino) (see [`firmware/README.md`](../firmware/README.md)).

## 1. Components and Their Roles

| Component | Role |
|---|---|
| **ESP32 microcontroller** | Reads the DHT11 on GPIO4, runs the control logic and drives the relay inputs on GPIO19, GPIO21 and GPIO22. |
| **3-channel relay module** | IN1 switches Fan 1, IN2 switches Fan 2, IN3 switches the water motor. The firmware drives it as an active-LOW module. |
| **DHT11 sensor** | Measures temperature and relative humidity. Powered from the 3.3V rail. |
| **Breadboard + jumper wires** | Prototyping platform connecting the ESP32, relay module and DHT11. Not water-resistant; keep it away from splashes. |
| **Two exhaust fans** | Mounted at the rear, blowing room air forward through the pot array. Each fan has its own relay channel and thresholds (Section 4). |
| **Water pump (motor) + tubing + reservoir** | Installed. Lifts water from the reservoir to the pots. Switched on humidity (Section 5). |

**Laser-cut 3 mm MDF enclosure for the electronics (DXF files).** A finger-jointed box for the ESP32, the relay module and the DHT11 wiring: six panels for a 120 × 150 × 100 mm box (material from the file names). DXF: [`cad/dxf-enclosure/basic-box-120x150x100-3mm.dxf`](../cad/dxf-enclosure/basic-box-120x150x100-3mm.dxf). Details: [digital-fabrication.md, section D](digital-fabrication.md#d-applied-in-claybreeze-electronics-enclosure).

## 2. ESP32 Wiring

Board orientation: antenna at top, USB at bottom; the ESP32 straddles the breadboard centre gap.

| Breadboard | ESP32 pin | Connection |
|---|---|---|
| 1J | V5 (5V) | Right positive rail (5V) |
| 19B | 3V3 | Left positive rail (3.3V) |
| 14B | GND | Left negative rail (GND) |
| 7J | GND | Right negative rail (GND) |
| 13J | GPIO4 (G4) | DHT11 DATA |
| 8J | GPIO19 (G19) | Relay IN1 – Fan 1 |
| 6J | GPIO21 (G21) | Relay IN2 – Fan 2 |
| 3J | GPIO22 (G22) | Relay IN3 – Water motor |

**Peripheral power**

- DHT11 VCC → 3.3V rail; GND → GND rail; DATA → 13J (GPIO4)
- Relay VCC/DC+ → 5V rail; GND/DC− → common GND; IN1/IN2/IN3 → 8J/6J/3J

**Notes**

- Keep the 3.3V and 5V positive rails separate; ground rails are connected together.
- Do not connect CLK, SD2, SD3, CMD, SD1 or SD0.

## 3. System Architecture

```
  DHT11 (temperature, RH) ── DATA → 13J → GPIO4
        │
        ▼
     ESP32  ── reads every 2 s, runs the control logic (Sections 4–5)
        │  GPIO19 (8J)   GPIO21 (6J)   GPIO22 (3J)
        ▼
  3-channel relay module (IN1, IN2, IN3)
    │          │          │
    ▼          ▼          ▼
  Fan 1      Fan 2     Water motor
```

## 4. Fan Control — IMPLEMENTED (with hysteresis)

| Output | ON | OFF | Between the limits |
|---|---|---|---|
| **Fan 1** (IN1, GPIO19) | above 26 °C | at or below 25 °C | keeps its previous state |
| **Fan 2** (IN2, GPIO21) | above 30 °C | at or below 29 °C | keeps its previous state |

Example for Fan 1: 25 → 26.5 → 25.5 → 24.5 °C gives OFF → ON → ON → OFF. The 1 °C band stops the relay from clicking on and off when a reading sits near a threshold.

## 5. Water-Motor Control — IMPLEMENTED (with hysteresis)

| Output | ON | OFF | Between the limits |
|---|---|---|---|
| **Water motor** (IN3, GPIO22) | below 60 % RH | at or above 62 % RH | keeps its previous state |

Example: 59 → 61 → 62 → 61 → 59 % RH gives ON → ON → OFF → OFF → ON.

Two physical effects are worth keeping in mind when interpreting this logic:

- **Direct evaporative cooling generally has less cooling potential at high incoming relative humidity** — as the incoming air gets closer to saturation, there is less room for additional moisture to evaporate, so switching the pump off at high RH avoids pumping water with little cooling benefit, not because high humidity itself is unsafe.
- **Stopping the pump does not instantly dry the clay pots.** Their wetted surfaces can continue to evaporate water for some time after the pump switches off, so the system's humidity and cooling behaviour will lag behind the pump's on/off state. Account for this when interpreting test results.

## 6. Firmware Behaviour

- All relays start OFF at power-on.
- The DHT11 is read every 2 s; a failed reading (NaN) is skipped and an error is printed, so the outputs keep their last state.
- Relay polarity: active-LOW (`RELAY_ON LOW`, `RELAY_OFF HIGH`).
- The Serial Monitor (115200 baud) shows temperature, humidity and the three output states.

## 7. Engineering Notes

- **Sensor placement:** where the DHT11 sits (ambient, inlet or outlet air) affects what the thresholds respond to.
- **Threshold choice:** the 26/25 °C, 30/29 °C and 60/62 % RH values set when each output switches; performance measurement will show how well they suit the cooler (see `docs/testing-and-results.md`).

## 8. Status Summary

| Item | Status |
|---|---|
| ESP32 + DHT11 + 3-channel relay module | **Integrated** (wiring in Section 2) |
| Fan control with hysteresis (Section 4) | **IMPLEMENTED** — running on the ESP32 |
| Water-motor control with hysteresis (Section 5) | **IMPLEMENTED** — running on the ESP32 |
| Water pump, tubing and reservoir | **Installed** |
| Firmware source | In [`firmware/`](../firmware/) — compiles for the ESP32 Dev Module |

**Future scope:** performance measurement, data logging of readings and relay states, IoT monitoring over the ESP32's Wi-Fi, and improvements such as a water-level sensor with a pump dry-run cut-out.

The project website's **Circuit & Control Lab** shows this wiring as an interactive drawing and runs the same thresholds and hysteresis. It is a simulator — not connected to hardware.
