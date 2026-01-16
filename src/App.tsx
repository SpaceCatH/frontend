import React, { useState } from "react";
import "./styles.css";

interface Strategy {
  strategy: string;
  entry: number;
  stop_loss: number;
  take_profit: number;
  shares: number;
  total_risk: number;
  total_profit: number;
  notes: string;
  score: number;
  is_recommended: boolean;
}

interface ScanCandidate {
  ticker: string;
  best_strategy: string;
  best_score: number;
  has_simple: boolean;
  has_swing: boolean;
  has_retest: boolean;
}

export default function App() {
  const [ticker, setTicker] = useState<string>("");
  const [dollars, setDollars] = useState<string>("10000");
  const [type, setType] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);

  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [scanResults, setScanResults] = useState<ScanCandidate[]>([]);
  const [error, setError] = useState<string>("");

  const API_BASE = "https://backend-957970620388.us-central1.run.app";

  // -----------------------------
  // Fetch single‑ticker strategy
  // -----------------------------
  async function fetchStrategy(t?: string) {
    const symbol = t || ticker;
    if (!symbol) return;

    setLoading(true);
    setError("");
    setStrategies([]);

    try {
      const url = `${API_BASE}/strategy?ticker=${symbol}&dollars=${dollars}&type=${type}`;
      const res = await fetch(url);

      if (!res.ok) {
        let errorMessage = "Unexpected server error. Please try again.";

        try {
          const errData = await res.json();
          if (res.status === 404 && errData?.detail) {
            errorMessage = errData.detail;
          }
        } catch {}

        throw new Error(errorMessage);
      }

      const data = await res.json();
      setStrategies(data.strategies);
      setTicker(symbol);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // Fetch S&P 100 scan
  // -----------------------------
  async function fetchScan() {
    setLoading(true);
    setError("");
    setScanResults([]);

    try {
      const url = `${API_BASE}/scan?dollars=${dollars}&type=${type}`;
      const res = await fetch(url);

      if (!res.ok) {
        let errorMessage = "Unexpected server error. Please try again.";

        try {
          const errData = await res.json();
          if (res.status === 404 && errData?.detail) {
            errorMessage = errData.detail;
          }
        } catch {}

        throw new Error(errorMessage);
      }

      const data = await res.json();
      setScanResults(data.candidates);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // Layout
  // -----------------------------
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* LEFT PANEL — SCREENER */}
      <div
        style={{
          borderRight: "1px solid #e5e7eb",
          padding: "1rem",
          overflowY: "auto",
          background: "#fafafa",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>S&P 100 Screener</h2>

        <button
          onClick={fetchScan}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#2563eb",
            color: "white",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontWeight: 600,
          }}
        >
          {loading ? "Scanning..." : "Scan Top Opportunities"}
        </button>

        {scanResults.length === 0 && (
          <p style={{ color: "#6b7280" }}>Run a scan to see opportunities.</p>
        )}

        {scanResults.map((c, i) => (
          <div
            key={i}
            onClick={() => fetchStrategy(c.ticker)}
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              marginBottom: "0.75rem",
              cursor: "pointer",
              transition: "0.15s",
            }}
          >
            <h3 style={{ marginBottom: "0.25rem" }}>{c.ticker}</h3>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              <strong>Best:</strong> {c.best_strategy.toUpperCase()}
            </p>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              <strong>Score:</strong> {c.best_score}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL — STRATEGY DETAILS */}
      <div
        style={{
          padding: "2rem",
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <h1 style={{ marginBottom: "1rem" }}>8‑EMA Breakout Strategy</h1>

          {/* FORM */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <input
              type="text"
              placeholder="Ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
            />

            <input
              type="number"
              placeholder="Dollars"
              value={dollars}
              onChange={(e) => setDollars(e.target.value)}
            />

            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="simple">Simple</option>
              <option value="retest">Retest</option>
              <option value="swing">Swing</option>
              <option value="all">All</option>
            </select>

            <button
              onClick={() => fetchStrategy()}
              disabled={loading}
              style={{
                gridColumn: "span 3",
                padding: "0.75rem",
                background: "#111827",
                color: "white",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              {loading ? "Loading..." : "Get Strategy"}
            </button>
          </div>

          {error && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                background: "#fee2e2",
                color: "#b91c1c",
                borderRadius: "8px",
              }}
            >
              {error}
            </div>
          )}

          {/* STRATEGY RESULTS */}
          {strategies.map((s, i) => {
            const highlight = s.is_recommended;

            return (
              <div
                key={i}
                style={{
                  padding: "1.25rem",
                  borderRadius: "12px",
                  border: highlight ? "2px solid #2563eb" : "1px solid #e5e7eb",
                  background: highlight ? "#eff6ff" : "#ffffff",
                  marginBottom: "1.25rem",
                  position: "relative",
                }}
              >
                {highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "-10px",
                      background: "#2563eb",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    Recommended
                  </div>
                )}

                <h2 style={{ marginBottom: "0.75rem" }}>
                  {s.strategy.toUpperCase()}
                </h2>

                <p>
                  <strong>Entry:</strong> {s.entry}
                </p>
                <p>
                  <strong>Stop Loss:</strong> {s.stop_loss}
                </p>
                <p>
                  <strong>Take Profit:</strong> {s.take_profit}
                </p>
                <p>
                  <strong>Shares:</strong> {s.shares}
                </p>
                <p>
                  <strong>Total Risk:</strong> ${s.total_risk}
                </p>
                <p>
                  <strong>Total Profit:</strong> ${s.total_profit}
                </p>

                <p style={{ marginTop: "0.5rem" }}>
                  <strong>Score:</strong> {s.score.toFixed(2)}
                </p>

                <p style={{ marginTop: "0.75rem", color: "#4b5563" }}>
                  {s.notes}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
