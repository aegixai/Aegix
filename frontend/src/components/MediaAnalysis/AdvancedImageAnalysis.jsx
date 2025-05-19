import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdvancedImageAnalysis = () => {
  return (
    <Card className="max-w-5xl mx-auto p-6 mt-10 bg-zinc-900 text-white shadow-xl rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">🧠 ניתוח מתקדם של תמונה</h2>

        <ul className="list-disc list-inside space-y-2 text-zinc-300">
          <li>🔎 <strong>Label ראשי:</strong> ניתוח מה המודל זיהה (למשל: person, tie, mask)</li>
          <li>📊 <strong>רמת ביטחון:</strong> כמה המודל בטוח בזיהוי (ב־%)</li>
          <li>🎯 <strong>חישוב מקוריות:</strong> לפי נוסחת מקוריות בהתבסס על תוכן + ביטחון</li>
          <li>📷 <strong>תצוגה מקדימה:</strong> בדיקה האם יש פרצוף בתמונה (נשלב מודול ניתוח פנים)</li>
          <li>🎨 <strong>בדיקת צבעוניות ורקע:</strong> האם הרקע אחיד או מלאכותי (בהמשך)</li>
          <li>🌐 <strong>מקור:</strong> האם הועלה מקובץ או URL</li>
        </ul>

        <p className="text-sm text-zinc-400">* ניתן להרחיב ניתוח באמצעות reverse image search או face analysis API</p>

        <Button variant="outline" onClick={() => alert("🚧 פיצ'רים מתקדמים בפיתוח")}>🔬 הפעל ניתוח פנים / רקע</Button>
      </CardContent>
    </Card>
  );
};

export default AdvancedImageAnalysis;
