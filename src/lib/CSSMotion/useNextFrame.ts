import React, { useCallback, useEffect, useRef } from "react";

export default function useNextFrame(): [
  nextFrameCallback: (callback: () => void) => void
] {
  const frameId = useRef<number>();

  const cancelFrameCallback = () => {
    if (frameId.current) {
      window.cancelAnimationFrame(frameId.current);
    }
  };

  const nextFrameCallback = (callback: () => void, delay = 2) => {
    if (delay > 0) {
      nextFrameCallback(callback, delay - 1);
    } else {
      cancelFrameCallback();
      frameId.current = window.requestAnimationFrame(callback);
    }
  };

  useEffect(() => {
    return () => {
      cancelFrameCallback();
    };
  }, []);
  return [nextFrameCallback];
}
