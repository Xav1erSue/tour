import React from 'react';
import { generateStageSvgPathString } from './stage';
import { OverlayProps } from './types';

const Overlay: React.FC<OverlayProps> = (props) => {
  const { stagePosition, windowInnerWidth, windowInnerHeight, ...rest } = props;

  const pathString = generateStageSvgPathString(stagePosition, {
    windowInnerWidth,
    windowInnerHeight,
  });

  return (
    <svg
      {...rest}
      style={{ width: '100%', height: '100%' }}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${windowInnerWidth} ${windowInnerHeight}`}
    >
      <path d={pathString} />
    </svg>
  );
};

export default Overlay;
