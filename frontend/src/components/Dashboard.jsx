import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  Search,
  Users,
  Wallet,
  AlertTriangle,
  Newspaper,
  ShieldCheck,
  FileSearch,
  ChevronDown, // אייקון חץ למטה
  ChevronUp, // אייקון חץ למעלה
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = (categoryKey) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  };

  const links = [
    { label: "Main Dashboard", to: "/dashboard", icon: <Home className="w-4 h-4" /> },
    { label: "Overview Dashboard", to: "/overview-dashboard", icon: <BarChart3 className="w-4 h-4" /> },

    // --- 1. מודיעין פיננסי (Finance & AML) ---
    {
      category: "מודיעין פיננסי (Finance & AML)",
      key: "finance",
      icon: <Wallet className="w-4 h-4" />,
      subLinks: [
        { label: "Financial Anomaly Dashboard", to: "/financial-anomaly-dashboard" },
        { label: "Suspicious Wallets Table", to: "/suspicious-wallets" },
        { label: "Transaction Pattern Graph", to: "/transaction-pattern-graph" },
        { label: "Anomaly Timeline", to: "/anomaly-timeline" },
        { label: "Anomaly Export Report", to: "/anomaly-export-report" },
        { label: "Wallet Heatmap", to: "/wallet-heatmap" },
        { label: "Wallet Profile", to: "/wallet-profile/wallet_1" },
        { label: "Wallet Intel Dashboard", to: "/wallet-intel/0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae" },
        { label: "Wallet Scanner", to: "/wallet-scanner" },
        { label: "Crypto Market", to: "/crypto-market" },
        { label: "FATF Regulatory Intel", to: "/regulatory-intel" },
        { label: "Legal Exposure", to: "/legal-exposure" },
      ],
    },

    // --- 2. סיכוני פנים (Insider Threats) ---
    {
      category: "סיכוני פנים (Insider Threats)",
      key: "insider",
      icon: <AlertTriangle className="w-4 h-4" />,
      subLinks: [
        { label: "Insider Risk Dashboard", to: "/insider-risk-dashboard" },
        { label: "Insider Activity Timeline", to: "/insider-activity-timeline" },
        { label: "Insider Export Report", to: "/insider-export-report" },
        { label: "Insider Profile Details", to: "/insider-profile-details" },
        { label: "Employee Risk", to: "/employee-risk" },
        { label: "AI Risk Insights", to: "/ai-employee-insights" },
        { label: "Narrative Monitor (Employee)", to: "/narrative-monitor-employee" },
      ],
    },

    // --- 3. ניתוח נרטיבים (Narrative Warfare) ---
    {
      category: "ניתוח נרטיבים (Narrative Warfare)",
      key: "narrative",
      icon: <Newspaper className="w-4 h-4" />,
      subLinks: [
        { label: "Narrative Detector Dashboard", to: "/narrative-detector-dashboard" },
        { label: "Narrative Trend Timeline", to: "/narrative-trend-timeline" },
        { label: "Narrative Topic Clusters", to: "/narrative-topic-clusters" },
        { label: "Narrative Geo Map", to: "/narrative-geo-map" },
        { label: "Narrative Export Report", to: "/narrative-export-report" },
        { label: "Narrative Dashboard", to: "/narrative-dashboard" },
        { label: "Narratives Monitor", to: "/narrative-monitor" },
      ],
    },

    // --- 4. דיסאינפורמציה (Disinformation) ---
    {
      category: "דיסאינפורמציה (Disinformation)",
      key: "disinfo",
      icon: <AlertTriangle className="w-4 h-4" />,
      subLinks: [
        { label: "Disinfo Monitor Panel", to: "/disinfo-monitor-panel" },
        { label: "Disinfo Trend Timeline", to: "/disinfo-trend-timeline" },
        { label: "Disinfo Report Center", to: "/disinfo-report-center" },
        { label: "Disinfo Map Report", to: "/disinfo-map-report" },
        { label: "Disinfo Monitor", to: "/disinfo-monitor" },
      ],
    },

    // --- 5. השפעה חברתית (Influence Ops) ---
    {
      category: "השפעה חברתית (Influence Ops)",
      key: "influence",
      icon: <Users className="w-4 h-4" />,
      subLinks: [
        { label: "Influence Overview Dashboard", to: "/influence-overview-dashboard" },
        { label: "Influence Trend Chart", to: "/influence-trend-chart" },
        { label: "Influence Heatmap View", to: "/influence-heatmap-view" },
        { label: "Influence Alerts Panel", to: "/influence-alerts-panel" },
        { label: "Influence Graph Relations", to: "/influence-graph-relations" },
        { label: "Influence Drill View", to: "/influence-drill-view" },
        { label: "Influence Compare Users", to: "/influence-compare-users" },
        { label: "Influencer Detection Report", to: "/influencer-detection-report" },
        { label: "Export Influence PDF Button", to: "/export-influence-pdf" },
        { label: "Influence Overview", to: "/influence-dashboard" },
        { label: "Group Tracker", to: "/group-tracker" },
        { label: "Negative Influencers", to: "/negative-influencers" },
        { label: "Group Comparison", to: "/group-compare" },
        { label: "Group Profile", to: "/group-profile" },
      ],
    },

    // --- 6. שחקני איום (Threat Actors) ---
    {
      category: "שחקני איום (Threat Actors)",
      key: "threatActors",
      icon: <ShieldCheck className="w-4 h-4" />,
      subLinks: [
        { label: "Threat Actor Dashboard", to: "/threat-actor-dashboard" },
        { label: "Threat Actor Profile", to: "/threat-actor-profile" },
        { label: "Actor Risk Matrix", to: "/actor-risk-matrix" },
        { label: "Actor Network Graph", to: "/actor-network-graph" },
        { label: "Actor Activity Timeline", to: "/actor-activity-timeline" },
        { label: "Actor Export Report", to: "/actor-export-report" },
        { label: "Threat Actors", to: "/actor-dashboard" },
        { label: "Actor Profile", to: "/actor-profile" },
      ],
    },

    // --- 7. קמפיינים עוינים (Hostile Campaigns) ---
    {
      category: "קמפיינים עוינים (Hostile Campaigns)",
      key: "campaigns",
      icon: <FileSearch className="w-4 h-4" />,
      subLinks: [
        { label: "Hostile Campaign Dashboard", to: "/hostile-campaign-dashboard" },
        { label: "Campaign Profile", to: "/campaign-profile-details" },
        { label: "Campaign Spread Heatmap", to: "/campaign-spread-heatmap" },
        { label: "Campaign Trend Timeline", to: "/campaign-trend-timeline" },
        { label: "Campaign Overview", to: "/campaign-overview-dashboard" },
        { label: "Campaign Alerts", to: "/campaign-alerts" },
        { label: "Campaign Export Report", to: "/campaign-export-report" },
        { label: "Campaign Dashboard", to: "/campaign-dashboard" },
        { label: "Campaign Overview", to: "/campaign-overview" },
      ],
    },

    // --- 8. תגובה למשברים (Crisis Response) ---
    {
      category: "תגובה למשברים (Crisis Response)",
      key: "crisis",
      icon: <AlertTriangle className="w-4 h-4" />,
      subLinks: [
        { label: "Crisis Response Dashboard", to: "/crisis-response-dashboard" },
        { label: "Crisis Live Feed", to: "/crisis-live-feed" },
        { label: "Crisis Heatmap View", to: "/crisis-heatmap-view" },
        { label: "Crisis Timeline", to: "/crisis-timeline" },
        { label: "Crisis Report Export", to: "/crisis-report-export" },
        { label: "Crisis Dashboard", to: "/crisis-dashboard" },
      ],
    },

    // --- 9. מודיעין חוצה פלטפורמות (Cross-Platform Intel) ---
    {
      category: "מודיעין חוצה פלטפורמות (Cross-Platform Intel)",
      key: "crossPlatform",
      icon: <Search className="w-4 h-4" />, // אייקון כללי לחיפוש/אינטל
      subLinks: [
        { label: "Actor Correlation Dashboard", to: "/actor-correlation-dashboard" },
        { label: "Actor Identity Matches", to: "/actor-identity-matches" },
        { label: "Actor Platform Map", to: "/actor-platform-map" },
        { label: "Actor Correlation Timeline", to: "/actor-correlation-timeline" },
        { label: "Actor Correlation Export", to: "/actor-correlation-export" },
      ],
    },

    // --- 10. ציד דליפות מידע (Data Leak Hunting) ---
    {
      category: "ציד דליפות מידע (Data Leak Hunting)",
      key: "dataLeak",
      icon: <FileSearch className="w-4 h-4" />,
      subLinks: [
        { label: "Data Leak Dashboard", to: "/data-leak-dashboard" },
        { label: "Leak Sources Map", to: "/leak-sources-map" },
        { label: "Leak Samples Table", to: "/leak-samples-table" },
        { label: "Leak Export Report", to: "/leak-export-report" },
        { label: "Dark Web Monitor", to: "/darkweb-monitor" },
      ],
    },

    // --- 11. ניהול מערכת (System Administration) ---
    {
      category: "ניהול מערכת (System Administration)",
      key: "admin",
      icon: <Users className="w-4 h-4" />,
      subLinks: [
        { label: "User Management Dashboard", to: "/admin/users" },
        { label: "User Role Editor", to: "/admin/user-role-editor" },
        { label: "Module Access Editor", to: "/admin/module-access-editor" },
        { label: "Alert Dashboard (Admin)", to: "/alert-dashboard" }, // שונה קצת כדי לא להתנגש בזה של מנוע ההתראות
        { label: "Alert Rules Config", to: "/alert-rules-config" },
        { label: "System Logs Dashboard", to: "/system-logs-dashboard" },
        { label: "Log Details View", to: "/log-details-view" },
        { label: "Content Removal", to: "/content-removal" },
        { label: "Avatar Admin Panel", to: "/admin/avatar-suite" },
        { label: "Avatar Manager", to: "/admin/avatar-suite/manager" },
        { label: "Profile Editor", to: "/admin/avatar-suite/profile-editor" },
        { label: "Risk Dashboard", to: "/admin/avatar-suite/risk-dashboard" },
        { label: "Scheduler", to: "/admin/avatar-suite/scheduler" },
        { label: "Post Timeline", to: "/admin/avatar-suite/post-timeline" },
        { label: "Post Archive", to: "/admin/avatar-suite/archive" },
      ],
    },

    // --- 12. הגנת נכסים אסטרטגיים (Strategic Asset Protection) ---
    {
      category: "הגנת נכסים אסטרטגיים (Strategic Asset Protection)",
      key: "assetProtection",
      icon: <ShieldCheck className="w-4 h-4" />,
      subLinks: [
        { label: "Asset Risk Dashboard", to: "/asset-risk-dashboard" },
        { label: "Asset Mention Timeline", to: "/asset-mention-timeline" },
        { label: "Asset Relationship Graph", to: "/asset-relationship-graph" },
        { label: "Asset Exposure Alerts", to: "/asset-exposure-alerts" },
        { label: "Asset Report Export", to: "/asset-report-export" },
        { label: "Company Profile", to: "/company-profile" },
        { label: "Competitors Map", to: "/competitor-map" },
        { label: "Legal Risk", to: "/legal-risk" },
        { label: "Product Sentiment", to: "/product-sentiment" },
        { label: "Export Report", to: "/export-report" },
        { label: "Company Risk Overview", to: "/company-risk-overview" },
        { label: "Global Network", to: "/global-network" },
        { label: "Geo Risk Heatmap", to: "/geo-risk" },
      ],
    },

    // --- 13. מודיעין שיחות (Chat Intelligence) ---
    {
      category: "מודיעין שיחות (Chat Intelligence)",
      key: "chatIntel",
      icon: <Search className="w-4 h-4" />, // אייקון כללי למודיעין/חיפוש
      subLinks: [
        { label: "Chat Summary Dashboard", to: "/chat-summary-dashboard" },
        { label: "Chat Sentiment Radar", to: "/chat-sentiment-radar" },
        { label: "Message Cluster View", to: "/message-cluster-view" },
        { label: "Key Highlights Panel", to: "/key-highlights-panel" },
        { label: "NLP Trend Timeline", to: "/nlp-trend-timeline" },
        { label: "Chat Export Report", to: "/chat-export-report" },
      ],
    },

    // --- 14. מנוע התראות (Alert Engine) ---
    {
      category: "מנוע התראות (Alert Engine)",
      key: "alertEngine",
      icon: <AlertTriangle className="w-4 h-4" />,
      subLinks: [
        { label: "Alert Dashboard", to: "/alert-engine-dashboard" }, // שונה קצת כדי לא להתנגש בזה של אדמין
        { label: "Alert Engine", to: "/alert-engine" },
        { label: "Alert Scheduler", to: "/alert-scheduler" },
        { label: "Alert Storage", to: "/alert-storage" },
      ],
    },

    // --- 15. רגולציה ומשפט (Regulation & Legal) ---
    {
      category: "רגולציה ומשפט (Regulation & Legal)",
      key: "regulation",
      icon: <ShieldCheck className="w-4 h-4" />,
      subLinks: [
        { label: "Regulatory Risk Dashboard", to: "/regulatory-risk-dashboard" },
        { label: "Regulation Trend Timeline", to: "/regulation-trend-timeline" },
        { label: "Regulation Source Table", to: "/regulation-source-table" },
        { label: "Regulation Impact Radar", to: "/regulation-impact-radar" },
        { label: "Regulation Export Report", to: "/regulation-export-report" },
        { label: "Regulatory Risk Insights Panel", to: "/regulatory-risk-insights-panel" },
        { label: "Regulatory Overview", to: "/regulatory-dashboard" },
      ],
    },

    // --- כלים וחיפושים כלליים (General Tools & Searches) ---
    {
      category: "כלים וחיפושים כלליים",
      key: "generalTools",
      icon: <Search className="w-4 h-4" />,
      subLinks: [
        { label: "Search", to: "/search" },
        { label: "Smart Search", to: "/smart-search" },
        { label: "Search Results", to: "/search-results" },
        { label: "AI Recommendation", to: "/ai-recommendation-dashboard" },
        { label: "Geo Intelligence", to: "/geo-report" },
        { label: "Geo Search", to: "/geo-search" },
        { label: "Investigation Center", to: "/investigation-center" },
        { label: "Sector Overview", to: "/sector-overview" },
        { label: "בדיקת מקוריות תמונה", to: "/image-auth" },
        { label: "דוח מודיעין תמונות", to: "/intel-report" },
        { label: "ניתוח תמונה מתקדם", to: "/image-advanced" },
        { label: "News Insights", to: "/news-insights" },
        { label: "Company News", to: "/company-news" },
      ],
    },
  ];

  return (
    <aside className="bg-gray-900 text-white min-h-screen w-56 p-4 border-r border-gray-800">
      <div className="font-bold text-lg mb-4">AEGIX Navigation</div>
      <ul className="space-y-1 text-sm list-none">
        {links.map((item, index) => {
          if (item.category) {
            const isOpen = openCategories[item.key];
            return (
              <li key={item.key || index} className="mt-2">
                <button
                  onClick={() => toggleCategory(item.key)}
                  className="flex items-center justify-between w-full px-2 py-1 rounded transition hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {item.category}
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {isOpen && (
                  <ul className="ml-4 border-l border-gray-700 space-y-1 mt-1 list-none">
                    {item.subLinks.map((subLink) => (
                      <li key={subLink.to}>
                        <Link
                          to={subLink.to}
                          // שינוי כאן: הגדלתי את ה-padding-left (pl) ל-px-4 כדי להזיז את הקישורים ימינה
                          className={`block px-4 py-1 rounded transition ${
                            location.pathname === subLink.to ? "bg-gray-700" : "hover:bg-gray-800"
                          }`}
                        >
                          {subLink.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          } else {
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-2 px-2 py-1 rounded transition ${
                    location.pathname === item.to ? "bg-gray-700" : "hover:bg-gray-800"
                  }`}
                >
                  {item.icon && item.icon}
                  {item.label}
                </Link>
              </li>
            );
          }
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;