import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 思考档案 — DOSSIER_01",
  description: "记录 AI 如何改变我们的工作、创作、判断，以及我们对未来生活的想象。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
