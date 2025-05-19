import React from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Card, CardContent } from "@/components/ui/card";

const graphData = {
  nodes: [
    { id: "cryptoshark77", group: 1 },
    { id: "darkbot99", group: 1 },
    { id: "tokenhunter", group: 1 }
  ],
  links: [
    { source: "cryptoshark77", target: "darkbot99" },
    { source: "cryptoshark77", target: "tokenhunter" }
  ]
};

const NegativeConnectionsGraph = () => {
  return (
    <Card className="bg-gray-900 border border-gray-700 mt-6">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">🕸️ Negative Actor Graph</h3>
        <div className="border border-gray-600">
          <ForceGraph2D
            graphData={graphData}
            nodeLabel="id"
            nodeAutoColorBy="group"
            width={700}
            height={400}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NegativeConnectionsGraph;
