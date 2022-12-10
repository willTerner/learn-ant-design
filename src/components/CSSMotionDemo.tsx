import React from "react";
import classNames from "classnames";
import CSSMotion from "../lib/CSSMotion";
import "./App.css";

const getCollapsedWidth = (stage: String, event: Event | undefined) => {
  console.log(stage);
  console.log(event);
  return {
    height: 0,
  };
};

const log = (...args: any[]) => {
  for (const arg of args) {
    console.log(arg);
  }
};

const prepare = (message) => {
  console.log("prepare before ", message);
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
};

const CSSMotionDemo: React.FC = (props) => {
  const [visible, setVisible] = React.useState(true);
  const handleClick = () => {
    setVisible((visible) => !visible);
  };

  return (
    <div>
      <button onClick={handleClick}>click</button>
      <CSSMotion
        visible={visible}
        motionName='my-motion'
        onEnterStart={(_, event) => getCollapsedWidth("enter start", event)}
        onEnterActive={(_, event) => log("on enter active", event)}
        onEnterEnd={(_, event) => log("enter end", event)}
        onLeaveStart={(_, event) => log("leave start", event)}
        onLeaveActive={(_, event) => getCollapsedWidth("leave active", event)}
        onLeaveEnd={(_, event) => log("leave end", event)}
        onAppearStart={(_, event) => getCollapsedWidth("appear start", event)}
        onAppearActive={(_, event) => log("appear active", event)}
        onAppearEnd={(_, event) => log("appear end", event)}
        // onAppearPrepare={() => prepare("appear")}
        // onEnterPrepare={() => prepare("enter")}
        // onLeavePrepare={() => prepare("leave")}
      >
        {({ className, style }, ref: any) => (
          <div
            className={classNames(className, "test-style")}
            style={style}
            ref={ref}
          ></div>
        )}
      </CSSMotion>
    </div>
  );
};

export default CSSMotionDemo;
