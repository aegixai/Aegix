from flask import Blueprint, request, jsonify
import os
import openai
from openai import OpenAI

ai_sentiment_api = Blueprint("ai_sentiment_api", __name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ------------------------------
# 1. Twitter Sentiment Summary (Tweets)
# ------------------------------
@ai_sentiment_api.route("/api/ai/sentiment-summary", methods=["POST"])
def sentiment_summary():
    try:
        data = request.get_json()
        tweets = data.get("tweets", [])

        if not tweets or len(tweets) < 3:
            return jsonify({"insights": ["Not enough tweets for meaningful insights."]})

        text_blocks = []
        for t in tweets[:20]:
            sentiment = t.get("sentiment", "neutral")
            text = t.get("text", "")
            text_blocks.append(f"- ({sentiment}) {text}")

        prompt = (
            "You are a professional OSINT analyst. Analyze the following tweets categorized by sentiment:\n\n"
            + "\n".join(text_blocks)
            + "\n\nProvide 3 key insights about public sentiment trends. Respond in bullet points starting with 📌."
        )

        chat_completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a sentiment analysis expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=300,
        )

        result = chat_completion.choices[0].message.content
        insights = [line.strip() for line in result.split("\n") if line.strip().startswith("📌")]
        return jsonify({"insights": insights})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"insights": [f"Error: {str(e)}"]}), 500


# ------------------------------
# 2. User Profile Summary (Used in UserProfileView.jsx)
# ------------------------------
@ai_sentiment_api.route("/api/ai/user-summary", methods=["POST"])
def user_summary():
    try:
        user = request.get_json().get("user", {})
        if not user:
            return jsonify({"insights": ["No user data received."]}), 400

        username = user.get("username", "unknown user")
        risk_score = user.get("risk_score", "?")
        risk_reason = user.get("risk_reason", "")
        top_topics = ", ".join(user.get("top_topics", []))
        geo = ", ".join(user.get("geo_activity", []))
        platforms = ", ".join(user.get("linked_platforms", []))

        prompt = (
            f"Analyze the following user from an OSINT and behavioral risk perspective:\n\n"
            f"Username: {username}\n"
            f"Risk Score: {risk_score}\n"
            f"Risk Reason: {risk_reason}\n"
            f"Top Topics: {top_topics}\n"
            f"Geo Activity: {geo}\n"
            f"Platforms: {platforms}\n\n"
            f"Write 3 behavioral and risk insights. Start each line with 📌."
        )

        chat_completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an OSINT intelligence analyst."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4,
            max_tokens=300,
        )

        result = chat_completion.choices[0].message.content
        insights = [line.strip() for line in result.split("\n") if line.strip().startswith("📌")]
        return jsonify({"insights": insights})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"insights": [f"Error: {str(e)}"]}), 500
