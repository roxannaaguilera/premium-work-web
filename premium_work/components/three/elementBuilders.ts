import * as THREE from "three";

/**
 * Constructores puros de los 8 elementos 3D de Premium Work.
 * Cada función devuelve un THREE.Group listo para añadir a cualquier escena.
 * (Extraídos de los componentes Bell3D, Cloche3D, Catering3D, Corporate3D,
 *  Medal3D, Festival3D, Rings3D y Envelope3D.)
 */

export interface SectorElement {
  name: string;
  build: () => THREE.Group;
}

const goldMat = (extra: Record<string, unknown> = {}) =>
  new THREE.MeshStandardMaterial({
    color: 0xd8a93c, metalness: 1.0, roughness: 0.28,
    envMapIntensity: 1.1, ...extra,
  });
const blackMat = () =>
  new THREE.MeshStandardMaterial({
    color: 0x17171a, metalness: 0.35, roughness: 0.45, envMapIntensity: 0.5,
  });
function shadowed<T extends THREE.Mesh>(m: T): T {
  m.castShadow = true; m.receiveShadow = true; return m;
}

/** 1. Hoteles — campana de conserjería */
export function buildBell(): THREE.Group {
  const bell = new THREE.Group();
  const profile = [
    [0.500, 0.115], [0.508, 0.150], [0.498, 0.200], [0.470, 0.270],
    [0.425, 0.340], [0.365, 0.405], [0.295, 0.455], [0.215, 0.495],
    [0.135, 0.520], [0.075, 0.535], [0.058, 0.548],
  ].map((p) => new THREE.Vector2(p[0], p[1]));
  bell.add(shadowed(new THREE.Mesh(
    new THREE.LatheGeometry(profile, 72),
    goldMat({ side: THREE.DoubleSide })
  )));
  const lip = shadowed(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.018, 16, 72), goldMat()));
  lip.rotation.x = Math.PI / 2; lip.position.y = 0.115;
  bell.add(lip);
  const base = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.575, 0.11, 72), blackMat()));
  base.position.y = 0.055;
  bell.add(base);
  const baseTrim = shadowed(new THREE.Mesh(new THREE.TorusGeometry(0.562, 0.012, 12, 72), goldMat()));
  baseTrim.rotation.x = Math.PI / 2; baseTrim.position.y = 0.105;
  bell.add(baseTrim);
  const stem = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.05, 32), goldMat()));
  stem.position.y = 0.565;
  bell.add(stem);
  const knob = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.048, 32, 24), goldMat()));
  knob.position.y = 0.605; knob.scale.y = 0.85;
  bell.add(knob);
  return bell;
}

/** 2. Restaurantes — cloche con plato */
export function buildCloche(): THREE.Group {
  const cloche = new THREE.Group();
  const plate = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.60, 0.07, 72), blackMat()));
  plate.position.y = 0.035;
  cloche.add(plate);
  const plateRim = shadowed(new THREE.Mesh(
    new THREE.TorusGeometry(0.59, 0.014, 12, 72), goldMat()));
  plateRim.rotation.x = Math.PI / 2; plateRim.position.y = 0.062;
  cloche.add(plateRim);
  const plateTop = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(0.545, 0.545, 0.012, 72), goldMat()));
  plateTop.position.y = 0.072;
  cloche.add(plateTop);
  const profile = [
    [0.430, 0.095], [0.438, 0.140], [0.422, 0.210], [0.385, 0.285],
    [0.330, 0.360], [0.260, 0.425], [0.180, 0.480], [0.105, 0.518],
    [0.055, 0.542], [0.040, 0.555],
  ].map((p) => new THREE.Vector2(p[0], p[1]));
  cloche.add(shadowed(new THREE.Mesh(
    new THREE.LatheGeometry(profile, 72), goldMat({ side: THREE.DoubleSide }))));
  const lip = shadowed(new THREE.Mesh(
    new THREE.TorusGeometry(0.432, 0.016, 16, 72), goldMat()));
  lip.rotation.x = Math.PI / 2; lip.position.y = 0.095;
  cloche.add(lip);
  const stem = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.045, 0.05, 32), goldMat()));
  stem.position.y = 0.572;
  cloche.add(stem);
  const knob = shadowed(new THREE.Mesh(
    new THREE.SphereGeometry(0.048, 32, 24), goldMat()));
  knob.position.y = 0.612; knob.scale.y = 0.85;
  cloche.add(knob);
  return cloche;
}

