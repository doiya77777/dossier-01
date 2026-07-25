"use client";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "../../../components/three/ThreeCanvas";
import "./lab.css";

export default function WaterfallPage() {
  const setup = useCallback((scene: THREE.Scene) => {
    scene.background = new THREE.Color("#101315"); scene.fog = new THREE.Fog("#101315", 7, 18);
    const rock = new THREE.Mesh(new THREE.BoxGeometry(6, 4.5, 1.2), new THREE.MeshStandardMaterial({ color: "#283335", roughness: 1 })); rock.position.set(0, 1.6, -1.2); scene.add(rock);
    const pool = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.6, 0.18, 64), new THREE.MeshStandardMaterial({ color: "#12343c", roughness: .18 })); pool.position.y = -1.25; scene.add(pool);
    const count = 2600, positions = new Float32Array(count * 3), speeds = new Float32Array(count), offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) { positions[i*3] = (Math.random()-.5)*2.1; positions[i*3+1] = Math.random()*5-.5; positions[i*3+2] = (Math.random()-.5)*.22; speeds[i] = .025 + Math.random()*.045; offsets[i] = Math.random()*Math.PI*2; }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const water = new THREE.Points(geometry, new THREE.PointsMaterial({ color: "#92e5ee", size: .045, transparent: true, opacity: .72, depthWrite: false, blending: THREE.AdditiveBlending })); water.position.y = -.3; scene.add(water);
    const mistGeometry = new THREE.BufferGeometry(), mistPositions = new Float32Array(480 * 3); for (let i = 0; i < 480; i++) { mistPositions[i*3] = (Math.random()-.5)*4.2; mistPositions[i*3+1] = -1+Math.random()*1.2; mistPositions[i*3+2] = Math.random()*1.2; } mistGeometry.setAttribute("position", new THREE.BufferAttribute(mistPositions, 3));
    const mist = new THREE.Points(mistGeometry, new THREE.PointsMaterial({ color: "#d6ffff", size: .065, transparent: true, opacity: .24, depthWrite: false })); scene.add(mist);
    scene.add(new THREE.HemisphereLight("#b8f5ff", "#152021", 2.2)); const light = new THREE.PointLight("#73d9ec", 18, 10); light.position.set(0, 0, 2); scene.add(light);
    const clock = new THREE.Clock();
    return () => { const elapsed = clock.getElapsedTime(), values = geometry.attributes.position.array as Float32Array; for (let i = 0; i < count; i++) { const y = values[i*3+1] - speeds[i]; values[i*3+1] = y < -4.8 ? 4.5 : y; values[i*3] += Math.sin(elapsed*2 + offsets[i]) * .0018; } geometry.attributes.position.needsUpdate = true; water.rotation.y = Math.sin(elapsed*.2)*.025; mist.rotation.y = elapsed*.025; light.intensity = 14 + Math.sin(elapsed*2)*3; };
  }, []);
  const onReady = useRef((scene: THREE.Scene) => setup(scene)).current;
  return <main className="lab-page"><a className="back-link" href="/">← 返回首页</a><div className="lab-header"><span>THREE.JS LAB / 001</span><h1>瀑布 Waterfall</h1><p>用粒子系统模拟一场持续落下的水。</p></div><div className="waterfall-stage"><ThreeCanvas className="waterfall-canvas" onReady={(scene) => { const update = onReady(scene); let frame = 0; const loop = () => { update?.(); frame = requestAnimationFrame(loop); }; loop(); return () => cancelAnimationFrame(frame); }} /></div><section className="explanation"><div><span className="eyebrow">HOW IT WORKS</span><h2>它不是一张视频，<br />而是 2600 个小水滴。</h2></div><div className="explanation-copy"><p>每一滴水都是粒子系统里的一个点。它拥有自己的横向位置、下落速度和随机偏移，在每一帧里向下移动。</p><ol><li><b>创建粒子</b><br />用 BufferGeometry 一次性保存大量粒子的坐标。</li><li><b>模拟重力</b><br />每一帧减少粒子的 Y 坐标，掉出画面后重新从顶部生成。</li><li><b>制造自然感</b><br />用正弦函数给 X 坐标加入轻微摆动，再叠加一层低透明度水雾。</li></ol></div></section></main>;
}
