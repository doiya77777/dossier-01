"use client";
import { useCallback, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ThreeCanvas } from "../../../components/three/ThreeCanvas";
import "./lab.css";

export default function WaterfallPage() {
  const setup = useCallback((scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    perspectiveCamera.position.set(7, 4.5, 9);
    const controls = new OrbitControls(perspectiveCamera, renderer.domElement);
    controls.target.set(0, 1.5, 0); controls.enableDamping = true; controls.minDistance = 5; controls.maxDistance = 15; controls.maxPolarAngle = Math.PI * .47;
    scene.background = new THREE.Color("#9bc9d0"); scene.fog = new THREE.Fog("#9bc9d0", 10, 24);
    const world = new THREE.Group(); scene.add(world);
    scene.add(new THREE.HemisphereLight("#e5fbff", "#334034", 2.5)); const sun = new THREE.DirectionalLight("#fff4d1", 3); sun.position.set(-4, 8, 5); scene.add(sun);
    const rockMat = new THREE.MeshStandardMaterial({ color: "#596960", roughness: .95 }); const darkRockMat = new THREE.MeshStandardMaterial({ color: "#354844", roughness: 1 });
    const addRock = (x: number, y: number, z: number, sx: number, sy: number, sz: number) => { const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 1), Math.random() > .45 ? rockMat : darkRockMat); mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); mesh.rotation.set(Math.random(), Math.random(), Math.random()); world.add(mesh); };
    for (let i = 0; i < 17; i++) { const side = i % 2 ? 1 : -1; addRock(side * (2.8 + Math.random() * 1.2), 1 + Math.random() * 3, -1 + Math.random() * 4, 1.2 + Math.random(), 1.5 + Math.random() * 2, 1.2 + Math.random()); }
    const ground = new THREE.Mesh(new THREE.CircleGeometry(5.5, 48), new THREE.MeshStandardMaterial({ color: "#45665d", roughness: .9 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -.55; world.add(ground);
    const pool = new THREE.Mesh(new THREE.CircleGeometry(3.2, 64), new THREE.MeshStandardMaterial({ color: "#1f8394", roughness: .12, metalness: .2, transparent: true, opacity: .9 })); pool.rotation.x = -Math.PI / 2; pool.position.set(0, -.42, 1.5); world.add(pool);
    const waterMaterial = new THREE.ShaderMaterial({ transparent: true, side: THREE.DoubleSide, uniforms: { uTime: { value: 0 } }, vertexShader: `varying vec2 vUv; uniform float uTime; void main(){vUv=uv;vec3 p=position;p.x+=sin(uv.y*18.0+uTime*3.0)*0.08*(1.0-uv.y);p.z+=cos(uv.y*14.0+uTime*2.0)*0.05;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`, fragmentShader: `varying vec2 vUv; uniform float uTime; void main(){float streaks=0.55+0.45*sin(vUv.x*70.0+sin(vUv.y*10.0)*2.0-uTime*5.0);float fade=smoothstep(0.0,0.12,vUv.y)*(1.0-smoothstep(.78,1.0,vUv.y));vec3 color=mix(vec3(.15,.65,.75),vec3(.65,1.0,1.0),streaks);gl_FragColor=vec4(color,fade*.72);}` });
    const curtain = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 5.5, 40, 30), waterMaterial); curtain.position.set(0, 2.05, -.55); world.add(curtain);
    const foamGeo = new THREE.BufferGeometry(); const foamCount = 900; const foam = new Float32Array(foamCount * 3); for (let i = 0; i < foamCount; i++) { foam[i*3]=(Math.random()-.5)*3.2; foam[i*3+1]=-.35+Math.random()*.38; foam[i*3+2]=.2+Math.random()*2.6; } foamGeo.setAttribute("position",new THREE.BufferAttribute(foam,3)); const foamPoints=new THREE.Points(foamGeo,new THREE.PointsMaterial({color:"#eaffff",size:.055,transparent:true,opacity:.72})); world.add(foamPoints);
    const mistGeo = new THREE.BufferGeometry(); const mist = new Float32Array(420 * 3); for (let i=0;i<420;i++){mist[i*3]=(Math.random()-.5)*4;mist[i*3+1]=-.2+Math.random()*1.3;mist[i*3+2]=Math.random()*2-.2;} mistGeo.setAttribute("position",new THREE.BufferAttribute(mist,3)); const mistPoints=new THREE.Points(mistGeo,new THREE.PointsMaterial({color:"#e8ffff",size:.1,transparent:true,opacity:.22,depthWrite:false})); world.add(mistPoints);
    const clock = new THREE.Clock();
    return () => { const time=clock.getElapsedTime(); waterMaterial.uniforms.uTime.value=time; foamPoints.rotation.y=time*.04; mistPoints.position.y=Math.sin(time)*.06; controls.update(); };
  }, []);
  const setupRef = useRef(setup).current;
  return <main className="lab-page"><a className="back-link" href="/">← 返回首页</a><div className="lab-header"><span>GAME ENVIRONMENT STUDY / 001</span><h1>峡谷瀑布</h1><p>一个可以放进游戏关卡里的实时瀑布环境。</p></div><div className="waterfall-stage"><ThreeCanvas className="waterfall-canvas" onReady={(scene,camera,renderer)=>{const update=setupRef(scene,camera,renderer);let frame=0;const loop=()=>{update?.();frame=requestAnimationFrame(loop)};loop();return()=>cancelAnimationFrame(frame)}} /></div><section className="explanation"><div><span className="eyebrow">GAME ASSET BREAKDOWN</span><h2>瀑布不是一个物体，<br />而是一整套环境。</h2></div><div className="explanation-copy"><p>这版使用实时 3D 场景来组织瀑布：岩壁负责体积感，Shader 水帘负责连续流动，泡沫和雾气负责把水体和地面连接起来。</p><ol><li><b>场景层</b><br />用程序化岩石排列出峡谷，用地面和水池建立关卡空间。</li><li><b>水体层</b><br />用透明 Shader 扭曲平面，让水帘拥有流动的条纹和边缘衰减。</li><li><b>氛围层</b><br />用泡沫、雾气、阴影色和环境光制造“水落下来”的重量感。</li><li><b>交互层</b><br />拖动鼠标旋转镜头，滚轮缩放；以后可以接入角色、碰撞和游戏输入。</li></ol></div></section></main>;
}
