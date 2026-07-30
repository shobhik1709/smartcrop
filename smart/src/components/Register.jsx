// Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Supabase removed
import "./Register.css";

function Register({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    farm_location: "",
    user_type: "farmer",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setMessage("❌ " + (data.error || "Registration failed"));
        setLoading(false);
        return;
      }
      
      setMessage("✅ Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🌱</div>
            <h1>Create Your Account</h1>
            <p>Join our farming community today</p>
          </div>

          {message && (
            <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <input 
                type="text" 
                id="full_name"
                name="full_name" 
                placeholder="Enter your full name" 
                value={formData.full_name} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email" 
                placeholder="Enter your email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password"
                  name="password" 
                  placeholder="Create password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirmPassword"
                  name="confirmPassword" 
                  placeholder="Confirm password" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone" 
                  placeholder="Your phone number" 
                  value={formData.phone} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label htmlFor="farm_location">Farm Location</label>
                <input 
                  type="text" 
                  id="farm_location"
                  name="farm_location" 
                  placeholder="Farm location" 
                  value={formData.farm_location} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="user_type">I am a</label>
              <select 
                id="user_type"
                name="user_type" 
                value={formData.user_type} 
                onChange={handleChange}
                className="role-select"
              >
                <option value="farmer">👨‍🌾 Farmer</option>
                <option value="agronomist">🔬 Agriculturist</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                "Get Started 🌟"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login" className="auth-link">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;