// קובץ: GroupNetworkGraph.jsx
import React, { useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const GroupNetworkGraph = () => {
  const fgRef = useRef();
  const navigate = useNavigate();

  const data = {
    nodes: [
      { id: "cryptoshark77", group: 1 },
      { id: "btc_explorer88", group: 1 },
      { id: "tokenhunter", group: 1 },
      { id: "alert_bot", group: 1 }
    ],
    links: [
      { source: "cryptoshark77", target: "btc_explorer88" },
      { source: "cryptoshark77", target: "tokenhunter" },
      { source: "cryptoshark77", target: "alert_bot" }
    ]
  };

  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <Card className="bg-gray-900 border border-gray-700 mb-6">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">🔗 Group Network Graph</h2>
          <p className="text-sm text-gray-400">Visualizing key members and connections.</p>

          <button
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm mt-4"
            onClick={() => navigate("/user-profile/cryptoshark77")}
          >
            👤 Analyze Member Profile
          </button>

          <div className="mt-6 border border-gray-600">
            <ForceGraph2D
              ref={fgRef}
              graphData={data}
              nodeLabel="id"
              nodeAutoColorBy="group"
              width={800}
              height={500}
              onNodeClick={(node) => {
                if (node.id) {
                  navigate(`/user-profile/${node.id}`);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupNetworkGraph;
