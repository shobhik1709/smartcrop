// Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Supabase removed
import "./Login.css";

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setMessage("❌ " + (data.error || "Login failed"));
        setLoading(false);
        return;
      }
      
      localStorage.setItem("authToken", "demo-token"); // Could be JWT
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsAuthenticated(true);
      navigate("/home");
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
            <h1>Welcome Back</h1>
            <p>Sign in to your farm dashboard</p>
          </div>

          {message && (
            <div className={`message ${message.includes("❌") ? "error" : "success"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email" 
                placeholder="Enter your email" 
                value={credentials.email} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password"
                name="password" 
                placeholder="Enter your password" 
                value={credentials.password} 
                onChange={handleChange} 
                required 
              />
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Signing In...
                </>
              ) : (
                "Sign In 🔑"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              New to FarmConnect? <Link to="/register" className="auth-link">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;