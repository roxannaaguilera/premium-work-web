"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Dos argollas de boda en 3D real (Three.js).
 * Flotan suavemente y giran al pasar el cursor por encima.
 */
export default function Rings3D() {
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
    camera.position.set(0.3, 0.7, 2.6);
    camera.lookAt(0, 0.42, 0);

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

    // ---------- Argollas ----------
    const gold = new THREE.MeshStandardMaterial({
      color: 0xd8a93c, metalness: 1.0, roughness: 0.24, envMapIntensity: 1.15,
    });
    const rings = new THREE.Group();

    const band1 = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.075, 40, 96), gold);
    band1.position.set(-0.48, 0.44, 0.02);
    band1.rotation.set(0.05, -0.14, 0.04);
    band1.castShadow = band1.receiveShadow = true;
    rings.add(band1);

    const band2 = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.075, 40, 96), gold);
    band2.position.set(0.48, 0.42, -0.02);
    band2.rotation.set(-0.04, 0.16, -0.05);
    band2.castShadow = band2.receiveShadow = true;
    rings.add(band2);

    scene.add(rings);

    // Sombra de contacto
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3, 48),
      new THREE.ShadowMaterial({ opacity: 0.22 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.002;
    floor.receiveShadow = true;
    scene.add(floor);

    // ---------- Interacción: un giro 360° por hover, termina de cara ----------
    let spinT = -1; // -1 = quieto; >=0 = girando (0→1)
    const onEnter = () => { if (spinT < 0) spinT = 0; };
    const onLeave = () => { /* al salir ya está de cara; el próximo hover gira de nuevo */ };
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
    let elapsed = 0;
    const easeInOut = (k: number) =>
      k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;
      rings.position.y = Math.sin(elapsed * 1.4) * 0.03;
      if (spinT >= 0) {
        spinT += dt / 1.0; // un giro 360° en 1 segundo
        const k = Math.min(spinT, 1);
        rings.rotation.y = easeInOut(k) * Math.PI * 2;
        if (spinT >= 1) { spinT = -1; rings.rotation.y = 0; }
      }
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
