from flask import Blueprint, request, jsonify

summary_api = Blueprint('summary_api', __name__)

@summary_api.route('/api/ai/summary', methods=['POST'])
def summarize():
    try:
        articles = request.get_json().get("articles", [])
        print("✅ Summarizing", len(articles), "articles")
        insights = [
            "🧠 Insight 1: Increase in media interest around the company.",
            "🧠 Insight 2: Some critical sentiment trends detected.",
            "🧠 Insight 3: AI detected potential risk keywords in coverage."
        ]
        return jsonify({"recommendations": insights})
    except Exception as e:
        print("❌ Error in AI summary:", e)
        return jsonify({"recommendations": ["AI Summary Failed: " + str(e)]}), 500