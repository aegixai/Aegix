from flask import Blueprint, request, jsonify
import openai
import os

shodan_ai_api = Blueprint("shodan_ai_api", __name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

@shodan_ai_api.route("/api/ai/shodan-insight", methods=["POST"])
def shodan_insight():
    data = request.json
    raw = str(data.get("raw", ""))[:4000]

    prompt = f"Analyze the following Shodan output and summarize the risks, open ports, technologies, and potential security insights:\n\n{raw}\n\nBullet points:"
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a cybersecurity analyst."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.4
        )
        content = response["choices"][0]["message"]["content"]
        return jsonify({"summary": content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
