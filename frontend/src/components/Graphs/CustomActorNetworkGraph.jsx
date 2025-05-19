import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

const CustomActorNetworkGraph = () => {
  const svgRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      let graphData;
      try {
        const res = await axios.get("/api/graph/actors");
        graphData = res.data;
      } catch (e) {
        console.warn("⚠️ API unavailable, using mock fallback.");
        graphData = {
          nodes: [
            { id: "User A", group: "High", role: "Actor" },
            { id: "User B", group: "Medium", role: "Promoter" },
            { id: "Group X", group: "Group", role: "Telegram" },
          ],
          links: [
            { source: "User A", target: "Group X" },
            { source: "User B", target: "Group X" },
          ],
        };
      }

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      const width = 600;
      const height = 400;

      const simulation = d3.forceSimulation(graphData.nodes)
        .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2));

      const link = svg.append("g")
        .selectAll("line")
        .data(graphData.links)
        .enter().append("line")
        .attr("stroke", "#888")
        .attr("stroke-width", 2);

      const node = svg.append("g")
        .selectAll("circle")
        .data(graphData.nodes)
        .enter().append("circle")
        .attr("r", 10)
        .attr("fill", d => d.group === "High" ? "#ff5555" : d.group === "Medium" ? "#ffaa00" : "#33c1ff")
        .call(drag(simulation))
        .on("click", d => alert(`🔍 ${d.target.__data__.id} (${d.target.__data__.role})`));

      const label = svg.append("g")
        .selectAll("text")
        .data(graphData.nodes)
        .enter().append("text")
        .text(d => d.id)
        .attr("font-size", 12)
        .attr("fill", "#fff");

      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

        label
          .attr("x", d => d.x + 12)
          .attr("y", d => d.y + 4);
      });
    };

    const drag = simulation => {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-zinc-900 text-white rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-4">🕸️ רשת קשרים – שחקנים וקבוצות</h2>
      <svg ref={svgRef} width={600} height={400} />
    </div>
  );
};

export default CustomActorNetworkGraph;
