import React from "react";

export type MotionPrepareHandler = (
  element: HTMLElement | null
) => Promise<any>;

export type MotionHandler = (
  element: HTMLElement | null,
  event?: Event
) => React.CSSProperties | void;

export enum MotionStatus {
  STATUS_NONE,
  STATUS_APPEAR,
  STATUS_ENTER,
  STATUS_LEAVE,
}

export enum MotionStep {
  STEP_NONE,
  STEP_PREPARE,
  STEP_START,
  STEP_ACTIVE,
  STEP_END,
}

export const STATUS_MAP = {
  [MotionStatus.STATUS_NONE]: "none",
  [MotionStatus.STATUS_APPEAR]: "appear",
  [MotionStatus.STATUS_ENTER]: "start",
  [MotionStatus.STATUS_LEAVE]: "leave",
};

export const STEP_MAP = {
  [MotionStep.STEP_NONE]: "none",
  [MotionStep.STEP_PREPARE]: "prepare",
  [MotionStep.STEP_START]: "start",
  [MotionStep.STEP_ACTIVE]: "active",
  [MotionStep.STEP_END]: "end",
};
