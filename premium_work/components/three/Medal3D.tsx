"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Medalla de oro con cinta en 3D real (Three.js).
 * Flota suavemente y gira al pasar el cursor por encima.
 */
export default function Medal3D() {
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
    camera.position.set(0.15, 0.58, 2.0);
    camera.lookAt(0, 0.45, 0);

    // ---------- Luces ----------
    scene.add(new THREE.HemisphereLight(0xfff2e0, 0x2a1f16, 0.4));
    const key = new THREE.DirectionalLight(0xffe6c4, 1.05);
    key.position.set(3, 5, 2.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -2; key.shadow.camera.right = 2;
    key.shadow.camera.top = 2; key.shadow.camera.bottom = -2;
    key.shadow.bias = -0.0004;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9db8ff, 0.45);
    rim.position.set(-3, 2.5, -2.5);
    scene.add(rim);
    const front = new THREE.DirectionalLight(0xfff0dd, 0.7);
    front.position.set(0.5, 1.2, 4);
    scene.add(front);

    // ---------- Materiales ----------
    const gold = new THREE.MeshStandardMaterial({
      color: 0xd8a93c, metalness: 1.0, roughness: 0.26, envMapIntensity: 1.15,
    });
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0x1c2333, roughness: 0.75, metalness: 0.05,
      side: THREE.DoubleSide, envMapIntensity: 0.4,
    });

    const medal = new THREE.Group();

    // Disco de la medalla
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.045, 64), gold);
    disc.rotation.x = Math.PI / 2;
    disc.position.y = 0.32;
    disc.castShadow = disc.receiveShadow = true;
    medal.add(disc);

    // Borde del disco
    const edge = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.018, 16, 64), gold);
    edge.position.y = 0.32;
    edge.castShadow = true;
    medal.add(edge);

    // Anilla superior
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 12, 32), gold);
    loop.position.y = 0.685;
    loop.castShadow = true;
    medal.add(loop);

    // Cinta ondulada (plano deformado con senos)
    const ribbonGeo = new THREE.PlaneGeometry(0.17, 0.62, 1, 32);
    const pos = ribbonGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const k = (y + 0.31) / 0.62; // 0 abajo → 1 arriba
      pos.setX(i, pos.getX(i) + Math.sin(k * Math.PI * 2.2) * 0.09);
      pos.setZ(i, Math.sin(k * Math.PI * 1.4 + 0.6) * 0.07);
    }
    ribbonGeo.computeVertexNormals();
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.y = 1.0;
    ribbon.castShadow = true;
    medal.add(ribbon);

    medal.scale.setScalar(1.05);
    scene.add(medal);

    // ---------- Interacción: girar al hover ----------
    let hovering = false;
    let spinSpeed = 0;
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
      medal.position.y = Math.sin(t * 1.4) * 0.03;
      const target = hovering ? 2.2 : 0;
      spinSpeed += (target - spinSpeed) * 0.06;
      medal.rotation.y += spinSpeed * 0.016;
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
