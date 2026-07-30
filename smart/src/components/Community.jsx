import React, { useState, useEffect } from "react";
// Supabase removed
import Navbar from "./Navbar";
import "./Community.css";

function Community() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data);
      }
    } catch (err) {
      console.error("Error fetching chat:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // refresh every 3s
    return () => clearInterval(interval);
  }, []);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user?.id,
          sender_type: user?.user_type,
          message: message.trim()
        })
      });
      if (response.ok) {
        setMessage("");
        fetchMessages();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/chat/${id}?sender_id=${user?.id}`, { method: 'DELETE' });
      fetchMessages();
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="community-container">
        <h2>🌱 Farming Community Chat</h2>
        <div className="chat-box">
          {chatMessages.map((chat) => (
            <div
              key={chat.id}
              className={`chat-message ${
                chat.sender_id === user.id ? "my-message" : "other-message"
              }`}
            >
              <div className="chat-sender">
                {chat.profiles?.full_name || "Unknown"} ({chat.sender_type})
              </div>
              <div className="chat-text">{chat.message}</div>
              <div className="chat-footer">
                <span className="chat-time">
                  {new Date(chat.created_at).toLocaleTimeString()}
                </span>
                {chat.sender_id === user.id && (
                  <button
                    className="delete-button-red"
                    onClick={() => handleDelete(chat.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <form className="chat-input-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Community;
