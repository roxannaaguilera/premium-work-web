<template>
  <div ref="mountRef" class="h-64 w-64 cursor-pointer md:h-96 md:w-96 [&_canvas]:block" aria-hidden="true" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";

/**
 * Campana de restaurante (cloche) en 3D real (Three.js).
 * Misma luz, cámara, flotación y giro que la campana de conserjería.
 * Cúpula y botón de oro sobre un plato con base oscura.
 */
const mountRef = ref<HTMLDivElement | null>(null);
let cleanup: (() => void) | null = null;

onMounted(() => {
  const mount = mountRef.value;
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
  const goldMat = (extra: Record<string, unknown> = {}) => new THREE.MeshStandardMaterial({
    color: 0xd8a93c, metalness: 1.0, roughness: 0.28,
    envMapIntensity: 1.1, ...extra,
  });
  const blackBase = new THREE.MeshStandardMaterial({
    color: 0x17171a, metalness: 0.35, roughness: 0.45, envMapIntensity: 0.5,
  });
  const shadowed = <T extends THREE.Mesh>(m: T): T => {
    m.castShadow = true; m.receiveShadow = true; return m;
  };

  const cloche = new THREE.Group();

  // Plato: base oscura, ancha y baja
  const plate = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.60, 0.07, 72),
    blackBase
  ));
  plate.position.y = 0.035;
  cloche.add(plate);

  // Filete de oro del plato
  const plateRim = shadowed(new THREE.Mesh(
    new THREE.TorusGeometry(0.59, 0.014, 12, 72),
    goldMat()
  ));
  plateRim.rotation.x = Math.PI / 2;
  plateRim.position.y = 0.062;
  cloche.add(plateRim);

  // Superficie del plato en oro, visible alrededor de la cúpula
  const plateTop = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(0.545, 0.545, 0.012, 72),
    goldMat()
  ));
  plateTop.position.y = 0.072;
  cloche.add(plateTop);

  // Cúpula hemisférica (no la falda abierta de la campana de conserjería)
  const profile = [
    [0.430, 0.095], [0.438, 0.140], [0.422, 0.210], [0.385, 0.285],
    [0.330, 0.360], [0.260, 0.425], [0.180, 0.480], [0.105, 0.518],
    [0.055, 0.542], [0.040, 0.555],
  ].map((p) => new THREE.Vector2(p[0], p[1]));
  cloche.add(shadowed(new THREE.Mesh(
    new THREE.LatheGeometry(profile, 72),
    goldMat({ side: THREE.DoubleSide })
  )));

  // Borde inferior de la cúpula, donde apoya en el plato
  const lip = shadowed(new THREE.Mesh(
    new THREE.TorusGeometry(0.432, 0.016, 16, 72),
    goldMat()
  ));
  lip.rotation.x = Math.PI / 2;
  lip.position.y = 0.095;
  cloche.add(lip);

  // Botón superior
  const stem = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.045, 0.05, 32),
    goldMat()
  ));
  stem.position.y = 0.572;
  cloche.add(stem);
  const knob = shadowed(new THREE.Mesh(
    new THREE.SphereGeometry(0.048, 32, 24),
    goldMat()
  ));
  knob.position.y = 0.612;
  knob.scale.y = 0.85;
  cloche.add(knob);

  scene.add(cloche);

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
    cloche.position.y = Math.sin(elapsed * 1.4) * 0.035;
    if (spinT >= 0) {
      spinT += dt / 1.0; // un giro 360° en 1 segundo
      const k = Math.min(spinT, 1);
      const e = easeInOut(k);
      cloche.rotation.y = e * Math.PI * 2;
      cloche.rotation.z =
        Math.sin(k * Math.PI * 6) * 0.09 * Math.sin(k * Math.PI) +
        Math.sin(elapsed * 0.9) * 0.02;
      if (spinT >= 1) { spinT = -1; cloche.rotation.y = 0; }
    } else {
      cloche.rotation.z = Math.sin(elapsed * 0.9) * 0.02;
    }
    renderer.render(scene, camera);
  };
  animate();

  cleanup = () => {
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
    if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
  };
});

onUnmounted(() => cleanup?.());
</script>
