# Electronics and Control

This document covers the control electronics currently wired into ClayBreeze, the fan-control logic the team reports as programmed (firmware not yet in this repository; not verified), and the fan and pump control logic that is planned or proposed but not yet implemented. It does not document GPIO pin assignments, relay logic levels (active-high/active-low), power ratings, or wiring connections — none of that has been supplied, and none of it should be assumed. Take those details from the actual firmware source and the component datasheets, not from this document.

## 1. Components and Their Roles

| Component | Role |
|---|---|
| **ESP32 microcontroller** | Reads the DHT11 sensor, runs the control logic, and drives the relay module. |
| **Relay module** | Switches the two exhaust fans under ESP32 control. Switching the (already installed) water pump is PROPOSED, not implemented. |
| **DHT11 sensor** | Measures ambient temperature and relative humidity and reports them to the ESP32. |
| **Breadboard** | Current prototyping platform for the ESP32, relay module and DHT11 wiring. |
| **Jumper wires** | Connect the breadboard, ESP32, relay module and DHT11. |
| **Two exhaust fans** | Mounted at the rear, blowing room air forward through the pot array. Switched by the relay module; reported as controlled by temperature only. |
| **Water pump** | Installed (reported by team; photo evidence pending). Water circulation is PENDING — not yet commissioned or verified. Not switched by the relay/ESP32 system — humidity-based control is PROPOSED, not implemented (Section 5). |

## 2. System Architecture (Functional, Not a Wiring Diagram)

The diagram below shows the intended functional relationship between the components — what reads what, and what controls what. It is **not** a wiring or pin-connection diagram, and it does not specify voltages, logic levels or GPIO numbers.

```
  DHT11 (temperature, RH)
        │
        ▼
     ESP32  ── runs control logic (see Sections 3–5)
        │
        ▼
  Relay module
    │        │
    ▼        ▼
 Fan 1,   Water pump
 Fan 2    (installed — reported; relay
(temperature- control is PROPOSED, not
 controlled,  wired/implemented)
 IMPLEMENTED
 — reported)
```

The fan path (DHT11 → ESP32 → relay → fans) is reported as wired and programmed. The water pump is reported as installed, but the pump path in this diagram (relay → pump, based on humidity) is a PROPOSED extension of the same architecture — not wired or implemented.

## 3. Current Fan-Control Logic — IMPLEMENTED (reported) — firmware not yet in repository; not verified

This is the rule the team reports as programmed on the ESP32. The firmware source has not yet been added to this repository, so the rule below has not been checked against code:

| Condition | Both fans |
|---|---|
| Temperature **above** 35 °C | ON |
| Temperature **below** 35 °C | OFF |
| Temperature **at exactly** 35.0 °C | **Unconfirmed** — verify against the actual source code |

This is the only control logic reported as programmed and wired. It has not been claimed, and should not be assumed, to have been fully bench-tested end to end — see the verification plan in `docs/testing-and-results.md` (Section 1a) for what still needs to be checked, including behaviour at the 35 °C boundary and whether the relay chatters (switches rapidly) when the reading sits close to it.

## 4. Planned Improved Fan-Control Logic — PLANNED, NOT IMPLEMENTED

This two-stage rule is intended for a future revision. **It is not running on the hardware today.**

| Condition | Fan 1 | Fan 2 |
|---|---|---|
| Temperature **≤ 28 °C** | OFF | OFF |
| Temperature **> 28 °C and ≤ 35 °C** | ON | OFF |
| Temperature **> 35 °C** | ON | ON |

Before implementing this, hysteresis around the 28 °C and 35 °C switching points should be evaluated, so that a reading hovering right at a threshold doesn't cause the relays to cycle rapidly. No specific hysteresis band has been decided yet. Implementing this logic should not silently replace the current programmed rule in Section 3 without the change being reviewed and recorded.

## 5. Proposed Humidity-Based Water-Pump Control — PROPOSED / TO BE TESTED

The water pump is installed (reported by team; photo evidence pending), but no humidity-based control has been implemented — it is not yet switched by the relay/ESP32 system. The following is a **starting proposal for bench testing**, not a validated or final control scheme:

| Condition | Pump |
|---|---|
| Relative humidity **≤ 60%** | ON |
| Relative humidity **≥ 70%** | OFF |
| Relative humidity **between 60% and 70%** | Retain the pump's previous state (hysteresis band) |

These thresholds (60% / 70%) are provisional, adjustable starting values for initial bench testing — they are **not** scientifically validated optimal thresholds, and this scheme does not guarantee any particular humidity or cooling outcome.

Two physical effects are worth keeping in mind when interpreting this logic:

- **Direct evaporative cooling generally has less cooling potential at high incoming relative humidity** — as the incoming air gets closer to saturation, there is less room for additional moisture to evaporate, so switching the pump off at high RH is intended to avoid pumping water with little cooling benefit, not because high humidity itself is unsafe.
- **Stopping the pump does not instantly dry the clay pots.** Their wetted surfaces can continue to evaporate water for some time after the pump switches off, so the system's actual humidity and cooling behaviour will lag behind the pump's on/off state. This should be accounted for when interpreting any test results, not treated as an instant cutoff.

## 6. Remaining Engineering Decisions

These are open items, not yet resolved — do not treat any of them as decided:

- **Sensor placement:** where the DHT11 should sit to give a representative reading (ambient vs. inlet vs. outlet air) has not been finalised.
- **Startup behaviour:** what the fans/pump should do in the first moments after power-on, before a valid sensor reading is available, is undefined.
- **Switching delay / debounce:** whether a minimum time between switches is needed to protect the relay and avoid rapid cycling has not been decided (related to the hysteresis note in Sections 4 and 5).
- **Manual override:** whether an operator can force the fans or pump on/off independent of the sensor reading is not documented here and should be confirmed against the actual code.
- **Threshold validation:** the 35 °C fan threshold and the proposed 28 °C / 60–70% RH values all need to be checked against real measurements before they're treated as final — see `docs/testing-and-results.md`.

## 7. Status Summary

| Item | Status |
|---|---|
| ESP32 + relay + DHT11 wiring (breadboard) | **Done (reported)** |
| Current fan-control logic (Section 3) | **IMPLEMENTED (reported)** — firmware not yet in repository; not verified |
| Planned two-stage fan logic (Section 4) | **PLANNED, not implemented** |
| Proposed humidity-based pump logic (Section 5) | **PROPOSED, not implemented, not tested** |
| Water pump / motor hardware | **Installed (reported by team; photo evidence pending)**; not relay-controlled |
| Water circulation | **PENDING** — not yet commissioned or verified |
| Fan supply cable | Loose and unterminated in the assembly photographs — secure before powered testing |
| Full end-to-end control system test | **Not performed** |

A browser-based simulation of all three logic tables above — for walking through the thresholds during a presentation — is available on the project website under **Control Logic Lab**. It is a software simulation only; it has no connection to the actual ESP32, DHT11 or relay hardware.
