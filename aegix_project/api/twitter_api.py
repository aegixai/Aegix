import os
import json
import requests
from flask import Blueprint, request, jsonify

twitter_api = Blueprint("twitter_api", __name__)
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")

@twitter_api.route("/api/twitter/search")
def search_tweets():
    query = request.args.get("q", "blackrock")
    headers = {
        "Authorization": f"Bearer {TWITTER_BEARER_TOKEN}"
    }
    url = f"https://api.twitter.com/2/tweets/search/recent?query={query}&max_results=10&tweet.fields=created_at,text,author_id,lang"

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json().get("data", [])
        print(f"✅ Twitter API success, {len(data)} tweets")
        return jsonify({"tweets": data})

    except requests.exceptions.HTTPError as e:
        if response.status_code == 429:
            print("⚠️ Twitter rate limit reached. Using mock data.")
        else:
            print(f"🔥 Twitter API error: {e}")
        # fallback to mock
        try:
            with open("mock_data/mock_tweets.json", "r", encoding="utf-8") as f:
                mock_data = json.load(f)
                return jsonify({"tweets": mock_data})
        except Exception as mock_error:
            print("🚫 Failed to load mock tweets:", mock_error)
            return jsonify({"tweets": [], "error": "Failed to fetch data from Twitter or mock"}), 500

    except Exception as e:
        print("❌ General error in Twitter API:", e)
        return jsonify({"tweets": [], "error": str(e)}), 500
