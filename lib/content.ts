export type PostTag = "AI 思考" | "AI 实践" | "未来观察";
export type Post = { date: string; tag: PostTag; title: string; excerpt: string; time: string };
export const posts: Post[] = [
  { date: "2026年7月24日", tag: "AI 思考", title: "当 AI 变得无处不在，我们还需要思考什么？", excerpt: "AI 正在替我们完成越来越多的事情。也许真正稀缺的，不再是答案，而是提出值得回答的问题。", time: "6 分钟阅读" },
  { date: "2026年7月18日", tag: "AI 实践", title: "我如何把 AI 当作第二张书桌", excerpt: "不是把判断交给模型，而是让它帮助我整理混乱、暴露盲点，然后重新回到自己的判断里。", time: "8 分钟阅读" },
  { date: "2026年7月3日", tag: "未来观察", title: "从工具到同事：我们会如何与 AI 共事？", excerpt: "当软件开始理解上下文，工作流的边界会改变。真正的变化可能发生在界面之外。", time: "4 分钟阅读" },
];
export const postTags: Array<"全部" | PostTag> = ["全部", "AI 思考", "AI 实践", "未来观察"];
