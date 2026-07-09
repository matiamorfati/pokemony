import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { OverlayPosition } from "../types/camera";

function lerp(from: number, to: number, factor: number) {
  return from + (to - from) * factor;
}

const SNAP_THRESHOLD = 0.5;

export function useSmoothedOverlayPosition(
  target: OverlayPosition | null,
  smoothingFactor = 0.18,
) {
  const targetRef = useRef(target);
  useLayoutEffect(() => {
    targetRef.current = target;
  });

  const smoothedRef = useRef<OverlayPosition | null>(null);
  const [displayPosition, setDisplayPosition] =
    useState<OverlayPosition | null>(null);

  useEffect(() => {
    let isMounted = true;
    let animationFrameId = 0;

    const animate = () => {
      if (!isMounted) {
        return;
      }

      const nextTarget = targetRef.current;

      if (!nextTarget) {
        smoothedRef.current = null;
        setDisplayPosition(null);
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const current = smoothedRef.current;

      if (!current) {
        smoothedRef.current = { ...nextTarget };
        setDisplayPosition({ ...nextTarget });
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const deltaX = Math.abs(nextTarget.x - current.x);
      const deltaY = Math.abs(nextTarget.y - current.y);

      if (deltaX < SNAP_THRESHOLD && deltaY < SNAP_THRESHOLD) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const smoothed = {
        x: lerp(current.x, nextTarget.x, smoothingFactor),
        y: lerp(current.y, nextTarget.y, smoothingFactor),
        width: lerp(current.width, nextTarget.width, smoothingFactor),
        height: lerp(current.height, nextTarget.height, smoothingFactor),
      };

      smoothedRef.current = smoothed;
      setDisplayPosition(smoothed);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [smoothingFactor]);

  return displayPosition;
}
