import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Category, MetalFinish } from '../types/storefront';

interface Jewelry3DCanvasProps {
  category: Exclude<Category, 'All'>;
  metal: MetalFinish;
  autoSpin: boolean;
  loupeZoom: boolean;
  resetSignal?: number;
  className?: string;
}

const METAL_TINTS: Record<MetalFinish, { color: number; roughness: number }> = {
  '18k Yellow Gold': { color: 0xe3b969, roughness: 0.14 },
  '18k Rose Gold': { color: 0xde9f8c, roughness: 0.14 },
  '950 Platinum': { color: 0xe7e9ef, roughness: 0.11 }
};

/** Builds a faceted brilliant-cut diamond with crown table and pointed pavilion. */
function createBrilliantDiamond(radius: number, material: THREE.Material): THREE.Group {
  const gem = new THREE.Group();
  const crownHeight = radius * 0.42;
  const pavilionHeight = radius * 0.92;

  const crown = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.62, radius, crownHeight, 16, 1),
    material
  );
  crown.position.y = crownHeight * 0.5;
  crown.castShadow = true;

  const pavilion = new THREE.Mesh(
    new THREE.ConeGeometry(radius, pavilionHeight, 16, 1),
    material
  );
  pavilion.rotation.x = Math.PI;
  pavilion.position.y = -pavilionHeight * 0.5;

  gem.add(crown, pavilion);
  return gem;
}

