import axios from "axios";

export const fetchAndSaveNews = async (query = "BlackRock") => {
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=30&language=en&apiKey=${API_KEY}`;

  try {
    const res = await axios.get(url);
    const articles = res.data.articles || [];

    const enriched = {
      query,
      last_fetched: new Date().toISOString(),
      articles
    };

    // שלח את הדאטה לבקאנד שישמור לקובץ
    await fetch("/api/save-news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enriched)
    });

    return articles;
  } catch (err) {
    console.error("❌ Error fetching or saving news:", err);
    return [];
  }
};
