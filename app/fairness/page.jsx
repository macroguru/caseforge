"use client";
import { useEffect, useState } from "react";

export default function FairnessPage() {
  const [state, setState] = useState(null);
  const [revealed, setRevealed] = useState(null);
  const [history, setHistory] = useState([]);

  async function load() {
    const res = await fetch("/api/fairness/state");
    const data = await res.json();
    setState(data);
    setHistory(JSON.parse(localStorage.getItem("cf_history") || "[]"));
  }
  useEffect(() => { load(); }, []);

  async function reveal() {
    const res = await fetch("/api/fairness/reveal");
    const data = await res.json();
    setRevealed(data);
    await load();
  }

  return (
    <main className="container">
      <div className="title">Provably Fair</div>
      {state && (
        <div className="card">
          <div className="small">Текущий serverSeedHash: <span className="mono">{state.serverSeedHash}</span></div>
          <div className="small">Текущий nonce: <span className="mono">{state.nonce}</span></div>
          <div className="space" />
          <button className="btn secondary" onClick={reveal}>Ротация + раскрыть предыдущий seed</button>
        </div>
      )}
      {revealed && (
        <>
          <div className="space" />
          <div className="card">
            <h3>Раскрыт предыдущий serverSeed</h3>
            <div className="small">serverSeed: <span className="mono">{revealed.serverSeed}</span></div>
            <div className="small">hash: <span className="mono">{revealed.serverSeedHash}</span></div>
            <div className="small">prevNonceMax: <span className="mono">{revealed.prevMaxNonce}</span></div>
          </div>
        </>
      )}
      <div className="space" />
      <div className="card">
        <h3>История операций (локально)</h3>
        <div className="small">Сохраняется в браузере (cf_history). Для каждой записи можно сверить HMAC.</div>
        <div className="space" />
        {history.length === 0 ? <div className="small">Пока пусто.</div> : (
          <div className="grid">
            {history.map((h, i) => (
              <div className="card" key={i}>
                <div className="badge">{h.type}</div>
                <div className="small">hmac: <span className="mono">{h.hmac.slice(0,16)}…</span></div>
                <div className="small">serverSeedHash: <span className="mono">{h.fairness.serverSeedHash.slice(0,16)}…</span></div>
                <div className="small">nonce: <span className="mono">{h.fairness.nonce}</span></div>
                {h.drop && <div className="small">drop: {h.drop.title} ({h.drop.value})</div>}
                {h.success !== undefined && <div className="small">success: {h.success ? "✅" : "❌"} ({(h.prob*100).toFixed(2)}%)</div>}
                {h.result && <div className="small">result: {h.result}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