/** Builds procedural fine-jewellery geometry tailored to each catalogue category. */
function buildJewelrySculpture(
  category: Exclude<Category, 'All'>,
  alloyMat: THREE.MeshPhysicalMaterial,
  diamondMat: THREE.MeshPhysicalMaterial
): THREE.Group {
  const root = new THREE.Group();

  if (category === 'Rings') {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.105, 32, 96), alloyMat);
    band.rotation.x = Math.PI * 0.06;
    band.castShadow = true;
    root.add(band);

    // Inner comfort bevel
    const innerRim = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.025, 16, 80), alloyMat);
    innerRim.rotation.x = Math.PI * 0.06;
    root.add(innerRim);

    // Shoulder pavé diamonds
    for (let i = -5; i <= 5; i += 1) {
      if (i === 0) continue;
      const angle = Math.PI / 2 + i * 0.17;
      const bead = createBrilliantDiamond(0.055, diamondMat);
      bead.position.set(Math.cos(angle) * 1.03, Math.sin(angle) * 1.03, 0);
      bead.rotation.z = angle - Math.PI / 2;
      root.add(bead);
    }

    // 4-claw cathedral basket & solitaire diamond
    const gallery = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.032, 16, 48), alloyMat);
    gallery.rotation.x = Math.PI / 2;
    gallery.position.set(0, 1.15, 0);
    root.add(gallery);

    const prongOffsets: Array<[number, number]> = [
      [0.24, 0.24],
      [-0.24, 0.24],
      [-0.24, -0.24],
      [0.24, -0.24]
    ];
    for (const [px, pz] of prongOffsets) {
      const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.036, 0.42, 12), alloyMat);
      prong.position.set(px, 1.24, pz);
      prong.rotation.z = -px * 0.35;
      prong.rotation.x = pz * 0.35;
      root.add(prong);
    }

    const solitaire = createBrilliantDiamond(0.36, diamondMat);
    solitaire.position.set(0, 1.38, 0);
    root.add(solitaire);
    root.position.y = -0.15;
    return root;
  }

  if (category === 'Bracelets') {
    const pts: THREE.Vector3[] = [];
    const steps = 64;
    for (let i = 0; i <= steps; i += 1) {
      const t = 0.28 + (i / steps) * (Math.PI * 2 - 0.56);
      pts.push(new THREE.Vector3(Math.cos(t) * 1.28, Math.sin(t) * 0.14, Math.sin(t) * 0.98));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const cuff = new THREE.Mesh(new THREE.TubeGeometry(curve, 96, 0.11, 24, false), alloyMat);
    cuff.castShadow = true;
    root.add(cuff);

    const capStart = new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 20), alloyMat);
    capStart.position.copy(pts[0]);
    const capEnd = new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 20), alloyMat);
    capEnd.position.copy(pts[pts.length - 1]);
    root.add(capStart, capEnd);

    // Terminal baguette diamonds
    for (const endPt of [pts[0], pts[pts.length - 1]]) {
      const stone = createBrilliantDiamond(0.13, diamondMat);
      stone.position.set(endPt.x * 1.03, endPt.y + 0.11, endPt.z * 1.03);
      root.add(stone);
    }
    root.rotation.x = 0.32;
    return root;
  }

  if (category === 'Earrings') {
    [-0.72, 0.72].forEach((offsetX, idx) => {
      const pair = new THREE.Group();
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.065, 24, 64), alloyMat);
      hoop.position.y = 0.52;
      pair.add(hoop);

      const bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 24), alloyMat);
      bezel.rotation.x = Math.PI / 2;
      bezel.position.y = -0.1;
      pair.add(bezel);

      const dropGem = createBrilliantDiamond(0.32, diamondMat);
      dropGem.rotation.x = Math.PI / 2;
      dropGem.position.set(0, -0.1, 0.04);
      pair.add(dropGem);

      // Halo micro-stones
      for (let k = 0; k < 10; k += 1) {
        const a = (k / 10) * Math.PI * 2;
        const m = createBrilliantDiamond(0.055, diamondMat);
        m.rotation.x = Math.PI / 2;
        m.position.set(Math.cos(a) * 0.33, -0.1 + Math.sin(a) * 0.33, 0.02);
        pair.add(m);
      }

      pair.position.set(offsetX, 0, idx === 0 ? 0.12 : -0.12);
      pair.rotation.y = idx === 0 ? 0.28 : -0.28;
      root.add(pair);
    });
    return root;
  }

  // Necklaces: collar arc with diamond bar pendant
  const collarPts: THREE.Vector3[] = [];
  for (let i = 0; i <= 48; i += 1) {
    const t = -Math.PI * 0.72 + (i / 48) * Math.PI * 1.44;
    collarPts.push(new THREE.Vector3(Math.sin(t) * 1.18, Math.cos(t) * 0.92 + 0.38, 0));
  }
  const chainCurve = new THREE.CatmullRomCurve3(collarPts);
  const chain = new THREE.Mesh(new THREE.TubeGeometry(chainCurve, 80, 0.04, 16, false), alloyMat);
  root.add(chain);

  const bar = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.14, 0.11), alloyMat);
  bar.position.set(0, -0.58, 0.04);
  root.add(bar);

  for (let i = -3; i <= 3; i += 1) {
    const stone = createBrilliantDiamond(i === 0 ? 0.16 : 0.085, diamondMat);
    stone.rotation.x = Math.PI / 2;
    stone.position.set(i * 0.16, -0.58, 0.12);
    root.add(stone);
  }
  root.rotation.x = -0.12;
  return root;
}

/**
 * Interactive WebGL / Three.js 360-degree jewelry renderer with PBR alloys,
 * refractive diamond dispersion, studio softbox reflections, and loupe clarity zoom.
 */
