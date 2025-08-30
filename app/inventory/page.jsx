"use client";
import { useEffect, useState } from "react";
import { uid } from "../../lib/utils";

export default function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem("cf_inventory") || "[]"));
  }, []);

  function clear() {
    if (confirm("Очистить инвентарь?")) {
      localStorage.setItem("cf_inventory", "[]");
      setItems([]);
    }
  }

  return (
    <main className="container">
      <div className="title">Инвентарь</div>
      <div className="flex"><button className="btn secondary" onClick={clear}>Очистить</button></div>
      <div className="space" />
      {items.length === 0 ? <div className="small">Пусто. Открой кейс или сделай апгрейд.</div> : null}
      <div className="grid">
        {items.map((it) => (
          <div className="card" key={it.id || uid()}>
            <h3>{it.title}</h3>
            <div className="small">Ценность: {it.value} Shards</div>
            <div className="badge">{it.rarity}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
