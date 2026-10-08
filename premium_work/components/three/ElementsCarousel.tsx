"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";

const SECTORS = [
  { name: "Hoteles", src: "/images/elementos-reales/hoteles.png" },
  { name: "Restaurantes", src: "/images/elementos-reales/restaurantes.png" },
  { name: "Catering", src: "/images/elementos-reales/catering.png" },
  { name: "Eventos corporativos", src: "/images/elementos-reales/corporativos.png" },
  { name: "Eventos deportivos", src: "/images/elementos-reales/deportivos.png" },
  { name: "Festivales", src: "/images/elementos-reales/festivales.png" },
  { name: "Bodas y celebraciones", src: "/images/elementos-reales/bodas.png" },
  { name: "Eventos privados", src: "/images/elementos-reales/privados.png" },
] as const;

const COUNT = SECTORS.length;
const STEP = (Math.PI * 2) / COUNT;
/** Casillas desde el centro hasta el borde, en un recorrido horizontal. */
const SPAN = 2.15;
const ITEM_SIZE = 1.05;

/**
 * Los 8 elementos reales recorren la pantalla de izquierda a derecha.
 * El del centro queda de frente y nítido; los laterales se alejan un poco
 * y se desenfocan con suavidad. Arrastra o desplaza para moverlos.
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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.domElement.style.cursor = "grab";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfdf3eb);

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    camera.position.set(0, 0, 7.2);
    camera.lookAt(0, 0, 0);

    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    composer.addPass(new RenderPass(scene, camera));
    const bokeh = new BokehPass(scene, camera, {
      focus: 6.2,
      aperture: 0.008,
      maxblur: 0.004,
    });
    composer.addPass(bokeh);
    const focusPoint = new THREE.Vector3();

    // ---------- Fotos reales en planos, en fila horizontal ----------
    const loader = new THREE.TextureLoader();
    const items: THREE.Group[] = [];
    SECTORS.forEach(({ src }) => {
      const wrap = new THREE.Group();
      const tex = loader.load(src, (t) => {
        const aspect = t.image.width / t.image.height;
        const w = aspect >= 1 ? ITEM_SIZE : ITEM_SIZE * aspect;
        const h = aspect >= 1 ? ITEM_SIZE / aspect : ITEM_SIZE;
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.02 })
        );
        wrap.add(mesh);
      });
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
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
      target -= Math.sign(wheelAcc) * STEP;
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
        const along = t / SPAN;
        const frontness = Math.max(0, 1 - ad / SPAN);
        const dist = Math.max(0.8, camera.position.z - (0.15 + frontness * 0.85));
        const halfH = Math.tan(vFov / 2) * dist;
        const halfW = halfH * Math.max(camera.aspect, 1);

        slotCenter.copy(camera.position).addScaledVector(viewDir, dist);
        wrap.position.copy(slotCenter);
        wrap.position.addScaledVector(camRight, along * halfW * 0.72);
        wrap.position.addScaledVector(camUp, -halfH * 0.1 + Math.sin(elapsed * 1.3 + i * 0.9) * 0.012);

        wrap.rotation.order = "YXZ";
        wrap.rotation.y = Math.max(-0.22, Math.min(0.22, along * 0.16));
        wrap.rotation.x = 0;
        wrap.rotation.z = 0;
        wrap.scale.setScalar(ad > SPAN + 0.65 ? 0.001 : 0.62 + frontness * frontness * 0.28);
        wrap.visible = ad < SPAN + 0.7;
      });
      const index = ((Math.round(rotation / STEP) % COUNT) + COUNT) % COUNT;
      if (index !== shown && captionRef.current) {
        shown = index;
        captionRef.current.textContent = SECTORS[index].name;
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
      bokeh.dispose();
      composer.dispose();
      renderer.dispose();
      mount.removeChild(el);
    };
  }, []);

  return (
    <div className="relative h-full min-h-full bg-[#fdf3eb] text-[#131834]">
      <div ref={mountRef} className="h-full w-full [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-8 text-center">
        <h1
          ref={captionRef}
          className="font-serif text-[clamp(2rem,5vw,3.8rem)] font-semibold tracking-wide text-[#c4501e]"
        >
          Hoteles
        </h1>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#131834]/60">
          Desplaza o arrastra
        </p>
      </div>
    </div>
  );
}
