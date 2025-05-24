# ✅ twitter_search_api.py – Twitter Search with Real GPT Sentiment
from flask import Blueprint, request, jsonify
import os
import requests
import time
import openai

twitter_search_api = Blueprint("twitter_search_api", __name__)
BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
openai.api_key = os.getenv("OPENAI_API_KEY")

SEARCH_URL = "https://api.twitter.com/2/tweets/search/recent"
CACHE = {}  # keyword → {timestamp, data}
CACHE_TTL = 60  # seconds

@twitter_search_api.route("/api/twitter/search", methods=["POST"])
def twitter_search():
    query = request.json.get("query", "").strip()
    if not query:
        return jsonify({"error": "Missing 'query' parameter"}), 400

    now = time.time()
    if query in CACHE and now - CACHE[query]["timestamp"] < CACHE_TTL:
        print(f"📦 Returning cached results for '{query}'")
        return jsonify({"tweets": CACHE[query]["data"]})

    headers = {
        "Authorization": f"Bearer {BEARER_TOKEN}"
    }

    params = {
        "query": query,
        "max_results": 20,
        "tweet.fields": "created_at,text,author_id,lang"
    }

    try:
        response = requests.get(SEARCH_URL, headers=headers, params=params)
        response.raise_for_status()
        tweets = response.json().get("data", [])

        # 🔍 GPT Sentiment Classification
        enriched = []
        for t in tweets:
            sentiment = "neutral"
            try:
                gpt = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You classify tweet sentiment as 'positive', 'negative', or 'neutral'."},
                        {"role": "user", "content": f"What is the sentiment of this tweet?\n\n\"{t['text']}\""}
                    ],
                    max_tokens=10,
                    temperature=0.2,
                )
                raw = gpt.choices[0].message["content"].strip().lower()
                if "positive" in raw:
                    sentiment = "positive"
                elif "negative" in raw:
                    sentiment = "negative"
                elif "neutral" in raw:
                    sentiment = "neutral"
                else:
                    sentiment = "neutral"
            except Exception as e:
                print("❌ GPT error:", e)

            enriched.append({
                **t,
                "sentiment": sentiment
            })

        CACHE[query] = {"timestamp": now, "data": enriched}
        return jsonify({"tweets": enriched})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
