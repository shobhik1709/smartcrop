import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  
  const startNow = () => {
    navigate("/Crops");
  };

  return (
    <div className="home">
      {/* ✅ Navbar included only once */}
      <Navbar />

      {/* Hero Section */}
      <header className="hero">
        <h1 id="main-heading">Grow Smarter, Not Harder</h1>
        <p>Select the best crops based on real-time weather and water levels.</p>
        <button onClick={startNow}>Start Now</button>
      </header>

      {/* Features Section */}
      <section className="features">
        <div className="card">
          <h2>🌦 Weather Monitoring</h2>
          <p>Track weather conditions to make informed decisions.</p>
        </div>
        <div className="card">
          <h2>💧 Water Level Input</h2>
          <p>Use your own water level info (Low, Medium, High) to get accurate crop suggestions.</p>
        </div>
        <div className="card">
          <h2>🌱 Smart Crop Advice</h2>
          <p>Our system recommends crops that suit your environment.</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 Smart Crop Selection. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;