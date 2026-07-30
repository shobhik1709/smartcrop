import { useState } from "react";
// Supabase removed
import "./DiseaseDiagnosis.css";

function DiseaseManagement() {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedDisease, setSelectedDisease] = useState("");
  const [managementData, setManagementData] = useState({
    crop: "",
    disease: "",
    symptoms: "",
    recommendedFertilizer: "",
    treatment: "",
    notes: "",
  });

  // Your crop disease database
  const cropDiseaseDatabase = {
    Rice: {
      diseases: {
        Blast: {
          symptoms: "Spindle-shaped spots on leaves and panicles",
          fertilizer: "Silicon-rich fertilizer",
          treatment: "Tricyclazole fungicide, resistant varieties",
        },
        "Bacterial Blight": {
          symptoms: "Water-soaked lesions turning yellow/gray",
          fertilizer: "Balanced NPK with micronutrients",
          treatment: "Copper-based bactericides",
        },
      },
    },
    Sugarcane: {
      diseases: {
        "Red Rot": {
          symptoms: "Reddish discoloration inside stem",
          fertilizer: "Nitrogen and potassium rich",
          treatment: "Remove infected stalks, fungicide",
        },
        Smut: {
          symptoms: "Black whip-like structures from buds",
          fertilizer: "Balanced NPK",
          treatment: "Use disease-free setts",
        },
      },
    },
    Cotton: {
      diseases: {
        Bollworm: {
          symptoms: "Holes in bolls, damaged cotton",
          fertilizer: "Nitrogen-rich fertilizer",
          treatment: "Biopesticides, insecticides",
        },
        "Leaf Curl": {
          symptoms: "Curling of leaves with yellow veins",
          fertilizer: "Potassium-enriched fertilizer",
          treatment: "Resistant varieties, insect control",
        },
      },
    },
    Groundnut: {
      diseases: {
        "Leaf Spot": {
          symptoms: "Brown circular spots on leaves",
          fertilizer: "Potassium and phosphorus rich",
          treatment: "Fungicide spray, crop rotation",
        },
      },
    },
    Maize: {
      diseases: {
        "Northern Leaf Blight": {
          symptoms: "Long gray-green lesions on leaves",
          fertilizer: "Zinc and nitrogen fertilizer",
          treatment: "Strobilurin fungicides",
        },
        "Common Rust": {
          symptoms: "Golden brown pustules on leaves",
          fertilizer: "Balanced NPK",
          treatment: "Triazole fungicides",
        },
      },
    },
    Tomato: {
      diseases: {
        "Early Blight": {
          symptoms: "Concentric rings on leaves and stem",
          fertilizer: "Calcium and potassium fertilizer",
          treatment: "Chlorothalonil/mancozeb",
        },
        "Late Blight": {
          symptoms: "Water-soaked lesions, white mold",
          fertilizer: "Phosphorus and copper fertilizer",
          treatment: "Metalaxyl, chlorothalonil",
        },
      },
    },
    Banana: {
      diseases: {
        "Panama Disease": {
          symptoms: "Yellowing and wilting of leaves",
          fertilizer: "Balanced NPK",
          treatment: "Resistant varieties, remove infected plants",
        },
      },
    },
    Mango: {
      diseases: {
        "Powdery Mildew": {
          symptoms: "White powder on leaves and flowers",
          fertilizer: "Potassium rich fertilizer",
          treatment: "Sulfur or fungicide spray",
        },
      },
    },
    Pomegranate: {
      diseases: {
        "Fruit Rot": {
          symptoms: "Brown rot on fruit surface",
          fertilizer: "Balanced NPK",
          treatment: "Remove infected fruit, fungicide spray",
        },
      },
    },
    Chillies: {
      diseases: {
        Anthracnose: {
          symptoms: "Dark sunken lesions on fruits",
          fertilizer: "Nitrogen and potassium fertilizer",
          treatment: "Copper-based fungicide",
        },
      },
    },
  };

  const getAvailableDiseases = () =>
    selectedCrop ? Object.keys(cropDiseaseDatabase[selectedCrop].diseases) : [];

  const handleCropChange = (e) => {
    const crop = e.target.value;
    setSelectedCrop(crop);
    setSelectedDisease("");
    setManagementData({
      crop,
      disease: "",
      symptoms: "",
      recommendedFertilizer: "",
      treatment: "",
      notes: "",
    });
  };

  const handleDiseaseChange = (e) => {
    const disease = e.target.value;
    setSelectedDisease(disease);
    if (disease && selectedCrop) {
      const info = cropDiseaseDatabase[selectedCrop].diseases[disease];
      setManagementData({
        crop: selectedCrop,
        disease,
        symptoms: info.symptoms,
        recommendedFertilizer: info.fertilizer,
        treatment: info.treatment,
        notes: "",
      });
    }
  };

  const handleAddRecommendation = async (e) => {
    e.preventDefault();
    if (!managementData.crop || !managementData.disease) {
      alert("Please select both crop and disease!");
      return;
    }

    try {
      const payload = {
        ...managementData,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toTimeString().slice(0, 5)
      };

      const response = await fetch('/api/reminders/disease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        alert("✅ Recommendation and Reminder Saved Successfully");

        setManagementData({
          crop: "",
          disease: "",
          symptoms: "",
          recommendedFertilizer: "",
          treatment: "",
          notes: "",
        });
        setSelectedCrop("");
        setSelectedDisease("");
      } else {
        alert("❌ Failed to save recommendation.");
      }
    } catch (err) {
      alert("Error saving data: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="disease-management-section futuristic-ui">
      <h2>🌿 Crop Health Management - Tamil Nadu Top Crops</h2>

      <div className="crop-selection glassmorphism">
        <label>Select Crop</label>
        <select value={selectedCrop} onChange={handleCropChange}>
          <option value="">--Select Crop--</option>
          {Object.keys(cropDiseaseDatabase).map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>
      </div>

      {selectedCrop && (
        <div className="disease-selection glassmorphism">
          <label>Select Disease</label>
          <select value={selectedDisease} onChange={handleDiseaseChange}>
            <option value="">--Select Disease--</option>
            {getAvailableDiseases().map((disease) => (
              <option key={disease} value={disease}>
                {disease}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedDisease && (
        <div className="disease-details glassmorphism">
          <h4>Disease Details</h4>
          <p>
            <strong>Symptoms:</strong> {managementData.symptoms}
          </p>
          <p>
            <strong>Recommended Fertilizer:</strong>{" "}
            {managementData.recommendedFertilizer}
          </p>
          <p>
            <strong>Treatment:</strong> {managementData.treatment}
          </p>
        </div>
      )}

      {selectedDisease && (
        <form
          onSubmit={handleAddRecommendation}
          className="management-form glassmorphism"
        >
          <label>Reminder Notes</label>
          <textarea
            rows="2"
            value={managementData.notes}
            onChange={(e) =>
              setManagementData({ ...managementData, notes: e.target.value })
            }
            placeholder="Enter any additional notes"
          />
          <button type="submit" className="futuristic-btn">
            💾 Save & Add Reminder
          </button>
        </form>
      )}
    </div>
  );
}

export default DiseaseManagement;
