from flask import Blueprint, jsonify
import json
import os
from datetime import datetime

narrative_api = Blueprint("narrative_api", __name__)

@narrative_api.route("/api/narratives", methods=["GET"])
def get_narrative_data():
    try:
        file_path = os.path.join(os.path.dirname(__file__), "../data/company_analysis/mock_narratives_with_dates.json")
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Parse & format
        for item in data:
            date = item.get("date")
            if date:
                try:
                    item["date"] = datetime.strptime(date, "%Y-%m-%d").strftime("%Y-%m-%d")
                except:
                    item["date"] = "2025-05-01"

        return jsonify({"narratives": data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
