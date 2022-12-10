import React, { isValidElement, ReactElement } from "react";
import { cloneElement } from "react";
import { updateCSS } from "../../util/dynamic";
import { composeRef, supportRef } from "../../util/ref";
import { isHidden } from "../../util/visibility";

interface IProp {
  children?: React.ReactNode;
  disabled?: boolean; // disabled wave effect
}

let styleForWaveEffect: HTMLStyleElement;

export default class Wave extends React.Component<IProp> {
  containerRef: React.RefObject<HTMLDivElement>;
  instance?: {cancel: () => void};

  constructor(props) {
    super(props);
    this.containerRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    this.instance = this.bindAnimationEvent();
    console.log(this.containerRef.current);
  }

  componentWillUnmount(): void {
      if (this.instance) {
        this.instance.cancel();
      }
  }

  onAnimationEnd= (event: AnimationEvent) => {
    if (event.animationName === "myFadeEffect") {
      this.resetEffect();
    }
    console.log("animationName", event.animationName);
  }

  getWaveEffectAttributeName() {
    return "should-have-wave-effect";
  }

  resetEffect() {
    const node = this.containerRef.current;
    if (node) {
      node.setAttribute(this.getWaveEffectAttributeName(), "false");
      node.removeEventListener("animationend", this.onAnimationEnd);
    }
    if (styleForWaveEffect) {
      styleForWaveEffect.innerHTML = "";
    }
  }

  getWaveColor(node: HTMLElement) {
    const getComputesStyle = window.getComputedStyle;
    return getComputedStyle(node).borderColor || getComputesStyle(node).borderTopColor;
  }

  onClick() {
    const node = this.containerRef.current;
    if (!node || !(node instanceof HTMLElement) || this.props.disabled || isHidden(node)) {
      return ;
    }
    node.setAttribute(this.getWaveEffectAttributeName(), "true");
    const css = `[${this.getWaveEffectAttributeName()}]=true::after {
      --var-wave-color: ${this.getWaveColor(node)};
    }`;
    styleForWaveEffect = updateCSS(css, "my-wave-effect") as HTMLStyleElement;
    node.addEventListener("animationend", this.onAnimationEnd);
  }

  bindAnimationEvent() {
    const node = this.containerRef.current;
    if (!node || !(node instanceof HTMLElement) || this.props.disabled) {
      return ;
    }
    const clickHandler = () => {
      this.resetEffect();
      setTimeout(() => { 
        this.onClick();
      }, 0);
    };
    node.addEventListener("click", clickHandler);
    return {
      cancel: () => {
        node.removeEventListener("click", clickHandler);
      }
    };
  }

  render() {
    if (!isValidElement(this.props.children)) {
      return this.props.children; 
    }
    let ref: React.Ref<any> | undefined = undefined;
    if (supportRef(this.props.children)) {
      ref = composeRef(this.containerRef, (this.props.children as any).ref);
    }
   // @ts-ignore
    return cloneElement(this.props.children, {ref});
  }
}
