import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./Crops.css";
// Supabase removed

function Crops() {
  const [city, setCity] = useState("");
  const [soil, setSoil] = useState("--Select--");
  const [water, setWater] = useState("--Select--");
  const [result, setResult] = useState("");
  const [weather, setWeather] = useState("");
  const [loading, setLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);

  // ⭐ Crop data (NO sandy soil)
  const cropsData = [
    { name: "Paddy", ideal: { temp: [20, 35], humidity: [60, 90], water: "high", soil: ["alluvial","black","red","laterite"] }, profit: "Medium" },
    { name: "Wheat", ideal: { temp: [10, 25], humidity: [40, 70], water: "medium", soil: ["alluvial","black","loamy"] }, profit: "Medium" },
    { name: "Cotton", ideal: { temp: [25, 40], humidity: [50, 80], water: "medium", soil: ["black","red"] }, profit: "Medium" },
    { name: "Sugarcane", ideal: { temp: [20, 38], humidity: [60, 85], water: "high", soil: ["alluvial","black","red","loamy"] }, profit: "High" },
    { name: "Millets", ideal: { temp: [20, 35], humidity: [30, 60], water: "low", soil: ["red","laterite","saline"] }, profit: "Medium" },
    { name: "Groundnut", ideal: { temp: [20, 30], humidity: [40, 70], water: "medium", soil: ["red","black"] }, profit: "Medium" },
    { name: "Soybean", ideal: { temp: [15, 30], humidity: [40, 70], water: "medium", soil: ["black","alluvial"] }, profit: "Medium" },
    { name: "Tea", ideal: { temp: [18, 30], humidity: [60, 90], water: "high", soil: ["laterite","loamy"] }, profit: "High" },
    { name: "Coffee", ideal: { temp: [15, 28], humidity: [65, 90], water: "high", soil: ["laterite","loamy"] }, profit: "High" },
    { name: "Mustard", ideal: { temp: [10, 25], humidity: [40, 60], water: "low", soil: ["alluvial","loamy"] }, profit: "Medium" },
  ];

  // ⭐ Updated prediction logic with HARD BLOCK for LOW water
  const predictCrops = (temp, humidity, soilType, waterAvailability) => {
    let predictions = cropsData.map((crop) => {
      let score = 0;

      // Temp
      if (temp >= crop.ideal.temp[0] && temp <= crop.ideal.temp[1]) score += 0.35;

      // Humidity
      if (humidity >= crop.ideal.humidity[0] && humidity <= crop.ideal.humidity[1]) score += 0.20;

      // Soil matching
      if (crop.ideal.soil.includes(soilType)) score += 0.35;
      else score -= 0.25;

      // Water match
      if (crop.ideal.water === waterAvailability) score += 0.10;
      else score -= 0.20;

      return { ...crop, score };
    });

    predictions.sort((a, b) => b.score - a.score);

    // ❌ HARD BLOCK: Never show these when water = LOW
    if (waterAvailability === "low") {
      predictions = predictions.filter(
        (c) =>
          c.name !== "Paddy" &&
          c.name !== "Sugarcane" &&
          c.name !== "Tea" &&
          c.name !== "Coffee"
      );
    }

    return predictions.filter((c) => c.score > 0.2).slice(0, 4);
  };

  // Fetch history
  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/weather-history');
      if (response.ok) {
        const data = await response.json();
        setHistoricalData(data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Main function
  const suggestCrop = async () => {
    setResult("");
    setWeather("");
    setLoading(true);

    if (!city || soil === "--Select--" || water === "--Select--") {
      setResult("⚠️ Please fill all fields.");
      setLoading(false);
      return;
    }

    try {
      const apiKey = "3bbcde3f70419ba7dd9a1eb9006faacb";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      const weatherData = await response.json();

      if (weatherData.cod !== 200) {
        setResult("❌ Could not fetch weather. Check city name.");
        setLoading(false);
        return;
      }

      const temp = weatherData.main.temp;
      const humidity = weatherData.main.humidity;

      setWeather(`🌤️ Current in ${city}: ${temp}°C, Humidity: ${humidity}%`);

      const suggestedCrops = predictCrops(temp, humidity, soil, water);

      if (suggestedCrops.length === 0) {
        setResult("😔 No strong matches found.");
        setLoading(false);
        return;
      }

      let output = "Crop Suggestions:\n\n";

      suggestedCrops.forEach((crop) => {
        output += `🌱 ${crop.name}\n`;
        output += `   📊 Confidence: ${(crop.score * 100).toFixed(1)}%\n`;
        output += `   💧 Water Needs: ${crop.ideal.water}\n`;
        output += `   💰 Profit Potential: ${crop.profit}\n\n`;
      });

      setResult(output);

      // Save to backend
      const newItem = {
        city,
        soil_type: soil,
        water_availability: water,
        temperature: temp,
        humidity: humidity,
        suggested_crops: suggestedCrops.map((c) => c.name)
      };
      
      try {
        await fetch('/api/weather-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
        fetchHistory();
      } catch (err) {
        console.error("Failed to save history", err);
      }
    } catch (error) {
      setResult("⚠️ Error fetching data.");
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>🌱 Crop Suggestion System</h1>
        <p className="subtitle">Professional crop prediction </p>

        <div className="form-container">
          <div className="form-group">
            <label>Enter City:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter any city name"
            />
          </div>

          <div className="form-group">
            <label>Select Soil Type:</label>
            <select value={soil} onChange={(e) => setSoil(e.target.value)}>
              <option>--Select--</option>
              <option value="alluvial">Alluvial</option>
              <option value="black">Black</option>
              <option value="red">Red</option>
              <option value="laterite">Laterite</option>
              <option value="saline">Saline</option>
              <option value="loamy">Loamy</option>
            </select>
          </div>

          <div className="form-group">
            <label>Select Water Availability:</label>
            <select value={water} onChange={(e) => setWater(e.target.value)}>
              <option>--Select--</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <button onClick={suggestCrop} disabled={loading}>
            {loading ? "🧠 Analyzing..." : "Suggest Crops 🌾"}
          </button>
        </div>

        {weather && <div className="weather-info">{weather}</div>}

        {result && (
          <div className="result-container">
            <h3>Crop Recommendations</h3>
            <div className="result-content">
              {result.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {historicalData.length > 0 && (
          <div className="history-container">
            <h3>📝 Recent Recommendations</h3>
            <div className="history-list">
              {historicalData.map((item, index) => (
                <div key={index} className="history-item">
                  <p>
                    <strong>{item.city}</strong> ({new Date(item.created_at).toLocaleString()})
                  </p>
                  <p>
                    Soil: {item.soil_type}, Water: {item.water_availability}, Temp:{" "}
                    {item.temperature}°C
                  </p>
                  <p>Crops: {item.suggested_crops.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Crops;
