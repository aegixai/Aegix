// App.jsx – כולל תמיכה במסך UserProfileView עם username דינמי

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import MainLayout from "@/components/MainLayout";

// Public Screens
import Welcome from "./components/Welcome";
import Login from "./components/Login";

// Core Dashboards
import Dashboard from "./components/Dashboard";
import DashboardOverview from "@/components/DashboardOverview";
import NarrativeDashboard from "./components/NarrativeDashboard";
import FinanceDashboard from "./components/FinanceDashboard";
import CrisisDashboard from "./components/CrisisDashboard";

// Threat Actor Intelligence
import ThreatActorDashboard from "./components/ThreatActorDashboard";
import ActorProfile from "./components/ActorProfile";
import ActorCorrelationDashboard from "./components/ActorCorrelationDashboard";

// Influence & Disinformation
import DisinfoMonitor from "./components/DisinfoMonitor";
import DarkWebMonitor from "./components/DarkWebMonitor";
import GroupNetworkGraph from "./components/GroupNetworkGraph";
import GroupProfile from "./components/GroupProfile";
import UserProfileView from "@/components/UserProfileView";
import InfluenceDashboard from "./components/InfluenceDashboard";

// Campaign Intelligence
import CampaignDashboard from "./components/Campaign/CampaignDashboard";
import CampaignOverview from "./components/Campaign/CampaignOverview";

// AI Recommendations
import AIRecommendationDashboard from "./components/AI/AIRecommendationDashboard";

// Regulatory Intelligence
import RegulatoryRiskDashboard from "./components/Regulatory/RegulatoryRiskDashboard";
import RegulatoryDashboard from "./components/Regulatory/RegulatoryDashboard";
import RegulatoryIntelDashboard from "@/components/Regulatory/RegulatoryIntelDashboard";

// Search & Admin
import Search from "./components/Search";
import SmartSearch from "./components/Search/SmartSearch";
import SearchResultsScreen from "./components/Search/SearchResultsScreen";
import ManageUsers from "./components/Admin/ManageUsers";

// Content Removal
import ContentRemovalDashboard from "./components/ContentRemoval/ContentRemovalDashboard";
import ContentRemovalForm from "./components/ContentRemoval/ContentRemovalForm";

// News & Sentiment
import NewsAnalyticsDashboard from "@/components/News/NewsAnalyticsDashboard";
import CompanyNewsDashboard from "./components/CompanyAnalysis/CompanyNewsDashboard";

// Avatar Suite
import AvatarAdminPanel from "./components/Admin/AvatarAdminPanel";
import AvatarManager from "./components/AvatarSuite/AvatarManager";
import PersonaProfileEditor from "./components/AvatarSuite/PersonaProfileEditor";
import AvatarRiskDashboard from "./components/AvatarSuite/AvatarRiskDashboard";
import AvatarSchedulerDashboard from "./components/AvatarSuite/AvatarSchedulerDashboard";
import PostTimeline from "./components/AvatarSuite/PostTimeline";
import PostArchive from "./components/AvatarSuite/PostArchive";

// Company Analysis
import CompanyProfileView from "./components/CompanyAnalysis/CompanyProfileView";
import CompetitorMapPanel from "./components/CompanyAnalysis/CompetitorMapPanel";
import EmployeeRiskScanner from "./components/CompanyAnalysis/EmployeeRiskScanner";
import ExportReport from "./components/CompanyAnalysis/ExportReport";
import LegalExposurePanel from "./components/CompanyAnalysis/LegalExposurePanel";
import NarrativeMonitor from "./components/CompanyAnalysis/NarrativeMonitor";
import ProductSentimentDashboard from "./components/CompanyAnalysis/ProductSentimentDashboard";
import EmployeeProfileView from "@/components/CompanyAnalysis/EmployeeProfileView";
import CompanyRiskOverview from "@/components/CompanyAnalysis/CompanyRiskOverview";
import GlobalEmployeeNetwork from "@/components/CompanyAnalysis/GlobalEmployeeNetwork";
import GeoRiskHeatmap from "@/components/CompanyAnalysis/GeoRiskHeatmap";
import AIEmployeeInsights from "@/components/CompanyAnalysis/AIEmployeeInsights";
import EmployeeNarrativeMonitor from "@/components/CompanyAnalysis/EmployeeNarrativeMonitor";
import InvestigationCenter from "./components/CompanyAnalysis/InvestigationCenter";
import CompanySearchPanel from "./components/CompanyAnalysis/CompanySearchPanel";
import ShodanIntelDashboard from "./components/NetworkIntel/ShodanIntelDashboard";

