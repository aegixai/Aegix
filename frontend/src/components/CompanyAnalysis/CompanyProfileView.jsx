import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CompanyProfileView = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`/api/company/${companyId}`);
        setCompany(res.data);
      } catch (error) {
        console.warn("API failed, loading from mock JSON...");
        try {
          const res = await fetch(`/data/companies/${companyId}.json`);
          const data = await res.json();
          setCompany(data);
        } catch (e) {
          console.error("Failed to load fallback data");
        }
      }
    };
    fetchCompany();
  }, [companyId]);

  if (!company) {
    return <p className="text-white p-6">🔄 Loading company profile...</p>;
  }

  const isGLEIF = !company.employees && !company.products;

  const countryMap = {
    US: "United States",
    IL: "Israel",
    DE: "Germany",
    FR: "France",
    GB: "United Kingdom",
  };

  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 space-y-6 text-white">
        <h1 className="text-3xl font-bold">{company.name}</h1>
        <p className="text-gray-400 mb-2">LEI: {company.lei}</p>

        {isGLEIF ? (
          <>
            <Card className="bg-gray-900 border border-gray-700">
              <CardContent className="p-4">
                <p><strong>🌍 Country:</strong> {countryMap[company.country] || company.country}</p>
                <p><strong>📬 Address:</strong> {company.address?.join(", ")}</p>
                <p><strong>🏙️ City:</strong> {company.city}</p>
                <p><strong>📮 Postal Code:</strong> {company.postalCode}</p>
                <p><strong>⚖️ Jurisdiction:</strong> {company.legalJurisdiction}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border border-gray-700">
              <CardContent className="p-4">
                <p><strong>📊 Status:</strong> {company.status}</p>
                <p><strong>📅 Registered:</strong> {company.registrationDate}</p>
                <p><strong>📆 Last Updated:</strong> {company.lastUpdate}</p>
                <p><strong>🔁 Next Renewal:</strong> {company.nextRenewal}</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <p className="text-gray-300">{company.sector}</p>
            <p className="text-gray-400">{company.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card><CardContent>Total Employees: {company.employees?.length}</CardContent></Card>
              <Card><CardContent>Average Risk: {company.risk_index ?? "N/A"}</CardContent></Card>
              <Card><CardContent>Open Legal Cases: {company.legal_issues?.length ?? 0}</CardContent></Card>
              <Card><CardContent>Products: {company.products?.length ?? 0}</CardContent></Card>
            </div>

            {company.ai_summary && (
              <Card className="bg-gray-800 border border-gray-700">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2">🧠 AI Insight</h2>
                  <p className="text-gray-200 italic">{company.ai_summary}</p>
                </CardContent>
              </Card>
            )}

            <div className="pt-6">
              <label className="mr-4">Filter Employees by Risk:</label>
              <select
                className="bg-gray-800 text-white px-2 py-1 rounded"
                onChange={(e) => setEmployeeFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <Card className="bg-gray-900 border border-gray-700">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold">Employees</h2>
                    <ul className="list-disc ml-5">
                      {company.employees?.filter((emp) =>
                        employeeFilter === "all" ? true : emp.risk === employeeFilter
                      ).map((emp, index) => (
                        <li key={index}>
                          {emp.name} – {emp.role} (
                          <span className={
                            emp.risk === "High" ? "text-red-500" :
                            emp.risk === "Medium" ? "text-yellow-400" : "text-green-400"
                          }>
                            {emp.risk}
                          </span>)
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Risk Distribution</h2>
                    <div className="max-w-xs mx-auto" style={{ maxHeight: "300px" }}>
                      <Bar data={{
                        labels: ["Low", "Medium", "High"],
                        datasets: [{
                          label: "Risk Distribution",
                          data: [
                            company.employees?.filter(e => e.risk === "Low").length ?? 0,
                            company.employees?.filter(e => e.risk === "Medium").length ?? 0,
                            company.employees?.filter(e => e.risk === "High").length ?? 0
                          ],
                          backgroundColor: ["#00cc66", "#ffcc00", "#ff3333"]
                        }]
                      }} options={{
                        responsive: true,
                        plugins: { legend: { labels: { color: "#ffffff" } } },
                        scales: {
                          x: { ticks: { color: "#ffffff" } },
                          y: { ticks: { color: "#ffffff" } }
                        }
                      }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="pt-6">
              <label className="mr-4">Search Product Name:</label>
              <div className="flex items-center gap-2 pt-2">
                <Input
                  className="w-64"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Type product name..."
                />
                <Button variant="outline" disabled>🔍</Button>
              </div>
            </div>

            <Card className="bg-gray-900 border border-gray-700">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">Products</h2>
                <ul className="list-disc ml-5">
                  {company.products?.filter((prod) =>
                    prod.name?.toLowerCase().includes(productSearch.toLowerCase())
                  ).map((prod, index) => (
                    <li key={index}>
                      {prod.name} ({prod.type}) – Issues: {prod.issues?.join(", ") ?? "None"}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex gap-4 flex-wrap">
              <Button onClick={() => navigate(`/employee-risk/${companyId}`)}>Employee Risk</Button>
              <Button onClick={() => navigate(`/product-sentiment/${companyId}`)}>Product Sentiment</Button>
              <Button onClick={() => navigate(`/legal-risk/${companyId}`)}>Legal Exposure</Button>
              <Button onClick={() => navigate(`/competitor-map/${companyId}`)}>Competitor Map</Button>
              <Button onClick={() => navigate(`/narrative-monitor/${companyId}`)}>Narrative Monitor</Button>
              <Button onClick={() => navigate(`/export-report/${companyId}`)}>Export Report</Button>
              <Button onClick={() => navigate(`/company-risk-overview/${companyId}`)}>Company Risk Overview</Button>
              <Button onClick={() => navigate(`/global-network/${companyId}`)}>Global Network</Button>
              <Button onClick={() => navigate(`/geo-risk-heatmap/${companyId}`)}>Geo Risk Heatmap</Button>
              <Button onClick={() => navigate(`/ai-risk-insights/${companyId}`)}>AI Risk Insights</Button>
              <Button onClick={() => navigate(`/narrative-monitor-employee/${companyId}`)}>Narrative Monitor (Employee)</Button>
              <Button onClick={() => navigate(`/shodan-intel/${companyId}`)}>Shodan Network Intel</Button>
            </div>
          </>
        )}

        <Button variant="secondary" onClick={() => navigate(-1)}>⬅ חזור אחורה</Button>
      </div>
    </div>
  );
};

export default CompanyProfileView;
