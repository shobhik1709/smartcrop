import { useState } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import WaterManagement from "./WaterManagement";
import DiseaseDiagnosis from "./DiseaseDiagnosis";
import Reminders from "./Reminders";
import Resources from "./Resources";
import "./Farm.css";

function Farm() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="farm-page">
      <Navbar />
      <div className="farm-container">
        <div className="farm-header">
          <h1>🌾 Smart Farm Management System</h1>
          <p>Intelligent water management, disease diagnosis, and crop care</p>
        </div>
        <div className="farm-tabs">
          <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
            📊 Dashboard
          </button>
          <button className={activeTab === "water" ? "active" : ""} onClick={() => setActiveTab("water")}>
            💧 Water Management
          </button>
          <button className={activeTab === "disease" ? "active" : ""} onClick={() => setActiveTab("disease")}>
            🐛 Disease Diagnosis
          </button>
          <button className={activeTab === "reminders" ? "active" : ""} onClick={() => setActiveTab("reminders")}>
            ⏰ Reminders
          </button>
          <button className={activeTab === "resources" ? "active" : ""} onClick={() => setActiveTab("resources")}>
            📚 Resources
          </button>
        </div>
        <div className="farm-content">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "water" && <WaterManagement />}
          {activeTab === "disease" && <DiseaseDiagnosis />}
          {activeTab === "reminders" && <Reminders />}
          {activeTab === "resources" && <Resources />}
        </div>
      </div>
    </div>
  );
}

export default Farm;