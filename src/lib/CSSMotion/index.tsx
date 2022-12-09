import React, { useMemo, useRef, useState } from "react";
import {
  MotionHandler,
  MotionPrepareHandler,
  MotionStatus,
  MotionStep,
} from "./interface";
import { forwardRef } from "react";
import DomWrapper from "./DomWrapper";
import ReactDOM from "react-dom";
import { useStatus } from "./useStatus";
import classNames from "classnames";
import { getClassName } from "./util";

/**
 *
 * @returns 浏览器是否支持CSS 过渡事件和动画事件，
 * 在step变化中，从active变为end需要监听dom 元素的
 * transitionend和animationend事件
 */
function supportMotionEvent(): boolean {
  return "TransitionEvent" in window && "AnimationEvent" in window;
}

const supportMotion = supportMotionEvent();

export interface CSSMotionProp {
  motionName: string;
  visible: boolean;
  /**
   * hook函数
   */
  onAppearPrepare?: MotionPrepareHandler;
  onEnterPrepare?: MotionPrepareHandler;
  onLeavePrepare?: MotionPrepareHandler;
  onAppearStart?: MotionHandler;
  onEnterStart?: MotionHandler;
  onLeaveStart?: MotionHandler;
  onAppearActive?: MotionHandler;
  onEnterActive?: MotionHandler;
  onLeaveActive?: MotionHandler;
  onAppearEnd?: MotionHandler;
  onEnterEnd?: MotionHandler;
  onLeaveEnd?: MotionHandler;

  /**
   * 不同status选择性允许动画
   */
  motionAppear?: boolean;
  motionEnter?: boolean;
  motionLeave?: boolean;

  children: (
    props: {
      style?: React.CSSProperties;
      className?: string;
      [key: string]: any;
    },
    ref: (node: any) => void
  ) => React.ReactElement;
}

function genCSSMotion(
  supportMotion: boolean
): React.ForwardRefExoticComponent<CSSMotionProp & { ref?: React.Ref<any> }> {
  const CSSMotion = forwardRef<any, CSSMotionProp>((props, ref) => {
    let { motionName, children } = props;
    const haveMotion = useMemo(
      () => !!(supportMotion && motionName),
      [motionName]
    );

    const nodeRef = useRef<any>(null);
    const domWrapperRef = useRef<any>(null);

    const getDomElement = (): HTMLElement => {
      if (nodeRef.current instanceof HTMLElement) {
        return nodeRef.current;
      }
      return ReactDOM.findDOMNode(domWrapperRef.current) as HTMLElement;
    };

    const setNodeRef = React.useCallback(
      (node: any) => {
        nodeRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const [status, step, style] = useStatus(haveMotion, getDomElement, props);

    function shouldHaveClass() {
      return !!(
        motionName &&
        step !== MotionStep.STEP_NONE &&
        step !== MotionStep.STEP_PREPARE &&
        step !== MotionStep.STEP_END
      );
    }

    let motionChildren: React.ReactNode;
    if (!supportMotion) {
      motionChildren = children({}, setNodeRef);
    } else if (status === MotionStatus.STATUS_NONE) {
      motionChildren = null;
    } else {
      const className = classNames({
        [motionName]: shouldHaveClass(),
        [getClassName(motionName, status)]: shouldHaveClass(),
        [getClassName(motionName, status, step)]: shouldHaveClass(),
      });
      motionChildren = children({ style, className }, setNodeRef);
      if (!("ref" in motionChildren)) {
        motionChildren = React.cloneElement(motionChildren, {
          ref: setNodeRef,
        });
      }
    }
    return <DomWrapper ref={domWrapperRef}>{motionChildren}</DomWrapper>;
  });

  return CSSMotion;
}

export default genCSSMotion(supportMotion);
