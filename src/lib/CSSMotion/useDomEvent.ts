import React, { useCallback, useEffect, useRef } from "react";

export default function useDomEvent(
  endCallback: (event: Event) => void
): [patchEvents: (element: HTMLElement | null) => void] {
  // 保存上一个元素
  const elementRef = useRef<HTMLElement>();
  // 保存最新的callback
  const callbackRef = useRef<typeof endCallback>(endCallback);
  callbackRef.current = endCallback;

  const internalCallback = useCallback((event) => {
    callbackRef.current(event);
  }, []);
  function removeEvent() {
    elementRef.current?.removeEventListener("transitionend", internalCallback);
    elementRef.current?.removeEventListener("animationend", internalCallback);
  }

  function patchEvents(element: HTMLElement | null) {
    if (elementRef.current && element !== elementRef.current) {
      removeEvent();
    }
    if (element) {
      element.addEventListener("transitionend", internalCallback);
      element.addEventListener("animationend", internalCallback);
      elementRef.current = element;
    }
  }

  // 卸载组件时清除监听器
  useEffect(() => {
    return () => {
      removeEvent();
    };
  }, []);

  return [patchEvents];
}
