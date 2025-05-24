import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  Search,
  Users,
  AlertCircle,
  Flame,
  Globe,
  Brain,
  Newspaper,
  Briefcase,
  ShieldCheck,
  FileSearch,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Megaphone,
  Gavel,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = (key) => {
    setOpenCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const categories = [
    {
      category: "Financial Monitoring",
      key: "financialMonitoring",
      icon: <DollarSign className="w-4 h-4" />,
      subLinks: [
        { label: "Main Dashboard", to: "/dashboard" },
        { label: "Overview Dashboard", to: "/overview-dashboard" },
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
        { label: "Shodan Intelligence", to: "/shodan-intel" },
      ],
    },
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
    {
      category: "Communication and Journalism",
      key: "communicationJournalism",
      icon: <Megaphone className="w-4 h-4" />,
      subLinks: [
        { label: "News Insights", to: "/news-insights" },
        { label: "Company News", to: "/company-news" },
      ],
    },
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
        {categories.map((item, index) => {
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
                        className={`block px-4 py-1 rounded transition ${
                          location.pathname === subLink.to
                            ? "bg-gray-700"
                            : "hover:bg-gray-800"
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
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
