from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

GLEIF_BASE_URL = "https://api.gleif.org/api/v1/lei-records"

@app.route("/api/company/search")
def search_companies():
    query = request.args.get("q", "")
    if not query:
        return jsonify([])

    gleif_url = f"{GLEIF_BASE_URL}?filter[entity.legalName]={query}&page[size]=10"
    try:
        res = requests.get(gleif_url)
        res.raise_for_status()
        data = res.json()["data"]

        results = []
        for company in data:
            attributes = company["attributes"]
            entity = attributes["entity"]
            results.append({
                "id": company["id"],
                "name": entity.get("legalName"),
                "country": entity.get("legalAddress", {}).get("country"),
                "status": attributes.get("registration", {}).get("status"),
                "source": "GLEIF"
            })

        return jsonify(results)
    except Exception as e:
        print("GLEIF Search Error:", e)
        return jsonify([])

@app.route("/api/company/<lei_id>")
def get_company_by_lei(lei_id):
    try:
        url = f"{GLEIF_BASE_URL}/{lei_id}"
        res = requests.get(url)
        res.raise_for_status()
        data = res.json()["data"]
        attributes = data["attributes"]
        entity = attributes["entity"]

        company_data = {
            "id": data["id"],
            "name": entity.get("legalName"),
            "sector": "N/A",
            "description": "No description available.",
            "employees": [],  # אפשר לייצר או לשלוף בעתיד
            "products": [],
            "legal_issues": [],
            "risk_index": 1,
            "ai_summary": "Real company data from GLEIF.",
        }

        return jsonify(company_data)
    except Exception as e:
        print("GLEIF LEI Error:", e)
        return jsonify({ "error": "Company not found" }), 404

if __name__ == "__main__":
    app.run(port=5000, debug=True)
