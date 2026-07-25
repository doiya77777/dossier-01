"use client";

import { useCallback, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ThreeCanvas, type ThreeCanvasSession } from "./ThreeCanvas";

const ASSET_ROOT = "/assets/nature";

function radialTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(220,251,255,.82)");
  gradient.addColorStop(1, "rgba(220,251,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function markShadows(root: THREE.Object3D) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.castShadow = true;
    object.receiveShadow = true;
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
      camera.fov = 40;
      camera.near = 0.1;
      camera.far = 120;
      camera.position.set(11.5, 6.6, 14);
      camera.updateProjectionMatrix();

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 2.6, -0.7);
      controls.enableDamping = true;
      controls.dampingFactor = 0.055;
      controls.minDistance = 7;
      controls.maxDistance = 24;
      controls.minPolarAngle = 0.55;
      controls.maxPolarAngle = 1.48;
      controls.enablePan = false;

      scene.background = new THREE.Color("#b9d7d7");
      scene.fog = new THREE.FogExp2("#b9d7d7", 0.026);

      const sky = new THREE.Mesh(
        new THREE.SphereGeometry(55, 32, 16),
        new THREE.ShaderMaterial({
          side: THREE.BackSide,
          depthWrite: false,
          uniforms: {
            topColor: { value: new THREE.Color("#6c9fa5") },
            bottomColor: { value: new THREE.Color("#dce8df") },
          },
          vertexShader:
            "varying vec3 vPosition; void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
          fragmentShader:
            "varying vec3 vPosition;uniform vec3 topColor;uniform vec3 bottomColor;void main(){float h=smoothstep(-12.0,22.0,vPosition.y);gl_FragColor=vec4(mix(bottomColor,topColor,h),1.0);}",
        }),
      );
      scene.add(sky);

      const hemi = new THREE.HemisphereLight("#dff9ff", "#27372f", 2.4);
      scene.add(hemi);
      const sun = new THREE.DirectionalLight("#fff3d3", 4.2);
      sun.position.set(-8, 14, 8);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.camera.left = -16;
      sun.shadow.camera.right = 16;
      sun.shadow.camera.top = 16;
      sun.shadow.camera.bottom = -16;
      scene.add(sun);
      const bounce = new THREE.PointLight("#62d8e8", 24, 18, 2);
      bounce.position.set(0, 1.2, 2.5);
      scene.add(bounce);

      const world = new THREE.Group();
      world.rotation.y = -0.05;
      scene.add(world);

      const earthMaterial = new THREE.MeshStandardMaterial({
        color: "#334c3c",
        roughness: 0.96,
      });
      const island = new THREE.Mesh(
        new THREE.CylinderGeometry(10.5, 11.8, 1.4, 48),
        earthMaterial,
      );
      island.position.set(0, -1.08, 0.8);
      island.receiveShadow = true;
      world.add(island);

      const poolMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          deep: { value: new THREE.Color("#155d69") },
          shallow: { value: new THREE.Color("#67c6c5") },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vWave;
          uniform float uTime;
          void main() {
            vUv = uv;
            vec3 p = position;
            float wave = sin(p.x * 1.8 + uTime * 1.2) * .055
              + cos(p.y * 2.4 - uTime * 1.5) * .035;
            p.z += wave;
            vWave = wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          varying float vWave;
          uniform vec3 deep;
          uniform vec3 shallow;
          uniform float uTime;
          void main() {
            float ripple = sin(length(vUv - vec2(.46,.55)) * 72.0 - uTime * 4.0);
            float edge = smoothstep(.5, .12, distance(vUv, vec2(.5)));
            vec3 color = mix(deep, shallow, .38 + vWave * 4.0 + ripple * .035);
            gl_FragColor = vec4(color, edge * .94);
          }
        `,
      });
      const pool = new THREE.Mesh(
        new THREE.PlaneGeometry(10.5, 8.2, 80, 64),
        poolMaterial,
      );
      pool.rotation.x = -Math.PI / 2;
      pool.position.set(0, -0.31, 2.1);
      pool.renderOrder = 2;
      world.add(pool);

      const riverMaterial = new THREE.MeshStandardMaterial({
        color: "#4fb3be",
        roughness: 0.24,
        transparent: true,
        opacity: 0.9,
      });
      const river = new THREE.Mesh(
        new THREE.PlaneGeometry(3.5, 8, 24, 12),
        riverMaterial,
      );
      river.rotation.x = -Math.PI / 2;
      river.position.set(0, 5.05, -4.8);
      world.add(river);

      const sprite = radialTexture();
      const foamCount = 520;
      const foamPositions = new Float32Array(foamCount * 3);
      const foamOrigins = new Float32Array(foamCount);
      for (let i = 0; i < foamCount; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.45 + Math.random() * 3.1;
        foamPositions[i * 3] = Math.cos(angle) * radius;
        foamPositions[i * 3 + 1] = -0.08 + Math.random() * 0.28;
        foamPositions[i * 3 + 2] = 1.35 + Math.sin(angle) * radius * 0.52;
        foamOrigins[i] = Math.random() * Math.PI * 2;
      }
      const foamGeometry = new THREE.BufferGeometry();
      foamGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(foamPositions, 3),
      );
      const foam = new THREE.Points(
        foamGeometry,
        new THREE.PointsMaterial({
          color: "#e9ffff",
          map: sprite,
          size: 0.19,
          transparent: true,
          opacity: 0.68,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      foam.renderOrder = 4;
      world.add(foam);

      const sprayCount = 380;
      const sprayPositions = new Float32Array(sprayCount * 3);
      const sprayVelocity = new Float32Array(sprayCount * 3);
      const resetSpray = (i: number, first = false) => {
        sprayPositions[i * 3] = (Math.random() - 0.5) * 3.4;
        sprayPositions[i * 3 + 1] =
          first ? Math.random() * 2.2 : -0.05 + Math.random() * 0.3;
        sprayPositions[i * 3 + 2] = 0.2 + Math.random() * 2.3;
        sprayVelocity[i * 3] = (Math.random() - 0.5) * 0.16;
        sprayVelocity[i * 3 + 1] = 0.35 + Math.random() * 0.9;
        sprayVelocity[i * 3 + 2] = Math.random() * 0.2;
      };
      for (let i = 0; i < sprayCount; i += 1) resetSpray(i, true);
      const sprayGeometry = new THREE.BufferGeometry();
      sprayGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(sprayPositions, 3),
      );
      const spray = new THREE.Points(
        sprayGeometry,
        new THREE.PointsMaterial({
          color: "#ffffff",
          map: sprite,
          size: 0.22,
          transparent: true,
          opacity: 0.34,
          depthWrite: false,
        }),
      );
      spray.renderOrder = 5;
      world.add(spray);

      const loader = new GLTFLoader();
      let cancelled = false;
      const animatedMaps: THREE.Texture[] = [];

      const load = (path: string) =>
        loader.loadAsync(path).then((gltf) => {
          if (cancelled) return null;
          markShadows(gltf.scene);
          return gltf.scene;
        });

      const place = (
        source: THREE.Object3D | null,
        position: [number, number, number],
        scale: number | [number, number, number],
        rotationY = 0,
      ) => {
        if (!source) return;
        const clone = source.clone(true);
        clone.position.set(...position);
        if (typeof scale === "number") clone.scale.setScalar(scale);
        else clone.scale.set(...scale);
        clone.rotation.y = rotationY;
        world.add(clone);
      };

      Promise.all([
        load(`${ASSET_ROOT}/cliff_waterfall_rock.glb`),
        load(`${ASSET_ROOT}/cliff_waterfallTop_rock.glb`),
        load(`${ASSET_ROOT}/cliff_large_rock.glb`),
        load(`${ASSET_ROOT}/cliff_top_rock.glb`),
        load(`${ASSET_ROOT}/rock_largeA.glb`),
        load(`${ASSET_ROOT}/rock_largeC.glb`),
        load(`${ASSET_ROOT}/rock_tallB.glb`),
        load(`${ASSET_ROOT}/tree_pineTallA.glb`),
        load(`${ASSET_ROOT}/tree_pineSmallC.glb`),
        load(`${ASSET_ROOT}/plant_bushDetailed.glb`),
        load(`${ASSET_ROOT}/grass_large.glb`),
        load("/assets/waterfall/waterfall1.glb"),
      ]).then(
        ([
          waterfallCliff,
          waterfallTop,
          cliff,
          cliffTop,
          rockA,
          rockC,
          tallRock,
          tallPine,
          smallPine,
          bush,
          grass,
          waterfall,
        ]) => {
          if (cancelled) return;

          place(waterfallCliff, [0, 1.45, -1.25], [4.8, 5.8, 4.5]);
          place(waterfallTop, [0, 5.45, -1.3], [4.8, 2.5, 4.5]);
          place(cliff, [-4.4, 1.15, -1.05], [5.1, 6.2, 4.7], 0.05);
          place(cliff, [4.4, 1.15, -1.05], [5.1, 6.2, 4.7], Math.PI);
          place(cliffTop, [-4.45, 5.15, -1.1], [5.1, 2.8, 4.7]);
          place(cliffTop, [4.45, 5.15, -1.1], [5.1, 2.8, 4.7], Math.PI);

          place(rockA, [-3.7, -0.22, 2.4], 2.7, 0.7);
          place(rockC, [3.65, -0.27, 2.75], 2.35, -0.8);
          place(tallRock, [-5.15, 0.15, 0.5], 2.25, 0.3);
          place(rockA, [5.25, -0.3, 0.75], 1.8, -0.5);
          place(rockC, [-1.9, -0.25, 4.9], 1.25, 1.1);
          place(rockA, [2.15, -0.25, 5.25], 1.05, -0.4);

          place(tallPine, [-5.2, 4.75, -1.8], 2.25, 0.3);
          place(tallPine, [5.15, 4.65, -1.95], 2.05, -0.2);
          place(smallPine, [-6.2, -0.38, 0.4], 1.8, 0.4);
          place(smallPine, [6.35, -0.38, 0.8], 1.6, -0.5);
          place(bush, [-4.15, -0.31, 3.35], 1.8);
          place(bush, [4.35, -0.31, 3.7], 1.65, 0.8);
          place(bush, [-2.65, -0.28, 5.15], 1.2, -0.3);
          place(grass, [-5.7, -0.26, 3.6], 1.4);
          place(grass, [5.55, -0.26, 4.1], 1.35, 0.6);

          if (waterfall) {
            waterfall.traverse((object) => {
              if (!(object instanceof THREE.Mesh)) return;
              const sourceMaterial = object.material as THREE.MeshStandardMaterial;
              const material = sourceMaterial.clone();
              material.transparent = true;
              material.depthWrite = false;
              material.opacity = 0.86;
              if (sourceMaterial.map) {
                material.map = sourceMaterial.map.clone();
                material.map.wrapS = THREE.RepeatWrapping;
                material.map.wrapT = THREE.RepeatWrapping;
                material.map.needsUpdate = true;
                animatedMaps.push(material.map);
              }
              object.material = material;
              object.renderOrder = 3;
              object.castShadow = false;
            });
            waterfall.position.set(-0.2, 5.1, -0.24);
            waterfall.scale.set(1.62, 1.18, 1.62);
            world.add(waterfall);
          }
          setReady(true);
        },
      );

      return {
        update(delta, elapsed) {
          controls.update();
          poolMaterial.uniforms.uTime.value = elapsed;
          animatedMaps.forEach((map, index) => {
            map.offset.y = -elapsed * (0.22 + index * 0.004);
          });

          const positions = sprayGeometry.attributes.position
            .array as Float32Array;
          for (let i = 0; i < sprayCount; i += 1) {
            positions[i * 3] += sprayVelocity[i * 3] * delta;
            positions[i * 3 + 1] += sprayVelocity[i * 3 + 1] * delta;
            positions[i * 3 + 2] += sprayVelocity[i * 3 + 2] * delta;
            sprayVelocity[i * 3 + 1] -= 0.42 * delta;
            if (
              positions[i * 3 + 1] > 2.25 ||
              positions[i * 3 + 1] < -0.25
            ) {
              resetSpray(i);
            }
          }
          sprayGeometry.attributes.position.needsUpdate = true;

          const foamArray = foamGeometry.attributes.position
            .array as Float32Array;
          for (let i = 0; i < foamCount; i += 1) {
            foamArray[i * 3 + 1] =
              -0.07 + Math.sin(elapsed * 1.8 + foamOrigins[i]) * 0.025;
          }
          foamGeometry.attributes.position.needsUpdate = true;
          bounce.intensity = 22 + Math.sin(elapsed * 1.4) * 2;
        },
        dispose() {
          cancelled = true;
          controls.dispose();
          sprite.dispose();
          animatedMaps.forEach((map) => map.dispose());
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
        label="可交互的峡谷瀑布游戏场景"
        onReady={createScene}
      />
      <div className={`scene-loader ${ready ? "is-ready" : ""}`}>
        <span />
        <p>正在生成峡谷环境</p>
      </div>
      <div className="scene-hud" aria-hidden="true">
        <span>DRAG TO LOOK</span>
        <i />
        <span>SCROLL TO ZOOM</span>
      </div>
    </div>
  );
}
