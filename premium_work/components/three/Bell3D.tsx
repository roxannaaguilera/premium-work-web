"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Campana de conserjería en 3D real (Three.js).
 * Flota suavemente y gira al pasar el cursor por encima.
 */
export default function Bell3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 384;
    const H = mount.clientHeight || 384;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Entorno para reflejos metálicos
    const envC = document.createElement("canvas");
    envC.width = 64; envC.height = 64;
    const ex = envC.getContext("2d")!;
    const grd = ex.createLinearGradient(0, 0, 0, 64);
    grd.addColorStop(0, "#fff6e0"); grd.addColorStop(0.45, "#8a7a5a");
    grd.addColorStop(0.55, "#2a241c"); grd.addColorStop(1, "#0c0a08");
    ex.fillStyle = grd; ex.fillRect(0, 0, 64, 64);
    const envTex = new THREE.CanvasTexture(envC);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 60);
    camera.position.set(1.7, 1.25, 2.1);
    camera.lookAt(0, 0.32, 0);

    // ---------- Luces ----------
    scene.add(new THREE.HemisphereLight(0xfff2e0, 0x2a1f16, 0.35));
    const key = new THREE.DirectionalLight(0xffe6c4, 1.1);
    key.position.set(3, 5, 2.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -2; key.shadow.camera.right = 2;
    key.shadow.camera.top = 2; key.shadow.camera.bottom = -2;
    key.shadow.bias = -0.0004;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9db8ff, 0.5);
    rim.position.set(-3, 2.5, -2.5);
    scene.add(rim);
    const warm = new THREE.PointLight(0xffc978, 0.5, 8);
    warm.position.set(-1.5, 1.2, 1.8);
    scene.add(warm);

    // ---------- Materiales ----------
    const goldMat = (extra = {}) => new THREE.MeshStandardMaterial({
      color: 0xd8a93c, metalness: 1.0, roughness: 0.28,
      envMapIntensity: 1.1, ...extra,
    });
    const blackBase = new THREE.MeshStandardMaterial({
      color: 0x17171a, metalness: 0.35, roughness: 0.45, envMapIntensity: 0.5,
    });
    const shadowed = <T extends THREE.Mesh>(m: T): T => {
      m.castShadow = true; m.receiveShadow = true; return m;
    };

    const bell = new THREE.Group();

    // Cúpula (torno)
    const profile = [
      [0.500, 0.115], [0.508, 0.150], [0.498, 0.200], [0.470, 0.270],
      [0.425, 0.340], [0.365, 0.405], [0.295, 0.455], [0.215, 0.495],
      [0.135, 0.520], [0.075, 0.535], [0.058, 0.548],
    ].map((p) => new THREE.Vector2(p[0], p[1]));
    bell.add(shadowed(new THREE.Mesh(
      new THREE.LatheGeometry(profile, 72),
      goldMat({ side: THREE.DoubleSide })
    )));

    // Borde inferior
    const lip = shadowed(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.018, 16, 72), goldMat()));
    lip.rotation.x = Math.PI / 2; lip.position.y = 0.115;
    bell.add(lip);

    // Base negra
    const base = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.575, 0.11, 72), blackBase));
    base.position.y = 0.055;
    bell.add(base);
    const baseTrim = shadowed(new THREE.Mesh(new THREE.TorusGeometry(0.562, 0.012, 12, 72), goldMat()));
    baseTrim.rotation.x = Math.PI / 2; baseTrim.position.y = 0.105;
    bell.add(baseTrim);

    // Botón superior
    const stem = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.05, 32), goldMat()));
    stem.position.y = 0.565;
    bell.add(stem);
    const knob = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.048, 32, 24), goldMat()));
    knob.position.y = 0.605; knob.scale.y = 0.85;
    bell.add(knob);

    scene.add(bell);

    // Sombra de contacto
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3, 48),
      new THREE.ShadowMaterial({ opacity: 0.22 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.002;
    floor.receiveShadow = true;
    scene.add(floor);

    // ---------- Interacción: repique al hover ----------
    let hovering = false;
    let spinSpeed = 0;
    let rockAmp = 0;
    const onEnter = () => { hovering = true; };
    const onLeave = () => { hovering = false; };
    mount.addEventListener("pointerenter", onEnter);
    mount.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      // Flotación suave
      bell.position.y = Math.sin(t * 1.4) * 0.035;
      // Giro al hover, con arranque/parada suaves
      const target = hovering ? 2.2 : 0;
      spinSpeed += (target - spinSpeed) * 0.06;
      bell.rotation.y += spinSpeed * 0.016;
      // Repique visible (la campana es simétrica y el giro solo no se nota)
      rockAmp += ((hovering ? 0.09 : 0) - rockAmp) * 0.06;
      bell.rotation.z = Math.sin(t * 9) * rockAmp + Math.sin(t * 0.9) * 0.02;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener("pointerenter", onEnter);
      mount.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[];
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="h-64 w-64 cursor-pointer md:h-96 md:w-96 [&_canvas]:block"
      aria-hidden="true"
    />
  );
}
