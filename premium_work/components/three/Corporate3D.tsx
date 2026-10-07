"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Micrófono de conferencia en 3D real (Three.js).
 * Misma luz, cámara, flotación y giro que la campana y el cloche.
 * Oro con base y rejilla oscuras, al mismo tamaño en pantalla.
 */
export default function Corporate3D() {
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

    // ---------- Materiales (mismos valores que la campana) ----------
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

    const mic = new THREE.Group();

    // Base redonda, oscura, con filete de oro
    const base = shadowed(new THREE.Mesh(
      new THREE.CylinderGeometry(0.40, 0.43, 0.08, 64),
      blackBase
    ));
    base.position.y = 0.04;
    mic.add(base);
    const baseTop = shadowed(new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.012, 64),
      goldMat()
    ));
    baseTop.position.y = 0.082;
    mic.add(baseTop);
    const baseRim = shadowed(new THREE.Mesh(
      new THREE.TorusGeometry(0.415, 0.013, 12, 64),
      goldMat()
    ));
    baseRim.rotation.x = Math.PI / 2;
    baseRim.position.y = 0.07;
    mic.add(baseRim);

    // Pie corto
    const stem = shadowed(new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.042, 0.18, 32),
      goldMat()
    ));
    stem.position.y = 0.175;
    mic.add(stem);
    const joint = shadowed(new THREE.Mesh(
      new THREE.SphereGeometry(0.048, 28, 20),
      goldMat()
    ));
    joint.position.y = 0.275;
    mic.add(joint);

    // Cápsula inclinada hacia el frente, rejilla oscura
    const head = new THREE.Group();
    const body = shadowed(new THREE.Mesh(
      new THREE.CylinderGeometry(0.105, 0.105, 0.42, 40),
      goldMat()
    ));
    body.rotation.z = Math.PI / 2;
    head.add(body);
    const capL = shadowed(new THREE.Mesh(
      new THREE.SphereGeometry(0.105, 28, 20),
      goldMat()
    ));
    capL.position.x = -0.21;
    head.add(capL);
    const capR = shadowed(new THREE.Mesh(
      new THREE.SphereGeometry(0.105, 28, 20),
      goldMat()
    ));
    capR.position.x = 0.21;
    head.add(capR);

    const grille = shadowed(new THREE.Mesh(
      new THREE.CylinderGeometry(0.112, 0.112, 0.16, 40),
      blackBase
    ));
    grille.rotation.z = Math.PI / 2;
    grille.position.x = 0.06;
    head.add(grille);
    for (const x of [-0.02, 0.06, 0.14]) {
      const ring = shadowed(new THREE.Mesh(
        new THREE.TorusGeometry(0.114, 0.006, 8, 32),
        goldMat()
      ));
      ring.rotation.y = Math.PI / 2;
      ring.position.x = x;
      head.add(ring);
    }

    head.position.set(0.06, 0.40, 0.02);
    head.rotation.z = 0.42;
    head.rotation.y = -0.35;
    mic.add(head);

    scene.add(mic);

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
      // Flotación suave
      mic.position.y = Math.sin(elapsed * 1.4) * 0.035;
      if (spinT >= 0) {
        spinT += dt / 1.0; // un giro 360° en 1 segundo
        const k = Math.min(spinT, 1);
        const e = easeInOut(k);
        mic.rotation.y = e * Math.PI * 2;
        mic.rotation.z =
          Math.sin(k * Math.PI * 6) * 0.09 * Math.sin(k * Math.PI) +
          Math.sin(elapsed * 0.9) * 0.02;
        if (spinT >= 1) { spinT = -1; mic.rotation.y = 0; }
      } else {
        mic.rotation.z = Math.sin(elapsed * 0.9) * 0.02;
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
      envTex.dispose();
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
