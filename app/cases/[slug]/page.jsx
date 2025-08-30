"use client";
import { useEffect, useMemo, useState } from "react";
import { cases } from "../../../lib/cases";

export default function CasePage({ params }) {
  const kase = useMemo(() => cases.find((c) => c.slug === params.slug), [params.slug]);
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState(null);

  if (!kase) return <main className="container">Кейс не найден</main>;

  async function openCase() {
    setLoading(true);
    const res = await fetch("/api/open-case", { method: "POST", body: JSON.stringify({ slug: kase.slug }) });
    const data = await res.json();
    setLoading(false);
    if (data.error) return alert(data.error);
    setLast(data);
    // сохранить в "инвентарь"
    const inv = JSON.parse(localStorage.getItem("cf_inventory") || "[]");
    inv.push({ id: crypto.randomUUID(), title: data.drop.title, value: data.drop.value, rarity: data.drop.rarity, source: "case" });
    localStorage.setItem("cf_inventory", JSON.stringify(inv));
    // история fairness
    const hist = JSON.parse(localStorage.getItem("cf_history") || "[]");
    hist.unshift({ type: "case", at: Date.now(), fairness: data.fairness, hmac: data.hmac, drop: data.drop });
    localStorage.setItem("cf_history", JSON.stringify(hist.slice(0, 100)));
  }

  return (
    <main className="container">
      <div className="title">{kase.title}</div>
      <div className="grid">
        {kase.items.map((it) => (
          <div className="card" key={it.id}>
            <h3>{it.title}</h3>
            <div className="small">Шанс: {(it.probability * 100).toFixed(2)}%</div>
            <div className="small">Ценность: {it.value} Shards</div>
            <div className="badge">{it.rarity}</div>
          </div>
        ))}
      </div>
      <div className="space" />
      <button className="btn" onClick={openCase} disabled={loading}>{loading ? "Крутим..." : `Открыть за ${kase.price} Shards`}</button>
      {last && (
        <>
          <div className="space" />
          <div className="card">
            <h3>Выпало: {last.drop.title} ({last.drop.value} Shards)</h3>
            <div className="small">serverSeedHash: <span className="mono">{last.fairness.serverSeedHash.slice(0, 16)}…</span></div>
            <div className="small">nonce: <span className="mono">{last.fairness.nonce}</span></div>
            <div className="small">hmac: <span className="mono">{last.hmac.slice(0, 16)}…</span></div>
          </div>
        </>
      )}
    </main>
  );
}