// Geo Intelligence
import GeoIntelReportView from "./components/Geo/GeoIntelReportView";
import GeoSearchPanel from "./components/Geo/GeoSearchPanel";
import ScheduledScanForm from "./components/Geo/ScheduledScanForm";
import ScheduledScanViewer from "@/components/Geo/ScheduledScanViewer";

// Blockchain Intelligence
import BlockchainAnomalyDashboard from "./components/Blockchain/BlockchainAnomalyDashboard";
import WalletHeatmap from "./components/Blockchain/WalletHeatmap";
import WalletProfile from "./components/Blockchain/WalletProfile";
import WalletExportReport from "./components/Blockchain/WalletExportReport";
import LiveWalletScanner from "./components/Blockchain/LiveWalletScanner";
import WalletConnectionsGraph from "./components/Blockchain/WalletConnectionsGraph";
import WalletIntelDashboard from "@/components/Blockchain/WalletIntelDashboard";
import CryptoMarketDashboard from "./components/Blockchain/CryptoMarketDashboard";
import CryptoMarket from "./components/CryptoMarket";
import GroupTrackerPanel from "@/components/Influence/GroupTrackerPanel";
import NegativeInfluencersPanel from "./components/NegativeInfluencersPanel";
import GroupComparePanel from "@/components/Influence/GroupComparePanel";
import SectorOverviewPanel from "@/components/Sectors/SectorOverviewPanel";
import ImageAuthenticityChecker from "@/components/MediaAnalysis/ImageAuthenticityChecker";
import AdvancedImageAnalysis from "@/components/MediaAnalysis/AdvancedImageAnalysis";
import IntelReportView from "@/components/Reports/IntelReportView";
import ReverseImageSearchPanel from "@/components/MediaAnalysis/ReverseImageSearchPanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/overview-dashboard" element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>} />
        <Route path="/narrative-dashboard" element={<ProtectedRoute><MainLayout><NarrativeDashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/finance-dashboard" element={<ProtectedRoute><MainLayout><FinanceDashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/crisis-dashboard" element={<ProtectedRoute><MainLayout><CrisisDashboard /></MainLayout></ProtectedRoute>} />

        {/* Threat Intelligence */}
        <Route path="/actor-dashboard" element={<ProtectedRoute><MainLayout><ThreatActorDashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/actor-profile" element={<ProtectedRoute><MainLayout><ActorProfile /></MainLayout></ProtectedRoute>} />
        <Route path="/actor-correlation-dashboard" element={<ProtectedRoute><MainLayout><ActorCorrelationDashboard /></MainLayout></ProtectedRoute>} />

        {/* Influence & Groups */}
        <Route path="/disinfo-monitor" element={<ProtectedRoute><MainLayout><DisinfoMonitor /></MainLayout></ProtectedRoute>} />
        <Route path="/darkweb-monitor" element={<ProtectedRoute><MainLayout><DarkWebMonitor /></MainLayout></ProtectedRoute>} />
        <Route path="/group-network" element={<ProtectedRoute><MainLayout><GroupNetworkGraph /></MainLayout></ProtectedRoute>} />
        <Route path="/group-profile" element={<ProtectedRoute><MainLayout><GroupProfile /></MainLayout></ProtectedRoute>} />
        <Route path="/user-profile/:username" element={<ProtectedRoute><MainLayout><UserProfileView /></MainLayout></ProtectedRoute>} />
        <Route path="/influence-dashboard" element={<ProtectedRoute><MainLayout><InfluenceDashboard /></MainLayout></ProtectedRoute>} />

        {/* Campaign */}
        <Route path="/campaign-dashboard" element={<ProtectedRoute><MainLayout><CampaignDashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/campaign-overview" element={<ProtectedRoute><MainLayout><CampaignOverview /></MainLayout></ProtectedRoute>} />

        {/* AI & Regulatory */}
        <Route path="/ai-recommendation-dashboard" element={<ProtectedRoute><MainLayout><AIRecommendationDashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/regulatory-risk-dashboard" element={<ProtectedRoute><MainLayout><RegulatoryRiskDashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/regulatory-dashboard" element={<ProtectedRoute><MainLayout><RegulatoryDashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/regulatory-intel" element={<ProtectedRoute><MainLayout><RegulatoryIntelDashboard /></MainLayout></ProtectedRoute>} />

        {/* Search & Admin */}
        <Route path="/search" element={<ProtectedRoute><MainLayout><Search /></MainLayout></ProtectedRoute>} />
        <Route path="/smart-search" element={<ProtectedRoute><SmartSearch /></ProtectedRoute>} />
        <Route path="/search-results" element={<ProtectedRoute><SearchResultsScreen /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><MainLayout><ManageUsers /></MainLayout></ProtectedRoute>} />

        {/* Content Removal */}
        <Route path="/content-removal" element={<ProtectedRoute><MainLayout><ContentRemovalDashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/content-removal/new" element={<ProtectedRoute><MainLayout><ContentRemovalForm /></MainLayout></ProtectedRoute>} />

        {/* News */}
        <Route path="/news-insights" element={<ProtectedRoute><NewsAnalyticsDashboard /></ProtectedRoute>} />
        <Route path="/company-news" element={<ProtectedRoute><MainLayout><CompanyNewsDashboard /></MainLayout></ProtectedRoute>} />

        {/* Avatar */}
        <Route path="/admin/avatar-suite" element={<ProtectedRoute><MainLayout><AvatarAdminPanel /></MainLayout></ProtectedRoute>} />
        <Route path="/admin/avatar-suite/manager" element={<ProtectedRoute><MainLayout><AvatarManager /></MainLayout></ProtectedRoute>} />
        <Route path="/admin/avatar-suite/profile-editor" element={<ProtectedRoute><MainLayout><PersonaProfileEditor /></MainLayout></ProtectedRoute>} />
        <Route path="/admin/avatar-suite/risk-dashboard" element={<ProtectedRoute><MainLayout><AvatarRiskDashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/admin/avatar-suite/scheduler" element={<ProtectedRoute><MainLayout><AvatarSchedulerDashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/admin/avatar-suite/timeline" element={<ProtectedRoute><MainLayout><PostTimeline /></MainLayout></ProtectedRoute>} />
        <Route path="/admin/avatar-suite/archive" element={<ProtectedRoute><MainLayout><PostArchive /></MainLayout></ProtectedRoute>} />

        {/* Company */}
        <Route path="/company-profile/:companyId" element={<ProtectedRoute><CompanyProfileView /></ProtectedRoute>} />
        <Route path="/competitor-map" element={<ProtectedRoute><MainLayout><CompetitorMapPanel /></MainLayout></ProtectedRoute>} />
        <Route path="/employee-risk" element={<ProtectedRoute><MainLayout><EmployeeRiskScanner /></MainLayout></ProtectedRoute>} />
        <Route path="/export-report" element={<ProtectedRoute><MainLayout><ExportReport /></MainLayout></ProtectedRoute>} />
        <Route path="/legal-risk" element={<ProtectedRoute><MainLayout><LegalExposurePanel /></MainLayout></ProtectedRoute>} />
        <Route path="/narrative-monitor" element={<ProtectedRoute><MainLayout><NarrativeMonitor /></MainLayout></ProtectedRoute>} />
        <Route path="/product-sentiment/:companyId" element={<ProtectedRoute><MainLayout><ProductSentimentDashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/employee/:id" element={<EmployeeProfileView />} />
        <Route path="/company-risk-overview" element={<ProtectedRoute><CompanyRiskOverview /></ProtectedRoute>} />
        <Route path="/global-network" element={<ProtectedRoute><GlobalEmployeeNetwork /></ProtectedRoute>} />
        <Route path="/geo-risk" element={<ProtectedRoute><GeoRiskHeatmap /></ProtectedRoute>} />
        <Route path="/ai-employee-insights" element={<ProtectedRoute><AIEmployeeInsights /></ProtectedRoute>} />
        <Route path="/narrative-monitor-employee" element={<ProtectedRoute><EmployeeNarrativeMonitor /></ProtectedRoute>} />
        <Route path="/investigation" element={<ProtectedRoute><MainLayout><InvestigationCenter /></MainLayout></ProtectedRoute>} />
        <Route path="/company-search" element={<ProtectedRoute><CompanySearchPanel /></ProtectedRoute>} />
        <Route path="/shodan-intel" element={<ProtectedRoute><MainLayout><ShodanIntelDashboard /></MainLayout></ProtectedRoute>} />

        {/* Geo Intelligence */}
        <Route path="/geo-report" element={<ProtectedRoute><MainLayout><GeoIntelReportView /></MainLayout></ProtectedRoute>} />
        <Route path="/geo-search" element={<ProtectedRoute><MainLayout><GeoSearchPanel /></MainLayout></ProtectedRoute>} />
        <Route path="/schedule-scan" element={<ScheduledScanForm />} />
        <Route path="/scheduled-scans" element={<ProtectedRoute><MainLayout><ScheduledScanViewer /></MainLayout></ProtectedRoute>} />

        {/* Blockchain */}
        <Route path="/blockchain-dashboard" element={<BlockchainAnomalyDashboard />} />
        <Route path="/wallet-heatmap" element={<WalletHeatmap />} />
        <Route path="/wallet-profile/:walletId" element={<WalletProfile />} />
        <Route path="/export-report/:walletId" element={<WalletExportReport />} />
        <Route path="/wallet-scanner" element={<LiveWalletScanner />} />
        <Route path="/wallet-intel/:walletAddress" element={<WalletIntelDashboard />} />
        <Route path="/wallet-intel" element={<WalletIntelDashboard walletAddress="0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae" />} />
        <Route path="/crypto-market" element={<CryptoMarketDashboard />} />
        <Route path="/crypto-market-overview" element={<CryptoMarket />} />
        <Route path="/negative-influencers" element={<ProtectedRoute><MainLayout><NegativeInfluencersPanel /></MainLayout></ProtectedRoute>} />
        <Route path="/group-tracker" element={<ProtectedRoute><MainLayout><GroupTrackerPanel /></MainLayout></ProtectedRoute>} />
        <Route path="/negative-influencers" element={<ProtectedRoute><MainLayout><NegativeInfluencersPanel /></MainLayout></ProtectedRoute>} />
        <Route path="/group-compare" element={<ProtectedRoute><MainLayout><GroupComparePanel /></MainLayout></ProtectedRoute>} />
        <Route path="/image-auth" element={<ImageAuthenticityChecker />} />
        <Route path="/image-advanced" element={<AdvancedImageAnalysis />} />
        <Route path="/intel-report" element={<IntelReportView />} />
        <Route path="/reverse-search" element={<ReverseImageSearchPanel />} />

        {/* NEW – Sector Overview */}
        <Route path="/sector-overview" element={<ProtectedRoute><MainLayout><SectorOverviewPanel /></MainLayout></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
