"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import styles from "./giro.module.css";

const SERVICES = [
  { name: "Hoteles", color: "#1f6f78" },
  { name: "Restaurantes", color: "#d4893a" },
  { name: "Catering", color: "#d4654a" },
  { name: "Eventos corporativos", color: "#2c3f66" },
  { name: "Eventos deportivos", color: "#3d7a45" },
  { name: "Festivales", color: "#a83d78" },
  { name: "Bodas y celebraciones", color: "#c4a15a" },
  { name: "Eventos privados", color: "#7a3048" },
] as const;

const COUNT = SERVICES.length;
const STEP = (Math.PI * 2) / COUNT;

function wrapAngle(angle: number) {
  let value = angle % (Math.PI * 2);
  if (value > Math.PI) value -= Math.PI * 2;
  if (value < -Math.PI) value += Math.PI * 2;
  return value;
}

function makeLabel(name: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");

  ctx.fillStyle = "#fbf6ef";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#5c3b32";
  ctx.lineWidth = 18;
  ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

  ctx.fillStyle = "#5c3b32";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const words = name.split(" ");
  const maxWidth = 860;
  let size = words.length > 2 ? 92 : words.length > 1 ? 108 : 124;
  ctx.font = `600 ${size}px Georgia, serif`;
  while (size > 64 && words.some((word) => ctx.measureText(word).width > maxWidth)) {
    size -= 4;
    ctx.font = `600 ${size}px Georgia, serif`;
  }

  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);

  const lineHeight = size * 1.12;
  const start = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((text, index) => {
    ctx.fillText(text, canvas.width / 2, start + index * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function Rig({
  target,
  rotation,
}: {
  target: RefObject<number>;
  rotation: RefObject<number>;
}) {
  useFrame((_, delta) => {
    const follow = 1 - Math.exp(-delta * 8);
    rotation.current += (target.current - rotation.current) * follow;
  }, 1);
  return null;
}

function Jar({
  index,
  color,
  name,
  rotation,
}: {
  index: number;
  color: string;
  name: string;
  rotation: RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const label = useMemo(() => makeLabel(name), [name]);

  useFrame(() => {
    const node = group.current;
    if (!node) return;
    const angle = wrapAngle(index * STEP - rotation.current);
    const away = Math.abs(angle);
    const front = Math.max(0, Math.cos(angle));
    node.position.set(Math.sin(angle) * 2.85, 0.15 * front, Math.cos(angle) * 1.55);
    node.rotation.y = angle;
    node.scale.setScalar(away > 2.35 ? 0.001 : 0.78 + front * 0.58);
    node.visible = away < 2.4;
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.46, 0.52, 1.22, 48]} />
        <meshStandardMaterial color={color} roughness={0.32} metalness={0.06} />
      </mesh>
      <mesh position={[0, 1.28, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.36, 0.18, 40]} />
        <meshStandardMaterial color={color} roughness={0.24} metalness={0.08} />
      </mesh>
      <mesh position={[0, 1.44, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.14, 40]} />
        <meshStandardMaterial color="#e4d3b4" roughness={0.38} metalness={0.42} />
      </mesh>
      <mesh position={[0, 0.58, 0.525]}>
        <planeGeometry args={[0.74, 0.46]} />
        <meshStandardMaterial map={label} roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

function Controls({
  target,
  onDrag,
}: {
  target: RefObject<number>;
  onDrag: (dragging: boolean) => void;
}) {
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    let dragging = false;
    let lastX = 0;
    let wheel = 0;

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      onDrag(true);
      el.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      lastX = event.clientX;
      target.current -= dx * 0.0075;
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      onDrag(false);
      target.current = Math.round(target.current / STEP) * STEP;
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      wheel += event.deltaY;
      if (Math.abs(wheel) < 36) return;
      target.current += Math.sign(wheel) * STEP;
      target.current = Math.round(target.current / STEP) * STEP;
      wheel = 0;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      el.removeEventListener("wheel", onWheel);
    };
  }, [gl, onDrag, target]);

  return null;
}

function ActiveCaption({
  rotation,
  caption,
}: {
  rotation: RefObject<number>;
  caption: RefObject<HTMLHeadingElement | null>;
}) {
  const shown = useRef(-1);
  useFrame(() => {
    const index = ((Math.round(rotation.current / STEP) % COUNT) + COUNT) % COUNT;
    if (shown.current === index || !caption.current) return;
    shown.current = index;
    caption.current.textContent = SERVICES[index].name;
  });
  return null;
}

export function ServiceRotator() {
  const target = useRef(0);
  const rotation = useRef(0);
  const caption = useRef<HTMLHeadingElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <main className={dragging ? `${styles.stage} ${styles.dragging}` : styles.stage}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.15, 6.6], fov: 32 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ camera }) => camera.lookAt(0, 0.85, 0)}
      >
        <color attach="background" args={["#f6efe6"]} />
        <ambientLight intensity={0.72} />
        <directionalLight
          position={[3.5, 6.5, 4.5]}
          intensity={1.7}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-4, 2.5, 2]} intensity={0.45} color="#fff6ea" />
        <Rig target={target} rotation={rotation} />
        <Controls target={target} onDrag={setDragging} />
        <ActiveCaption rotation={rotation} caption={caption} />
        {SERVICES.map((service, index) => (
          <Jar
            key={service.name}
            index={index}
            color={service.color}
            name={service.name}
            rotation={rotation}
          />
        ))}
        <ContactShadows
          position={[0, 0.02, 0]}
          opacity={0.32}
          scale={12}
          blur={2.4}
          far={4.5}
          color="#6a5146"
        />
      </Canvas>
      <div className={styles.caption}>
        <h1 ref={caption} className={styles.title}>
          Hoteles
        </h1>
        <p className={styles.hint}>Desplaza o arrastra</p>
      </div>
    </main>
  );
}
