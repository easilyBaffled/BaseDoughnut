import { arrayOf, oneOfType, number, exact, string } from "prop-types";
import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const randomColor = () =>
  `rgba(${getRandomInt(255)}, ${getRandomInt(255)}, ${getRandomInt(255)}, 0.8)`;

// A shortcut for displaying values in an error message.
const toString = JSON.stringify;

// initialOffset will rotate the segments from 3 O'clock - where segments normally start - to 12 O'clock at the top of the circle.
// initialOffset is 25 because the circumference is 100
const calculateSegmentOffset = (totalSegments = 0, initialOffset = 25) =>
  -initialOffset + totalSegments;

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
      <DoughnutSegment
        baseCircleProps={{ ...baseCircleProps, strokeWidth: 0.2 }}
        value={adjustSegmentPosition(100, 2)}
        stroke="#03bbe8"
        strokeDashoffset={calculateSegmentOffset(0, -25)}
      />
      {
        values.reduce(
          ({ totalLength, segments }, v, i) => {
            const segmentLength = adjustSegmentPosition(v.value || v, 2);

            return {
              totalLength: totalLength + segmentLength,
              segments: segments.concat(
                <DoughnutSegment
                  key={i}
                  baseCircleProps={baseCircleProps}
                  value={segmentLength}
                  stroke={v.color || randomColor()}
                  strokeDashoffset={calculateSegmentOffset(
                    totalLength + segmentLength,
                    -75
                  )}
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
  exact({ value: number, color: string })
]);

Doughnut.propTypes = {
  value: segmentValueProptype,
  values: arrayOf(segmentValueProptype)
};

function App() {
  return (
    <div className="App">
      <Doughnut value={{ value: getRandomInt(100), color: "#03bbe8" }} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
