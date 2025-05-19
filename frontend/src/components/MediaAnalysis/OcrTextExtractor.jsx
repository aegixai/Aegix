// 📁 frontend/src/components/OcrTextExtractor.jsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Tesseract from "tesseract.js";

const OcrTextExtractor = ({ imagePath }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOCR = () => {
    setLoading(true);
    Tesseract.recognize(`http://localhost:5000/uploads/${imagePath}`, "eng")
      .then(({ data: { text } }) => {
        setText(text.trim() || "לא זוהה טקסט בתמונה");
      })
      .catch(() => {
        setText("⚠️ שגיאה בזיהוי טקסט (OCR)");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-6 space-y-3 text-center">
      <Button onClick={handleOCR} disabled={loading}>
        🔠 הפעל זיהוי טקסט מתוך תמונה (OCR)
      </Button>

      {loading && <p className="text-sm text-zinc-400">⏳ מזהה טקסט מתוך התמונה...</p>}

      {text && (
        <div className="bg-zinc-800 p-4 rounded-lg text-left whitespace-pre-wrap text-zinc-300 shadow mt-4">
          <h4 className="text-md font-bold mb-2">📄 טקסט מזוהה:</h4>
          <div className="text-sm">{text}</div>
        </div>
      )}
    </div>
  );
};

export default OcrTextExtractor;
