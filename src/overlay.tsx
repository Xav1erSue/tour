import React from 'react';
import { generateStageSvgPathString } from './stage';
import { OverlayProps } from './types';

const Overlay: React.FC<OverlayProps> = (props) => {
  const { stagePosition, windowInnerWidth, windowInnerHeight, ...rest } = props;

  const pathString = generateStageSvgPathString(stagePosition, {
    windowInnerWidth,
    windowInnerHeight,
  });

  const svgStr = `
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${windowInnerWidth} ${windowInnerHeight}"
    >
      <path d="${pathString}" />
    </svg>
  `;

  const svgFile = new Blob([svgStr], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgFile);

  return <img {...rest} src={svgUrl} />;
};

export default Overlay;
