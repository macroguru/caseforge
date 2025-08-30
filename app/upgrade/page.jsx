"use client";
import { useEffect, useMemo, useState } from "react";

export default function Upgrade() {
  const [inv, setInv] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mult, setMult] = useState(2);

  useEffect(() => { setInv(JSON.parse(localStorage.getItem("cf_inventory") || "[]")); }, []);

  const selected = useMemo(() => inv.find((i) => i.id === selectedId), [inv, selectedId]);
  const targetValue = selected ? Math.max(1, Math.round(selected.value * mult)) : 0;
  const edge = 0.98;
  const probability = selected ? Math.max(0.01, Math.min(0.99, (selected.value / targetValue) * edge)) : 0;

  async function doUpgrade() {
    if (!selected) return alert("Выбери предмет");
    const res = await fetch("/api/upgrade", { method: "POST", body: JSON.stringify({ fromItem: selected, targetValue }) });
    const data = await res.json();
    if (data.error) return alert(data.error);

    // удалить исходный, добавить результат если успех
    const next = inv.filter((i) => i.id !== selected.id);
    if (data.success) next.push({ id: crypto.randomUUID(), title: `Upgrade ${targetValue}`, value: targetValue, rarity: "upgraded", source: "upgrade" });
    setInv(next);
    localStorage.setItem("cf_inventory", JSON.stringify(next));

    const hist = JSON.parse(localStorage.getItem("cf_history") || "[]");
    hist.unshift({ type: "upgrade", at: Date.now(), fairness: data.fairness, hmac: data.hmac, success: data.success, prob: data.probability, from: selected.value, to: targetValue });
    localStorage.setItem("cf_history", JSON.stringify(hist.slice(0, 100)));
  }

  return (
    <main className="container">
      <div className="title">Апгрейд</div>
      <div className="grid">
        {inv.map((it) => (
          <div className="card" key={it.id} onClick={() => setSelectedId(it.id)} style={{ borderColor: selectedId === it.id ? "var(--accent)" : "#1a1f33", cursor: "pointer" }}>
            <h3>{it.title}</h3>
            <div className="small">Ценность: {it.value} Shards</div>
            <div className="badge">{it.rarity}</div>
          </div>
        ))}
      </div>
      <div className="space" />
      {selected ? (
        <div className="card">
          <h3>Цель</h3>
          <div className="flex">
            <label className="field">
              <span>Множитель</span>
              <select value={mult} onChange={(e) => setMult(parseFloat(e.target.value))}>
                <option value={1.5}>x1.5</option>
                <option value={2}>x2</option>
                <option value={3}>x3</option>
                <option value={5}>x5</option>
              </select>
            </label>
            <div className="field">
              <span>Итоговая ценность</span>
              <input className="input" value={targetValue} readOnly />
            </div>
            <div className="field">
              <span>Шанс</span>
              <div className="badge">{(probability * 100).toFixed(2)}%</div>
            </div>
          </div>
          <div className="space" />
          <button className="btn" onClick={doUpgrade}>Апгрейд</button>
        </div>
      ) : <div className="small">Выбери предмет из инвентаря</div>}
    </main>
  );
}
