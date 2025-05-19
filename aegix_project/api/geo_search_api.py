from flask import Flask, request, jsonify
from flask_cors import CORS
from subprocess import run
import json
import os

app = Flask(__name__)
CORS(app)

@app.route("/api/geo-scan", methods=["POST"])
def geo_scan():
    data = request.json
    lat = data.get("lat")
    lon = data.get("lon")
    radius = data.get("radius", 1000)  # default to 1000m if not provided

    if lat is None or lon is None:
        return jsonify({"error": "Missing lat/lon"}), 400

    # Update LAT/LON/RADIUS in scanner file
    scanner_path = "geo_locator/telegram_geo_scanner.py"
    with open(scanner_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    for i, line in enumerate(lines):
        if line.startswith("LAT ="):
            lines[i] = f"LAT = {lat}\n"
        elif line.startswith("LON ="):
            lines[i] = f"LON = {lon}\n"
        elif line.startswith("RADIUS ="):
            lines[i] = f"RADIUS = {radius}\n"

    with open(scanner_path, "w", encoding="utf-8") as f:
        f.writelines(lines)

    # Run scanner
    result = run(["python", scanner_path], capture_output=True, text=True)
    if result.returncode != 0:
        print("[ERROR] Scanner failed:")
        print(result.stderr)
        return jsonify({"error": "Failed to run scanner", "details": result.stderr}), 500

    if not os.path.exists("geo_users.json"):
        return jsonify({"error": "No geo_users.json output"}), 500

    with open("geo_users.json", "r", encoding="utf-8") as f:
        try:
            users = json.load(f)
        except json.JSONDecodeError:
            return jsonify({"error": "geo_users.json is corrupted or empty"}), 500

    return jsonify(users)

if __name__ == "__main__":
    app.run(port=5005, debug=True)
