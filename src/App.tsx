import classNames from "classnames";
import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import "./App.css";
import CSSMotionDemo from "./CSSMotionDemo";
import AntDemo from "./AntDemo";
import { Button } from "antd";
import "antd/dist/antd.min.css";

function useTest(callback: () => void) {
  const internalCallback = useCallback(() => {
    callback();
  }, []);
  internalCallback();
}

interface IProp {
  children: React.ReactElement<any, any>;
}

const Test: React.FC<IProp> = function Test(props) {
  return props.children;
};

const set = new Set();

function App() {
  const testRef = useRef<any>();
  return (
    <div>
      <Test ref={testRef}>
        <div>test</div>
      </Test>
      {/* <AntDemo></AntDemo> */}
    </div>
  );
}

export default App;
