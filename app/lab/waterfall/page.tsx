import type { Metadata } from "next";
import { GameWaterfallScene } from "../../../components/three/GameWaterfallScene";
import "./lab.css";

export const metadata: Metadata = {
  title: "峡谷瀑布 — Three.js Game Environment",
  description:
    "使用真实 CC0 游戏资产、Three.js 水体动画和粒子系统构建的可交互峡谷瀑布。",
};

export default function WaterfallPage() {
  return (
    <main className="lab-page">
      <header className="lab-nav">
        <a className="back-link" href="/">
          ← 返回档案
        </a>
        <div className="lab-status">
          <span />
          REALTIME / WEBGL
        </div>
      </header>

      <section className="lab-hero">
        <div className="lab-heading">
          <p className="lab-kicker">GAME ENVIRONMENT STUDY / 001</p>
          <h1>
            峡谷
            <br />
            <em>瀑布</em>
          </h1>
        </div>
        <p className="lab-intro">
          一座运行在浏览器里的微型游戏关卡。
          <br />
          拖动镜头，从不同角度观察水流、岩壁和雾气。
        </p>
      </section>

      <section className="waterfall-stage">
        <GameWaterfallScene />
      </section>

      <section className="explanation">
        <div>
          <span className="eyebrow">SCENE BREAKDOWN</span>
          <h2>
            真正的瀑布，
            <br />
            是一套环境系统。
          </h2>
        </div>
        <div className="explanation-copy">
          <p>
            场景使用 Kenney Nature Kit 的悬崖、岩石、松树与植被模型，结合
            Toon Waterfall 的分层水流模型。水池、泡沫、飞溅和灯光则由
            Three.js 在浏览器中实时生成。
          </p>
          <ol>
            <li>
              <b>地形资产</b>
              <br />
              多个独立模型拼成完整峡谷，保证轮廓和尺度像一处游戏关卡。
            </li>
            <li>
              <b>分层水流</b>
              <br />
              瀑布模型包含多层透明水片，通过持续滚动 UV 产生下落运动。
            </li>
            <li>
              <b>水面反馈</b>
              <br />
              Shader 驱动水池波纹，泡沫和喷雾粒子连接落水点与水面。
            </li>
            <li>
              <b>实时镜头</b>
              <br />
              轨道镜头、软阴影、雾和色调映射共同建立游戏环境的空间感。
            </li>
          </ol>
          <p className="asset-note">
            3D assets: Kenney Nature Kit + Toon Waterfall · CC0
          </p>
        </div>
      </section>
    </main>
  );
}
