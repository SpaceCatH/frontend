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
  const [dollars, setDollars] = useState<string>("");
  const [type, setType] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [scanResults, setScanResults] = useState<ScanCandidate[]>([]); // NEW
  const [error, setError] = useState<string>("");

  const API_BASE = "https://backend-950106760076.us-central1.run.app";

  // -----------------------------
  // Fetch single‑ticker strategy
  // -----------------------------
  async function fetchStrategy() {
    setLoading(true);
    setError("");
    setStrategies([]);
    setScanResults([]); // NEW: clear scan results

    try {
      const url = `${API_BASE}/strategy?ticker=${ticker}&dollars=${dollars}&type=${type}`;
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
      if (!data.strategies) throw new Error("No strategies returned");

      setStrategies(data.strategies);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // NEW: Fetch S&P 100 scan
  // -----------------------------
  async function fetchScan() {
    setLoading(true);
    setError("");
    setStrategies([]);
    setScanResults([]);

    try {
      const url = `${API_BASE}/scan?dollars=${dollars || 10000}&type=${type}`;
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
      if (!data.candidates) throw new Error("No scan results returned");

      setScanResults(data.candidates);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="container"
      style={{ padding: "2rem 1rem", maxWidth: 900, margin: "0 auto" }}
    >
      {/* HERO */}
      <header style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          8‑EMA Breakout Strategy
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#4b5563",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          Generate clean, beginner‑friendly trading setups — or scan the entire
          S&P 100 for opportunities.
        </p>
      </header>

      {/* FORM */}
      <section
        style={{
          marginBottom: "2.5rem",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          background: "#fafafa",
        }}
      >
        <div className="form" style={{ display: "grid", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Ticker (AAPL)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
          />

          <input
            type="number"
            placeholder="Dollars to invest"
            value={dollars}
            onChange={(e) => setDollars(e.target.value)}
          />

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="simple">Simple Breakout</option>
            <option value="retest">Retest Breakout</option>
            <option value="swing">Swing‑High Breakout</option>
            <option value="all">All Strategies</option>
          </select>

          <button onClick={fetchStrategy} disabled={loading}>
            {loading ? "Calculating..." : "Get Strategy"}
          </button>

          {/* NEW: Scan button */}
          <button
            onClick={fetchScan}
            disabled={loading}
            style={{ background: "#2563eb", color: "white" }}
          >
            {loading ? "Scanning..." : "Scan S&P 100"}
          </button>
        </div>

        {error && (
          <div
            className="error"
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              borderRadius: "8px",
              background: "#fee2e2",
              color: "#b91c1c",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}
      </section>

      {/* NEW: SCAN RESULTS */}
      {scanResults.length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>S&P 100 Opportunities</h2>

          {scanResults.map((c, i) => (
            <div
              key={i}
              style={{
                padding: "1rem",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                marginBottom: "1rem",
                background: "#ffffff",
              }}
            >
              <h3 style={{ marginBottom: "0.5rem" }}>{c.ticker}</h3>
              <p>
                <strong>Best Strategy:</strong> {c.best_strategy.toUpperCase()}
              </p>
              <p>
                <strong>Score:</strong> {c.best_score}
              </p>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                {c.has_simple && "• Simple "}
                {c.has_swing && "• Swing "}
                {c.has_retest && "• Retest "}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* STRATEGY RESULTS */}
      <section className="results" style={{ marginBottom: "3rem" }}>
        {strategies.map((s, i) => {
          const highlight = s.is_recommended;

          return (
            <div
              key={i}
              className="card"
              style={{
                padding: "1.25rem",
                borderRadius: "12px",
                border: highlight ? "2px solid #2563eb" : "1px solid #e5e7eb",
                background: highlight ? "#eff6ff" : "#ffffff",
                boxShadow: highlight
                  ? "0 0 0 3px rgba(37, 99, 235, 0.15)"
                  : "0 2px 6px rgba(0,0,0,0.04)",
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

              <p style={{ marginTop: "0.5rem", color: "#374151" }}>
                <strong>Score:</strong> {s.score.toFixed(2)}
              </p>

              <p
                className="notes"
                style={{ marginTop: "0.75rem", color: "#4b5563" }}
              >
                {s.notes}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
