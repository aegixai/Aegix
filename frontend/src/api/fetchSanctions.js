// fetchSanctions.js – חיבור ל־OpenSanctions API

import axios from "axios";

// אפשר לשים את המפתח בקובץ .env גם (ראה הערה למטה)
const API_KEY = "2d25f4c655afa1e247e425639fbbfb42";
const BASE_URL = "https://api.opensanctions.org/match";

export const fetchSanctionsData = async (name) => {
  try {
    const res = await axios.post(
      BASE_URL,
      { q: name, size: 5 },
      {
        headers: {
          "Authorization": `ApiKey ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Sanctions API Error:", err);
    return null;
  }
};
