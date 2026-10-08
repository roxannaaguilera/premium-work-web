"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { SECTOR_ELEMENTS } from "./elementBuilders";

const COUNT = SECTOR_ELEMENTS.length;
const STEP = (Math.PI * 2) / COUNT;
/** Casillas desde el objeto nítido del centro hasta la esquina de la pantalla. */
const CORNER = 2.05;

/**
 * Los 8 elementos de Premium Work en una diagonal de esquina a esquina.
 * El del centro sale de la pantalla y se queda nítido; hacia las esquinas
 * se inclinan, se alejan y se desenfocan. Arrastra o desplaza para cambiar.
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
    renderer.setClearColor(0xfdf3eb, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.style.cursor = "grab";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfdf3eb);

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

    const camera = new THREE.PerspectiveCamera(38, 1, 0.08, 40);
    camera.position.set(0, 0.08, 5.2);
    camera.lookAt(0, 0.02, 0.5);

    // ---------- Luces ----------
    scene.add(new THREE.HemisphereLight(0xfff2e0, 0x2a1f16, 0.4));
    const key = new THREE.DirectionalLight(0xffe6c4, 1.15);
    key.position.set(3.5, 6.5, 4.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -8; key.shadow.camera.right = 8;
    key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
    key.shadow.bias = -0.0004;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9db8ff, 0.5);
    rim.position.set(-4, 2.5, 2);
    scene.add(rim);
    const front = new THREE.DirectionalLight(0xfff0dd, 0.55);
    front.position.set(0.5, 1.2, 5);
    scene.add(front);

    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    composer.addPass(new RenderPass(scene, camera));
    const bokeh = new BokehPass(scene, camera, {
      focus: 3.2,
      aperture: 0.07,
      maxblur: 0.038,
    });
    composer.addPass(bokeh);
    const focusPoint = new THREE.Vector3();

    // ---------- Elementos normalizados, luego en diagonal ----------
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
      composer.setSize(w, h);
    });
    ro.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    let elapsed = 0;
    let shown = -1;
    const viewDir = new THREE.Vector3();
    const camRight = new THREE.Vector3();
    const camUp = new THREE.Vector3();
    const slotCenter = new THREE.Vector3();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;
      rotation += (target - rotation) * (1 - Math.exp(-dt * 8));
      camera.updateMatrixWorld();
      camera.getWorldDirection(viewDir);
      camRight.setFromMatrixColumn(camera.matrixWorld, 0);
      camUp.setFromMatrixColumn(camera.matrixWorld, 1);
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      items.forEach((wrap, i) => {
        let t = i - rotation / STEP;
        t = ((t % COUNT) + COUNT) % COUNT;
        if (t > COUNT / 2) t -= COUNT;

        const ad = Math.abs(t);
        const along = t / CORNER;
        const reach = Math.max(-1, Math.min(1, along));
        const frontness = Math.max(0, 1 - ad / CORNER);
        const dist = Math.max(0.55, camera.position.z - (0.35 + frontness * 1.55));
        const halfH = Math.tan(vFov / 2) * dist;
        const halfW = halfH * Math.max(camera.aspect, 1);

        slotCenter.copy(camera.position).addScaledVector(viewDir, dist);
        wrap.position.copy(slotCenter);
        wrap.position.addScaledVector(camRight, reach * halfW * 0.86);
        wrap.position.addScaledVector(camUp, reach * halfH * 0.72 + Math.sin(elapsed * 1.3 + i * 0.9) * 0.02);

        wrap.rotation.order = "YXZ";
        wrap.rotation.y = reach * 0.78;
        wrap.rotation.x = -0.66;
        wrap.rotation.z = -reach * 0.32;
        wrap.scale.setScalar(ad > CORNER + 0.4 ? 0.001 : 0.55 + frontness * frontness * 0.38);
        wrap.visible = ad < CORNER + 0.45;
      });
      const index = ((Math.round(rotation / STEP) % COUNT) + COUNT) % COUNT;
      if (index !== shown && captionRef.current) {
        shown = index;
        captionRef.current.textContent = SECTOR_ELEMENTS[index].name;
      }
      items[index].updateMatrixWorld(true);
      items[index].getWorldPosition(focusPoint);
      focusPoint.applyMatrix4(camera.matrixWorldInverse);
      bokeh.uniforms.focus.value = -focusPoint.z;

      // El del frente no entra en el desenfoque: solo lo de detrás y los lados.
      const frontWasVisible = items[index].visible;
      items[index].visible = false;
      composer.render();
      items[index].visible = frontWasVisible;

      const background = scene.background;
      scene.background = null;
      const autoClear = renderer.autoClear;
      renderer.autoClear = false;
      renderer.setRenderTarget(null);
      renderer.clearDepth();
      const visibility = items.map((wrap) => wrap.visible);
      items.forEach((wrap, i) => { wrap.visible = i === index; });
      renderer.render(scene, camera);
      items.forEach((wrap, i) => { wrap.visible = visibility[i]; });
      scene.background = background;
      renderer.autoClear = autoClear;
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
      bokeh.dispose();
      composer.dispose();
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
