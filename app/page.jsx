export default function Home() {
  return (
    <main className="container">
      <div className="title">CaseForge</div>
      <p className="subtitle">Открывай кейсы, делай апгрейды и контракты. Провайбли-фэир на базе хэшей и seed’ов.</p>

      <div className="grid">
        <div className="card">
          <h3>Кейсы</h3>
          <p className="small">Стартовый набор предметов и редкостей. Прозрачные шансы.</p>
          <a className="btn" href="/cases">Перейти к кейсам</a>
        </div>
        <div className="card">
          <h3>Апгрейд</h3>
          <p className="small">Меняй предмет на более ценный с шансом, зависящим от стоимости.</p>
          <a className="btn" href="/upgrade">Попробовать</a>
        </div>
        <div className="card">
          <h3>Контракт</h3>
          <p className="small">Объедини несколько предметов и получи один случайный.</p>
          <a className="btn" href="/contract">Создать контракт</a>
        </div>
        <div className="card">
          <h3>Fairness</h3>
          <p className="small">Коммит сервера, client seed и nonce. Проверка HMAC и раскрытие seed.</p>
          <a className="btn" href="/fairness">Проверить</a>
        </div>
      </div>
      <div className="space" />
      <div className="small">Вход через Steam появится после добавления ключа — сейчас доступен “Гость”.</div>
    </main>
  );
}
