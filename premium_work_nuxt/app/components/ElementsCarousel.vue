<!-- Migración de components/three/ElementsCarousel.tsx (Next.js/React).
Carrusel 360° con Three.js: 7 objetos (PNG con transparencias) distribuidos
en círculo. Solo 3 visibles: principal al frente, uno entrando, uno saliendo.
Arrastrar / rueda del ratón para rotar, hover inclina el frontal -22°,
clic en el frontal emite `pw-open-service` con los datos del vuelo.
Todo el código Three.js vive en onMounted (solo cliente); usar dentro de
<ClientOnly>. Sin framer-motion: el render loop es rAF nativo. -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";

const { t } = useLang();

const SECTORS = [
  { name: "Hoteles", src: "/images/elementos-reales/hoteles.png", di: 0 },
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
const SLUGS = [
  "hoteles",
  "restaurantes",
  "catering",
  "eventos-corporativos",
  "eventos-deportivos",
  "festivales",
  "bodas-y-celebraciones",
  "experiencias-privadas",
] as const;

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

interface ThreeState {
  camera: THREE.PerspectiveCamera;
  items: THREE.Group[];
  planeMeshes: THREE.Mesh[];
  raycaster: THREE.Raycaster;
  el: HTMLCanvasElement;
}

const mountRef = ref<HTMLDivElement | null>(null);
const tagRef = ref<HTMLDivElement | null>(null);

// Estado mutable compartido entre el loop y los manejadores (equivale a los useRef).
let three: ThreeState | null = null;
const front = { idx: 0, hoverT: 0 };
let hiddenIdx = -1;

// Recursos para limpiar en onUnmounted.
let raf = 0;
let ro: ResizeObserver | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let composer: EffectComposer | null = null;
let bokeh: BokehPass | null = null;
let scene: THREE.Scene | null = null;
let canvasEl: HTMLCanvasElement | null = null;
let mountEl: HTMLDivElement | null = null;
const listeners: Array<[EventTarget, string, EventListener, AddEventListenerOptions | undefined]> = [];

function addListener(
  target: EventTarget,
  type: string,
  handler: EventListener,
  options?: AddEventListenerOptions,
): void {
  target.addEventListener(type, handler, options);
  listeners.push([target, type, handler, options]);
}

onMounted(() => {
  const mount = mountRef.value;
  if (!mount) return;
  mountEl = mount;

  // ---------- Clic nativo: emite pw-open-service si dio en el frontal ----------
  // Se usa manejador NATIVO (no @click de Vue) para distinguir arrastre de clic
  // por distancia del puntero antes de lanzar el raycast.
  let down: { x: number; y: number } | null = null;
  const onPointerDown = (e: PointerEvent) => {
    down = { x: e.clientX, y: e.clientY };
  };
  const onClick = (e: MouseEvent) => {
    const d = down;
    down = null;
    if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) >= 6) return; // arrastre
    if (!three || three.planeMeshes.length !== COUNT) return;
    const { camera, items, planeMeshes, raycaster, el } = three;
    const r = el.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      -((e.clientY - r.top) / r.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(planeMeshes, false);
    const idx = front.idx;
    const hit = hits[0];
    if (!hit || (hit.object.userData.sectorIndex as number) !== idx) return;
    const sector = SECTORS[idx];
    if (!sector) return;
    const slug = SLUGS[sector.di];
    if (!slug) return;
    // Rect en pantalla del objeto frontal para el clon volador.
    const wp = new THREE.Vector3();
    const obj = items[idx];
    if (!obj) return;
    obj.getWorldPosition(wp);
    const pv = wp.clone().project(camera);
    const cx = r.left + (pv.x * 0.5 + 0.5) * r.width;
    const cy = r.top + (-pv.y * 0.5 + 0.5) * r.height;
    const dist = camera.position.distanceTo(wp);
    const worldH = ITEM_SIZE * obj.scale.x;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const screenH = (worldH / (2 * dist * Math.tan(vFov / 2))) * r.height;
    // El overlay SPA de la home escucha este evento y renderiza el detalle
    // sin recarga (el objeto nunca desaparece).
    const flight = {
      src: sector.src,
      slug,
      fromY: cy - screenH / 2,
      fromH: screenH,
      rotate: -22 * front.hoverT,
    };
    window.dispatchEvent(new CustomEvent("pw-open-service", { detail: flight }));
  };
  addListener(mount, "pointerdown", onPointerDown as EventListener);
  addListener(mount, "click", onClick as EventListener);

  // ---------- Escena ----------
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(mount.clientWidth || 800, mount.clientHeight || 600);
  renderer.setClearColor(0xfdf3eb, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.domElement.style.cursor = "grab";
  mount.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfdf3eb);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.08, 40);
  camera.position.set(0, 0.08, 5.2);
  camera.lookAt(0, 0.02, 0.5);

  composer = new EffectComposer(renderer);
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  composer.addPass(new RenderPass(scene, camera));
  bokeh = new BokehPass(scene, camera, {
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
        new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.02 }),
      );
      mesh.userData.sectorIndex = idx;
      planeMeshes.push(mesh);
      wrap.add(mesh);
    });
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    scene!.add(wrap);
    items.push(wrap);
  });

  // ---------- Interacción: arrastrar / desplazar, con encaje ----------
  let target = 0;
  let rotation = 0;
  let dragging = false;
  let lastX = 0;
  let wheelAcc = 0;
  const el = renderer.domElement;
  canvasEl = el;

  // ---------- Hover en el objeto principal: avanza + etiqueta ----------
  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2(-10, -10);
  let hovered = false;
  let hoverT = 0;
  let tagX = 0;
  let tagY = 0;
  let tagTX = 0;
  let tagTY = 0;

  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  };
  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    pointerNDC.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    tagTX = e.clientX - rect.left;
    tagTY = e.clientY - rect.top;
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    target -= dx * 0.013;
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    el.style.cursor = "grab";
    // Encaja el carrusel tras un arrastre.
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
  addListener(el, "pointerdown", onDown as EventListener);
  addListener(el, "pointermove", onMove as EventListener);
  addListener(window, "pointerup", onUp as EventListener);
  addListener(el, "wheel", onWheel as EventListener, { passive: false });
  // Objetos para el raycast del manejador de clic.
  three = { camera, items, planeMeshes, raycaster, el };

  ro = new ResizeObserver(() => {
    const w = mount.clientWidth || 1;
    const h = mount.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer!.setSize(w, h);
    composer!.setSize(w, h);
  });
  ro.observe(mount);

  const clock = new THREE.Clock();
  let elapsed = 0;
  const fallStart = items.map(() => -1);
  // Sin cortina: la caída de presentación empieza al montar.
  const curtainAt = 0;
  const viewDir = new THREE.Vector3();
  const camRight = new THREE.Vector3();
  const camUp = new THREE.Vector3();
  const slotCenter = new THREE.Vector3();
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
      const fsBefore = fallStart[i] ?? -1;
      wrap.position.addScaledVector(
        camUp,
        -halfH0 * 0.08 -
          reach * halfH * 0.3 +
          Math.sin(elapsed * 1.3 + i * 0.9) * 0.02 * (fsBefore < 0 || elapsed - fsBefore > 0.64 ? 1 : 0),
      );

      // La caída de presentación empieza al montar.
      // Si un objeto entra después, cae en ese momento.
      if (ad > 2.2) fallStart[i] = -1;
      else if (inView && fsBefore < 0 && curtainAt >= 0) {
        const opening = elapsed - curtainAt < 0.08;
        const stagger = opening ? (reach + 1) * 0.028 : 0;
        fallStart[i] = (opening ? curtainAt : elapsed) + stagger;
      }
      const fsAfter = fallStart[i] ?? -1;
      const lift = fallLift(fsAfter < 0 ? -1 : elapsed - fsAfter);
      if (lift !== 0) wrap.position.addScaledVector(camUp, lift * halfH);

      // De frente a cámara. El principal no se inclina en reposo ni al pasar
      // el cursor: la inclinación solo ocurre después del clic, en el detalle.
      wrap.rotation.order = "YXZ";
      wrap.rotation.y = isFront ? 0 : reach * 0.18;
      wrap.rotation.x = 0;
      wrap.rotation.z = isFront ? 0 : -reach * 0.08;
      // El principal entra entero en pantalla; los laterales más pequeños.
      const fit = (halfH0 * 1.15) / ITEM_SIZE;
      const boost = isFront ? 1 + 0.14 * hoverT : 1;
      wrap.scale.setScalar(!inView ? 0.001 : isFront ? fit * boost : fit * 0.66);
      wrap.visible = inView && i !== hiddenIdx;
    });
    const index = ((Math.round(rotation / STEP) % COUNT) + COUNT) % COUNT;
    front.idx = index;
    front.hoverT = hoverT;

    // Hover solo sobre el objeto principal: avanza un poco hacia adelante.
    if (!dragging && planeMeshes.length === COUNT) {
      raycaster.setFromCamera(pointerNDC, camera);
      const hits = raycaster.intersectObjects(planeMeshes, false);
      const hit = hits[0];
      hovered = !!hit && hit.object.userData.sectorIndex === index;
    } else {
      hovered = false;
    }
    hoverT += ((hovered ? 1 : 0) - hoverT) * (1 - Math.exp(-dt * 10));
    el.style.cursor = dragging ? "grabbing" : hovered ? "pointer" : "grab";

    // Etiqueta que sigue al cursor.
    tagX += (tagTX - tagX) * (1 - Math.exp(-dt * 14));
    tagY += (tagTY - tagY) * (1 - Math.exp(-dt * 14));
    const tag = tagRef.value;
    if (tag) {
      tag.style.transform = `translate(${tagX + 20}px, ${tagY - 18}px)`;
      tag.style.opacity = hovered ? "1" : "0";
    }

    const frontItem = items[index];
    if (!frontItem) return;
    frontItem.updateMatrixWorld(true);
    frontItem.getWorldPosition(focusPoint);
    focusPoint.applyMatrix4(camera.matrixWorldInverse);
    // En la versión instalada de @types/three, BokehPass.uniforms es `object`.
    (bokeh!.uniforms as { focus: { value: number } }).focus.value = -focusPoint.z;

    // El del frente no entra en el desenfoque: solo lo de detrás y los lados.
    const frontWasVisible = frontItem.visible;
    frontItem.visible = false;
    composer!.render();
    frontItem.visible = frontWasVisible;

    const background = scene!.background;
    scene!.background = null;
    const autoClear = renderer!.autoClear;
    renderer!.autoClear = false;
    renderer!.setRenderTarget(null);
    renderer!.clearDepth();
    const visibility = items.map((wrap) => wrap.visible);
    items.forEach((wrap, i) => {
      wrap.visible = i === index;
    });
    renderer!.render(scene!, camera);
    items.forEach((wrap, i) => {
      wrap.visible = visibility[i] ?? true;
    });
    scene!.background = background;
    renderer!.autoClear = autoClear;
  };
  animate();
});

