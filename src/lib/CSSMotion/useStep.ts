import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { MotionStatus, MotionStep } from "./interface";
import useNextFrame from "./useNextFrame";

const STEP_MACHINE = [
  MotionStep.STEP_NONE,
  MotionStep.STEP_PREPARE,
  MotionStep.STEP_START,
  MotionStep.STEP_ACTIVE,
  MotionStep.STEP_END,
];

export enum StepAction {
  Skip_Prepare,
  DoActive,
  DoEnd,
}

export default function useStep(
  status: MotionStatus,
  callback: (step: MotionStep) => StepAction | Promise<any>,
  stepEndCallback: React.MutableRefObject<(() => void) | undefined>
): [step: MotionStep, startStep: () => void] {
  const [step, setStep] = useState(MotionStep.STEP_NONE);

  const startStep = () => {
    setStep(MotionStep.STEP_PREPARE);
  };

  const setStepEnd = () => {
    setStep(MotionStep.STEP_END);
  };

  stepEndCallback.current = setStepEnd;

  const [nextFrameCallback] = useNextFrame();
  useEffect(() => {
    if (step !== MotionStep.STEP_NONE && step !== MotionStep.STEP_END) {
      const nextStep =
        STEP_MACHINE[STEP_MACHINE.findIndex((cur) => cur === step) + 1];
      const result = callback(step);

      function doNext() {
        setStep(nextStep);
      }

      if (result === StepAction.Skip_Prepare) {
        doNext();
      } else if (result === StepAction.DoActive) {
        nextFrameCallback(doNext);
      } else if (result === StepAction.DoEnd) {
        // 由动画事件设置end状态
      } else {
        Promise.resolve(result).then(doNext);
      }
    }
  }, [step]);

  return [step, startStep];
}
