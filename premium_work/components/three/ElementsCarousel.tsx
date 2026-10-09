"use client";

import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { useLang } from "@/components/i18n/lang";
import { CURTAINS_OPENING } from "@/components/motion/curtainSignal";

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
 * Caída con un solo rebote. Devuelve altura extra (en fracciones de media
 * pantalla): positivo arriba, un poco por debajo al aterrizar, y 0 al asentarse.
 * No es un muelle: termina y se queda quieto.
 */
function fallLift(age: number): number {
  const drop = 0.62;
  const dip = -0.05;
  const rebound = 0.028;
  if (age < 0) return drop;
  const fall = 0.36;
  const up = 0.13;
  const settle = 0.1;
  if (age < fall) {
    const e = 1 - Math.pow(1 - age / fall, 3);
    return drop + (dip - drop) * e;
  }
  if (age < fall + up) {
    const e = 1 - Math.pow(1 - (age - fall) / up, 2);
    return dip + (rebound - dip) * e;
  }
  if (age < fall + up + settle) {
    const e = 1 - Math.pow(1 - (age - fall - up) / settle, 2);
    return rebound * (1 - e);
  }
  return 0;
}

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
  // Ida con navegación cliente desde el manejador nativo: se pulsa un <a> oculto
  // cuyo onClick de React hace router.push (el push imperativo directo no funciona
  // fuera del ciclo de React). Así no hay flash de recarga y el objeto viaja de
  // forma continua desde su punto en el hero hasta la página de servicio.
  const navSlugRef = useRef<string | null>(null);
  const navAnchorRef = useRef<HTMLAnchorElement | null>(null);
  const goToService = (slug: string) => {
    navSlugRef.current = slug;
    navAnchorRef.current?.click();
  };
  const onNavAnchorClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const slug = navSlugRef.current;
    if (slug) router.push(`/servicios/${slug}`);
  };

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
      target -= dx * 0.013;
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
          // Guarda la posición del elemento en el hero para la transición continua.
          tmpV.setFromMatrixPosition(items[idx].matrixWorld).project(camera);
          const r = el.getBoundingClientRect();
          const slug = SLUGS[SECTORS[idx].di];
          try {
            sessionStorage.setItem(
              "pw-element-from",
              JSON.stringify({
                x: r.left + (tmpV.x * 0.5 + 0.5) * r.width,
                y: r.top + (-tmpV.y * 0.5 + 0.5) * r.height,
                slug,
              })
            );
          } catch {
            /* sin almacenamiento: la página entra desde abajo */
          }
          goToService(slug);
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
    const fallStart = items.map(() => -1);
    let curtainAt = -1;
    const onCurtains = () => {
      if (curtainAt < 0) curtainAt = elapsed;
    };
    window.addEventListener(CURTAINS_OPENING, onCurtains);
    const viewDir = new THREE.Vector3();
    const camRight = new THREE.Vector3();
    const camUp = new THREE.Vector3();
    const slotCenter = new THREE.Vector3();
    const tmpV = new THREE.Vector3();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;
      rotation += (target - rotation) * (1 - Math.exp(-dt * 18));
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
        wrap.position.addScaledVector(camUp, -halfH0 * 0.08 - reach * halfH * 0.30 + Math.sin(elapsed * 1.3 + i * 0.9) * 0.02 * (fallStart[i] < 0 || elapsed - fallStart[i] > 0.64 ? 1 : 0));

        // La caída de presentación empieza cuando las cortinas empiezan a abrirse.
        // Si un objeto entra después, cae en ese momento, no espera otro telón.
        if (ad > 2.2) fallStart[i] = -1;
        else if (inView && fallStart[i] < 0 && curtainAt >= 0) {
          const opening = elapsed - curtainAt < 0.08;
          const stagger = opening ? (reach + 1) * 0.028 : 0;
          fallStart[i] = (opening ? curtainAt : elapsed) + stagger;
        }
        const lift = fallLift(fallStart[i] < 0 ? -1 : elapsed - fallStart[i]);
        if (lift !== 0) wrap.position.addScaledVector(camUp, lift * halfH);

        // De frente a cámara. El principal no se inclina en reposo ni al pasar
        // el cursor: la inclinación solo ocurre después del click, en el detalle.
        wrap.rotation.order = "YXZ";
        wrap.rotation.y = isFront ? 0 : reach * 0.18;
        wrap.rotation.x = 0;
        wrap.rotation.z = isFront ? 0 : -reach * 0.08;
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
      window.removeEventListener(CURTAINS_OPENING, onCurtains);
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
      {/* Ancla oculta para la navegación cliente desde el manejador nativo del canvas */}
      <a
        ref={navAnchorRef}
        href="#"
        onClick={onNavAnchorClick}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
