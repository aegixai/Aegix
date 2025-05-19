# C:\Users\User\my_project\aegix_project\api\news_api.py

from flask import Blueprint, request, jsonify
import json
import os

news_api = Blueprint("news_api", __name__)

@news_api.route("/api/save-news", methods=["POST"])
def save_news():
    data = request.json
    if not data or "articles" not in data:
        return jsonify({"error": "Missing data"}), 400

    # ודא שהתיקייה קיימת
    os.makedirs("public/data", exist_ok=True)

    # שמור את הנתונים לקובץ
    with open("public/data/company_news.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return jsonify({"status": "saved", "total": len(data["articles"])}), 200
