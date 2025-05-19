from flask import Blueprint, request, jsonify
import torch
from PIL import Image
import requests
import io
from torchvision import transforms
from transformers import AutoImageProcessor, AutoModelForImageClassification

media_fake_detector_api = Blueprint("media_fake_detector_api", __name__)

# ✅ מודל חדש
model_name = "nateraw/fake-image-detector"
processor = AutoImageProcessor.from_pretrained(model_name)
model = AutoModelForImageClassification.from_pretrained(model_name)
model.eval()

@media_fake_detector_api.route("/api/media/detect-fake", methods=["POST"])
def detect_fake():
    if 'image' in request.files:
        image = Image.open(request.files['image'].stream).convert("RGB")
    elif 'url' in request.form:
        try:
            response = requests.get(request.form['url'], timeout=5)
            image = Image.open(io.BytesIO(response.content)).convert("RGB")
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

        result = "✅ תמונה אמיתית" if label.lower() == "real" else "❌ תמונה מזויפת"

        return jsonify({
            "score": confidence_pct,
            "result": f"{result} ({label}, {confidence_pct}%)"
        })

    except Exception as e:
        return jsonify({"score": 0, "result": f"❌ שגיאה בעיבוד: {str(e)}"}), 500
