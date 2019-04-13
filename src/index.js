import { arrayOf, oneOfType, number, exact, string } from "prop-types";
import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const randomColor = () =>
  `rgb(${getRandomInt(255)}, ${getRandomInt(255)}, ${getRandomInt(255)})`;

// A shortcut for displaying values in an error message.
const toString = JSON.stringify;

// initialOffset will rotate the segments from 3 O'clock - where segments normally start - to 12 O'clock at the top of the circle.
// initialOffset is 25 because the circumference is 100
const calculateSegmentOffset = (totalSegments = 0, initialOffset = 25) =>
  100 - totalSegments + initialOffset;

const adjustSegmentPosition = (value, adjustment = 1) => value / adjustment;

const DoughnutSegment = ({
  value,
  baseCircleProps,
  stroke = "#ce4b99",
  strokeDashoffset
}) => (
  <circle
    className="donut-segment"
    {...baseCircleProps}
    fill="transparent"
    stroke={stroke}
    strokeDasharray={`${value} ${100 - value}`}
    strokeDashoffset={strokeDashoffset}
  />
);

const Doughnut = ({
  value,
  values,
  height = "100%",
  width = "100%",
  strokeWidth = 3
}) => {
  if (value && values) {
    throw new TypeError(
      `Doughnut can only take value( ${toString(value)} ) or values( ${toString(
        values
      )} ), not both.`
    );
  }

  if (value) values = [value];

  if (values.reduce((total, v) => total + (v.value || v)) > 100)
    throw new TypeError(
      `Doughnut values( ${toString(values)} ) cannot add up to more than 100.`
    );

  const padding = 1,
    radius = 100 / (2 * Math.PI), // Use 100 as the circumference and then all values can be made to be of 100% and fit neatly in the circle
    center = radius + strokeWidth,
    viewBox = `0 0 ${2 * (center + padding)} ${2 * (center + padding)}`; // TODO: padding here or as css?

  const baseCircleProps = { cx: center, cy: center, r: radius, strokeWidth };

  return (
    <svg width={width} height={height} viewBox={viewBox} className="donut">
      <circle className="donut-hole" {...baseCircleProps} fill="#fff" />
      <circle
        className="donut-ring"
        {...baseCircleProps}
        fill="transparent"
        stroke="#d2d3d4"
      />
      {
        values.reduce(
          ({ totalLength, segments }, v, i) => {
            const segmentLength = adjustSegmentPosition(v.value || v);

            return {
              totalLength: totalLength + segmentLength,
              segments: segments.concat(
                <DoughnutSegment
                  key={i}
                  baseCircleProps={baseCircleProps}
                  value={segmentLength}
                  stroke={v.color || randomColor()}
                  strokeDashoffset={calculateSegmentOffset(totalLength)}
                />
              )
            };
          },
          { totalLength: 0, segments: [] }
        ).segments
      }
    </svg>
  );
};

const segmentValueProptype = oneOfType([
  number.isRequired,
  exact({ value: number.isRequired, color: string.isRequired })
]);

Doughnut.propTypes = {
  value: segmentValueProptype,
  values: arrayOf(segmentValueProptype)
};

function App() {
  return (
    <div className="App">
      <Doughnut values={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
