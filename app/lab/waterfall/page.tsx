import type { Metadata } from "next";
import { GameWaterfallScene } from "../../../components/three/GameWaterfallScene";
import "./lab.css";

export const metadata: Metadata = {
  title: "二次元峡谷瀑布 — Three.js Anime VFX",
  description:
    "使用分层色带、程序化轮廓与水花粒子构建的可交互二次元游戏瀑布。",
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
          <p className="lab-kicker">ANIME WATER VFX STUDY / 001</p>
          <h1>
            峡谷
            <br />
            <em>瀑布</em>
          </h1>
        </div>
        <p className="lab-intro">
          一座运行在浏览器里的二次元游戏场景。
          <br />
          拖动镜头，观察分层水纹、泡沫和夸张水花。
        </p>
      </section>

      <section className="waterfall-stage">
        <GameWaterfallScene />
      </section>

      <section className="explanation">
        <div>
          <span className="eyebrow">SCENE BREAKDOWN</span>
          <h2>
            二次元瀑布，
            <br />
            先设计运动，再设计水。
          </h2>
        </div>
        <div className="explanation-copy">
          <p>
            这版不模拟写实透明水，而是把动画里的水拆成明确色阶：深色水体、
            青色流带、白色速度线和撞击泡沫。每一层拥有不同尺度与速度，因此
            即使没有昂贵的流体模拟，也能读出持续下落的力量。
          </p>
          <ol>
            <li>
              <b>专用水帘网格</b>
              <br />
              网格沿下落方向向外弯曲，宽度和轮廓由独立参数控制，不再是一张矩形贴图。
            </li>
            <li>
              <b>四层动画色带</b>
              <br />
              宽阴影、细流线、快速高光与上下泡沫使用不同频率和速度叠加。
            </li>
            <li>
              <b>夸张撞击反馈</b>
              <br />
              低多边形泡沫团、抛物线水滴和扩散波纹共同表现瀑布落水的冲击。
            </li>
            <li>
              <b>轻量实时渲染</b>
              <br />
              无折射预通道、无大型扫描模型；主要动画都在 GPU Shader 中完成。
            </li>
          </ol>
          <p className="asset-note">
            ORIGINAL THREE.JS / GLSL STUDY · NO EXTERNAL SCENE ASSETS
          </p>
        </div>
      </section>
    </main>
  );
}
