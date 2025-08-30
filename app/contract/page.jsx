"use client";
import { useEffect, useState } from "react";

export default function Contract() {
  const [inv, setInv] = useState([]);
  const [selected, setSelected] = useState({});

  useEffect(() => { setInv(JSON.parse(localStorage.getItem("cf_inventory") || "[]")); }, []);

  const picked = inv.filter((i) => selected[i.id]);
  const total = picked.reduce((s, i) => s + i.value, 0);

  async function submitContract() {
    if (picked.length < 3) return alert("Нужно минимум 3 предмета");
    const res = await fetch("/api/contract", { method: "POST", body: JSON.stringify({ itemValues: picked.map(p => p.value) }) });
    const data = await res.json();
    if (data.error) return alert(data.error);
    // удалить выбранные, добавить результат
    const rest = inv.filter((i) => !selected[i.id]);
    rest.push({ id: crypto.randomUUID(), title: data.result.title, value: data.result.value, rarity: "contract", source: "contract" });
    setInv(rest);
    localStorage.setItem("cf_inventory", JSON.stringify(rest));

    const hist = JSON.parse(localStorage.getItem("cf_history") || "[]");
    hist.unshift({ type: "contract", at: Date.now(), fairness: data.fairness, hmac: data.hmac, total, result: data.result.value });
    localStorage.setItem("cf_history", JSON.stringify(hist.slice(0, 100)));
    setSelected({});
  }

  return (
    <main className="container">
      <div className="title">Контракт</div>
      <div className="small">Выбери 3+ предмета.</div>
      <div className="grid">
        {inv.map((it) => (
          <div key={it.id} className="card" style={{ borderColor: selected[it.id] ? "var(--accent)" : "#1a1f33", cursor: "pointer" }} onClick={() => setSelected(s => ({ ...s, [it.id]: !s[it.id] }))}>
            <h3>{it.title}</h3>
            <div className="small">Ценность: {it.value} Shards</div>
          </div>
        ))}
      </div>
      <div className="space" />
      <div className="card">
        <div className="flex"><div>Итого: <b>{total}</b> Shards</div><div className="badge">{picked.length} выбрано</div></div>
        <div className="space" />
        <button className="btn" onClick={submitContract} disabled={picked.length < 3}>Создать контракт</button>
      </div>
    </main>
  );
}
