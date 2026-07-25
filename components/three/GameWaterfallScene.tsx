"use client";

import { useCallback, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  createRoundSprite,
  createSurfaceMaterial,
  createWaterfallGeometry,
  createWaterfallMaterial,
} from "./animeWaterfall";
import { ThreeCanvas, type ThreeCanvasSession } from "./ThreeCanvas";

type SplashParticle = {
  origin: THREE.Vector3;
  velocity: THREE.Vector3;
  age: number;
  life: number;
};

const cliffColors = ["#3d5754", "#496560", "#58756b", "#304844"];

function createCliffRock(
  color: string,
  position: [number, number, number],
  scale: [number, number, number],
  rotation: [number, number, number],
) {
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1, 1),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.96,
      metalness: 0,
      flatShading: true,
    }),
  );
  rock.position.set(...position);
  rock.scale.set(...scale);
  rock.rotation.set(...rotation);
  rock.castShadow = true;
  rock.receiveShadow = true;
  return rock;
}

function addCanyon(world: THREE.Group) {
  const rocks: Array<{
    position: [number, number, number];
    scale: [number, number, number];
    rotation: [number, number, number];
  }> = [
    { position: [-4.0, 1.2, -0.7], scale: [2.7, 3.2, 2.0], rotation: [0.1, 0.1, -0.16] },
    { position: [-5.5, 3.8, -1.7], scale: [2.5, 3.0, 1.9], rotation: [0.2, 0.4, 0.15] },
    { position: [-3.55, 5.4, -1.1], scale: [2.1, 2.35, 1.75], rotation: [-0.1, -0.2, 0.12] },
    { position: [-6.7, 0.1, 1.0], scale: [2.8, 2.0, 2.5], rotation: [0.2, 0.5, 0.08] },
    { position: [-4.9, -0.15, 3.1], scale: [2.0, 1.35, 1.8], rotation: [0.1, 0.8, -0.05] },
    { position: [4.0, 1.2, -0.7], scale: [2.7, 3.2, 2.0], rotation: [0.1, -0.1, 0.16] },
    { position: [5.5, 3.8, -1.7], scale: [2.5, 3.0, 1.9], rotation: [0.2, -0.4, -0.15] },
    { position: [3.55, 5.4, -1.1], scale: [2.1, 2.35, 1.75], rotation: [-0.1, 0.2, -0.12] },
    { position: [6.7, 0.1, 1.0], scale: [2.8, 2.0, 2.5], rotation: [0.2, -0.5, -0.08] },
    { position: [4.9, -0.15, 3.1], scale: [2.0, 1.35, 1.8], rotation: [0.1, -0.8, 0.05] },
    { position: [-2.55, 6.25, -2.45], scale: [2.15, 1.2, 1.7], rotation: [0.2, 0.15, -0.1] },
    { position: [2.55, 6.25, -2.45], scale: [2.15, 1.2, 1.7], rotation: [0.2, -0.15, 0.1] },
  ];

  rocks.forEach((rock, index) => {
    world.add(
      createCliffRock(
        cliffColors[index % cliffColors.length],
        rock.position,
        rock.scale,
        rock.rotation,
      ),
    );
  });

  const mossMaterial = new THREE.MeshStandardMaterial({
    color: "#6f9b70",
    roughness: 1,
    flatShading: true,
  });
  const mossGeometry = new THREE.IcosahedronGeometry(1, 1);
  [
    [-4.1, 4.45, 0.65, 1.45, 0.42, 0.85],
    [-5.2, 1.55, 1.05, 1.2, 0.34, 0.72],
    [4.1, 4.45, 0.65, 1.45, 0.42, 0.85],
    [5.2, 1.55, 1.05, 1.2, 0.34, 0.72],
    [-2.8, 6.8, -1.25, 1.0, 0.25, 0.6],
    [2.8, 6.8, -1.25, 1.0, 0.25, 0.6],
  ].forEach(([x, y, z, sx, sy, sz]) => {
    const moss = new THREE.Mesh(mossGeometry, mossMaterial);
    moss.position.set(x, y, z);
    moss.scale.set(sx, sy, sz);
    world.add(moss);
  });
}

