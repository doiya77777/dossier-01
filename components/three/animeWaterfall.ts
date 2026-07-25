import * as THREE from "three";

const waterfallVertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uPhase;

  float wave(float y, float speed, float phase) {
    return sin(y * 11.0 + uTime * speed + phase)
      + 0.45 * sin(y * 23.0 - uTime * speed * 0.72 + phase * 1.7);
  }

  void main() {
    vUv = uv;
    vec3 p = position;
    float fall = 1.0 - uv.y;
    p.x += wave(uv.y, 1.7, uPhase) * 0.035 * (0.35 + fall);
    p.z += wave(uv.y + uv.x * 0.08, 2.1, uPhase) * 0.045;
    p.z += fall * fall * 0.72;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const waterfallFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform float uPhase;
  uniform vec3 uDeep;
  uniform vec3 uMid;
  uniform vec3 uLight;
  uniform vec3 uFoam;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x),
      f.y
    );
  }

  float streak(vec2 uv, float xFrequency, float yFrequency, float speed, float seed) {
    vec2 p = vec2(
      uv.x * xFrequency + seed,
      uv.y * yFrequency + uTime * speed + seed * 2.37
    );
    float first = noise(p);
    float second = noise(vec2(p.x * 1.91 + 8.4, p.y * 0.73 - 4.2));
    return first * 0.68 + second * 0.32;
  }

  void main() {
    vec2 uv = vUv;

    float edgeMotion =
      (noise(vec2(uv.y * 5.2 + uTime * 0.18, uPhase + 3.7)) - 0.5) * 0.085
      + sin(uv.y * 18.0 + uTime * 0.75 + uPhase) * 0.012;
    float halfWidth = mix(0.44, 0.49, uv.y) + edgeMotion;
    float inside = halfWidth - abs(uv.x - 0.5);
    if (inside < 0.0) discard;

    float broad = streak(uv, 8.0, 2.0, 0.58, uPhase + 2.1);
    float medium = streak(uv, 18.0, 3.1, 0.88, uPhase + 7.4);
    float fast = streak(uv, 38.0, 1.35, 1.72, uPhase + 13.2);
    float slowFoam = smoothstep(0.58, 0.65, broad);
    float midBand = smoothstep(0.53, 0.61, medium);
    float speedLine = smoothstep(0.68, 0.75, fast);

    vec3 color = mix(uDeep, uMid, 0.45 + uv.y * 0.22);
    color = mix(color, uDeep, midBand * 0.42);
    color = mix(color, uLight, slowFoam * 0.42);
    color = mix(color, uFoam, speedLine * (0.35 + uv.y * 0.45));

    float lipMask = smoothstep(0.80, 0.98, uv.y);
    float impactMask = 1.0 - smoothstep(0.02, 0.28, uv.y);
    float impactNoise = smoothstep(
      0.42,
      0.60,
      streak(uv, 12.0, 4.0, 1.12, uPhase + 21.0)
    );
    float edgeInk = 1.0 - smoothstep(0.012, 0.045, inside);
    float innerRim = 1.0 - smoothstep(0.035, 0.075, inside);

    color = mix(color, uFoam, max(lipMask * 0.64, impactMask * (0.65 + impactNoise * 0.35)));
    color = mix(color, uLight, innerRim * 0.48);
    color = mix(color, uDeep * 0.72, edgeInk * 0.42);

    float sparkle = step(0.986, hash21(floor(uv * vec2(54.0, 82.0)) + floor(uTime * 5.0)));
    sparkle *= smoothstep(0.18, 0.35, uv.y) * (1.0 - smoothstep(0.82, 0.94, uv.y));
    color += uFoam * sparkle * 0.42;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const surfaceVertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += sin(p.x * 2.4 + uTime * 1.4) * 0.025;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const surfaceFragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uLight;
  uniform vec3 uFoam;
  uniform float uPool;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec2 uv = vUv;
    vec3 color;

    if (uPool > 0.5) {
      vec2 centered = uv - 0.5;
      float radius = length(centered) * 2.0;
      if (radius > 0.985) discard;

      float rings = abs(fract(radius * 3.2 - uTime * 0.46) - 0.5);
      float ringLine = 1.0 - smoothstep(0.055, 0.105, rings);
      float broken = smoothstep(0.34, 0.58, noise(vec2(atan(centered.y, centered.x) * 2.0, radius * 4.0 - uTime)));
      float radialFoam = ringLine * broken * (1.0 - smoothstep(0.70, 0.98, radius));
      float edge = smoothstep(0.74, 0.99, radius);

      color = mix(uDeep, uLight, 0.20 + (1.0 - radius) * 0.24);
      color = mix(color, uFoam, radialFoam * 0.74 + edge * 0.30);
    } else {
      float broad = noise(vec2(uv.x * 9.0, uv.y * 2.1 + uTime * 0.65));
      float fine = noise(vec2(uv.x * 28.0 + 3.1, uv.y * 3.0 + uTime * 1.25));
      float band = smoothstep(0.58, 0.67, broad);
      float line = smoothstep(0.70, 0.77, fine);
      color = mix(uDeep, uLight, 0.28 + band * 0.22);
      color = mix(color, uFoam, line * 0.42);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createWaterfallGeometry(
  width = 4.25,
  height = 6.9,
  columns = 26,
  rows = 88,
) {
  const geometry = new THREE.PlaneGeometry(width, height, columns, rows);
  const position = geometry.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const vertical = y / height + 0.5;
    const normalizedX = x / width;
    const narrowed = THREE.MathUtils.lerp(1.08, 0.86, vertical);
    position.setX(i, normalizedX * width * narrowed);
    position.setZ(i, -0.08 + Math.pow(1 - vertical, 2) * 0.16);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

export function createWaterfallMaterial(phase = 0) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPhase: { value: phase },
      uDeep: { value: new THREE.Color("#176f9c") },
      uMid: { value: new THREE.Color("#31b9d2") },
      uLight: { value: new THREE.Color("#8ee9ed") },
      uFoam: { value: new THREE.Color("#f5fff1") },
    },
    vertexShader: waterfallVertexShader,
    fragmentShader: waterfallFragmentShader,
    side: THREE.DoubleSide,
  });
}

export function createSurfaceMaterial(pool: boolean) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(pool ? "#0b658b" : "#157ca3") },
      uLight: { value: new THREE.Color(pool ? "#49c9d4" : "#6bdce2") },
      uFoam: { value: new THREE.Color("#f4fff2") },
      uPool: { value: pool ? 1 : 0 },
    },
    vertexShader: surfaceVertexShader,
    fragmentShader: surfaceFragmentShader,
    side: THREE.DoubleSide,
  });
}

export function createRoundSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, 64, 64);
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(32, 32, 26, 0, Math.PI * 2);
  context.fill();
  return new THREE.CanvasTexture(canvas);
}
