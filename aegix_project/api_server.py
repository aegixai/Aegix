# 📡 api_server.py — Flask Launcher for AEGIX APIs

import sys
import os

# ✅ הוספת נתיב שורש לפרויקט לפני כל import
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# ✅ Load .env values
load_dotenv(dotenv_path="C:/Users/User/my_project/aegix_project/.env")

# ✅ Import Blueprints AFTER sys.path + .env
from aegix_project.api.news_api import news_api
from aegix_project.routes.telegram_routes import telegram_bp
from aegix_project.routes.healthcheck_routes import health_bp
from aegix_project.core.api.default_query_api import default_query_api
from aegix_project.core.api.search_query_api import search_query_api
from aegix_project.core.api.broadcast_routes import broadcast_api
from aegix_project.core.api.fileintel_routes import fileintel_api
from aegix_project.api.ai_insights_api import ai_insights_api
from fetchers.coinmarketcap_fetcher import coinmarket_bp
from aegix_project.api.narrative_data_api import narrative_api
from aegix_project.api.narrative_ai_api import narrative_ai_api
from aegix_project.api.twitter_search_api import twitter_search_api
from api.ai_sentiment import ai_sentiment_api
from api.group_sentiment_api import group_sentiment_api
from aegix_project.api.sector_insights_api import sector_api

app = Flask(__name__)
CORS(app)

# 🔌 Register Blueprints
app.register_blueprint(telegram_bp)
app.register_blueprint(health_bp)
app.register_blueprint(default_query_api)
app.register_blueprint(search_query_api)
app.register_blueprint(broadcast_api)
app.register_blueprint(fileintel_api)
app.register_blueprint(ai_insights_api)
app.register_blueprint(coinmarket_bp)
app.register_blueprint(news_api)
app.register_blueprint(narrative_api)
app.register_blueprint(narrative_ai_api)
app.register_blueprint(twitter_search_api)
app.register_blueprint(ai_sentiment_api)
app.register_blueprint(group_sentiment_api)
app.register_blueprint(sector_api)

@app.route("/")
def home():
    return "✅ AEGIX API is running!"

# 🧠 Flask Entry
if __name__ == "__main__":
    print("🐍 Loaded News API Key:", os.getenv("NEWS_API_KEY", "🔒 (not set)"))
    print("🪙 Loaded CoinMarketCap API Key:", os.getenv("COINMARKETCAP_API_KEY", "🔒 (not set)"))
    app.run(debug=True, host="0.0.0.0", port=5000)
