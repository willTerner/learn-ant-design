import React from "react";

interface DomWrapperProp {
  children: React.ReactNode;
}

export default class DomWrapper extends React.Component<DomWrapperProp> {
  render() {
    return this.props.children;
  }
}
