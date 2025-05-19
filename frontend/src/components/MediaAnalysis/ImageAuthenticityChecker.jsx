import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";

const ImageAuthenticityChecker = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [score, setScore] = useState(null);
  const [result, setResult] = useState("");
  const [label, setLabel] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageUrl("");
    setPreviewUrl(URL.createObjectURL(file));
    setScore(null);
    setResult("");
    setSource("");
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageFile(null);
    setPreviewUrl(url);
    setScore(null);
    setResult("");
    setSource("");
  };

  const handleCheckAuthenticity = async () => {
    setLoading(true);
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imageUrl) {
      formData.append("url", imageUrl);
    }

    try {
      const res = await axios.post("/api/media/check-authenticity", formData);
      setScore(res.data.score);
      setResult(res.data.result);
      setSource(res.data.source);
      setLabel(res.data.label || "");
      setConfidence(res.data.confidence || null);
    } catch (error) {
      console.error("❌ שגיאה:", error);
      setResult("⚠️ שגיאה בניתוח התמונה או תקשורת עם השרת.");
      setScore(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToIntel = async () => {
    const body = {
      source,
      result,
      score,
    };
    try {
      await axios.post("/api/reports/add-image-check", body);
      alert("✅ נוסף לדוח מודיעין בהצלחה!");
    } catch (err) {
      alert("❌ שגיאה בשמירה לדוח");
    }
  };

  return (
    <div className="flex bg-zinc-900 min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <Card className="max-w-xl mx-auto p-4 bg-zinc-800 rounded-2xl shadow-lg">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">🔍 בדיקת מקוריות תמונה</h2>

            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            <div className="text-center text-sm text-zinc-400">או הזן URL של תמונה</div>
            <Input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={handleUrlChange}
            />

            {previewUrl && (
              <div className="text-center">
                <img
                  src={previewUrl}
                  alt="תצוגה מקדימה"
                  className="max-h-64 mt-2 rounded-md mx-auto shadow-md"
                />
              </div>
            )}

            <Button
              onClick={handleCheckAuthenticity}
              disabled={loading || (!imageFile && !imageUrl)}
            >
              בדוק מקוריות
            </Button>

            {loading && <div>⏳ מנתח תמונה...</div>}

            {score !== null && (
              <div className="space-y-2">
                <div className="text-sm">ציון מקוריות (Authenticity Score)</div>
                <Progress value={score} className="h-4" />
                <div className="text-md font-bold">תוצאה: {result}</div>

                {source && (
                  <img
                    src={`http://localhost:5000/uploads/${source}`}
                    alt="preview"
                    className="h-32 mx-auto rounded shadow"
                  />
                )}

                <Button variant="outline" onClick={handleSaveToIntel}>
                  📁 הוסף לדוח מודיעין
                </Button>

                <div className="flex gap-2 pt-2 justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/reverse-search?image=${source}`)}
                  >
                    🔍 הרחב סריקה
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                  >
                    ↩ חזור לדשבורד
                  </Button>
                </div>
              </div>
            )}

            {!loading && !score && result && (
              <div className="text-red-400 text-sm mt-2">{result}</div>
            )}

            <div className="text-sm text-zinc-400 pt-4 text-center">
              🔗 קישור ישיר למסך: {" "}
              <a
                href="http://localhost:5173/image-auth"
                target="_blank"
                rel="noreferrer"
                className="underline text-blue-400"
              >
                http://localhost:5173/image-auth
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageAuthenticityChecker;