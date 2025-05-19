import json
from datetime import datetime, timedelta
import random
import argparse

sentiment_keywords = {
    "positive": ["growth", "record", "expansion", "success", "profit"],
    "negative": ["scandal", "loss", "protest", "criticism", "regulation"],
    "neutral": ["statement", "announcement", "meeting", "report", "update"]
}

def generate_mock_tweets(query="BlackRock", count=25, output_path="mock_data/mock_tweets.json"):
    tweets = []
    for _ in range(count):
        sentiment = random.choice(["positive", "neutral", "negative"])
        keyword = random.choice(sentiment_keywords[sentiment])
        text = f"{keyword.capitalize()} related to {query} observed in recent developments."
        tweet = {
            "author_id": f"user_{random.randint(1000, 9999)}",
            "text": text,
            "created_at": (datetime.now() - timedelta(days=random.randint(0, 6))).isoformat() + "Z"
        }
        tweets.append(tweet)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(tweets, f, ensure_ascii=False, indent=2)

    print(f"✅ {count} mock tweets saved to {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate mock tweets for testing.")
    parser.add_argument("--query", type=str, default="BlackRock", help="Search term to embed in tweets")
    parser.add_argument("--count", type=int, default=25, help="Number of tweets to generate")
    parser.add_argument("--output", type=str, default="mock_data/mock_tweets.json", help="Output JSON file path")
    args = parser.parse_args()

    generate_mock_tweets(args.query, args.count, args.output)
