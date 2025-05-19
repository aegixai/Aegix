from flask import Blueprint, request, jsonify
from PIL import Image
import imagehash
import io
import requests

media_auth_api = Blueprint('media_auth_api', __name__)

def is_likely_ai_generated(image: Image.Image) -> float:
    hash_val = imagehash.phash(image)
    ai_hashes = [
        imagehash.hex_to_hash("ffffffff00000000"),
        imagehash.hex_to_hash("00000000ffffffff"),
        imagehash.hex_to_hash("aaaaaaaaffffffff"),
    ]
    score = min([hash_val - h for h in ai_hashes])
    return max(0, 100 - score * 10)

@media_auth_api.route("/api/media/check-authenticity", methods=["POST"])
def check_authenticity():
    if 'image' in request.files:
        image = Image.open(request.files['image'].stream)
    elif 'url' in request.form:
        try:
            response = requests.get(request.form['url'], timeout=5)
            image = Image.open(io.BytesIO(response.content))
        except Exception:
            return jsonify({"score": 0, "result": "❌ שגיאה בהורדת התמונה"}), 400
    else:
        return jsonify({"score": 0, "result": "❌ לא נשלחה תמונה או כתובת"}), 400

    try:
        score = is_likely_ai_generated(image)
        label = "✅ כנראה תמונה אמיתית" if score > 70 else "⚠️ חשד לתמונה שנוצרה על ידי AI"
        return jsonify({
            "score": int(score),
            "result": label
        })
    except Exception as e:
        return jsonify({"score": 0, "result": f"שגיאה: {str(e)}"}), 500
