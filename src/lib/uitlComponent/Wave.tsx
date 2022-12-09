import React from "react";

interface IProp {
  children?: React.ReactNode;
  disabled?: boolean; // disabled wave effect
}

export default class Wave extends React.Component<IProp> {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef<HTMLDivElement>();
  }
}
