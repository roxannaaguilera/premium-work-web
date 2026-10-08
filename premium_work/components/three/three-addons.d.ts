declare module "three/addons/postprocessing/EffectComposer.js" {
  import { WebGLRenderer } from "three";
  export class EffectComposer {
    constructor(renderer: WebGLRenderer);
    addPass(pass: object): void;
    setSize(width: number, height: number): void;
    setPixelRatio(pixelRatio: number): void;
    render(): void;
    dispose(): void;
  }
}

declare module "three/addons/postprocessing/RenderPass.js" {
  import { Camera, Scene } from "three";
  export class RenderPass {
    constructor(scene: Scene, camera: Camera);
  }
}

declare module "three/addons/postprocessing/BokehPass.js" {
  import { Camera, Scene } from "three";
  export class BokehPass {
    constructor(
      scene: Scene,
      camera: Camera,
      params?: { focus?: number; aperture?: number; maxblur?: number },
    );
    uniforms: {
      focus: { value: number };
      aperture: { value: number };
      maxblur: { value: number };
    };
    dispose(): void;
  }
}
