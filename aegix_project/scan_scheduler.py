import json
import os
import time
from datetime import datetime
from subprocess import run

SCHEDULE_FILE = "scheduled_scans.json"
SCANNER_PATH = "geo_locator/telegram_geo_scanner.py"

def load_scheduled_scans():
    if not os.path.exists(SCHEDULE_FILE):
        return []
    with open(SCHEDULE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_remaining_scans(scans):
    with open(SCHEDULE_FILE, "w", encoding="utf-8") as f:
        json.dump(scans, f, indent=2, ensure_ascii=False)

def update_scanner_coordinates(lat, lon):
    with open(SCANNER_PATH, "r", encoding="utf-8") as f:
        lines = f.readlines()
    for i, line in enumerate(lines):
        if line.startswith("LAT ="):
            lines[i] = f"LAT = {lat}\n"
        elif line.startswith("LON ="):
            lines[i] = f"LON = {lon}\n"
    with open(SCANNER_PATH, "w", encoding="utf-8") as f:
        f.writelines(lines)

def run_geo_scan(timestamp_str):
    print(f"[SCAN] Executing scheduled scan at {timestamp_str}")
    result = run(["python", SCANNER_PATH], capture_output=True, text=True)
    if result.returncode != 0:
        print("[ERROR] Scan failed:")
        print(result.stderr)
    else:
        output_name = f"geo_users_{timestamp_str.replace(':', '-').replace('T', '_')}.json"
        if os.path.exists("geo_users.json"):
            os.rename("geo_users.json", output_name)
            print(f"[✓] Saved scan to {output_name}")

def main_loop():
    while True:
        now = datetime.utcnow().replace(second=0, microsecond=0)
        scans = load_scheduled_scans()
        remaining = []

        for scan in scans:
            scan_time = datetime.fromisoformat(scan["datetime"])
            if scan_time <= now:
                update_scanner_coordinates(scan["lat"], scan["lon"])
                run_geo_scan(scan["datetime"])
            else:
                remaining.append(scan)

        save_remaining_scans(remaining)
        time.sleep(60)

if __name__ == "__main__":
    print("[🛰️] Scheduled Scan Monitor is running...")
    main_loop()
