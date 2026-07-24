"use client";
import { useState } from "react";

const posts = [
  { date: "2026年7月24日", tag: "AI 思考", title: "当 AI 变得无处不在，我们还需要思考什么？", excerpt: "AI 正在替我们完成越来越多的事情。也许真正稀缺的，不再是答案，而是提出值得回答的问题。", time: "6 分钟阅读" },
  { date: "2026年7月18日", tag: "AI 实践", title: "我如何把 AI 当作第二张书桌", excerpt: "不是把判断交给模型，而是让它帮助我整理混乱、暴露盲点，然后重新回到自己的判断里。", time: "8 分钟阅读" },
  { date: "2026年7月3日", tag: "未来观察", title: "从工具到同事：我们会如何与 AI 共事？", excerpt: "当软件开始理解上下文，工作流的边界会改变。真正的变化可能发生在界面之外。", time: "4 分钟阅读" },
];

export default function Home() {
  const [filter, setFilter] = useState("全部");
  const visible = filter === "全部" ? posts : posts.filter((post) => post.tag === filter);
  return <div className="notion-app">
    <aside className="sidebar"><div className="workspace"><span className="workspace-icon">D</span><span>Dōiya 的空间</span><span className="chevron">⌄</span></div><div className="side-actions"><span>⌕</span><span>快速查找</span><kbd>⌘ K</kbd></div><div className="side-actions"><span>▣</span><span>所有更新</span></div><div className="side-actions"><span>⚙</span><span>设置与成员</span></div><div className="side-label">AI 思考档案</div><a className="side-page active" href="#top"><span>✳</span> 首页</a><a className="side-page" href="#writing"><span>▤</span> AI 文章</a><a className="side-page" href="#notes"><span>✉</span> AI 通讯</a><div className="side-bottom"><span>＋ 新建页面</span><span>☁ 已保存</span></div></aside>
    <main className="page"><header className="topbar"><div className="breadcrumbs"><span>AI 思考档案</span><b>›</b><strong>首页</strong></div><div className="top-actions"><span>···</span><span>↗ 分享</span><span className="avatar">D</span></div></header>
      <div className="page-content" id="top"><div className="page-icon">✳</div><div className="page-meta">最后编辑于 2026年7月24日</div><h1>关于 AI，<br />慢慢把事情想清楚。</h1><p className="lead">记录 AI 如何改变我们的工作、创作、判断，以及我们对未来生活的想象。</p><div className="callout"><span>💡</span><p>这里不追逐每天的模型新闻，也不急着给未来下结论。我更想记录那些值得停下来想一想的问题：AI 帮我们获得了什么，又可能让我们失去什么。</p></div><div className="divider" />
        <section className="block-section" id="writing"><div className="block-title"><span>▤</span><h2>最新文字</h2><small>{visible.length} 篇文章</small></div><div className="filters">{["全部", "AI 思考", "AI 实践", "未来观察"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="post-list">{visible.map((post) => <article className="post" key={post.title}><div className="post-title"><span className="post-emoji">{post.tag === "AI 实践" ? "🛠️" : post.tag === "未来观察" ? "🔭" : "✍️"}</span><div><h3><a href="#notes">{post.title}</a></h3><p>{post.excerpt}</p></div></div><div className="post-info">{post.date}<br />{post.time}</div></article>)}</div></section>
        <section className="block-section about-block"><div className="block-title"><span>◎</span><h2>关于这个页面</h2></div><p>这是一个关于 AI 的慢速档案。我会在这里记录实践、观察，以及那些暂时没有答案的问题。</p><div className="quote">“真正重要的，不是 AI 能做什么，而是我们决定让它做什么。”</div></section>
        <section className="subscribe-block" id="notes"><div className="block-title"><span>✉</span><h2>AI 思考通讯</h2></div><p>不定期分享 AI 相关的观察、实践和仍然没有答案的问题。</p><form onSubmit={(e) => e.preventDefault()}><label className="sr-only" htmlFor="email">邮箱</label><input id="email" type="email" placeholder="你的邮箱地址" required /><button type="submit">订阅</button></form></section><footer><span>© 2026 DOSSIER_01</span><span>Made with care · No trackers</span></footer>
      </div>
    </main>
  </div>;
}
