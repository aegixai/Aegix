# 📁 shodan_api.py — Shodan Intelligence API Integration

from flask import Blueprint, jsonify
import os
import requests

# ✅ הגדרת ה-Blueprint
shodan_api = Blueprint("shodan_api", __name__)
SHODAN_KEY = os.getenv("SHODAN_API_KEY")

@shodan_api.route("/ip/<ip_address>")
def search_ip(ip_address):
    base_url = "https://api.shodan.io"
    url = f"{base_url}/shodan/host/{ip_address}?key={SHODAN_KEY}"
    try:
        res = requests.get(url)
        res.raise_for_status()
        return jsonify(res.json())
    except requests.exceptions.RequestException as e:
        print("❌ Shodan IP Error:", e)
        return jsonify({"error": str(e)}), 500

@shodan_api.route("/domain/<domain>")
def search_domain(domain):
    base_url = "https://api.shodan.io"
    url = f"{base_url}/dns/domain/{domain}?key={SHODAN_KEY}"
    try:
        res = requests.get(url)
        res.raise_for_status()
        return jsonify(res.json())
    except requests.exceptions.RequestException as e:
        print("❌ Shodan Domain Error:", e)
        return jsonify({"error": str(e)}), 500

@shodan_api.route("/org/<org_name>")
def search_org(org_name):
    base_url = "https://api.shodan.io"
    url = f"{base_url}/shodan/host/search?key={SHODAN_KEY}&query=org:\"{org_name}\""
    try:
        res = requests.get(url)
        res.raise_for_status()
        return jsonify(res.json())
    except requests.exceptions.RequestException as e:
        print("❌ Shodan Org Error:", e)
        return jsonify({"error": str(e)}), 500
