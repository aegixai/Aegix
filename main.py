# 📁 main.py — AEGIX Launcher (Render-ready version)

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os, sys, json
import yfinance as yf
import quandl
from dotenv import load_dotenv
from fpdf import FPDF

print("📂 DIR:", os.listdir("aegix_project/core"))

# 🔐 Load .env variables
load_dotenv()
NASDAQ_API_KEY = os.getenv("NASDAQ_API_KEY")

# ✅ Full path imports assuming aegix_project is a module
from aegix_project.routes.telegram_routes import telegram_bp
from aegix_project.routes.healthcheck_routes import health_bp

from aegix_project.core.telegram_group_monitoring import collect_telegram_data
from aegix_project.analytics.calculate_user_distances import calculate_user_distances
from aegix_project.analytics.cleaning_pipeline import clean_data
from aegix_project.analytics.risk_assessor import assess_risks
from aegix_project.analytics.real_time_threat_detection import generate_alerts
from aegix_project.export.report_exporter import export_report, export_user_distance_report
from aegix_project.analytics.geo_distance_calculator import calculate_user_distances

from aegix_project.core.api.default_query_api import default_query_api
from aegix_project.core.api.search_query_api import search_query_api
from aegix_project.core.api.broadcast_routes import broadcast_api
from aegix_project.core.api.fileintel_routes import fileintel_api
from aegix_project.core.api.group_compare_api import group_compare_api
from aegix_project.api.shodan_api import shodan_api
from aegix_project.api.shodan_ai_api import shodan_ai_api

# ✅ AI + MEDIA
from aegix_project.api.ai_insights_api import ai_insights_api
from aegix_project.core.api.media_auth_ai import media_auth_api
from aegix_project.core.api.media_image_classifier_api import media_image_classifier_api
from aegix_project.core.api.intel_report_api import intel_report_api
from aegix_project.api.save_news_api import save_news_api  
from aegix_project.api.summary_api import summary_api
from aegix_project.api.twitter_search_api import twitter_search_api

# 🧠 Flask App Setup
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "*"])

# ✅ Root route to prevent 404 (for Render)
@app.route("/")
def root_status():
    return jsonify({
        "status": "✅ AEGIX backend is live",
        "routes": [
            "/api/",
            "/uploads/<filename>",
            "/healthcheck"
        ]
    })

# 📦 Register Blueprints
app.register_blueprint(telegram_bp)
app.register_blueprint(health_bp)
app.register_blueprint(default_query_api)
app.register_blueprint(search_query_api)
app.register_blueprint(broadcast_api)
app.register_blueprint(fileintel_api)
app.register_blueprint(media_auth_api)
app.register_blueprint(media_image_classifier_api)
app.register_blueprint(intel_report_api)
app.register_blueprint(shodan_api, url_prefix="/api/shodan")
app.register_blueprint(shodan_ai_api)
app.register_blueprint(save_news_api)
app.register_blueprint(summary_api)
app.register_blueprint(twitter_search_api)

# ✅ Fixed: AI API with proper prefix
app.register_blueprint(ai_insights_api, url_prefix="/api/ai")

# 📁 Serve uploaded images
@app.route("/uploads/<filename>")
def uploaded_image(filename):
    return send_from_directory("uploads", filename)

# 🚀 Flask API Server (Render-compatible)
def run_flask_app():
    port = int(os.environ.get("PORT", 5000))  # Render expects PORT from env
    print(f"🚀 Starting Flask API server on port {port}...")
    app.run(debug=True, host="0.0.0.0", port=port)

# 🔄 Telegram Monitoring to Alerts
def run_pipeline():
    print("🔍 Starting AEGIX OSINT pipeline...")
    raw_data = collect_telegram_data()
    print(f"📥 Collected {len(raw_data)} raw items")
    clean = clean_data(raw_data)
    print(f"🧼 Cleaned data: {len(clean)} items")
    risks = assess_risks(clean)
    print(f"⚠ Risk scores calculated: {len(risks)} items")
    alerts = generate_alerts(risks)
    print(f"🚨 Alerts triggered: {len(alerts)}")
    export_report(alerts)
    print("📤 Report exported successfully")

# 📍 Distance Report Exporter
def run_export():
    print("📤 Generating user distance report...")
    center_location = (32.0853, 34.7818)  # תל אביב
    users = []
    try:
        with open("telegram_groups.json", "r", encoding="utf-8") as f:
            groups_data = json.load(f)
            for group in groups_data:
                if group.get("riskLevel") == "High":
                    flagged_users = group.get("flaggedUsers", [])
                    for user_id in flagged_users:
                        users.append({
                            "id": user_id,
                            "location": (32.08, 34.78)
                        })
        print(f"✅ Loaded {len(users)} flagged users from JSON")
    except Exception as e:
        print(f"❌ Error loading telegram_groups.json: {e}")
        return

    if users:
        user_distances = calculate_user_distances(users, center_location)
        export_user_distance_report(user_distances)
        print("📍 Export complete.")
    else:
        print("⚠️ No users to export.")

# 📡 Alert Engine Trigger
from aegix_project.core.alert_engine.alert_scheduler import run_alert_engine
from aegix_project.core.alert_engine.alert_storage import get_all_alerts

def run_alert_system():
    print("🧠 Running Automated Alert Engine...")
    run_alert_engine()
    all_alerts = get_all_alerts()
    print(f"📡 Total Alerts: {len(all_alerts)}")
    for alert in all_alerts:
        print(f"🚨 {alert['time']} - {alert['message']}")

# 📈 NASDAQ AAPL Data
def run_nasdaq_demo():
    if not NASDAQ_API_KEY:
        print("❌ No NASDAQ_API_KEY found in .env file.")
        return
    print("📈 Downloading NASDAQ AAPL data via Quandl...")
    try:
        quandl.ApiConfig.api_key = NASDAQ_API_KEY
        data = quandl.get("NASDAQ/AAPL")
        print(data.tail())
    except Exception as e:
        print(f"⚠️ Error fetching data: {e}")

# 🧠 Entry Point
if __name__ == "__main__":
    if len(sys.argv) > 1:
        mode = sys.argv[1]
        if mode == "api":
            run_flask_app()
        elif mode == "pipeline":
            run_pipeline()
        elif mode == "export":
            run_export()
        elif mode == "alerts":
            run_alert_system()
        elif mode == "nasdaq":
            run_nasdaq_demo()
        else:
            print("❌ Unknown mode. Use: api / pipeline / export / alerts / nasdaq")
    else:
        print("ℹ️ Please provide mode: api / pipeline / export / alerts / nasdaq")
