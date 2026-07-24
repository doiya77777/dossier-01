"use client";

import { useState } from "react";

const posts = [
  { date: "2026.07.24", tag: "随笔", title: "把互联网当作一间安静的房间", excerpt: "在噪声之外，重新搭一张自己的桌子。写下正在想的、正在做的，和还没有答案的事。", time: "6 min read" },
  { date: "2026.07.18", tag: "技术", title: "极简网站的十条性能纪律", excerpt: "少一点依赖，少一次请求，少一点等待。好的个人网站，首先应该尊重读者的时间。", time: "8 min read" },
  { date: "2026.07.03", tag: "观察", title: "旧唱片、纯文本与慢通讯", excerpt: "有些媒介没有消失，只是退回到愿意认真使用它们的人手里。", time: "4 min read" },
];

export default function Home() {
  const [filter, setFilter] = useState("全部");
  const visible = filter === "全部" ? posts : posts.filter((post) => post.tag === filter);

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="回到首页"><span className="brand-mark">✳</span> DOSSIER_01</a>
        <nav aria-label="主导航"><a href="#writing">文字</a><a href="#about">关于</a><a href="#notes">订阅</a></nav>
        <span className="status"><i /> ONLINE / 2026</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-label">PERSONAL ARCHIVE / ISSUE 001</div>
        <h1>在这里，<em>慢慢</em><br />把事情想清楚。</h1>
        <div className="hero-bottom"><p>一份关于技术、生活与那些<br />值得被记录的小事的私人档案。</p><span className="scroll-cue">↓ SCROLL TO EXPLORE</span></div>
      </section>

      <section className="feature-grid" id="about">
        <div className="section-index">01 / THE EDITOR’S NOTE</div>
        <div className="feature-copy"><p className="kicker">A NOTE FROM THE DESK</p><h2>写给未来的自己，<br />也写给偶然路过的你。</h2><p>你好，我是 Dōiya。这里是我的互联网角落——没有算法推送，没有无尽滚动，只有一些被认真留下来的文字。</p><a className="text-link" href="#writing">进入档案 <span>↗</span></a></div>
        <div className="stamp" aria-hidden="true"><span>EST.</span><strong>20<br />26</strong><small>SHANGHAI<br />CHINA</small></div>
      </section>

      <section className="writing" id="writing"><div className="section-head"><div><span className="section-index">02 / RECENT WRITINGS</span><h2>最新文字</h2></div><span className="count">{String(visible.length).padStart(2, "0")} ENTRIES</span></div>
        <div className="filters" role="group" aria-label="文章分类">{["全部", "随笔", "技术", "观察"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
        <div className="post-list">{visible.map((post, i) => <article className="post" key={post.title}><span className="post-no">0{i + 1}</span><div className="post-date">{post.date}<br /><span>{post.tag}</span></div><div className="post-body"><h3><a href="#notes">{post.title}</a></h3><p>{post.excerpt}</p></div><span className="post-time">{post.time} <b>↗</b></span></article>)}</div>
      </section>

      <section className="subscribe" id="notes"><div className="section-index">03 / A LETTER, OCCASIONALLY</div><div><h2>偶尔寄一封信。</h2><p>新文章、读到的好东西，以及一些不适合发在社交媒体上的想法。</p><form onSubmit={(e) => e.preventDefault()}><label className="sr-only" htmlFor="email">你的邮箱</label><input id="email" type="email" placeholder="your@email.com" required /><button type="submit">订阅 ↗</button></form></div></section>

      <footer><span>© 2026 DOSSIER_01</span><span>MADE WITH CARE / NO TRACKERS</span><a href="#top">回到顶部 ↑</a></footer>
    </main>
  );
}
