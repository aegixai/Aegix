import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  Search,
  Users,
  AlertCircle,
  Flame, // ייתכן שנרצה להחליף את זה באייקון מתאים יותר אם הוא לא משמש
  Globe,
  Brain,
  Newspaper,
  Briefcase,
  ShieldCheck,
  FileSearch,
  AlertTriangle,
  ChevronDown, // אייקון חץ למטה
  ChevronUp, // אייקון חץ למעלה
  DollarSign, // עבור Financial Monitoring
  Megaphone, // עבור Communication
  Gavel, // עבור Law Enforcement
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  // מצב המנהל אילו קטגוריות פתוחות. נשתמש במפתחות ייחודיים לכל קטגוריה.
  const [openCategories, setOpenCategories] = useState({});

  // פונקציה לשינוי מצב הפתיחה/סגירה של קטגוריה
  const toggleCategory = (categoryKey) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  };

  const categories = [ // שיניתי את sections ל-categories כדי להתאים יותר למבנה
    // --- 1. Financial Monitoring ---
    {
      category: "Financial Monitoring", // שם הקטגוריה שיוצג
      key: "financialMonitoring", // מפתח ייחודי לניהול מצב פתוח/סגור
      icon: <DollarSign className="w-4 h-4" />, // אייקון לקטגוריה הראשית
      subLinks: [ // תת-הפריטים בתוך הקטגוריה
        { label: "Main Dashboard", to: "/dashboard" }, // ללא אייקון
        { label: "Overview Dashboard", to: "/overview-dashboard" }, // ללא אייקון
        { label: "Finance Dashboard", to: "/finance-dashboard" },
        { label: "Wallet Heatmap", to: "/wallet-heatmap" },
        { label: "Wallet Profile", to: "/wallet-profile/wallet_1" },
        { label: "Wallet Intel Dashboard", to: "/wallet-intel/0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae" },
        { label: "Wallet Scanner", to: "/wallet-scanner" },
        { label: "Crypto Market", to: "/crypto-market" },
        { label: "FATF Regulatory Intel", to: "/regulatory-intel" },
        { label: "Legal Exposure", to: "/legal-exposure" },
      ],
    },
    // --- 2. Business Intelligence ---
    {
      category: "Business Intelligence",
      key: "businessIntelligence",
      icon: <Briefcase className="w-4 h-4" />,
      subLinks: [
        { label: "Company Profile", to: "/company-profile" },
        { label: "Competitors Map", to: "/competitor-map" },
        { label: "Employee Risk", to: "/employee-risk" },
        { label: "Legal Exposure", to: "/legal-risk" },
        { label: "Narratives Monitor", to: "/narrative-monitor" },
        { label: "Product Sentiment", to: "/product-sentiment" },
        { label: "Export Report", to: "/export-report" },
        { label: "Company Risk Overview", to: "/company-risk-overview" },
        { label: "Global Network", to: "/global-network" },
        { label: "Geo Risk Heatmap", to: "/geo-risk" },
        { label: "AI Risk Insights", to: "/ai-employee-insights" },
        { label: "Narrative Monitor (Employee)", to: "/narrative-monitor-employee" },
        { label: "Shodan Intelligence", to: "/shodan-intel", icon: <ShieldCheck className="w-4 h-4" /> },

      ],
    },
    // --- 3. Political Analysis ---
    {
      category: "Political Analysis",
      key: "politicalAnalysis",
      icon: <Globe className="w-4 h-4" />,
      subLinks: [
        { label: "Narrative Dashboard", to: "/narrative-dashboard" },
        { label: "Influence Overview", to: "/influence-dashboard" },
        { label: "Campaign Dashboard", to: "/campaign-dashboard" },
        { label: "Campaign Overview", to: "/campaign-overview" },
        { label: "Disinfo Monitor", to: "/disinfo-monitor" },
        { label: "AI Recommendation", to: "/ai-recommendation-dashboard" },
        { label: "Regulatory Risk", to: "/regulatory-risk-dashboard" },
        { label: "Regulatory Overview", to: "/regulatory-dashboard" },
        { label: "Search", to: "/search" },
        { label: "Smart Search", to: "/smart-search" },
        { label: "Search Results", to: "/search-results" },
      ],
    },
    // --- 4. Law Enforcement ---
    {
      category: "Law Enforcement",
      key: "lawEnforcement",
      icon: <Gavel className="w-4 h-4" />,
      subLinks: [
        { label: "Threat Actors", to: "/actor-dashboard" },
        { label: "Actor Profile", to: "/actor-profile" },
        { label: "Actor Correlation", to: "/actor-correlation-dashboard" },
        { label: "Dark Web Monitor", to: "/darkweb-monitor" },
        { label: "Group Profile", to: "/group-profile" },
        { label: "Investigation Center", to: "/investigation-center" },
        { label: "Sector Overview", to: "/sector-overview" },
        { label: "בדיקת מקוריות תמונה", to: "/image-auth" },
        { label: "דוח מודיעין תמונות", to: "/intel-report" },
        { label: "ניתוח תמונה מתקדם", to: "/image-advanced" },
      ],
    },
    // --- 5. Communication and Journalism ---
    {
      category: "Communication and Journalism",
      key: "communicationJournalism",
      icon: <Megaphone className="w-4 h-4" />,
      subLinks: [
        { label: "News Insights", to: "/news-insights" },
        { label: "Company News", to: "/company-news" },
      ],
    },
    // --- System Administration (לרוב קטגוריה עצמאית) ---
    {
        category: "System Administration",
        key: "systemAdmin",
        icon: <Users className="w-4 h-4" />,
        subLinks: [
          { label: "User Management Dashboard", to: "/admin/users" },
          { label: "User Role Editor", to: "/admin/user-role-editor" },
          { label: "Module Access Editor", to: "/admin/module-access-editor" },
          { label: "Alert Dashboard (Admin)", to: "/alert-dashboard" },
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
      // --- Alert Engine (לרוב קטגוריה עצמאית) ---
      {
        category: "Alert Engine",
        key: "alertEngine",
        icon: <AlertTriangle className="w-4 h-4" />,
        subLinks: [
          { label: "Alert Dashboard", to: "/alert-engine-dashboard" },
          { label: "Alert Engine", to: "/alert-engine" },
          { label: "Alert Scheduler", to: "/alert-scheduler" },
          { label: "Alert Storage", to: "/alert-storage" },
        ],
      },
  ];

  return (
    <aside className="bg-gray-900 text-white min-h-screen w-56 p-4 border-r border-gray-800">
      <div className="font-bold text-lg mb-4">AEGIX Navigation</div>
      <ul className="space-y-1 text-sm list-none">
        {categories.map((item, index) => { // עכשיו עוברים על categories
          const isOpen = openCategories[item.key];
          return (
            <li key={item.key || index} className="mt-2">
              <button
                onClick={() => toggleCategory(item.key)}
                className="flex items-center justify-between w-full px-2 py-1 rounded transition hover:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  {item.icon} {/* האייקון של הקטגוריה הראשית */}
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
                  {item.subLinks.map((subLink) => ( // תת-הקישורים
                    <li key={subLink.to}>
                      <Link
                        to={subLink.to}
                        // הגדלתי את ה-padding-left (pl) ל-px-4 כדי להזיז את הקישורים ימינה
                        className={`block px-4 py-1 rounded transition ${
                          location.pathname === subLink.to ? "bg-gray-700" : "hover:bg-gray-800"
                        }`}
                      >
                        {/* אין אייקונים בתת-פריטים */}
                        {subLink.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;