from flask import Blueprint, jsonify, request
import datetime
import json

group_compare_api = Blueprint("group_compare_api", __name__)

@group_compare_api.route("/api/groups/compare", methods=["GET"])
def compare_groups():
    platform = request.args.get("platform", "All")
    group_name = request.args.get("group", None)
    keyword = request.args.get("keyword", "").lower()
    min_sentiment = float(request.args.get("minSentiment", -1.0))
    sector = request.args.get("sector", "All")
    start_date = request.args.get("startDate", "2025-05-01")
    end_date = request.args.get("endDate", "2025-05-18")

    with open("public/data/groups/group_sentiments.json") as f:
        all_data = json.load(f)["groups"]

    filtered = []
    for group in all_data:
        if platform != "All" and group["platform"] != platform:
            continue
        if group_name and group["name"] != group_name:
            continue
        if sector != "All" and group.get("sector", "General") != sector:
            continue
        if keyword and keyword not in group.get("keywords", []):
            continue

        timeline = [
            p for p in group["sentimentTimeline"]
            if start_date <= p["date"] <= end_date
        ]

        avg = sum(p["value"] for p in timeline) / len(timeline) if timeline else 0
        if avg < min_sentiment:
            continue

        # Top 3 negative influencers (lowest sentiment score)
        top_negative = sorted(
            group["users"], key=lambda u: u.get("sentiment", 0)
        )[:3]

        filtered.append({
            "name": group["name"],
            "platform": group["platform"],
            "sector": group.get("sector", "General"),
            "averageSentiment": avg,
            "sentimentTimeline": timeline,
            "keywords": group.get("keywords", []),
            "topNegativeInfluencers": top_negative
        })

    return jsonify(filtered)
