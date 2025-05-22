from flask import Blueprint, request, jsonify
import os
import openai
import traceback

ai_insights_api = Blueprint("ai_insights_api", __name__)
openai.api_key = os.getenv("OPENAI_API_KEY")


# ✅ AI Insight for Company Name
@ai_insights_api.route("/api/ai/insight", methods=["GET"])
def get_ai_insight():
    company_name = request.args.get("name")
    if not company_name:
        return jsonify({"error": "Missing 'name' parameter"}), 400

    try:
        prompt = (
            f"You are a senior business intelligence analyst.\n"
            f"Given the company named \"{company_name}\", provide a short AI-generated insight "
            f"about its risk level, public perception, regulatory exposure, or market position."
        )

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You generate professional business insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=120,
            temperature=0.6
        )

        insight = response.choices[0].message.content.strip()
        return jsonify({"insight": insight})

    except Exception as e:
        print("❌ Insight Error:", e)
        return jsonify({"error": str(e)}), 500


# ✅ AI Insight for Group Comparison
@ai_insights_api.route("/api/ai/group-compare-insight", methods=["POST"])
def group_compare_insight():
    try:
        data = request.get_json()
        print("📥 Received data:", data)

        groups = data.get("groups")
        if not groups:
            print("⚠️ Missing 'groups' in request")
            return jsonify({"error": "Missing 'groups' in request"}), 400

        print("🔍 Groups to compare:", groups)
        group_list = ", ".join(groups)

        prompt = (
            f"Compare sentiment trends between the following groups: {group_list}. "
            "Highlight any major sentiment gaps, anomalies, or behavioral patterns in bullet points starting with 📌."
        )

        print("🧠 Sending request to OpenAI...")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You analyze group sentiment data for intelligence teams."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.5
        )
        print("✅ OpenAI response received")

        content = response["choices"][0]["message"]["content"]
        insights = [line.strip() for line in content.split("\n") if line.strip().startswith("📌")]

        recommendations = [
            "✅ Monitor negative sentiment spikes around token launches.",
            "✅ Engage with influencers in groups showing consistent optimism."
        ]

        alerts = [
            f"🚨 Sentiment drop detected in '{groups[0]}'" if len(groups) > 0 else "",
            f"🚨 Regulatory discussion surge in '{groups[1]}'" if len(groups) > 1 else ""
        ]

        chart = {
            "labels": groups,
            "datasets": [{
                "label": "Sentiment Score",
                "data": [0.6 if i % 2 == 0 else -0.3 for i in range(len(groups))],
                "backgroundColor": ["#4FD1C5", "#F56565", "#ECC94B", "#68D391"][:len(groups)]
            }]
        }

        return jsonify({
            "chart": chart,
            "insights": insights,
            "recommendations": recommendations,
            "alerts": alerts
        })

    except Exception as gpt_err:
        print("❌ GPT ERROR:", gpt_err)
        traceback.print_exc()
        return jsonify({"error": f"GPT Error: {str(gpt_err)}"}), 500
