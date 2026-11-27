# ClayBreeze firmware

`claybreeze_controller/claybreeze_controller.ino` is the team's ESP32 sketch, copied unchanged from the Arduino sketchbook (`Claybreeze1.ino`). It already implements the hysteresis control below.

## What it does

Every 2 s the ESP32 reads the DHT11 (temperature and relative humidity). Failed readings (NaN) are skipped with an error message, and then it sets three relay channels:

| Output | Relay input | GPIO | ON | OFF | Between the limits |
|---|---|---|---|---|---|
| Fan 1 | IN1 | GPIO19 | above 26 °C | at or below 25 °C | keeps its previous state |
| Fan 2 | IN2 | GPIO21 | above 30 °C | at or below 29 °C | keeps its previous state |
| Water motor | IN3 | GPIO22 | below 60 % RH | at or above 62 % RH | keeps its previous state |

All relays start OFF. The readings and the three states are printed to the Serial Monitor at 115200 baud.

## Hardware assumptions in the sketch

- DHT11 DATA on **GPIO4** (`DHTPIN 4`, `DHTTYPE DHT11`).
- Relays on **GPIO19 / GPIO21 / GPIO22** (`FAN1_RELAY`, `FAN2_RELAY`, `WATER_RELAY`).
- **Active-LOW relay module:** `RELAY_ON LOW`, `RELAY_OFF HIGH`. For an active-HIGH module, swap these two lines.

The wiring table on the website (Section 07) and in [`docs/electronics-and-control.md`](../docs/electronics-and-control.md) matches these pins.

## Libraries

- **DHT sensor library** by Adafruit (tested with 1.4.7)
- **Adafruit Unified Sensor** (dependency, tested with 1.1.15)

Install both from the Arduino IDE Library Manager.

## Build

Arduino IDE: board **ESP32 Dev Module** (esp32 core by Espressif), open the sketch and click Verify/Upload.

Command line (verified 28 Nov 2026 with arduino-cli 1.6.0 and esp32 core 4.0.0; compiled only, not flashed from this repository):

```
arduino-cli compile --fqbn esp32:esp32:esp32 firmware/claybreeze_controller
```

Result: 294,073 bytes of program storage (22 %), 23,232 bytes of dynamic memory (7 %).

## Simulator

The website's **Circuit & Control Lab** runs the same thresholds and hysteresis in the browser (values in `assets/js/project-data.js`, `window.CLAYBREEZE_CONTROL`). It is a simulator and is not connected to the hardware.
