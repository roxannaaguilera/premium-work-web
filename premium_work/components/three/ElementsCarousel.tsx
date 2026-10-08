"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";

const SECTORS = [
  { name: "Hoteles", src: "/images/elementos-reales/hoteles.png" },
  { name: "Bodas y celebraciones", src: "/images/elementos-reales/bodas.png" },
  { name: "Catering", src: "/images/elementos-reales/catering.png" },
  { name: "Eventos corporativos", src: "/images/elementos-reales/corporativos.png" },
  { name: "Restaurantes", src: "/images/elementos-reales/restaurantes.png" },
  { name: "Eventos deportivos", src: "/images/elementos-reales/deportivos.png" },
  { name: "Eventos privados", src: "/images/elementos-reales/privados.png" },
  { name: "Festivales", src: "/images/elementos-reales/festivales.png" },
] as const;

const COUNT = SECTORS.length;
const STEP = (Math.PI * 2) / COUNT;
/** Casillas desde el objeto nítido del centro hasta la esquina de la pantalla. */
const CORNER = 2.05;
const ITEM_SIZE = 1.45;

/**
 * Los 8 elementos reales de Premium Work (fotografía) en diagonal de
 * esquina a esquina. El del centro sale de la pantalla y se queda nítido;
 * hacia las esquinas se inclinan, se alejan y se desenfocan (bokeh).
 * Arrastra o desplaza para girar 360° entre sectores.
 */
export default function ElementsCarousel() {
  const mountRef = useRef<HTMLDivElement>(null);

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

    const camera = new THREE.PerspectiveCamera(38, 1, 0.08, 40);
    camera.position.set(0, 0.08, 5.2);
    camera.lookAt(0, 0.02, 0.5);

    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    composer.addPass(new RenderPass(scene, camera));
    const bokeh = new BokehPass(scene, camera, {
      focus: 2.6,
      aperture: 0.01,
      maxblur: 0.007,
    });
    composer.addPass(bokeh);
    const focusPoint = new THREE.Vector3();

    // ---------- Fotos reales en planos, en diagonal ----------
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
        const dist = Math.max(0.55, camera.position.z - (1.45 + frontness * 0.7));
        const halfH = Math.tan(vFov / 2) * dist;
        const halfW = halfH * Math.max(camera.aspect, 1);

        slotCenter.copy(camera.position).addScaledVector(viewDir, dist);
        wrap.position.copy(slotCenter);
        wrap.position.addScaledVector(camRight, reach * halfW * 0.9);
        // Diagonal suavizada: entra por arriba-izquierda, sale por abajo-derecha.
        wrap.position.addScaledVector(camUp, -reach * halfH * 0.45 - 0.25 + Math.sin(elapsed * 1.3 + i * 0.9) * 0.02);

        // Las fotos miran a cámara; leve giro en los laterales.
        wrap.rotation.order = "YXZ";
        wrap.rotation.y = reach * 0.5;
        wrap.rotation.x = reach * 0.12;
        wrap.rotation.z = -reach * 0.22;
        wrap.scale.setScalar(ad > CORNER + 0.4 ? 0.001 : 1.05 + frontness * 0.45);
        wrap.visible = ad < CORNER + 0.45;
      });
      const index = ((Math.round(rotation / STEP) % COUNT) + COUNT) % COUNT;
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
    </div>
  );
}
