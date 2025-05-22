from flask import Flask, jsonify, request
import requests
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SHODAN_API_KEY = os.getenv("SHODAN_API_KEY")  # Set this in your environment!

@app.route("/api/shodan/ip/<ip>")
def shodan_by_ip(ip):
    if not SHODAN_API_KEY:
        return jsonify({"error": "Shodan API key not set."}), 403

    try:
        url = f"https://api.shodan.io/shodan/host/{ip}?key={SHODAN_API_KEY}"
        res = requests.get(url)
        res.raise_for_status()
        return jsonify(res.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
