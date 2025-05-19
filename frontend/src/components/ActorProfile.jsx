import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIdCard,
  FaEdit,
  FaPlus,
  FaLink
} from "react-icons/fa";
import {
  actorProfile as initialProfile,
  actorConnections,
  movementHistory
} from "@/data/actor_mock_data.json";
import { Link } from "react-router-dom";

const ActorProfile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editData, setEditData] = useState({ ...initialProfile });

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    setProfile(editData);
    setShowEditPopup(false);
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">🎭 Actor Profile</h1>
          <Link to="/dashboard" className="text-sm text-gray-400 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row bg-gray-900 p-6 rounded-xl">
          <div className="flex-shrink-0">
            <img
              src={profile.image}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover"
            />
            <p className="text-center mt-2 text-gray-400">{profile.name}</p>
          </div>
          <div className="md:ml-8 mt-6 md:mt-0 space-y-2">
            <p><FaIdCard className="inline" /> {profile.idNumber}</p>
            <p><FaMapMarkerAlt className="inline" /> {profile.address}</p>
            <p><FaPhoneAlt className="inline" /> {profile.phones.join(", ")}</p>
            <p><FaEnvelope className="inline" /> {profile.emails.join(", ")}</p>
            <p><FaLink className="inline" /> {profile.socials.join(", ")}</p>
            <div className="flex space-x-4 mt-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center"
                onClick={() => setShowEditPopup(true)}
              >
                <FaEdit className="mr-2" /> Edit Info
              </button>
              <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center">
                <FaPlus className="mr-2" /> Add File
              </button>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold mb-4">🧮 Risk Matrix</h2>
          <div className="bg-gray-800 p-4 rounded text-center text-gray-300">
            <img
              src="/assets/risk_matrix_example.png"
              alt="Risk Matrix"
              className="rounded-lg shadow-lg mt-4"
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">🔗 Links Graph</h2>
          <div className="bg-gray-800 p-4 rounded text-center text-gray-300">
            <img
              src="/assets/links_graph_example.png"
              alt="Links Graph"
              className="rounded-lg shadow-lg mt-4"
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">📈 Movement Timeline</h2>
          <div className="space-y-4">
            {movementHistory.map((entry, idx) => (
              <div key={idx} className="border-l-4 border-cyan-400 pl-4 ml-2">
                <p className="text-cyan-300 font-semibold">{entry.timestamp}</p>
                <p className="text-gray-300">Lat: {entry.lat}, Lng: {entry.lng}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">🗺 Movement Map</h2>
          <div className="rounded-xl overflow-hidden border border-gray-800">
            <MapContainer
              center={[31.7683, 35.2137]}
              zoom={8}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {movementHistory.map((location, idx) => (
                <Marker key={idx} position={[location.lat, location.lng]}>
                  <Popup>
                    <div className="text-center">
                      <p><strong>Timestamp:</strong></p>
                      <p>{location.timestamp}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </section>

        <div className="text-right">
          <Link to="/user-profile/cryptoshark77">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm mt-6">
              👤 View CryptoShark Profile
            </button>
          </Link>
        </div>

        {showEditPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded-lg w-96 space-y-4 relative">
              <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
              <input
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                className="w-full p-2 border rounded"
                placeholder="Name"
              />
              <input
                name="idNumber"
                value={editData.idNumber}
                onChange={handleEditChange}
                className="w-full p-2 border rounded"
                placeholder="ID Number"
              />
              <input
                name="address"
                value={editData.address}
                onChange={handleEditChange}
                className="w-full p-2 border rounded"
                placeholder="Address"
              />
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mt-2"
                onClick={saveProfile}
              >
                Save Changes
              </button>
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
                onClick={() => setShowEditPopup(false)}
              >
                ✖
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActorProfile;
