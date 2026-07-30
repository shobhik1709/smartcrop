import React, { useEffect, useState } from "react";
// Supabase removed

function Dashboard() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reminders from both tables
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

  // Delete reminder (works for both tables)
  const deleteReminder = async (reminder) => {
    try {
      await fetch(`/api/reminders/${reminder.type}/${reminder.id}`, { method: 'DELETE' });
      fetchReminders();
    } catch (error) {
      console.error("Error deleting reminder", error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        🌱 Reminders Dashboard
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading reminders...</p>
      ) : reminders.length === 0 ? (
        <p className="text-center text-gray-500">No reminders found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reminders.map((reminder) => (
            <div
              key={`${reminder.type}-${reminder.id}`}
              className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold text-green-700">
                {reminder.crop} {reminder.disease ? `- ${reminder.disease}` : ""}
              </h2>

              {reminder.season || reminder.growthstage ? (
                <p className="text-sm text-gray-500 mb-2">
                  Season: {reminder.season || "—"} | Stage: {reminder.growthstage || "—"}
                </p>
              ) : null}

              <div className="text-gray-700 mb-2">
                <p>
                  <strong>📅 Date:</strong> {reminder.date}
                </p>
                <p>
                  <strong>⏰ Time:</strong> {reminder.time || "—"}
                </p>

                {reminder.type !== "disease" && (
                  <>
                    <p>
                      <strong>🔄 Frequency:</strong> {reminder.frequency || "—"}
                    </p>
                    <p>
                      <strong>💧 Amount:</strong> {reminder.amount || "—"}
                    </p>
                  </>
                )}
              </div>

              {reminder.weatherconsiderations && (
                <p className="text-sm text-blue-600">🌤 {reminder.weatherconsiderations}</p>
              )}
              {reminder.notes && (
                <p className="text-sm text-gray-600 italic mt-1">📝 {reminder.notes}</p>
              )}

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => deleteReminder(reminder)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={fetchReminders}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  Refresh
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
