import { MotionStatus, MotionStep, STATUS_MAP, STEP_MAP } from "./interface";

export function getClassName(
  motionName: string,
  status: MotionStatus,
  step?: MotionStep
): string {
  const statusName = STATUS_MAP[status];
  const stepName = step && STEP_MAP[step];
  if (step) {
    return `${motionName}-${statusName}-${stepName}`;
  }
  return `${motionName}-${statusName}`;
}
