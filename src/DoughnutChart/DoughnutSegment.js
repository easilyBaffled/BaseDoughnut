import { number, string, object } from "prop-types";
import React from "react";

const DoughnutSegment = ({
  value,
  baseCircleProps,
  stroke = "#ce4b99",
  strokeDashoffset
}) => (
  <circle
    className="donut-segment"
    fill="transparent"
    {...baseCircleProps}
    stroke={stroke}
    strokeDasharray={`${value} ${100 - value}`}
    strokeDashoffset={strokeDashoffset}
  />
);

DoughnutSegment.proptypes = {
  value: number.isRequired,
  baseCircleProps: object.isRequired,
  stroke: string,
  strokeDashoffset: number
};

export default DoughnutSegment;
