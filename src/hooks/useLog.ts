/* eslint-disable import/no-anonymous-default-export */
import { useEffect } from "react";

export default () => {
  useEffect(() => {
    console.log("mounted");
    return () => {
      console.log("unmounted");
    };
  }, []);
};
