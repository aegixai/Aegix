
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AddGroupPanel = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("Telegram");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (name.trim() && description.trim()) {
      onAdd({
        name,
        platform,
        description,
      });
      setName("");
      setPlatform("Telegram");
      setDescription("");
    }
  };

  return (
    <Card className="bg-gray-800 text-white mb-4">
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-lg">➕ Add New Group</h3>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Group Name"
            className="bg-gray-700 px-3 py-1 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="bg-gray-700 px-3 py-1 rounded"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="Telegram">Telegram</option>
            <option value="Twitter">Twitter</option>
            <option value="Facebook">Facebook</option>
            <option value="Reddit">Reddit</option>
          </select>
          <input
            type="text"
            placeholder="Short Description"
            className="bg-gray-700 px-3 py-1 rounded flex-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button className="bg-green-600 hover:bg-green-500" onClick={handleAdd}>
            Add Group
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddGroupPanel;
