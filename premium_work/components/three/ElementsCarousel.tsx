"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { useLang } from "@/components/i18n/lang";

const SECTORS = [
  { name: "Hoteles", src: "/images/elementos-reales/hoteles.png", di: 0 },
  { name: "Bodas y celebraciones", src: "/images/elementos-reales/bodas.png", di: 6 },
  { name: "Catering", src: "/images/elementos-reales/catering.png", di: 2 },
  { name: "Eventos corporativos", src: "/images/elementos-reales/corporativos.png", di: 3 },
  { name: "Restaurantes", src: "/images/elementos-reales/restaurantes.png", di: 1 },
  { name: "Eventos deportivos", src: "/images/elementos-reales/deportivos.png", di: 4 },
  { name: "Eventos privados", src: "/images/elementos-reales/privados.png", di: 7 },
  { name: "Festivales", src: "/images/elementos-reales/festivales.png", di: 5 },
] as const;

const COUNT = SECTORS.length;
const STEP = (Math.PI * 2) / COUNT;
const ITEM_SIZE = 1.45;

// Slugs de las páginas de detalle, en el orden del diccionario.
const SLUGS = ["hoteles", "restaurantes", "catering", "eventos-corporativos", "eventos-deportivos", "festivales", "bodas-y-celebraciones", "experiencias-privadas"];

/**
 * Los 8 elementos reales de Premium Work (fotografía) en diagonal de
 * esquina a esquina. El del centro sale de la pantalla y se queda nítido;
 * hacia las esquinas se inclinan, se alejan y se desenfocan (bokeh).
 * Arrastra o desplaza para girar 360° entre sectores.
 */
export default function ElementsCarousel() {
  const { t } = useLang();
  const router = useRouter();
  const mountRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

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
    const planeMeshes: THREE.Mesh[] = [];
    SECTORS.forEach(({ src }, idx) => {
      const wrap = new THREE.Group();
      const tex = loader.load(src, (t) => {
        const aspect = t.image.width / t.image.height;
        const w = aspect >= 1 ? ITEM_SIZE : ITEM_SIZE * aspect;
        const h = aspect >= 1 ? ITEM_SIZE / aspect : ITEM_SIZE;
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.02 })
        );
        mesh.userData.sectorIndex = idx;
        planeMeshes.push(mesh);
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

    // ---------- Hover en el objeto principal: avanza + etiqueta ----------
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2(-10, -10);
    let hovered = false;
    let hoverT = 0;
    let tagX = 0;
    let tagY = 0;
    let tagTX = 0;
    let tagTY = 0;
    let downX = 0;
    let downY = 0;

    const onDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
      dragging = true;
      lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointerNDC.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      tagTX = e.clientX - rect.left;
      tagTY = e.clientY - rect.top;
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      target -= dx * 0.0075;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.style.cursor = "grab";
      // Click (sin arrastre) sobre el objeto principal: abre su página de servicio.
      if (Math.hypot(e.clientX - downX, e.clientY - downY) < 6 && planeMeshes.length === COUNT) {
        const rect = el.getBoundingClientRect();
        pointerNDC.set(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(pointerNDC, camera);
        const hits = raycaster.intersectObjects(planeMeshes, false);
        const idx = ((Math.round(rotation / STEP) % COUNT) + COUNT) % COUNT;
        if (hits.length > 0 && hits[0].object.userData.sectorIndex === idx) {
          router.push(`/servicios/${SLUGS[SECTORS[idx].di]}`);
          return;
        }
      }
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

        // Solo 3 en pantalla: principal (t=0), uno que entra y otro que sale.
        const ad = Math.abs(t);
        const inView = ad < 1.6;
        const isFront = ad < 0.5;
        const reach = Math.max(-1, Math.min(1, t));
        // El principal avanza un poco hacia adelante al hover, como en Agrumea.
        const distF = camera.position.z - 2.15 - (isFront ? 0.4 * hoverT : 0);
        const dist = distF + ad * 1.0;
        const halfH = Math.tan(vFov / 2) * dist;
        const halfW = halfH * Math.max(camera.aspect, 1);
        const halfH0 = Math.tan(vFov / 2) * distF;

        slotCenter.copy(camera.position).addScaledVector(viewDir, dist);
        wrap.position.copy(slotCenter);
        wrap.position.addScaledVector(camRight, reach * halfW * 0.62);
        // Diagonal suave: entra por arriba-izquierda, sale por abajo-derecha.
        // Aire entre el logo y el objeto, y entre el objeto y el final del header.
        wrap.position.addScaledVector(camUp, -halfH0 * 0.08 - reach * halfH * 0.30 + Math.sin(elapsed * 1.3 + i * 0.9) * 0.02);

        // De frente a cámara, leve giro en los laterales.
        wrap.rotation.order = "YXZ";
        wrap.rotation.y = reach * 0.18;
        wrap.rotation.x = 0;
        wrap.rotation.z = -reach * 0.08;
        // El principal entra entero en pantalla; los laterales más pequeños.
        const fit = (halfH0 * 1.15) / ITEM_SIZE;
        const boost = isFront ? 1 + 0.14 * hoverT : 1;
        wrap.scale.setScalar(!inView ? 0.001 : isFront ? fit * boost : fit * 0.66);
        wrap.visible = inView;
      });
      const index = ((Math.round(rotation / STEP) % COUNT) + COUNT) % COUNT;

      // Hover solo sobre el objeto principal: avanza un poco hacia adelante.
      if (!dragging && planeMeshes.length === COUNT) {
        raycaster.setFromCamera(pointerNDC, camera);
        const hits = raycaster.intersectObjects(planeMeshes, false);
        hovered = hits.length > 0 && hits[0].object.userData.sectorIndex === index;
      } else {
        hovered = false;
      }
      hoverT += ((hovered ? 1 : 0) - hoverT) * (1 - Math.exp(-dt * 10));
      el.style.cursor = dragging ? "grabbing" : hovered ? "pointer" : "grab";

      // Etiqueta que sigue al cursor.
      tagX += (tagTX - tagX) * (1 - Math.exp(-dt * 14));
      tagY += (tagTY - tagY) * (1 - Math.exp(-dt * 14));
      if (tagRef.current) {
        tagRef.current.style.transform = `translate(${tagX + 20}px, ${tagY - 18}px)`;
        tagRef.current.style.opacity = hovered ? "1" : "0";
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
      {/* Etiqueta que aparece al posar el cursor sobre el objeto principal */}
      <div
        ref={tagRef}
        className="pointer-events-none absolute left-0 top-0 z-[3] opacity-0 transition-opacity duration-200"
        aria-hidden="true"
      >
        <span className="inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-[#131834] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f3ead6] shadow-lg">
          <span className="inline-block h-2 w-2 rotate-45 bg-[#d9a83f]" />
          {t("hero.discoverTag")}
        </span>
      </div>
    </div>
  );
}
