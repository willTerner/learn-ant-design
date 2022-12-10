import { Button } from "antd";
import React, {
} from "react";
import "./App.css";
import Wave from "./lib/uitlComponent/wave/Wave";


interface IProp {
  children?: React.ReactElement<any, any>[];
}

const Test: React.FC<IProp> = (props) => {
  return (
    <Wave>
      <button className="test-style">test</button>
    </Wave>
  );
}


function App() {
  return (
    <div>
      <Test >
      </Test>
      {/* <AntDemo></AntDemo> */}
      <div style={{margin: 20}}>
        <Button>test</Button>
      </div>
    </div>
  );
}

export default App;
