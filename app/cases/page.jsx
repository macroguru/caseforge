import { cases } from "../../lib/cases";

export default function Cases() {
  return (
    <main className="container">
      <div className="title">Кейсы</div>
      <div className="grid">
        {cases.map((c) => (
          <div key={c.slug} className="card">
            <h3>{c.title}</h3>
            <div className="small">Цена: {c.price} Shards</div>
            <div className="small">Предметов: {c.items.length}</div>
            <a className="btn" href={`/cases/${c.slug}`}>Открыть</a>
          </div>
        ))}
      </div>
    </main>
  );
}
