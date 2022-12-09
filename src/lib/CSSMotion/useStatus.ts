import { CSSMotionProp } from "./index";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MotionStatus, MotionStep } from "./interface";
import useStep, { StepAction } from "./useStep";
import useDomEvent from "./useDomEvent";

export function useStatus(
  haveMotion: boolean,
  getDomElement: () => HTMLElement | null,
  cssMotionProps: CSSMotionProp
): [
  status: MotionStatus,
  step: MotionStep,
  style: React.CSSProperties | undefined
] {
  let {
    visible = true,
    onAppearPrepare,
    onEnterPrepare,
    onLeavePrepare,
    onAppearStart,
    onEnterStart,
    onLeaveStart,
    onAppearActive,
    onEnterActive,
    onLeaveActive,
    onAppearEnd,
    onEnterEnd,
    onLeaveEnd,
    motionAppear = true,
    motionEnter = true,
    motionLeave = true,
  } = cssMotionProps;
  const [status, setStatus] = useState<MotionStatus>(MotionStatus.STATUS_NONE);

  const mountedRef = useRef(false);
  const [style, setStyle] = useState<React.CSSProperties>();
  // 保持设置step end的回调函数
  const stepEndCallback = useRef<() => void>();

  const eventHandlers = React.useMemo(() => {
    switch (status) {
      case MotionStatus.STATUS_APPEAR: {
        return {
          [MotionStep.STEP_PREPARE]: onAppearPrepare,
          [MotionStep.STEP_START]: onAppearStart,
          [MotionStep.STEP_ACTIVE]: onAppearActive,
          [MotionStep.STEP_END]: onAppearEnd,
        };
      }
      case MotionStatus.STATUS_ENTER: {
        return {
          [MotionStep.STEP_PREPARE]: onEnterPrepare,
          [MotionStep.STEP_START]: onEnterStart,
          [MotionStep.STEP_ACTIVE]: onEnterActive,
          [MotionStep.STEP_END]: onEnterEnd,
        };
      }
      case MotionStatus.STATUS_LEAVE: {
        return {
          [MotionStep.STEP_PREPARE]: onLeavePrepare,
          [MotionStep.STEP_START]: onLeaveStart,
          [MotionStep.STEP_ACTIVE]: onLeaveActive,
          [MotionStep.STEP_END]: onLeaveEnd,
        };
      }
      default: {
        return {};
      }
    }
  }, [status]);

  // StepEnd回调函数
  const endCallback = (event: Event) => {
    const endCallback = eventHandlers[MotionStep.STEP_END];
    if (endCallback) {
      endCallback(getDomElement(), event);
    }
    if (stepEndCallback.current) {
      stepEndCallback.current();
    }
  };

  const [patchEvents] = useDomEvent(endCallback);

  // MotionStep状态变化回调函数
  const onCurrentStep = (currentStep: MotionStep) => {
    const stepCallback = eventHandlers[currentStep];
    if (currentStep === MotionStep.STEP_PREPARE) {
      return stepCallback
        ? stepCallback(getDomElement())
        : StepAction.Skip_Prepare;
    }
    if (eventHandlers[currentStep]) {
      setStyle(eventHandlers[currentStep](getDomElement()));
    }
    if (currentStep === MotionStep.STEP_ACTIVE) {
      patchEvents(getDomElement());
    }
    return currentStep === MotionStep.STEP_START
      ? StepAction.DoActive
      : StepAction.DoEnd;
  };

  // MotionStep状态更新
  const [step, startStep] = useStep(status, onCurrentStep, stepEndCallback);

  // MotionStatus状态更新
  useEffect(() => {
    if (!haveMotion) {
      return;
    }
    const isMounted = mountedRef.current;
    mountedRef.current = true;

    let nextStatus: MotionStatus | undefined;
    if (!isMounted && visible && motionAppear) {
      nextStatus = MotionStatus.STATUS_APPEAR;
    }
    if (isMounted && visible && motionEnter) {
      nextStatus = MotionStatus.STATUS_ENTER;
    }
    if (isMounted && !visible && motionLeave) {
      nextStatus = MotionStatus.STATUS_LEAVE;
    }
    if (nextStatus) {
      setStatus(nextStatus);
      startStep();
    }
  }, [visible]);

  const mergedStyle = useMemo(() => {
    if (
      eventHandlers[MotionStep.STEP_PREPARE] &&
      step === MotionStep.STEP_START
    ) {
      // 避免prepare到start之间会发生动画
      return {
        transition: "none",
        ...style,
      };
    }
    return style;
  }, [style, step]);

  return [status, step, mergedStyle];
}
