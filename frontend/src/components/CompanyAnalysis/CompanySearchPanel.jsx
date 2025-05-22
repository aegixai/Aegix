import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const CompanySearchPanel = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/company/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const countryMap = {
    US: "United States",
    IL: "Israel",
    DE: "Germany",
    FR: "France",
    GB: "United Kingdom",
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🔍 חיפוש חברה לבדיקה</h1>
      <div className="flex items-center gap-2 mb-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-96"
          placeholder="הכנס שם חברה"
        />
        <Button onClick={handleSearch}>חפש</Button>
      </div>

      {loading && <p className="text-gray-400">...טוען תוצאות</p>}
      {error && <p className="text-red-400">{error}</p>}

      {results.map((result, index) => (
        <Card
          key={index}
          className="mb-4 bg-gray-900 border border-gray-700 cursor-pointer hover:border-blue-500"
          onClick={() => navigate(`/company-profile/${result.id}`)}
        >
          <CardContent className="p-4">
            <p><strong>🏢 Company:</strong> {result.name?.name || "N/A"}</p>
            <p><strong>🌍 Country:</strong> {countryMap[result.country] || result.country || "N/A"}</p>
            <p><strong>📊 Status:</strong> {result.status || "N/A"}</p>
            <p><strong>🔗 Source:</strong> {result.source || "GLEIF"}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompanySearchPanel;
