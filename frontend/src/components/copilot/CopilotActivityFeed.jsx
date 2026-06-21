import React, { useEffect, useState } from "react";
import API_BASE_ROOT from "../../config/api";
import { auth } from "../../firebase";

const API_BASE = `${API_BASE_ROOT}/api/v1`;

export default function CopilotActivityFeed() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      if (!auth.currentUser) return;
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(`${API_BASE}/memory/feed`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFeed(data.feed);
        }
      } catch (err) {
        console.error("Failed to fetch activity feed", err);
      }
    };
    fetchFeed();
  }, []);

  if (feed.length === 0) return null;

  return (
    <div style={{ marginTop: "24px" }}>
      <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
        Activity Feed
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "12px", marginLeft: "6px" }}>
        {feed.map((item) => (
          <div key={item.id} style={{ position: "relative" }}>
            <div style={{ position: "absolute", width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent-blue)", left: "-16px", top: "4px" }} />
            <div style={{ fontSize: "12px", color: "var(--tp)", fontWeight: "500" }}>{item.action_type}</div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>{item.description}</div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px" }}>
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
