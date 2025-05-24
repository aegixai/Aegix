from flask import Blueprint, request, jsonify

save_news_api = Blueprint('save_news_api', __name__)

@save_news_api.route('/api/save-news', methods=['POST'])
def save_news():
    try:
        data = request.get_json()
        print("✅ Received news for:", data.get("query"))
        # You could write to file or DB here
        return jsonify({"status": "success", "message": "News saved."}), 200
    except Exception as e:
        print("❌ Error saving news:", e)
        return jsonify({"status": "error", "message": str(e)}), 500