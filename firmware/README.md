# ClayBreeze firmware

`claybreeze_controller/claybreeze_controller.ino` is the ESP32 sketch for the ClayBreeze controller.

## Pins

| Breadboard | ESP32 GPIO | Connected to |
|---|---|---|
| 7A | GPIO32 | DHT11 DATA |
| 9A | GPIO25 | Relay IN1 – Fan 1 |
| 10A | GPIO26 | Relay IN2 – Fan 2 |
| 11A | GPIO27 | Relay IN3 – Water motor |
| 14A | GND | Common ground |

- DHT11: VCC → ESP32 3.3V; DATA → GPIO32 (7A); GND → common GND.
- Relay module: VCC → the module's rated supply (5 V typical); GND → common GND.
- The relay module is **active-low**: LOW = ON, HIGH = OFF (`RELAY_ON = LOW`, `RELAY_OFF = HIGH`).

## Logic

Every ~2 s (timed with `millis()`, no blocking delay) the ESP32 reads the DHT11. A failed reading (NaN) is skipped and the outputs stay as they are. Each output has hysteresis — between its two limits it keeps its previous state:

| Output | Relay input | GPIO | ON | OFF |
|---|---|---|---|---|
| Fan 1 | IN1 | GPIO25 | T > 26 °C | T ≤ 25 °C |
| Fan 2 | IN2 | GPIO26 | T > 30 °C | T ≤ 29 °C |
| Water motor | IN3 | GPIO27 | RH < 75 % | RH ≥ 77 % |

At start-up each relay pin is written HIGH **before** `pinMode(OUTPUT)`, so every relay starts OFF and none clicks on during boot.

Serial Monitor (115200 baud), one line per reading:

```
T: 27.0 C | RH: 58.0 % | Fan1: ON | Fan2: OFF | Motor: ON
```

## Libraries

- **DHT sensor library** by Adafruit (tested with 1.4.7)
- **Adafruit Unified Sensor** (dependency, tested with 1.1.15)

Install both from the Arduino IDE Library Manager.

## Upload

1. Arduino IDE → Boards Manager → install **esp32 by Espressif Systems**.
2. Open `claybreeze_controller/claybreeze_controller.ino`.
3. Tools → Board → **ESP32 Dev Module**; Tools → Port → the ESP32's COM port.
4. Click **Upload** (if it waits at "Connecting…", hold the board's BOOT button until the upload starts).
5. Open the Serial Monitor at **115200** baud.

Command line (compile verified 28 Nov 2026 with arduino-cli 1.6.0 and esp32 core 4.0.0: 294,105 bytes, 22 % of flash; not flashed from this repository):

```
arduino-cli compile --fqbn esp32:esp32:esp32 firmware/claybreeze_controller
arduino-cli upload  --fqbn esp32:esp32:esp32 -p COM3 firmware/claybreeze_controller
```

Replace `COM3` with the board's port.

## Simulator

The website's **Circuit & Control Lab** runs the same thresholds and hysteresis in the browser (values in `assets/js/project-data.js`, `window.CLAYBREEZE_CONTROL`). It is a simulator — not connected to hardware.
