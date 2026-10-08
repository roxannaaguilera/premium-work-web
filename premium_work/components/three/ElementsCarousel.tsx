"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SECTOR_ELEMENTS } from "./elementBuilders";

const COUNT = SECTOR_ELEMENTS.length;
const STEP = (Math.PI * 2) / COUNT;
const RADIUS_X = 2.85;
const RADIUS_Z = 1.55;

function wrapAngle(angle: number) {
  let v = angle % (Math.PI * 2);
  if (v > Math.PI) v -= Math.PI * 2;
  if (v < -Math.PI) v += Math.PI * 2;
  return v;
}

/**
 * Carrusel 3D de los 8 elementos de Premium Work.
 * Arrastra o desplaza para girar; encaja en el sector más cercano.
 * Misma luz y materiales que los elementos del hero.
 */
export default function ElementsCarousel() {
  const mountRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth || 800, mount.clientHeight || 600);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.style.cursor = "grab";
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

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
    camera.position.set(0, 1.15, 6.6);
    camera.lookAt(0, 0.85, 0);

    // ---------- Luces ----------
    scene.add(new THREE.HemisphereLight(0xfff2e0, 0x2a1f16, 0.4));
    const key = new THREE.DirectionalLight(0xffe6c4, 1.15);
    key.position.set(3.5, 6.5, 4.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -4; key.shadow.camera.right = 4;
    key.shadow.camera.top = 4; key.shadow.camera.bottom = -4;
    key.shadow.bias = -0.0004;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9db8ff, 0.5);
    rim.position.set(-4, 2.5, 2);
    scene.add(rim);
    const front = new THREE.DirectionalLight(0xfff0dd, 0.55);
    front.position.set(0.5, 1.2, 5);
    scene.add(front);

    // ---------- Elementos normalizados en círculo ----------
    const items: THREE.Group[] = [];
    SECTOR_ELEMENTS.forEach(({ build }) => {
      const g = build();
      const box = new THREE.Box3().setFromObject(g);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const s = 1.05 / Math.max(size.x, size.y, size.z);
      g.scale.setScalar(s);
      g.position.sub(center.multiplyScalar(s));
      const wrap = new THREE.Group();
      wrap.add(g);
      scene.add(wrap);
      items.push(wrap);
    });

    // ---------- Interacción: arrastrar / desplazar, con encaje ----------
    let target = 0;
    let rotation = 0;
    let dragging = false;
    let lastX = 0;
    let wheelAcc = 0;
    const el = renderer.domElement;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      target -= dx * 0.0075;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      el.style.cursor = "grab";
      target = Math.round(target / STEP) * STEP;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAcc += e.deltaY;
      if (Math.abs(wheelAcc) < 36) return;
      target += Math.sign(wheelAcc) * STEP;
      target = Math.round(target / STEP) * STEP;
      wheelAcc = 0;
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });

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
    let shown = -1;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;
      rotation += (target - rotation) * (1 - Math.exp(-dt * 8));
      items.forEach((wrap, i) => {
        const angle = wrapAngle(i * STEP - rotation);
        const away = Math.abs(angle);
        const frontness = Math.max(0, Math.cos(angle));
        wrap.position.set(
          Math.sin(angle) * RADIUS_X,
          0.55 + Math.sin(elapsed * 1.4 + i * 1.3) * 0.03,
          Math.cos(angle) * RADIUS_Z
        );
        wrap.rotation.y = angle;
        wrap.scale.setScalar(away > 2.35 ? 0.001 : 0.8 + frontness * 0.5);
        wrap.visible = away < 2.4;
      });
      const index = ((Math.round(rotation / STEP) % COUNT) + COUNT) % COUNT;
      if (index !== shown && captionRef.current) {
        shown = index;
        captionRef.current.textContent = SECTOR_ELEMENTS[index].name;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("wheel", onWheel);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[];
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      envTex.dispose();
      renderer.dispose();
      mount.removeChild(el);
    };
  }, []);

  return (
    <div className="relative flex h-full min-h-full flex-col bg-[#fdf3eb] text-[#131834]">
      <div ref={mountRef} className="w-full flex-1 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full" />
      <div className="pointer-events-none pb-10 text-center">
        <h1
          ref={captionRef}
          className="font-serif text-[clamp(2.4rem,6vw,4.5rem)] font-semibold tracking-wide text-[#c4501e]"
        >
          Hoteles
        </h1>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#131834]/60">
          Desplaza o arrastra
        </p>
      </div>
    </div>
  );
}
