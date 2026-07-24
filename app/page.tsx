"use client";

import { useState } from "react";

const posts = [
  { date: "2026年7月24日", tag: "随笔", title: "把互联网当作一间安静的房间", excerpt: "在噪声之外，重新搭一张自己的桌子。写下正在想的、正在做的，和还没有答案的事。", time: "6 分钟阅读" },
  { date: "2026年7月18日", tag: "技术", title: "极简网站的十条性能纪律", excerpt: "少一点依赖，少一次请求，少一点等待。好的个人网站，首先应该尊重读者的时间。", time: "8 分钟阅读" },
  { date: "2026年7月3日", tag: "观察", title: "旧唱片、纯文本与慢通讯", excerpt: "有些媒介没有消失，只是退回到愿意认真使用它们的人手里。", time: "4 分钟阅读" },
];

export default function Home() {
  const [filter, setFilter] = useState("全部");
  const visible = filter === "全部" ? posts : posts.filter((post) => post.tag === filter);
  return <div className="notion-app">
    <aside className="sidebar"><div className="workspace"><span className="workspace-icon">D</span><span>Dōiya 的空间</span><span className="chevron">⌄</span></div><div className="side-actions"><span>⌕</span><span>快速查找</span><kbd>⌘ K</kbd></div><div className="side-actions"><span>▣</span><span>所有更新</span></div><div className="side-actions"><span>⚙</span><span>设置与成员</span></div><div className="side-label">私人页面</div><a className="side-page active" href="#top"><span>✳</span> 首页</a><a className="side-page" href="#writing"><span>▤</span> 文字档案</a><a className="side-page" href="#notes"><span>✉</span> 通讯</a><div className="side-bottom"><span>＋ 新建页面</span><span>☁ 已保存</span></div></aside>
    <main className="page"><header className="topbar"><div className="breadcrumbs"><span>私人页面</span><b>›</b><strong>首页</strong></div><div className="top-actions"><span>···</span><span>↗ 分享</span><span className="avatar">D</span></div></header>
      <div className="page-content" id="top"><div className="page-icon">✳</div><div className="page-meta">最后编辑于 2026年7月24日</div><h1>在这里，慢慢<br />把事情想清楚。</h1><p className="lead">一份关于技术、生活与那些值得被记录的小事的私人档案。</p><div className="callout"><span>💡</span><p>你好，我是 Dōiya。这里是我的互联网角落——没有算法推送，没有无尽滚动，只有一些被认真留下来的文字。</p></div><div className="divider" /><section className="block-section" id="writing"><div className="block-title"><span>▤</span><h2>最新文字</h2><small>{visible.length} 篇文章</small></div><div className="filters">{["全部", "随笔", "技术", "观察"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="post-list">{visible.map((post) => <article className="post" key={post.title}><div className="post-title"><span className="post-emoji">{post.tag === "技术" ? "🛠️" : post.tag === "观察" ? "🔭" : "✍️"}</span><div><h3><a href="#notes">{post.title}</a></h3><p>{post.excerpt}</p></div></div><div className="post-info">{post.date}<br />{post.time}</div></article>)}</div></section><section className="block-section about-block"><div className="block-title"><span>◎</span><h2>关于这个页面</h2></div><p>这是一个慢速、开放的个人档案。你可以把它当作一间小房间，随时回来坐一会儿。</p><div className="quote">“我们写作，是为了知道自己在想什么。”</div></section><section className="subscribe-block" id="notes"><div className="block-title"><span>✉</span><h2>偶尔寄一封信</h2></div><p>新文章、读到的好东西，以及一些不适合发在社交媒体上的想法。</p><form onSubmit={(e) => e.preventDefault()}><label className="sr-only" htmlFor="email">邮箱</label><input id="email" type="email" placeholder="你的邮箱地址" required /><button type="submit">订阅</button></form></section><footer><span>© 2026 DOSSIER_01</span><span>Made with care · No trackers</span></footer></div></main>
  </div>;
}
