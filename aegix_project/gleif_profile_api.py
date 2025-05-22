from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route("/api/company/<lei>")
def get_company_profile(lei):
    try:
        url = f"https://api.gleif.org/api/v1/lei-records/{lei}"
        response = requests.get(url)
        data = response.json()

        record = data.get("data", {})
        attr = record.get("attributes", {})
        entity = attr.get("entity", {})

        profile = {
            "lei": lei,
            "name": entity.get("legalName", {}).get("name"),
            "country": entity.get("legalAddress", {}).get("country"),
            "address": entity.get("legalAddress", {}).get("addressLines", []),
            "city": entity.get("legalAddress", {}).get("city"),
            "postalCode": entity.get("legalAddress", {}).get("postalCode"),
            "status": attr.get("registration", {}).get("status"),
            "registrationDate": attr.get("registration", {}).get("initialRegistrationDate"),
            "lastUpdate": attr.get("registration", {}).get("lastUpdateDate"),
            "nextRenewal": attr.get("registration", {}).get("nextRenewalDate"),
            "legalJurisdiction": entity.get("legalJurisdiction")
        }

        return jsonify(profile)

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

if __name__ == "__main__":
    app.run(port=5003, debug=True)
