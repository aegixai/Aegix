from flask import Blueprint, request, jsonify
import os, json, shutil
from datetime import datetime

intel_report_api = Blueprint("intel_report_api", __name__)
UPLOADS_DIR = "uploads"
REPORT_FILE = "image_intel_report.json"

# וודא שהתיקייה קיימת
os.makedirs(UPLOADS_DIR, exist_ok=True)

@intel_report_api.route("/api/reports/add-image-check", methods=["POST"])
def add_image_check():
    try:
        data = request.get_json()

        source = data.get("source")
        result = data.get("result")
        score = data.get("score")

        if not source or not result:
            return jsonify({"status": "❌ חסר מידע"}), 400

        # אם הקובץ קיים במחשב המקומי - נעתיק אותו ל־/uploads
        source_path = os.path.join(".", source)
        if os.path.exists(source_path):
            dest_path = os.path.join(UPLOADS_DIR, os.path.basename(source))
            shutil.copy(source_path, dest_path)

        entry = {
            "source": os.path.basename(source),
            "result": result,
            "score": score,
            "timestamp": datetime.utcnow().isoformat()
        }

        report = []
        if os.path.exists(REPORT_FILE):
            with open(REPORT_FILE, "r", encoding="utf-8") as f:
                report = json.load(f)

        report.append(entry)
        with open(REPORT_FILE, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        return jsonify({"status": "✅ נשמר לדוח", "entry": entry})

    except Exception as e:
        return jsonify({"status": "❌ שגיאה", "error": str(e)}), 500


@intel_report_api.route("/api/reports/view", methods=["GET"])
def view_report():
    try:
        if not os.path.exists(REPORT_FILE):
            return jsonify([])
        with open(REPORT_FILE, "r", encoding="utf-8") as f:
            return jsonify(json.load(f))
    except Exception as e:
        return jsonify({"status": "❌ שגיאה בטעינה", "error": str(e)}), 500
