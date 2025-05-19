// 📁 frontend/src/components/ReverseImageSearchPanel.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import OcrTextExtractor from "./OcrTextExtractor";

const ReverseImageSearchPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const image = query.get("image");

  return (
    <div className="flex bg-zinc-900 min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <Card className="max-w-4xl mx-auto p-4 bg-zinc-800 rounded-2xl shadow-lg">
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-bold">🔍 הרחבת סריקה לתמונה</h2>

            <div className="text-sm text-zinc-400">
              קובץ: <span className="text-white font-mono">{image}</span>
            </div>

            <img
              src={`http://localhost:5000/uploads/${image}`}
              alt="preview"
              className="max-h-64 mx-auto rounded shadow"
            />

            <div className="space-y-2 pt-4">
              <Button
                variant="outline"
                onClick={() =>
                  window.open(`https://tineye.com/search?url=http://localhost:5000/uploads/${image}`, "_blank")
                }
              >
                🔍 חפש ב־TinEye
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  window.open(`https://yandex.com/images/search?rpt=imageview&url=http://localhost:5000/uploads/${image}`, "_blank")
                }
              >
                🌍 חפש ב־Yandex Images
              </Button>

              <OcrTextExtractor imagePath={image} />
            </div>

            <div className="flex justify-between pt-6 text-sm text-zinc-400">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                ← חזור למסך הקודם
              </Button>
              <a href="/intel-report" className="underline text-blue-400">
                לצפייה בדוח המודיעין →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReverseImageSearchPanel;
