// src/components/Reminders.jsx
import React, { useEffect, useState } from "react";
import "./Reminders.css";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reminders');
      if (response.ok) {
        const data = await response.json();
        setReminders(data);
      }
    } catch (error) {
      console.error("Error fetching reminders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleDelete = async (type, id) => {
    try {
      await fetch(`/api/reminders/${type || 'unknown'}/${id}`, { method: 'DELETE' });
      fetchReminders();
    } catch (error) {
      console.error("Error deleting reminder", error);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });
      if (response.ok) {
        fetchReminders();
      }
    } catch (error) {
      console.error("Error updating reminder", error);
    }
  };

  const sorted = reminders.slice().sort((a, b) => {
    const ad = a.datetime || `${a.date || ""} ${a.time || ""}`.trim();
    const bd = b.datetime || `${b.date || ""} ${b.time || ""}`.trim();
    const at = ad ? new Date(ad) : 0;
    const bt = bd ? new Date(bd) : 0;
    return at - bt;
  });

  return (
    <div className="reminders-root">
      <div className="reminders-header">
        <h2>⏰ Your Scheduled Reminders</h2>
        <div className="rem-actions">
          <button className="btn small" onClick={fetchReminders}>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading reminders...</p>
      ) : sorted.length === 0 ? (
        <div className="empty-state">
          <p>No reminders yet. Add reminders from Water Management or Disease Diagnosis pages.</p>
        </div>
      ) : (
        <ul className="reminder-list">
          {sorted.map((r) => {
            const dt = r.datetime ? new Date(r.datetime) : (r.date ? new Date(`${r.date}T${r.time || "00:00"}`) : null);
            return (
              <li key={r.id} className={`reminder-card ${r.completed ? "completed" : ""}`}>
                <div className="rem-left">
                  <div className="rem-title">
                    {r.crop} {r.type ? <span className="rem-type">({r.type})</span> : null}
                  </div>
                  <div className="rem-meta">
                    <span className="rem-datetime">{dt ? dt.toLocaleString() : `${r.date || ""} ${r.time || ""}`.trim()}</span>
                    {r.frequency && <span className="rem-dot">• {r.frequency}</span>}
                    {r.amount && <span className="rem-dot">• {r.amount}</span>}
                  </div>
                  {r.notes && <div className="rem-notes">{r.notes}</div>}
                </div>

                <div className="rem-right">
                  <button className="btn small" onClick={() => handleToggleComplete(r.id, r.completed)}>
                    {r.completed ? "Undo" : "Done"}
                  </button>
                  <button className="btn small danger" onClick={() => handleDelete(r.type, r.id)}>Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
