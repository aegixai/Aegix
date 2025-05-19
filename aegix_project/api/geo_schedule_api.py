from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

SCHEDULE_FILE = "scheduled_scans.json"

@app.route("/api/schedule-scan", methods=["POST"])
def schedule_scan():
    data = request.json
    address = data.get("address")
    date = data.get("date")
    time = data.get("time")

    if not address or not date or not time:
        return jsonify({"error": "Missing address/date/time"}), 400

    entry = {
        "address": address,
        "datetime": f"{date} {time}"
    }

    # Load or create JSON list
    if os.path.exists(SCHEDULE_FILE):
        with open(SCHEDULE_FILE, "r", encoding="utf-8") as f:
            scans = json.load(f)
    else:
        scans = []

    scans.append(entry)

    with open(SCHEDULE_FILE, "w", encoding="utf-8") as f:
        json.dump(scans, f, ensure_ascii=False, indent=2)

    return jsonify({"status": "scheduled"})

if __name__ == "__main__":
    app.run(port=5005, debug=True)