export function Jewelry3DCanvas({
  category,
  metal,
  autoSpin,
  loupeZoom,
  resetSignal = 0,
  className = 'h-[420px]'
}: Jewelry3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const alloyMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const autoSpinRef = useRef(autoSpin);
  const targetDistanceRef = useRef(loupeZoom ? 2.15 : 4.25);
  const targetYRef = useRef(loupeZoom && category === 'Rings' ? 0.82 : 0.12);
  const [webglReady, setWebglReady] = useState(true);

  autoSpinRef.current = autoSpin;
  targetDistanceRef.current = loupeZoom ? 2.15 : 4.25;
  targetYRef.current = loupeZoom && category === 'Rings' ? 0.82 : 0.12;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setWebglReady(false);
      return;
    }

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 420;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTex = pmrem.fromScene(roomEnv, 0.035).texture;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 40);
    camera.position.set(2.3, 1.55, 3.4);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI * 0.78;
    controls.target.set(0, 0.12, 0);
    // Mobile: 1-finger scrolls the page, 2-finger rotates the model
    controls.touches = {
      ONE: THREE.TOUCH.DOLLY_PAN, // effectively no-op since pan+zoom disabled → falls through to page scroll
      TWO: THREE.TOUCH.ROTATE
    };
    controlsRef.current = controls;

    // Let single-finger vertical touch pass through to the page scroller
    const canvas = renderer.domElement;
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      // If mostly vertical → let page scroll (don't preventDefault)
      if (dy > dx) return;
      // Mostly horizontal → rotate model, block page scroll
      e.preventDefault();
    };
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });

    // Soft studio key + warm rose bounce light
    const keyLight = new THREE.DirectionalLight(0xfff6ec, 2.2);
    keyLight.position.set(4, 6, 4);
    const rimLight = new THREE.DirectionalLight(0xf6d8d4, 1.4);
    rimLight.position.set(-4, 3, -3);
    const sparklePoint = new THREE.PointLight(0xffffff, 4.5, 12);
    sparklePoint.position.set(1.6, 3.2, 2.4);
    scene.add(keyLight, rimLight, sparklePoint);

    // Ground silk pedestal contact shadow disc
    const pedestal = new THREE.Mesh(
      new THREE.CircleGeometry(1.55, 64),
      new THREE.MeshBasicMaterial({
        color: 0x2b1c1e,
        transparent: true,
        opacity: 0.08
      })
    );
    pedestal.rotation.x = -Math.PI / 2;
    pedestal.position.y = -1.25;
    scene.add(pedestal);

    const tint = METAL_TINTS[metal];
    const alloyMat = new THREE.MeshPhysicalMaterial({
      color: tint.color,
      metalness: 1.0,
      roughness: tint.roughness,
      clearcoat: 0.38,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.9
    });
    alloyMatRef.current = alloyMat;

    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.02,
      transmission: 0.94,
      ior: 2.417,
      thickness: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      iridescence: 0.7,
      iridescenceIOR: 1.33,
      envMapIntensity: 2.8,
      flatShading: true
    });

    const sculpture = buildJewelrySculpture(category, alloyMat, diamondMat);
    scene.add(sculpture);

    let rafId = 0;
    const clock = new THREE.Clock();
    const dirVec = new THREE.Vector3();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      if (autoSpinRef.current) {
        sculpture.rotation.y += 0.006;
        sculpture.position.y = Math.sin(elapsed * 1.4) * 0.035 - (category === 'Rings' ? 0.15 : 0);
      }

      // Smoothly interpolate camera distance & focus target for Clarity Loupe
      controls.target.y += (targetYRef.current - controls.target.y) * 0.08;
      dirVec.copy(camera.position).sub(controls.target);
      const currentDist = dirVec.length();
      if (Math.abs(currentDist - targetDistanceRef.current) > 0.005) {
        const nextDist = currentDist + (targetDistanceRef.current - currentDist) * 0.08;
        dirVec.normalize().multiplyScalar(nextDist);
        camera.position.copy(controls.target).add(dirVec);
      }

      controls.update();
      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(animate);
    };
    rafId = window.requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.cancelAnimationFrame(rafId);
      controls.dispose();
      roomEnv.dispose();
      envTex.dispose();
      pmrem.dispose();
      sculpture.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
        }
      });
      alloyMat.dispose();
      diamondMat.dispose();
      renderer.dispose();
    };
  }, [category]);

  // Real-time alloy material tinting without recreating WebGL scene
  useEffect(() => {
    const mat = alloyMatRef.current;
    if (!mat) return;
    const next = METAL_TINTS[metal];
    mat.color.setHex(next.color);
    mat.roughness = next.roughness;
    mat.needsUpdate = true;
  }, [metal]);

  // Reset camera orientation when requested
  useEffect(() => {
    if (!resetSignal || !cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(2.3, 1.55, 3.4);
    controlsRef.current.target.set(0, 0.12, 0);
    controlsRef.current.update();
  }, [resetSignal]);

  if (!webglReady) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#ECD8D6] text-xs text-[#2B1C1E]/65`}>
        Interactive 3D view requires WebGL support in your browser.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-label={`Interactive 360-degree 3D ${category} viewer`}
      className={`${className} w-full cursor-grab active:cursor-grabbing select-none touch-auto`}
    />
  );
}