onUnmounted(() => {
  cancelAnimationFrame(raf);
  for (const [target, type, handler, options] of listeners) {
    target.removeEventListener(type, handler, options);
  }
  listeners.length = 0;
  ro?.disconnect();
  ro = null;
  if (scene) {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) mat.dispose();
    });
  }
  bokeh?.dispose();
  bokeh = null;
  composer?.dispose();
  composer = null;
  if (renderer && canvasEl && mountEl && canvasEl.parentNode === mountEl) {
    mountEl.removeChild(canvasEl);
  }
  renderer?.dispose();
  renderer = null;
  scene = null;
  canvasEl = null;
  mountEl = null;
  three = null;
});
</script>

<template>
  <div class="relative h-full min-h-full bg-[#fdf3eb] text-[#131834]">
    <div
      ref="mountRef"
      class="h-full w-full cursor-pointer [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
      role="link"
      :aria-label="t('hero.discoverTag')"
      tabindex="0"
    />
    <!-- Etiqueta que aparece al posar el cursor sobre el objeto principal -->
    <div
      ref="tagRef"
      class="pointer-events-none absolute left-0 top-0 z-[3] opacity-0 transition-opacity duration-200"
      aria-hidden="true"
    >
      <span
        class="inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-[#131834] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f3ead6] shadow-lg"
      >
        <span class="inline-block h-2 w-2 rotate-45 bg-[#d9a83f]" />
        {{ t("hero.discoverTag") }}
      </span>
    </div>
  </div>
</template>