/** 3. Catering — bandeja con copas de champán */
export function buildCatering(): THREE.Group {
  const catering = new THREE.Group();
  const trayBase = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.48, 0.055, 64), blackMat()));
  trayBase.scale.set(1.2, 1, 0.78); trayBase.position.y = 0.028;
  catering.add(trayBase);
  const trayTop = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(0.435, 0.435, 0.012, 64), goldMat()));
  trayTop.scale.set(1.2, 1, 0.78); trayTop.position.y = 0.056;
  catering.add(trayTop);
  const trayRim = shadowed(new THREE.Mesh(
    new THREE.TorusGeometry(0.455, 0.012, 12, 64), goldMat()));
  trayRim.rotation.x = Math.PI / 2;
  trayRim.scale.set(1.2, 0.78, 1); trayRim.position.y = 0.052;
  catering.add(trayRim);
  const fluteProfile = [
    [0.100, 0.000], [0.106, 0.016], [0.042, 0.032],
    [0.020, 0.052], [0.018, 0.155], [0.026, 0.185],
    [0.052, 0.240], [0.080, 0.320], [0.088, 0.400],
    [0.076, 0.465], [0.064, 0.510],
  ].map((p) => new THREE.Vector2(p[0], p[1]));
  const fluteGeo = new THREE.LatheGeometry(fluteProfile, 40);
  const addFlute = (x: number, z: number) => {
    const flute = new THREE.Group();
    flute.add(shadowed(new THREE.Mesh(fluteGeo, goldMat({ side: THREE.DoubleSide }))));
    const foot = shadowed(new THREE.Mesh(new THREE.TorusGeometry(0.096, 0.008, 10, 32), blackMat()));
    foot.rotation.x = Math.PI / 2; foot.position.y = 0.010;
    flute.add(foot);
    const lip = shadowed(new THREE.Mesh(new THREE.TorusGeometry(0.064, 0.007, 8, 32), goldMat()));
    lip.rotation.x = Math.PI / 2; lip.position.y = 0.508;
    flute.add(lip);
    flute.position.set(x, 0.064, z);
    catering.add(flute);
  };
  addFlute(-0.30, 0.04);
  addFlute(0, -0.06);
  addFlute(0.30, 0.05);
  return catering;
}

/** 4. Eventos corporativos — micrófono de conferencia */
export function buildMicrophone(): THREE.Group {
  const mic = new THREE.Group();
  const base = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(0.40, 0.43, 0.08, 64), blackMat()));
  base.position.y = 0.04;
  mic.add(base);
  const baseTop = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.36, 0.012, 64), goldMat()));
  baseTop.position.y = 0.082;
  mic.add(baseTop);
  const baseRim = shadowed(new THREE.Mesh(
    new THREE.TorusGeometry(0.415, 0.013, 12, 64), goldMat()));
  baseRim.rotation.x = Math.PI / 2; baseRim.position.y = 0.07;
  mic.add(baseRim);
  const stem = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(0.032, 0.042, 0.18, 32), goldMat()));
  stem.position.y = 0.175;
  mic.add(stem);
  const joint = shadowed(new THREE.Mesh(
    new THREE.SphereGeometry(0.048, 28, 20), goldMat()));
  joint.position.y = 0.275;
  mic.add(joint);
  const head = new THREE.Group();
  const body = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(0.105, 0.105, 0.42, 40), goldMat()));
  body.rotation.z = Math.PI / 2;
  head.add(body);
  const capL = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.105, 28, 20), goldMat()));
  capL.position.x = -0.21;
  head.add(capL);
  const capR = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.105, 28, 20), goldMat()));
  capR.position.x = 0.21;
  head.add(capR);
  const grille = shadowed(new THREE.Mesh(
    new THREE.CylinderGeometry(0.112, 0.112, 0.16, 40), blackMat()));
  grille.rotation.z = Math.PI / 2; grille.position.x = 0.06;
  head.add(grille);
  for (const x of [-0.02, 0.06, 0.14]) {
    const ring = shadowed(new THREE.Mesh(new THREE.TorusGeometry(0.114, 0.006, 8, 32), goldMat()));
    ring.rotation.y = Math.PI / 2; ring.position.x = x;
    head.add(ring);
  }
  head.position.set(0.06, 0.40, 0.02);
  head.rotation.z = 0.42; head.rotation.y = -0.35;
  mic.add(head);
  return mic;
}

