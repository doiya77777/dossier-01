# DOSSIER_01

一个极简、静态优先的复古个人博客。无需数据库或运行时服务，适合直接连接 GitHub 并部署到 Vercel。

## 本地运行

```bash
npm run dev
```

## Vercel 上线

1. 将此目录推送到 GitHub。
2. 在 Vercel 中导入该仓库。
3. 保持默认设置：Framework Preset 选择 Next.js，Build Command 为 `npm run build`。
4. 在 Vercel 的 Domains 中绑定你的域名，并按提示配置 DNS。

文章内容目前集中在 `app/page.tsx` 顶部的 `posts` 数组中，后续可以无痛迁移为 Markdown 内容目录。
