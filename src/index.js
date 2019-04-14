import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import DoughnutChart, { calculateDisplaySpacing } from "./DoughnutChart";

const strokeWidth = 3,
  padding = 2,
  { center, viewBox } = calculateDisplaySpacing(strokeWidth, padding);

const TickMarks = ({ center, padding, strokeWidth }) => {
  const tickProps = {
    stroke: "darkgrey",
    strokeWidth: 1 / strokeWidth
  };
  return (
    <React.Fragment>
      {/* top */}
      <path d={`M ${center},0 v ${padding}`} {...tickProps} />
      {/* middle */}
      <path d={`M ${2 * center},${center} h -${padding}`} {...tickProps} />
      {/* top */}
      <path d={`M ${center},${2 * center} v -${padding}`} {...tickProps} />
    </React.Fragment>
  );
};

function App() {
  return (
    <div className="App">
      <svg
        width={200}
        height={200}
        viewBox={viewBox}
        className="donut"
        transform="scale(-1, 1)"
      >
        <TickMarks
          center={center}
          padding={padding}
          strokeWidth={strokeWidth}
        />
        <DoughnutChart
          value={{ value: Math.random() * 100, color: "#03bbe8" }}
          initialOffset={-75}
          segmentScaling={0.5}
        />
      </svg>
      <svg width={200} height={200} viewBox={viewBox} className="donut">
        <TickMarks
          center={center}
          padding={padding}
          strokeWidth={strokeWidth}
        />
        <DoughnutChart
          value={{ value: Math.random() * 100, color: "#03bbe8" }}
          initialOffset={-75}
          segmentScaling={0.5}
        />
      </svg>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
