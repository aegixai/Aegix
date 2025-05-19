
from flask import Blueprint, request, jsonify
import os
import requests
import time

twitter_search_api = Blueprint("twitter_search_api", __name__)
BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")

SEARCH_URL = "https://api.twitter.com/2/tweets/search/recent"
CACHE = {}  # keyword → {timestamp, data}
CACHE_TTL = 60  # seconds

@twitter_search_api.route("/api/twitter/search", methods=["GET"])
def twitter_search():
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify({"error": "Missing 'q' parameter"}), 400

    now = time.time()
    if query in CACHE and now - CACHE[query]["timestamp"] < CACHE_TTL:
        print(f"📦 Returning cached results for '{query}'")
        return jsonify({"tweets": CACHE[query]["data"]})

    headers = {
        "Authorization": f"Bearer {BEARER_TOKEN}"
    }

    params = {
        "query": query,
        "max_results": 10,
        "tweet.fields": "created_at,text,author_id,lang"
    }

    try:
        response = requests.get(SEARCH_URL, headers=headers, params=params)
        response.raise_for_status()
        tweets = response.json().get("data", [])

        # Cache result
        CACHE[query] = {"timestamp": now, "data": tweets}

        return jsonify({"tweets": tweets})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
