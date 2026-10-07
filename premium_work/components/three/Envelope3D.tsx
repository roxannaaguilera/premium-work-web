"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Sobre lacrado en 3D real (Three.js).
 * Flota suavemente y gira al pasar el cursor por encima.
 */
export default function Envelope3D() {
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

    // Entorno para reflejos
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
    camera.position.set(0.25, 0.62, 1.9);
    camera.lookAt(0, 0.35, 0);

    // ---------- Luces ----------
    scene.add(new THREE.HemisphereLight(0xfff2e0, 0x2a1f16, 0.45));
    const key = new THREE.DirectionalLight(0xffe6c4, 1.0);
    key.position.set(3, 5, 2.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -2; key.shadow.camera.right = 2;
    key.shadow.camera.top = 2; key.shadow.camera.bottom = -2;
    key.shadow.bias = -0.0004;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9db8ff, 0.4);
    rim.position.set(-3, 2.5, -2.5);
    scene.add(rim);

    // ---------- Sobre ----------
    const paper = new THREE.MeshStandardMaterial({
      color: 0xf3ead6, roughness: 0.85, metalness: 0.0, envMapIntensity: 0.35,
    });
    const paperDark = new THREE.MeshStandardMaterial({
      color: 0xe2d5b8, roughness: 0.9, metalness: 0.0, envMapIntensity: 0.3,
    });
    const wax = new THREE.MeshStandardMaterial({
      color: 0x9e1f1f, roughness: 0.42, metalness: 0.15, envMapIntensity: 0.8,
    });

    const env3d = new THREE.Group();

    // Cuerpo del sobre
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.62, 0.05), paper);
    body.position.y = 0.35;
    body.castShadow = body.receiveShadow = true;
    env3d.add(body);

    // Solapa trasera (triángulo sutil)
    const flapShape = new THREE.Shape();
    flapShape.moveTo(-0.475, 0.31);
    flapShape.lineTo(0.475, 0.31);
    flapShape.lineTo(0, -0.05);
    flapShape.closePath();
    const flap = new THREE.Mesh(
      new THREE.ExtrudeGeometry(flapShape, { depth: 0.012, bevelEnabled: false }),
      paperDark
    );
    flap.position.set(0, 0.35, 0.026);
    flap.castShadow = true;
    env3d.add(flap);

    // Sello de lacre (borde irregular)
    const sealPts: THREE.Vector2[] = [];
    const sealR = 0.115;
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const wobble = 1 + 0.06 * Math.sin(a * 5 + 1.2) + 0.04 * Math.sin(a * 9);
      sealPts.push(new THREE.Vector2(Math.cos(a) * sealR * wobble, Math.sin(a) * sealR * wobble));
    }
    const sealShape = new THREE.Shape(sealPts);
    const seal = new THREE.Mesh(
      new THREE.ExtrudeGeometry(sealShape, {
        depth: 0.022, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2,
      }),
      wax
    );
    seal.rotation.x = 0;
    seal.position.set(0, 0.33, 0.032);
    seal.castShadow = seal.receiveShadow = true;
    env3d.add(seal);

    // Relieve central del sello
    const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.012, 32), wax);
    emblem.rotation.x = Math.PI / 2;
    emblem.position.set(0, 0.33, 0.058);
    emblem.castShadow = true;
    env3d.add(emblem);

    // Ligera inclinación elegante
    env3d.rotation.x = -0.12;
    env3d.rotation.z = 0.04;
    env3d.scale.setScalar(1.32);
    scene.add(env3d);

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
      env3d.position.y = Math.sin(elapsed * 1.4) * 0.03;
      if (spinT >= 0) {
        spinT += dt / 1.0; // un giro 360° en 1 segundo
        const k = Math.min(spinT, 1);
        env3d.rotation.y = easeInOut(k) * Math.PI * 2;
        if (spinT >= 1) { spinT = -1; env3d.rotation.y = 0; }
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
