# קובץ: group_sentiment_api.py

from flask import Blueprint, request, jsonify

group_sentiment_api = Blueprint("group_sentiment_api", __name__)

@group_sentiment_api.route("/api/ai/group-sentiment", methods=["POST"])
def group_sentiment():
    data = request.get_json()
    group = data.get("group", [])

    return jsonify({
        "trend": {
            "dates": ["2025-05-10", "2025-05-11", "2025-05-12", "2025-05-13", "2025-05-14"],
            "scores": [0.1, -0.2, -0.4, -0.1, 0.05]
        },
        "insights": [
            "📌 Sentiment declined sharply on May 12 due to coordinated posts.",
            "📌 CryptoShark77 and ScamalertX dominate negative sentiment.",
            "📌 Memecoin-related warnings peaked during May 13."
        ]
    })
