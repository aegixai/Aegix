import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AIInsightsPanel from "../Dashboard/AIInsightsPanel";
import {
  Shield,
  Twitter,
  Globe,
  Users,
  Newspaper,
  Server,
  Search,
} from "lucide-react";

const CompanyDueDiligenceCenter = () => {
  const [companyName, setCompanyName] = useState("Acme Corp");
  const navigate = useNavigate();

  const handleSearch = () => {
    console.log("Searching for:", companyName);
    // בעתיד ניתן להוסיף שליחה לכל הדשבורדים
  };

  const navigateWithCompany = (basePath) => {
    const encoded = encodeURIComponent(companyName.trim());
    navigate(`${basePath}?company=${encoded}`);
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🏢 Company Due Diligence Center</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg mb-4">
        <label className="text-lg font-medium mb-2 block">
          <Search className="inline-block mr-2 w-4 h-4" />
          Company Search
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-64 p-2 rounded bg-gray-800 text-white"
            placeholder="Enter company name..."
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <Card className="bg-gray-900 mb-4">
        <CardContent className="p-4 space-y-2">
          <p>
            <strong>🏢 Company:</strong> {companyName}
          </p>
          <p>
            <strong>⚡ Sources Connected:</strong> Telegram, Twitter, News, Shodan, Legal, Employees
          </p>
          <p className="text-sm text-gray-400">
            This screen consolidates all signals from OSINT sources and runs AI analysis to support pre-acquisition due diligence.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <Button className="bg-gray-800 w-full" onClick={() => navigate("/shodan-intel")}>
          <Server className="w-4 h-4 mr-2" /> Shodan Intel
        </Button>
        <Button className="bg-gray-800 w-full" onClick={() => navigate("/twitter-sentiment")}>
          <Twitter className="w-4 h-4 mr-2" /> Twitter Sentiment
        </Button>
        <Button className="bg-gray-800 w-full" onClick={() => navigate("/telegram-groups")}>
          <Globe className="w-4 h-4 mr-2" /> Telegram Groups
        </Button>
        <Button className="bg-gray-800 w-full" onClick={() => navigate("/regulatory-risk")}>
          <Shield className="w-4 h-4 mr-2" /> Regulatory Risk
        </Button>
        <Button className="bg-gray-800 w-full" onClick={() => navigate("/employee-risk")}>
          <Users className="w-4 h-4 mr-2" /> Employee Risks
        </Button>
        <Button className="bg-gray-800 w-full" onClick={() => navigateWithCompany("/company-news")}>
          <Newspaper className="w-4 h-4 mr-2" /> Company News
        </Button>
      </div>

      <h2 className="text-2xl font-semibold mb-2 text-pink-400">🧠 AI Insights</h2>
      <AIInsightsPanel
        results={[
          { source: "Telegram", value: `Rise in negative sentiment about ${companyName}` },
          { source: "Twitter", value: `Trust drop related to ${companyName}` },
          { source: "Shodan", value: "Open ports detected: 53, 443" },
          { source: "Legal", value: `Pending regulation concerns around ${companyName}` },
        ]}
      />
    </div>
  );
};

export default CompanyDueDiligenceCenter;
