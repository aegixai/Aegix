from flask import Blueprint, request, jsonify
from PIL import Image
import torch
import requests
import io
from transformers import AutoImageProcessor, AutoModelForImageClassification

media_image_classifier_api = Blueprint("media_image_classifier_api", __name__)

# ✅ מודל ציבורי שזמין
model_name = "microsoft/resnet-50"
processor = AutoImageProcessor.from_pretrained(model_name)
model = AutoModelForImageClassification.from_pretrained(model_name)
model.eval()

def calculate_originality_score(label: str, confidence: float) -> int:
    score = 0
    label = label.lower()

    if "person" in label or "face" in label or "portrait" in label:
        score += 40
    elif any(x in label for x in ["mask", "armor", "cartoon", "tie", "costume"]):
        score -= 30
    else:
        score += 10

    if confidence >= 90:
        score += 40
    elif confidence >= 70:
        score += 20
    elif confidence >= 50:
        score += 10
    else:
        score -= 10

    return max(0, min(score, 100))

@media_image_classifier_api.route("/api/media/classify-image", methods=["POST"])
def classify_image():
    if 'image' in request.files:
        image = Image.open(request.files['image'].stream).convert("RGB")
        source = request.files['image'].filename
    elif 'url' in request.form:
        try:
            response = requests.get(request.form['url'], timeout=5)
            image = Image.open(io.BytesIO(response.content)).convert("RGB")
            source = request.form['url']
        except:
            return jsonify({"score": 0, "result": "❌ לא ניתן לטעון תמונה מהקישור"}), 400
    else:
        return jsonify({"score": 0, "result": "❌ לא נשלחה תמונה"}), 400

    try:
        inputs = processor(images=image, return_tensors="pt")
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        confidence, prediction = torch.max(probs, 1)

        label = model.config.id2label[prediction.item()]
        confidence_pct = round(confidence.item() * 100)

        originality_score = calculate_originality_score(label, confidence_pct)

        if originality_score >= 70:
            status = "✅ כנראה תמונה אמיתית"
        elif originality_score >= 40:
            status = "⚠️ חשד לתמונה מזויפת או לא ודאית"
        else:
            status = "❌ תמונה מזויפת בסבירות גבוהה"

        return jsonify({
            "source": source,
            "score": originality_score,
            "label": label,
            "confidence": confidence_pct,
            "result": f"{status} ({label}, {confidence_pct}%)"
        })

    except Exception as e:
        return jsonify({"score": 0, "result": f"❌ שגיאה בעיבוד: {str(e)}"}), 500