from telethon.sync import TelegramClient
from telethon.tl.functions.contacts import GetLocatedRequest
from telethon.tl.types import InputGeoPoint
import json

# 🔒 Telegram credentials
API_ID = 25477801
API_HASH = '1328dc13fdcff643d163a5985c2cd97d'

# 🛰️ Default scan location – overridden dynamically
LAT = 32.2205316
LON = 35.2569374
RADIUS = 3000

# 📁 Output path
OUTPUT_FILE = "geo_users.json"

def load_mock_data(lat, lon):
    return [
        {
            "id": 101,
            "name": "Shira Cohen",
            "username": "shira_c",
            "phone": "+972501112233",
            "distance_m": 320,
            "location": {"lat": lat, "lon": lon}
        },
        {
            "id": 102,
            "name": "Dvir Levi",
            "username": "dvirl",
            "phone": "+972507778899",
            "distance_m": 920,
            "location": {"lat": lat, "lon": lon}
        },
        {
            "id": 103,
            "name": "Yasmin Faraj",
            "username": "yasmin_f",
            "phone": "+972544556677",
            "distance_m": 1800,
            "location": {"lat": lat, "lon": lon}
        },
        {
            "id": 104,
            "name": "Mohammed Abed",
            "username": "m_abed",
            "phone": "+972534556622",
            "distance_m": 2800,
            "location": {"lat": lat, "lon": lon}
        }
    ]

def run_geo_scan(lat, lon):
    print("[INFO] Starting scan...")
    client = TelegramClient("geo_session", API_ID, API_HASH)
    client.start()

    result = client(GetLocatedRequest(
        geo_point=InputGeoPoint(lat=lat, long=lon)
    ))

    print(f"[DEBUG] Total updates: {len(result.updates)}")
    users = []

    for update in result.updates:
        if hasattr(update, "user"):
            user = update.user
            distance = getattr(update, "distance", None)
            if distance is None or distance > RADIUS:
                continue
            users.append({
                "id": user.id,
                "name": f"{user.first_name or ''} {user.last_name or ''}".strip(),
                "username": user.username,
                "phone": getattr(user, "phone", None),
                "distance_m": distance,
                "location": {
                    "lat": lat,
                    "lon": lon
                }
            })

    if not users:
        print("[INFO] No live users found. Loading mock data.")
        users = load_mock_data(lat, lon)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, ensure_ascii=False, indent=2)

    print(f"[OK] Saved {len(users)} users to geo_users.json")

if __name__ == "__main__":
    run_geo_scan(LAT, LON)
