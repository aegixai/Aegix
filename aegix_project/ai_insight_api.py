from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load your OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/api/ai/insight")
def ai_insight():
    name = request.args.get("name", "")
    if not name:
        return jsonify({"error": "Missing company name"}), 400

    try:
        prompt = f"""You are an AI business intelligence analyst. 
Given the company name "{name}", provide a short and professional insight (1-2 sentences) about the company’s known risks, controversies, or market relevance.
Avoid generic statements. Focus on risks, ESG issues, lawsuits, or notable activity if possible."""

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{ "role": "user", "content": prompt }],
            max_tokens=100,
            temperature=0.7,
        )

        insight = response.choices[0].message.content.strip()
        return jsonify({ "insight": insight })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

if __name__ == "__main__":
    app.run(port=5004, debug=True)
