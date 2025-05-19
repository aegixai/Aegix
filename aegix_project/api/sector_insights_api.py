from flask import Blueprint, request, jsonify
import traceback
import os
import openai

sector_api = Blueprint("sector_api", __name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

@sector_api.route("/api/ai/sector-overview", methods=["POST"])
def sector_overview():
    try:
        data = request.get_json()
        sector = data.get("sector", "Finance")
        print("📥 Sector selected:", sector)

        # קבוצות לפי סקטור
        sector_groups = {
            "Finance": [
                {"name": "Crypto Watchdogs", "sentiment": 0.62},
                {"name": "Token Hunters", "sentiment": -0.3},
                {"name": "DeFi Explorers", "sentiment": 0.41},
            ],
            "Cyber": [
                {"name": "Exploit Radar", "sentiment": -0.5},
                {"name": "ZeroDay Channel", "sentiment": -0.7},
            ],
            "Regulation": [
                {"name": "AML Monitors", "sentiment": 0.12},
                {"name": "SEC Discussion", "sentiment": -0.25},
            ],
            "Narratives": [
                {"name": "Narrative Watch", "sentiment": -0.15},
                {"name": "Public Voice", "sentiment": 0.1},
            ]
        }

        groups = sector_groups.get(sector, [])

        labels = [g["name"] for g in groups]
        values = [g["sentiment"] for g in groups]

        chart = {
            "labels": labels,
            "datasets": [{
                "label": "Sentiment Score",
                "data": values,
                "backgroundColor": ["#4FD1C5", "#F56565", "#ECC94B", "#68D391", "#63B3ED"][:len(groups)]
            }]
        }

        # בניית Prompt לפי סקטור
        group_descriptions = ", ".join([f"{g['name']} (score {g['sentiment']})" for g in groups])
        prompt = (
            f"As an intelligence analyst, analyze the sentiment and behavioral risk trends "
            f"for the following groups in the {sector} sector: {group_descriptions}. "
            "Respond with 3-4 bullet points of insights, then list 2 recommendations and 2 alerts."
        )

        print("🧠 Sending request to OpenAI...")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert OSINT and risk analyst."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.4
        )

        text = response["choices"][0]["message"]["content"]
        lines = [l.strip() for l in text.split("\n") if l.strip()]

        insights = [l for l in lines if l.startswith("📌")]
        recommendations = [l for l in lines if l.startswith("✅")]
        alerts = [l for l in lines if l.startswith("🚨")]

        return jsonify({
            "chart": chart,
            "groups": groups,
            "insights": insights,
            "recommendations": recommendations,
            "alerts": alerts
        })

    except Exception as e:
        print("❌ Error in sector_overview:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
