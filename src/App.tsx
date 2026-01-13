import React from "react";
import { useState } from "react";
import "./styles.css";

interface Strategy {
  strategy: string;
  entry: number;
  stop_loss: number;
  take_profit: number;
  shares: number;
  total_risk: number;
  notes: string;
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
      const res = await fetch(url, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      if (!data.strategies) {
        throw new Error("No strategies returned");
      }

      setStrategies(data.strategies);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>8‑EMA Breakout Strategy</h1>

      <div className="form">
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

      {error && <div className="error">{error}</div>}

      <div className="results">
        {strategies.map((s, i) => (
          <div key={i} className="card">
            <h2>{s.strategy.toUpperCase()}</h2>
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
            <p className="notes">{s.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
