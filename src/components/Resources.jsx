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
      setMessage("❌ Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      setTimeout(() => {
        setMessage("✅ Account created! Please confirm your email before logging in.");
        setTimeout(() => navigate("/login"), 3000);
      }, 500);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>🌱 Create Farm Account</h1>
        <p>Join the FarmConnect community</p>
        {message && <div className="status">{message}</div>}
        <form onSubmit={handleSubmit} className="register-form">
          <input type="text" name="full_name" placeholder="Full Name" required onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} />
          <input type="tel" name="phone" placeholder="Phone (optional)" onChange={handleChange} />
          <input type="text" name="farm_location" placeholder="Farm Location (optional)" onChange={handleChange} />
          <select name="user_type" value={formData.user_type} onChange={handleChange}>
            <option value="farmer">Farmer</option>
            <option value="agronomist">Agronomist</option>
            <option value="distributor">Distributor</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? "⏳ Creating..." : "📝 Register"}
          </button>
        </form>
        <p>Already registered? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Register;