/** 5. Eventos deportivos — medalla de oro con cinta prolongada */
export function buildMedal(): THREE.Group {
  const medal = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({
    color: 0xd8a93c, metalness: 0.85, roughness: 0.3, envMapIntensity: 1.2,
  });
  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0x2a3550, roughness: 0.7, metalness: 0.1,
    side: THREE.DoubleSide, envMapIntensity: 0.5,
  });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.045, 64), gold);
  disc.rotation.x = Math.PI / 2; disc.position.y = 0.32;
  disc.castShadow = disc.receiveShadow = true;
  medal.add(disc);
  const edge = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.018, 16, 64), gold);
  edge.position.y = 0.32; edge.castShadow = true;
  medal.add(edge);
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 12, 32), gold);
  loop.position.y = 0.685; loop.castShadow = true;
  medal.add(loop);
  const ribbonGeo = new THREE.PlaneGeometry(0.2, 0.95, 1, 40);
  const pos = ribbonGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const k = (y + 0.475) / 0.95;
    pos.setX(i, pos.getX(i) + Math.sin(k * Math.PI * 1.6) * 0.06);
    pos.setZ(i, Math.sin(k * Math.PI * 1.2 + 0.6) * 0.06);
  }
  ribbonGeo.computeVertexNormals();
  const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
  ribbon.position.y = 1.18; ribbon.castShadow = true;
  medal.add(ribbon);
  medal.scale.setScalar(0.85);
  return medal;
}

/** 6. Festivales — boleto de admisión */
export function buildTicket(): THREE.Group {
  const ticket = new THREE.Group();
  const edge = shadowed(new THREE.Mesh(
    new THREE.BoxGeometry(0.98, 0.58, 0.06), goldMat()));
  edge.position.y = 0.34;
  ticket.add(edge);
  const addFace = (width: number, x: number, z: number) => {
    const panel = shadowed(new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.50, 0.012), blackMat()));
    panel.position.set(x, 0.34, z);
    ticket.add(panel);
  };
  addFace(0.58, -0.16, 0.026);
  addFace(0.58, -0.16, -0.026);
  addFace(0.20, 0.36, 0.026);
  addFace(0.20, 0.36, -0.026);
  for (let i = 0; i < 7; i++) {
    const hole = shadowed(new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.072, 16), blackMat()));
    hole.rotation.x = Math.PI / 2;
    hole.position.set(0.18, 0.12 + i * 0.072, 0);
    ticket.add(hole);
  }
  return ticket;
}

/** 7. Bodas y celebraciones — dos argollas separadas */
export function buildRings(): THREE.Group {
  const rings = new THREE.Group();
  const band1 = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.075, 40, 96), goldMat());
  band1.position.set(-0.48, 0.44, 0.02);
  band1.rotation.set(0.05, -0.14, 0.04);
  band1.castShadow = band1.receiveShadow = true;
  rings.add(band1);
  const band2 = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.075, 40, 96), goldMat());
  band2.position.set(0.48, 0.42, -0.02);
  band2.rotation.set(-0.04, 0.16, -0.05);
  band2.castShadow = band2.receiveShadow = true;
  rings.add(band2);
  return rings;
}

/** 8. Eventos privados — sobre lacrado */
export function buildEnvelope(): THREE.Group {
  const env3d = new THREE.Group();
  const paper = new THREE.MeshStandardMaterial({
    color: 0xf3ead6, roughness: 0.85, metalness: 0.0, envMapIntensity: 0.35,
  });
  const paperDark = new THREE.MeshStandardMaterial({
    color: 0xe2d5b8, roughness: 0.9, metalness: 0.0, envMapIntensity: 0.3,
  });
  const wax = new THREE.MeshStandardMaterial({
    color: 0x9e1f1f, roughness: 0.42, metalness: 0.15, envMapIntensity: 0.8,
  });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.62, 0.05), paper);
  body.position.y = 0.35;
  body.castShadow = body.receiveShadow = true;
  env3d.add(body);
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
  const sealPts: THREE.Vector2[] = [];
  const sealR = 0.115;
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const wobble = 1 + 0.06 * Math.sin(a * 5 + 1.2) + 0.04 * Math.sin(a * 9);
    sealPts.push(new THREE.Vector2(Math.cos(a) * sealR * wobble, Math.sin(a) * sealR * wobble));
  }
  const seal = new THREE.Mesh(
    new THREE.ExtrudeGeometry(new THREE.Shape(sealPts), {
      depth: 0.022, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2,
    }),
    wax
  );
  seal.position.set(0, 0.33, 0.032);
  seal.castShadow = seal.receiveShadow = true;
  env3d.add(seal);
  const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.012, 32), wax);
  emblem.rotation.x = Math.PI / 2;
  emblem.position.set(0, 0.33, 0.058);
  emblem.castShadow = true;
  env3d.add(emblem);
  env3d.rotation.x = -0.12;
  env3d.rotation.z = 0.04;
  env3d.scale.setScalar(1.32);
  return env3d;
}

export const SECTOR_ELEMENTS: SectorElement[] = [
  { name: "Hoteles", build: buildBell },
  { name: "Restaurantes", build: buildCloche },
  { name: "Catering", build: buildCatering },
  { name: "Eventos corporativos", build: buildMicrophone },
  { name: "Eventos deportivos", build: buildMedal },
  { name: "Festivales", build: buildTicket },
  { name: "Bodas y celebraciones", build: buildRings },
  { name: "Eventos privados", build: buildEnvelope },
];
