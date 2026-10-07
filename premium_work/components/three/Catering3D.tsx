"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Bandeja de catering con copas de champán, en 3D real (Three.js).
 * Misma luz, cámara, flotación y giro que la campana y el cloche.
 * Oro y base oscura, con el mismo peso en pantalla.
 */
export default function Catering3D() {
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

    const catering = new THREE.Group();

    // Bandeja oval: base oscura y tapa de oro, mismo ancho que la campana
    const trayBase = shadowed(new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.48, 0.055, 64),
      blackBase
    ));
    trayBase.scale.set(1.2, 1, 0.78);
    trayBase.position.y = 0.028;
    catering.add(trayBase);

    const trayTop = shadowed(new THREE.Mesh(
      new THREE.CylinderGeometry(0.435, 0.435, 0.012, 64),
      goldMat()
    ));
    trayTop.scale.set(1.2, 1, 0.78);
    trayTop.position.y = 0.056;
    catering.add(trayTop);

    const trayRim = shadowed(new THREE.Mesh(
      new THREE.TorusGeometry(0.455, 0.012, 12, 64),
      goldMat()
    ));
    trayRim.rotation.x = Math.PI / 2;
    trayRim.scale.set(1.2, 0.78, 1);
    trayRim.position.y = 0.052;
    catering.add(trayRim);

    // Copa de champán: pie, tallo fino y cáliz alto
    const fluteProfile = [
      [0.100, 0.000], [0.106, 0.016], [0.042, 0.032],
      [0.020, 0.052], [0.018, 0.155], [0.026, 0.185],
      [0.052, 0.240], [0.080, 0.320], [0.088, 0.400],
      [0.076, 0.465], [0.064, 0.510],
    ].map((p) => new THREE.Vector2(p[0], p[1]));
    const fluteGeo = new THREE.LatheGeometry(fluteProfile, 40);

    const addFlute = (x: number, z: number) => {
      const flute = new THREE.Group();
      flute.add(shadowed(new THREE.Mesh(
        fluteGeo,
        goldMat({ side: THREE.DoubleSide })
      )));

      const foot = shadowed(new THREE.Mesh(
        new THREE.TorusGeometry(0.096, 0.008, 10, 32),
        blackBase
      ));
      foot.rotation.x = Math.PI / 2;
      foot.position.y = 0.010;
      flute.add(foot);

      const lip = shadowed(new THREE.Mesh(
        new THREE.TorusGeometry(0.064, 0.007, 8, 32),
        goldMat()
      ));
      lip.rotation.x = Math.PI / 2;
      lip.position.y = 0.508;
      flute.add(lip);

      flute.position.set(x, 0.064, z);
      catering.add(flute);
    };

    addFlute(-0.30, 0.04);
    addFlute(0, -0.06);
    addFlute(0.30, 0.05);

    scene.add(catering);

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
      catering.position.y = Math.sin(elapsed * 1.4) * 0.035;
      if (spinT >= 0) {
        spinT += dt / 1.0; // un giro 360° en 1 segundo
        const k = Math.min(spinT, 1);
        const e = easeInOut(k);
        catering.rotation.y = e * Math.PI * 2;
        catering.rotation.z =
          Math.sin(k * Math.PI * 6) * 0.09 * Math.sin(k * Math.PI) +
          Math.sin(elapsed * 0.9) * 0.02;
        if (spinT >= 1) { spinT = -1; catering.rotation.y = 0; }
      } else {
        catering.rotation.z = Math.sin(elapsed * 0.9) * 0.02;
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
