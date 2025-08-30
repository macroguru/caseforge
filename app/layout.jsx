import "./globals.css";

export const metadata = {
  title: "CaseForge — F2P Case Opener",
  description: "Кейсы, апгрейды, контракты. Provably fair. RU/EN.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <nav className="nav">
          <div className="brand">
            <div className="logo" />
            <div>CaseForge <span className="badge">F2P</span></div>
          </div>
          <div className="navlinks">
            <a href="/" className="btn ghost">Главная</a>
            <a href="/cases" className="btn ghost">Кейсы</a>
            <a href="/upgrade" className="btn ghost">Апгрейд</a>
            <a href="/contract" className="btn ghost">Контракт</a>
            <a href="/inventory" className="btn ghost">Инвентарь</a>
            <a href="/fairness" className="btn ghost">Fair</a>
            <LangSwitcher />
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}

function LangSwitcher() {
  // Простой переключатель RU/EN через localStorage
  const script = `
    (function(){
      const key='cf_lang';
      const current = localStorage.getItem(key) || 'ru';
      function set(l){ localStorage.setItem(key,l); location.reload(); }
      window.__cfLangSet = set;
      document.getElementById('cf-lang').textContent = current.toUpperCase();
    })()
  `;
  return (
    <div className="flex">
      <button id="cf-lang" className="btn secondary" onClick={() => {}}>
        RU
      </button>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <div className="small">Язык</div>
      <div className="flex">
        <a className="btn secondary" onClick={() => {}} href="#" onMouseDown={(e)=>{e.preventDefault();}}>
          <span className="small">сменить →</span>
        </a>
        <script dangerouslySetInnerHTML={{ __html: `document.currentScript.previousElementSibling.onclick=function(e){e.preventDefault(); var cur=(localStorage.getItem('cf_lang')||'ru'); __cfLangSet(cur==='ru'?'en':'ru');};` }} />
      </div>
    </div>
  );
}
