from flask import Blueprint, request, jsonify
from PIL import Image
import io
import os
import requests
import torch
import torchvision.transforms as T
from transformers import BeitFeatureExtractor, BeitForImageClassification

media_auth_api = Blueprint("media_auth_api", __name__)
UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Load model and extractor
extractor = BeitFeatureExtractor.from_pretrained("microsoft/beit-base-patch16-224")
model = BeitForImageClassification.from_pretrained("microsoft/beit-base-patch16-224")
model.eval()

# Resize + Normalize
transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor()
])

@media_auth_api.route("/api/media/check-authenticity", methods=["POST"])
def check_image():
    image = None
    filename = ""

    # 📤 Handle local file upload
    if "image" in request.files:
        file = request.files["image"]
        image = Image.open(file.stream).convert("RGB")
        filename = file.filename
        filepath = os.path.join(UPLOAD_DIR, filename)
        image.save(filepath)  # ✅ Save image to /uploads

    # 🌐 Handle URL upload
    elif "url" in request.form:
        try:
            url = request.form["url"]
            response = requests.get(url, timeout=5)
            image = Image.open(io.BytesIO(response.content)).convert("RGB")
            filename = os.path.basename(url.split("?")[0])
            filepath = os.path.join(UPLOAD_DIR, filename)
            image.save(filepath)  # ✅ Save downloaded image
        except:
            return jsonify({"score": 0, "result": "❌ לא ניתן לטעון תמונה מהקישור"}), 400

    else:
        return jsonify({"score": 0, "result": "❌ לא נשלחה תמונה"}), 400

    try:
        inputs = extractor(images=image, return_tensors="pt")
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        top_score = torch.max(probs).item()
        label = model.config.id2label[torch.argmax(probs).item()]

        if top_score > 0.8:
            result = "✅ כנראה תמונה אמיתית" if "natural" in label.lower() or "photo" in label.lower() else "⚠️ חשד לתמונה מלאכותית"
        else:
            result = "⚠️ תוצאה לא ודאית"

        return jsonify({
            "score": int(top_score * 100),
            "result": f"{result} ({label})",
            "source": filename  # ✅ חשוב: מחזיר את שם הקובץ
        })

    except Exception as e:
        return jsonify({"score": 0, "result": f"❌ שגיאה בעיבוד: {str(e)}"}), 500
