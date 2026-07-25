"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type ThreeCanvasProps = { className?: string; onReady?: (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => (() => void) | void };

/** Shared lifecycle for future experiments: responsive sizing, animation, and disposal. */
export function ThreeCanvas({ className, onReady }: ThreeCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = hostRef.current; if (!host) return;
    const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100); camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); host.appendChild(renderer.domElement);
    const resize = () => { const { width, height } = host.getBoundingClientRect(); renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(host); resize(); const dispose = onReady?.(scene, camera, renderer); let frame = 0;
    const animate = () => { frame = requestAnimationFrame(animate); renderer.render(scene, camera); }; animate();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); dispose?.(); renderer.dispose(); renderer.domElement.remove(); scene.traverse((object) => { const mesh = object as THREE.Mesh; mesh.geometry?.dispose(); const material = mesh.material; if (Array.isArray(material)) material.forEach((item) => item.dispose()); else material?.dispose(); }); };
  }, [onReady]);
  return <div ref={hostRef} className={className} aria-label="Three.js interactive scene" />;
}
