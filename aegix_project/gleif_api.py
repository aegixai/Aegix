from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route("/api/company/search")
def search_company():
    query = request.args.get("q", "")
    if not query:
        return jsonify({ "error": "Missing query" }), 400

    url = f"https://api.gleif.org/api/v1/lei-records?filter[entity.legalName]={query}&page[size]=10"

    try:
        response = requests.get(url)
        data = response.json()

        results = []
        for record in data.get("data", []):
            attributes = record.get("attributes", {})
            results.append({
                "id": record.get("id"),
                "name": attributes.get("entity", {}).get("legalName", ""),
                "country": attributes.get("entity", {}).get("legalAddress", {}).get("country", ""),
                "status": attributes.get("registration", {}).get("status", ""),
                "source": "GLEIF"
            })

        return jsonify(results)
    except Exception as e:
        return jsonify({ "error": str(e) }), 500

if __name__ == "__main__":
    app.run(port=5002, debug=True)
