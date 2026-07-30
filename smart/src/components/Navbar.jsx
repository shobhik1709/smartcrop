import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// Supabase removed
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      // Use window.location instead of navigate so state resets
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/crops", label: "Crop Suggestions", icon: "🌱" },
    { path: "/farm", label: "Farm", icon: "📊" },
    { path: "/community", label: "Community", icon: "👥" },
    // Removed Contact link
    { path: "/about", label: "About", icon: "ℹ️" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🌾</span>
          <span className="logo-text">SmartCrop</span>
        </Link>
        
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
          
          {user && (
            <li className="profile-section">
              <button 
                className="profile-button" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <span className="profile-icon">👤</span>
                <span className="profile-name">{user.full_name || 'Profile'}</span>
              </button>
              
              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="profile-info">
                    <strong>{user.full_name}</strong>
                    <span className="user-type">{user.user_type}</span>
                    {user.farm_location && (
                      <span className="farm-location">📍 {user.farm_location}</span>
                    )}
                  </div>
                  <button className="logout-button" onClick={handleLogout}>
                    <span className="logout-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
