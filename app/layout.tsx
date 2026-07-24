import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOSSIER_01 — 个人档案",
  description: "关于技术、生活与那些值得被记录的小事的私人档案。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
