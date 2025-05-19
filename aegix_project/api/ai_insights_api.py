
from flask import Blueprint, request, jsonify
import os
import openai
import traceback

ai_insights_api = Blueprint("ai_insights_api", __name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

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
        try:
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

            # Recommendations and alerts – mock for now, can be AI-generated later
            recommendations = [
                "✅ Monitor negative sentiment spikes around token launches.",
                "✅ Engage with influencers in groups showing consistent optimism."
            ]

            alerts = [
                f"🚨 Sentiment drop detected in '{groups[0]}'" if len(groups) > 0 else "",
                f"🚨 Regulatory discussion surge in '{groups[1]}'" if len(groups) > 1 else ""
            ]

            # Sentiment demo chart (static)
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

    except Exception as e:
        print("❌ UNEXPECTED ERROR:", e)
        traceback.print_exc()
        return jsonify({"error": f"Server Error: {str(e)}"}), 500
