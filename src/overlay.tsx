import React from 'react';
import { generateStageSvgPathString } from './stage';
import { OverlayProps } from './types';

const Overlay: React.FC<OverlayProps> = (props) => {
  const { stagePosition, windowInnerWidth, windowInnerHeight } = props;

  const pathString = generateStageSvgPathString(stagePosition, {
    windowInnerWidth,
    windowInnerHeight,
  });

  return (
    <svg
      className="tour-overlay"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${windowInnerWidth} ${windowInnerHeight}`}
    >
      <path d={pathString} />
    </svg>
  );
};

export default Overlay;