export function GameWaterfallScene() {
  const [ready, setReady] = useState(false);

  const createScene = useCallback(
    (
      scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      renderer: THREE.WebGLRenderer,
    ): ThreeCanvasSession => {
      camera.fov = 38;
      camera.near = 0.1;
      camera.far = 80;
      camera.position.set(9.6, 5.4, 14.5);
      camera.updateProjectionMatrix();

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 2.75, 0);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enablePan = false;
      controls.minDistance = 9;
      controls.maxDistance = 20;
      controls.minPolarAngle = 0.75;
      controls.maxPolarAngle = 1.4;
      controls.minAzimuthAngle = -0.72;
      controls.maxAzimuthAngle = 0.72;

      scene.background = new THREE.Color("#c5ded8");
      scene.fog = new THREE.Fog("#c5ded8", 18, 42);

      const hemi = new THREE.HemisphereLight("#f5fff8", "#314943", 2.25);
      scene.add(hemi);
      const sun = new THREE.DirectionalLight("#fff3ca", 4.1);
      sun.position.set(-7, 13, 9);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      sun.shadow.camera.left = -12;
      sun.shadow.camera.right = 12;
      sun.shadow.camera.top = 12;
      sun.shadow.camera.bottom = -12;
      scene.add(sun);

      const world = new THREE.Group();
      world.position.y = -0.35;
      scene.add(world);
      addCanyon(world);

      const ground = new THREE.Mesh(
        new THREE.CircleGeometry(10.5, 48),
        new THREE.MeshStandardMaterial({
          color: "#526f61",
          roughness: 1,
          flatShading: true,
        }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.8;
      ground.scale.set(1.25, 0.9, 1);
      ground.receiveShadow = true;
      world.add(ground);

      const waterfallMaterial = createWaterfallMaterial(0.4);
      const waterfall = new THREE.Mesh(
        createWaterfallGeometry(),
        waterfallMaterial,
      );
      waterfall.position.set(0, 2.95, -0.25);
      waterfall.renderOrder = 3;
      world.add(waterfall);

      const lipMaterial = new THREE.MeshBasicMaterial({
        color: "#eaffee",
      });
      const lipBlobs: THREE.Mesh[] = [];
      for (let i = 0; i < 8; i += 1) {
        const lip = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.34 + (i % 3) * 0.035, 1),
          lipMaterial,
        );
        lip.position.set(
          -1.72 + i * 0.49,
          6.39 + (i % 2) * 0.025,
          -0.13 + (i % 3) * 0.025,
        );
        lip.scale.set(1.08, 0.27, 0.48);
        lipBlobs.push(lip);
        world.add(lip);
      }

      const streamMaterial = createSurfaceMaterial(false);
      const stream = new THREE.Mesh(
        new THREE.PlaneGeometry(4.15, 5.7, 18, 28),
        streamMaterial,
      );
      stream.rotation.x = -Math.PI / 2;
      stream.position.set(0, 6.42, -2.8);
      world.add(stream);

      const poolMaterial = createSurfaceMaterial(true);
      const pool = new THREE.Mesh(
        new THREE.CircleGeometry(5.5, 72),
        poolMaterial,
      );
      pool.rotation.x = -Math.PI / 2;
      pool.position.set(0, -0.42, 2.05);
      pool.scale.set(1.18, 0.77, 1);
      pool.renderOrder = 1;
      world.add(pool);

      const foamMaterial = new THREE.MeshBasicMaterial({
        color: "#f5fff1",
        transparent: true,
        opacity: 0.86,
        depthWrite: false,
      });
      const foamBlobs: THREE.Mesh[] = [];
      const foamGroup = new THREE.Group();
      foamGroup.position.set(0, -0.12, 0.55);
      for (let i = 0; i < 9; i += 1) {
        const angle = (i / 9) * Math.PI * 2;
        const blob = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.34 + (i % 3) * 0.055, 1),
          foamMaterial,
        );
        blob.position.set(
          Math.cos(angle) * (0.78 + (i % 2) * 0.24),
          0.12 + (i % 3) * 0.055,
          Math.sin(angle) * 0.42,
        );
        blob.scale.set(1.32, 0.36, 0.74);
        foamBlobs.push(blob);
        foamGroup.add(blob);
      }
      foamGroup.renderOrder = 4;
      world.add(foamGroup);

      const sprite = createRoundSprite();
      const splashCount = 110;
      const splashPositions = new Float32Array(splashCount * 3);
      const splashParticles: SplashParticle[] = [];
      const resetSplash = (index: number, initial = false) => {
        const origin = new THREE.Vector3(
          (Math.random() - 0.5) * 2.25,
          -0.02,
          0.25 + Math.random() * 0.9,
        );
        const velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 1.8,
          1.1 + Math.random() * 2.15,
          0.25 + Math.random() * 1.35,
        );
        const life = 0.72 + Math.random() * 0.85;
        const particle = splashParticles[index] ?? {
          origin,
          velocity,
          age: 0,
          life,
        };
        particle.origin.copy(origin);
        particle.velocity.copy(velocity);
        particle.life = life;
        particle.age = initial ? Math.random() * life : 0;
        splashParticles[index] = particle;
      };

      for (let i = 0; i < splashCount; i += 1) resetSplash(i, true);
      const splashGeometry = new THREE.BufferGeometry();
      splashGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(splashPositions, 3),
      );
      const splash = new THREE.Points(
        splashGeometry,
        new THREE.PointsMaterial({
          color: "#f4fff1",
          map: sprite,
          alphaTest: 0.45,
          transparent: true,
          opacity: 0.92,
          size: 0.12,
          sizeAttenuation: true,
          depthWrite: false,
        }),
      );
      splash.renderOrder = 5;
      world.add(splash);

      const mistPositions = new Float32Array(28 * 3);
      for (let i = 0; i < 28; i += 1) {
        mistPositions[i * 3] = (Math.random() - 0.5) * 3.5;
        mistPositions[i * 3 + 1] = Math.random() * 1.65;
        mistPositions[i * 3 + 2] = 0.55 + Math.random() * 1.7;
      }
      const mistGeometry = new THREE.BufferGeometry();
      mistGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(mistPositions, 3),
      );
      const mist = new THREE.Points(
        mistGeometry,
        new THREE.PointsMaterial({
          color: "#dff9ed",
          map: sprite,
          transparent: true,
          opacity: 0.13,
          size: 1.05,
          depthWrite: false,
        }),
      );
      mist.renderOrder = 2;
      world.add(mist);

      const accentLight = new THREE.PointLight("#5ee8ef", 8, 9, 2);
      accentLight.position.set(0, 1.2, 2.2);
      world.add(accentLight);
      setReady(true);

      return {
        update(delta, elapsed) {
          controls.update();
          waterfallMaterial.uniforms.uTime.value = elapsed;
          streamMaterial.uniforms.uTime.value = elapsed;
          poolMaterial.uniforms.uTime.value = elapsed;

          const positions = splashGeometry.attributes.position
            .array as Float32Array;
          for (let i = 0; i < splashCount; i += 1) {
            const particle = splashParticles[i];
            particle.age += delta;
            if (particle.age >= particle.life) resetSplash(i);
            const t = particle.age;
            positions[i * 3] = particle.origin.x + particle.velocity.x * t;
            positions[i * 3 + 1] =
              particle.origin.y + particle.velocity.y * t - 2.7 * t * t;
            positions[i * 3 + 2] =
              particle.origin.z + particle.velocity.z * t;
          }
          splashGeometry.attributes.position.needsUpdate = true;

          foamBlobs.forEach((blob, index) => {
            const pulse = 1 + Math.sin(elapsed * 3.1 + index * 1.7) * 0.1;
            blob.scale.y = 0.36 * pulse;
            blob.position.y =
              0.12 + (index % 3) * 0.055 + Math.sin(elapsed * 2.4 + index) * 0.025;
          });
          lipBlobs.forEach((blob, index) => {
            blob.position.y =
              6.39 + (index % 2) * 0.025 + Math.sin(elapsed * 2.2 + index) * 0.018;
            blob.scale.x = 1.08 + Math.sin(elapsed * 1.8 + index * 0.7) * 0.055;
          });
          mist.rotation.y = Math.sin(elapsed * 0.16) * 0.08;
          accentLight.intensity = 7.5 + Math.sin(elapsed * 2.0) * 0.8;
        },
        dispose() {
          controls.dispose();
          sprite.dispose();
          setReady(false);
        },
      };
    },
    [],
  );

  return (
    <div className="waterfall-experience">
      <ThreeCanvas
        className="waterfall-canvas"
        label="可交互的二次元峡谷瀑布场景"
        onReady={createScene}
      />
      <div className={`scene-loader ${ready ? "is-ready" : ""}`}>
        <span />
        <p>正在绘制二次元水流</p>
      </div>
      <div className="scene-hud" aria-hidden="true">
        <span>拖动观察</span>
        <i />
        <span>滚轮缩放</span>
      </div>
    </div>
  );
}
