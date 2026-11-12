import React, { useEffect, useRef, useState } from 'react';

interface SpringTiltOptions {
  maxDeg?: number;
  damping?: number;
  ambientDrift?: boolean;
}

interface TiltStyleState {
  rotateX: number;
  rotateY: number;
  shiftX: number;
  shiftY: number;
  lightX: number;
  lightY: number;
  isActive: boolean;
}

/**
 * Damped requestAnimationFrame 3D tilt hook that mimics weighted physical glass/metal vitrines.
 * Automatically disables motion on coarse pointers or prefers-reduced-motion.
 */
export function useSpringTilt({
  maxDeg = 4.5,
  damping = 0.085,
  ambientDrift = false
}: SpringTiltOptions = {}) {
  const [state, setState] = useState<TiltStyleState>({
    rotateX: 0,
    rotateY: 0,
    shiftX: 0,
    shiftY: 0,
    lightX: 50,
    lightY: 35,
    isActive: false
  });

  const targetRef = useRef({ rx: 0, ry: 0, sx: 0, sy: 0, lx: 50, ly: 35 });
  const currentRef = useRef({ rx: 0, ry: 0, sx: 0, sy: 0, lx: 50, ly: 35 });
  const hoveringRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqCoarse = window.matchMedia('(pointer: coarse)');
    reducedMotionRef.current = mqReduced.matches || mqCoarse.matches;

    if (reducedMotionRef.current) return;

    let startTime = performance.now();

    const tick = (now: number) => {
      const cur = currentRef.current;
      const tgt = targetRef.current;

      // Subtle breathing drift when idle if enabled (barely perceptible atelier poise)
      if (ambientDrift && !hoveringRef.current) {
        const t = (now - startTime) * 0.00055;
        tgt.rx = Math.sin(t) * (maxDeg * 0.28);
        tgt.ry = Math.cos(t * 0.85) * (maxDeg * 0.34);
        tgt.sx = Math.cos(t * 0.85) * -4;
        tgt.sy = Math.sin(t) * -3;
        tgt.lx = 50 + Math.cos(t * 0.85) * 14;
        tgt.ly = 38 + Math.sin(t) * 10;
      }

      const drx = tgt.rx - cur.rx;
      const dry = tgt.ry - cur.ry;
      const dsx = tgt.sx - cur.sx;
      const dsy = tgt.sy - cur.sy;
      const dlx = tgt.lx - cur.lx;
      const dly = tgt.ly - cur.ly;

      const isMoving =
        ambientDrift ||
        hoveringRef.current ||
        Math.abs(drx) > 0.004 ||
        Math.abs(dry) > 0.004 ||
        Math.abs(dsx) > 0.01;

      if (isMoving) {
        cur.rx += drx * damping;
        cur.ry += dry * damping;
        cur.sx += dsx * damping;
        cur.sy += dsy * damping;
        cur.lx += dlx * damping;
        cur.ly += dly * damping;

        setState({
          rotateX: cur.rx,
          rotateY: cur.ry,
          shiftX: cur.sx,
          shiftY: cur.sy,
          lightX: cur.lx,
          lightY: cur.ly,
          isActive: hoveringRef.current
        });
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    if (ambientDrift) {
      rafRef.current = window.requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [ambientDrift, damping, maxDeg]);

  const ensureLoop = () => {
    if (reducedMotionRef.current || rafRef.current !== null) return;
    const step = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      const drx = tgt.rx - cur.rx;
      const dry = tgt.ry - cur.ry;
      const dsx = tgt.sx - cur.sx;
      const dsy = tgt.sy - cur.sy;
      const dlx = tgt.lx - cur.lx;
      const dly = tgt.ly - cur.ly;

      cur.rx += drx * damping;
      cur.ry += dry * damping;
      cur.sx += dsx * damping;
      cur.sy += dsy * damping;
      cur.lx += dlx * damping;
      cur.ly += dly * damping;

      setState({
        rotateX: cur.rx,
        rotateY: cur.ry,
        shiftX: cur.sx,
        shiftY: cur.sy,
        lightX: cur.lx,
        lightY: cur.ly,
        isActive: hoveringRef.current
      });

      if (
        hoveringRef.current ||
        Math.abs(drx) > 0.004 ||
        Math.abs(dry) > 0.004 ||
        Math.abs(dsx) > 0.01
      ) {
        rafRef.current = window.requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = window.requestAnimationFrame(step);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotionRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    hoveringRef.current = true;
    targetRef.current = {
      rx: -ny * maxDeg * 2,
      ry: nx * maxDeg * 2,
      sx: nx * -10,
      sy: ny * -10,
      lx: (nx + 0.5) * 100,
      ly: (ny + 0.5) * 100
    };
    ensureLoop();
  };

  const onMouseLeave = () => {
    hoveringRef.current = false;
    if (!ambientDrift) {
      targetRef.current = { rx: 0, ry: 0, sx: 0, sy: 0, lx: 50, ly: 35 };
      ensureLoop();
    }
  };

  return {
    tilt: state,
    bind: {
      onMouseMove,
      onMouseLeave
    }
  };
}

