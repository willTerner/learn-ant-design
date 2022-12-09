import React from "react";
import { Button } from "antd";
import "./App.css";
import classNames from "classnames";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const set = [];
export default function AntDemo(props) {
  const [shouldWave, setShouldWave] = useState(false);
  set.push(setShouldWave);
  if (set.length >= 2) {
    console.log(set[set.length - 1] === set[set.length - 2]);
  }
  const testDivRef = useRef<HTMLDivElement>(null);
  const handleClick = () => {
    setShouldWave(true);
  };
  useEffect(() => {
    const testDiv = testDivRef.current;
    const transitionendHandler = (event) => {
      if (event.target === testDiv) {
        setShouldWave(false);
      }
    };
    testDiv?.addEventListener("transitionend", transitionendHandler);
    testDiv?.addEventListener("animationend", transitionendHandler);
    return () => {
      testDiv?.removeEventListener("transitionend", transitionendHandler);
      testDiv?.removeEventListener("animationend", transitionendHandler);
    };
  }, []);
  return (
    <div>
      <Button onClick={handleClick} type='primary'>
        click
      </Button>
      <div
        className={classNames("test-style", { wave: shouldWave })}
        ref={testDivRef}
      ></div>
    </div>
  );
}
