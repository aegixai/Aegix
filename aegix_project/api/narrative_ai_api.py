from flask import Blueprint, request, jsonify
import os
from openai import OpenAI

narrative_ai_api = Blueprint("narrative_ai_api", __name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@narrative_ai_api.route("/api/ai/narrative-summary", methods=["POST"])
def generate_narrative_summary():
    data = request.get_json()
    narratives = data.get("narratives", [])

    print("🧠 קיבלתי בקשה ל־/api/ai/narrative-summary")
    print(f"📦 מספר נרטיבים שהתקבלו: {len(narratives)}")

    if not narratives or len(narratives) < 2:
        print("⚠️ לא מספיק נרטיבים לניתוח GPT")
        return jsonify({"insights": ["Not enough narratives for AI insights."]})

    try:
        text_blocks = []
        for n in narratives[:15]:
            text = n.get("text", "")
            sentiment = n.get("sentiment", "")
            text_blocks.append(f"- ({sentiment}) {text}")

        prompt = (
            "Analyze the following narrative texts grouped by sentiment:\n\n"
            + "\n".join(text_blocks)
            + "\n\n"
            "Provide 3 high-level intelligence insights based on these narratives. "
            "Start each one with 📌 and keep them concise."
        )

        print("📤 שולח ל־GPT את הפרומפט:\n" + prompt)

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a geopolitical intelligence analyst."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.4,
        )

        text = response.choices[0].message.content
        print("📥 תגובת GPT:\n" + text)

        insights = [line.strip() for line in text.split("\n") if line.strip().startswith("📌")]
        return jsonify({"insights": insights})

    except Exception as e:
        print("🔥 שגיאה בזמן חיבור ל־GPT:")
        print(str(e))
        return jsonify({"insights": [f"Error: {str(e)}"]}), 500
