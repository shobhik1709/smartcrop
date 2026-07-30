import { useState, useEffect } from "react";
import "./WaterManagement.css";
// Supabase removed

function WaterManagement({ addReminder, user }) {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [cropDatabase, setCropDatabase] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("");

  const [newReminder, setNewReminder] = useState({
    type: "water",
    crop: "",
    season: "",
    growthStage: "Seedling",
    date: "",
    time: "08:00",
    frequency: "",
    amount: "",
    notes: "",
    weatherConsiderations: "",
  });

  // 🔑 Replace with your OpenWeatherMap API key
  const API_KEY = "3bbcde3f70419ba7dd9a1eb9006faacb";

  const cropWaterRequirements = {
    Rice: {
      frequency: "Daily",
      amount: "5-6 cm standing water",
      season: "Kharif (Monsoon)",
      stages: {
        Seedling: { water: "Keep soil moist", frequency: "Daily" },
        Vegetative: { water: "2-3 cm standing water", frequency: "Every 2 days" },
        Reproductive: { water: "5-10 cm standing water", frequency: "Daily" },
        Ripening: { water: "Gradually reduce water", frequency: "Every 3-4 days" },
      },
    },
    Wheat: {
      frequency: "Every 7-10 days",
      amount: "5-7 mm",
      season: "Rabi (Winter)",
      stages: {
        Germination: { water: "Light watering", frequency: "When soil is dry" },
        Tillering: { water: "Moderate watering", frequency: "Every 7-10 days" },
        "Stem Extension": { water: "Adequate watering", frequency: "Every 10 days" },
        Heading: { water: "Consistent moisture", frequency: "Every 7 days" },
        Ripening: { water: "Reduce watering", frequency: "Every 14 days" },
      },
    },
    Maize: {
      frequency: "Every 5-7 days",
      amount: "20-30 mm",
      season: "All seasons",
      stages: {
        Emergence: { water: "Light moisture", frequency: "When soil is dry" },
        Vegetative: { water: "25-30 mm", frequency: "Every 5-7 days" },
        Tasseling: { water: "30-35 mm", frequency: "Every 5 days" },
        "Grain Fill": { water: "25-30 mm", frequency: "Every 7 days" },
      },
    },
    Cotton: {
      frequency: "Every 10-12 days",
      amount: "30-35 mm",
      season: "Kharif (Monsoon)",
      stages: {
        Seedling: { water: "Light watering", frequency: "Every 10-12 days" },
        "Square Formation": { water: "30-35 mm", frequency: "Every 10 days" },
        Flowering: { water: "35-40 mm", frequency: "Every 7 days" },
        "Boll Development": { water: "30-35 mm", frequency: "Every 10 days" },
      },
    },
    Tomato: {
      frequency: "Every 3-4 days",
      amount: "20-25 mm",
      season: "All seasons",
      stages: {
        Seedling: { water: "Keep soil moist", frequency: "Every 3-4 days" },
        Vegetative: { water: "20-25 mm", frequency: "Every 4 days" },
        Flowering: { water: "25-30 mm", frequency: "Every 3 days" },
        "Fruit Development": {
          water: "Consistent moisture",
          frequency: "Every 3-4 days",
        },
      },
    },
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) return "Summer";
    if (month >= 6 && month <= 9) return "Monsoon";
    if (month >= 10 || month <= 1) return "Winter";
    return "Unknown";
  };

  const fetchWeatherData = async (locationName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error("Location not found");
      const data = await response.json();

      const processedWeather = {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        precipitation: data.rain ? data.rain["1h"] : 0,
        forecast: data.weather[0].description,
      };

      setWeatherData(processedWeather);
      setNewReminder((prev) => ({
        ...prev,
        weatherConsiderations: `Temp: ${processedWeather.temperature}°C, Humidity: ${processedWeather.humidity}%, Rain (1h): ${processedWeather.precipitation}mm`,
      }));
    } catch (error) {
      alert("⚠️ Unable to fetch weather. Please check location or API key.");
      setWeatherData(null);
    }
  };

  useEffect(() => {
    setNewReminder((prev) => ({ ...prev, season: getCurrentSeason() }));
    const fetchCrops = async () => {
      try {
        const response = await fetch('/api/crops');
        if (response.ok) {
          const data = await response.json();
          const customCrops = data.map(c => c.name);
          const defaultCrops = Object.keys(cropWaterRequirements);
          setCropDatabase([...new Set([...defaultCrops, ...customCrops])]);
        } else {
          setCropDatabase(Object.keys(cropWaterRequirements));
        }
      } catch (err) {
        setCropDatabase(Object.keys(cropWaterRequirements));
      }
    };
    fetchCrops();
  }, []);

  const handleCropChange = (crop) => {
    setSelectedCrop(crop);
    setNewReminder({
      ...newReminder,
      crop,
      frequency: cropWaterRequirements[crop]?.frequency || "",
      amount: cropWaterRequirements[crop]?.amount || "",
    });
  };

  const addNewCrop = async (cropName) => {
    if (cropName && !cropDatabase.includes(cropName)) {
      try {
        const response = await fetch('/api/crops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cropName })
        });
        if (response.ok) {
          setCropDatabase([...cropDatabase, cropName]);
        }
      } catch (error) {
        console.error("Failed to save crop", error);
      }
    }
  };

 const handleAddReminder = async (e) => {
  e.preventDefault();
  if (!newReminder.crop) {
    alert("Please select or enter a crop!");
    return;
  }

  const reminder = {
    user_id: user?.id || "guest",
    type: "water",
    crop: newReminder.crop,
    season: newReminder.season,
    growthstage: newReminder.growthStage,
    date: newReminder.date,
    time: newReminder.time,
    frequency: newReminder.frequency,
    amount: newReminder.amount,
    notes: newReminder.notes,
    weatherconsiderations: newReminder.weatherConsiderations,
    created_at: new Date().toISOString(),
  };

  try {
    const response = await fetch('/api/reminders/water', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reminder)
    });
    
    if (response.ok) {
      alert("Reminder Scheduled Successfully ✅");
      setNewReminder({
        type: "water",
        crop: "",
        season: newReminder.season,
        growthStage: "Seedling",
        date: "",
        time: "08:00",
        frequency: "",
        amount: "",
        notes: "",
        weatherConsiderations: "",
      });
      setSelectedCrop("");
      setWeatherData(null);
    } else {
      alert("❌ Failed to add reminder.");
    }
  } catch (err) {
    console.error("Insert Error:", err.message || err);
    alert("❌ Failed to add reminder. Check console for details.");
  }
};


  return (
    <div className="water-management-section futuristic-ui">
      <h2>💧 Intelligent Water Management System</h2>

      {/* Location and Weather Section */}
      <div className="weather-section glassmorphism">
        <h3>Weather Integration</h3>
        <div className="location-input">
          <input
            type="text"
            placeholder="Enter your location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button onClick={() => fetchWeatherData(location)} className="weather-btn">
            Get Weather Data
          </button>
        </div>

        {weatherData && (
          <div className="weather-display">
            <h4>Current Conditions</h4>
            <div className="weather-grid">
              <div className="weather-item">
                <span className="label">Temperature:</span>
                <span className="value">{weatherData.temperature}°C</span>
              </div>
              <div className="weather-item">
                <span className="label">Humidity:</span>
                <span className="value">{weatherData.humidity}%</span>
              </div>
              <div className="weather-item">
                <span className="label">Rain (1h):</span>
                <span className="value">{weatherData.precipitation} mm</span>
              </div>
              <div className="weather-item">
                <span className="label">Forecast:</span>
                <span className="value">{weatherData.forecast}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Crop Selection */}
      <div className="crop-selection glassmorphism">
        <h3>Crop Management</h3>
        <div className="season-selector">
          <label>Current Season:</label>
          <select
            value={newReminder.season}
            onChange={(e) => setNewReminder({ ...newReminder, season: e.target.value })}
          >
            <option value="Summer">Summer</option>
            <option value="Monsoon">Monsoon</option>
            <option value="Winter">Winter</option>
            <option value="Autumn">Autumn</option>
            <option value="Spring">Spring</option>
          </select>
        </div>

        <div className="crop-buttons-grid">
          {cropDatabase.map((crop) => (
            <button
              key={crop}
              className={selectedCrop === crop ? "active crop-chip" : "crop-chip"}
              onClick={() => handleCropChange(crop)}
            >
              {crop}
            </button>
          ))}
        </div>

        <div className="manual-entry">
          <input
            type="text"
            placeholder="Or enter a new crop..."
            value={newReminder.crop}
            onChange={(e) => {
              setNewReminder({ ...newReminder, crop: e.target.value });
              setSelectedCrop("");
            }}
          />
          <button onClick={() => addNewCrop(newReminder.crop)} className="add-crop-btn">
            Add to Database
          </button>
        </div>
      </div>

      {/* Water Recommendations */}
      {(selectedCrop || newReminder.crop) && (
        <div className="water-recommendations glassmorphism">
          <h3>Watering Guide for {selectedCrop || newReminder.crop}</h3>

          <div className="growth-stage-selector">
            <label>Growth Stage:</label>
            <select
              value={newReminder.growthStage}
              onChange={(e) => setNewReminder({ ...newReminder, growthStage: e.target.value })}
            >
              {cropWaterRequirements[selectedCrop]?.stages
                ? Object.keys(cropWaterRequirements[selectedCrop].stages).map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))
                : ["Seedling", "Vegetative", "Flowering", "Fruiting", "Ripening"].map(
                    (stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    )
                  )}
            </select>
          </div>

          <div className="recommendation-card">
            {cropWaterRequirements[selectedCrop]?.stages?.[newReminder.growthStage] ? (
              <>
                <p>
                  <strong>Frequency:</strong>{" "}
                  {cropWaterRequirements[selectedCrop].stages[newReminder.growthStage].frequency}
                </p>
                <p>
                  <strong>Amount:</strong>{" "}
                  {cropWaterRequirements[selectedCrop].stages[newReminder.growthStage].water}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Frequency:</strong>{" "}
                  {cropWaterRequirements[selectedCrop]?.frequency || "Varies by season"}
                </p>
                <p>
                  <strong>Amount:</strong>{" "}
                  {cropWaterRequirements[selectedCrop]?.amount || "Depends on soil moisture"}
                </p>
              </>
            )}
            <p>
              <strong>Best Season:</strong>{" "}
              {cropWaterRequirements[selectedCrop]?.season || "Check local guide"}
            </p>
            <p>
              <strong>Best Time:</strong> Early morning or late evening
            </p>
            {weatherData && (
              <p>
                <strong>Weather Advisory:</strong>{" "}
                {weatherData.precipitation > 5
                  ? "Rain expected, reduce watering"
                  : "No significant rain, proceed with schedule"}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Reminder Scheduler */}
      <div className="schedule-reminder glassmorphism">
        <h3>Schedule Watering Reminder</h3>
        <form onSubmit={handleAddReminder} className="reminder-form">
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={newReminder.date}
                onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Frequency</label>
              <input
                type="text"
                placeholder="e.g. Every 3 days"
                value={newReminder.frequency}
                onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="text"
                placeholder="e.g. 20 mm"
                value={newReminder.amount}
                onChange={(e) => setNewReminder({ ...newReminder, amount: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Weather Considerations</label>
            <textarea
              placeholder="Weather-based notes..."
              value={newReminder.weatherConsiderations}
              onChange={(e) =>
                setNewReminder({ ...newReminder, weatherConsiderations: e.target.value })
              }
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Additional Notes (optional)</label>
            <textarea
              placeholder="Special instructions, soil conditions, etc."
              value={newReminder.notes}
              onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
              rows="2"
            />
          </div>

          <button type="submit" className="submit-btn futuristic-btn">
            💧 Schedule Watering
          </button>
        </form>
      </div>
    </div>
  );
}

export default WaterManagement;
