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
  score: number; // NEW
  is_recommended: boolean; // NEW
}

export default function App() {
  const [ticker, setTicker] = useState<string>("");
  const [dollars, setDollars] = useState<string>("");
  const [type, setType] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [error, setError] = useState<string>("");

  const API_BASE = "https://backend-950106760076.us-central1.run.app";

  async function fetchStrategy() {
    setLoading(true);
    setError("");
    setStrategies([]);

    try {
      const url = `${API_BASE}/strategy?ticker=${ticker}&dollars=${dollars}&type=${type}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      if (!data.strategies) throw new Error("No strategies returned");

      setStrategies(data.strategies);
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
          Generate clean, beginner‑friendly trading setups using three proven
          breakout methods.
        </p>
      </header>

      {/* STRATEGY OVERVIEW */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Strategy Overview
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Simple */}
          <div
            style={{
              padding: "1.25rem",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Simple Breakout
            </h3>
            <p style={{ lineHeight: 1.5, color: "#4b5563" }}>
              A fast, momentum‑based entry triggered when price closes above the
              8‑EMA after a pullback. Ideal for traders who want clean,
              straightforward signals.
            </p>
          </div>

          {/* Swing‑High */}
          <div
            style={{
              padding: "1.25rem",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Swing‑High Breakout
            </h3>
            <p style={{ lineHeight: 1.5, color: "#4b5563" }}>
              A more selective setup that waits for price to break above a
              recent swing high. Great for traders who want structural
              confirmation before entering.
            </p>
          </div>

          {/* Retest */}
          <div
            style={{
              padding: "1.25rem",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Retest Breakout
            </h3>
            <p style={{ lineHeight: 1.5, color: "#4b5563" }}>
              A slower, more conservative approach that waits for a breakout and
              retest before entering. Designed to avoid false breakouts and
              reward patience.
            </p>
          </div>

          {/* All */}
          <div
            style={{
              padding: "1.25rem",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              All Strategies
            </h3>
            <p style={{ lineHeight: 1.5, color: "#4b5563" }}>
              Runs all three strategies and shows every valid setup. Perfect for
              comparing signals and choosing the best fit for current market
              conditions.
            </p>
          </div>
        </div>
      </section>

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

      {/* RESULTS */}
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

              {/* Score */}
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
