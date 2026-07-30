import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
// Supabase removed
// Components
import Home from "./components/Home";
import Crops from "./components/Crops";
import Login from "./components/Login";
import Register from "./components/Register";
import Farm from "./components/Farm";
import Community from "./components/Community";
import About from "./components/About";
import WaterManagement from "./components/WaterManagement";
import DiseaseDiagnosis from "./components/DiseaseDiagnosis";
import Reminders from "./components/Reminders";

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState([]);

  // ✅ Initialize auth state
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsAuthenticated(!!token);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // ✅ Reminder functions
  const addReminder = (reminder) => {
    setReminders((prev) => [
      ...prev,
      { ...reminder, id: Date.now(), completed: false },
    ]);
  };

  const toggleReminderStatus = (id) => {
    setReminders((prev) =>
      prev.map((rem) =>
        rem.id === id ? { ...rem, completed: !rem.completed } : rem
      )
    );
  };

  const deleteReminder = (id) => {
    setReminders((prev) => prev.filter((rem) => rem.id !== id));
  };

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <Register setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/crops"
          element={isAuthenticated ? <Crops /> : <Navigate to="/login" />}
        />
        <Route
          path="/farm"
          element={isAuthenticated ? <Farm /> : <Navigate to="/login" />}
        />
        <Route
          path="/community"
          element={isAuthenticated ? <Community /> : <Navigate to="/login" />}
        />
        <Route
          path="/about"
          element={isAuthenticated ? <About /> : <Navigate to="/login" />}
        />

        {/* New feature routes */}
        <Route
          path="/water"
          element={
            isAuthenticated ? (
              <WaterManagement addReminder={addReminder} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/disease"
          element={
            isAuthenticated ? (
              <DiseaseDiagnosis addReminder={addReminder} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/reminders"
          element={
            isAuthenticated ? (
              <Reminders
                reminders={reminders}
                toggleReminderStatus={toggleReminderStatus}
                deleteReminder={deleteReminder}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
