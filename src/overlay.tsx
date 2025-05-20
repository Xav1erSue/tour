import React, { useContext } from 'react';
import { TourContext } from './context';
import { Rect } from './platform';

interface GenerateOverlayOptions {
  /** window 宽度，在浏览器环境下是 window.innerWidth */
  windowInnerWidth: number;
  /** window 高度，在浏览器环境下是 window.innerHeight */
  windowInnerHeight: number;
  /** stage padding */
  stagePadding?: number;
  /** stage radius */
  stageRadius?: number;
}

const generateOverlaySvgPathString = (
  referenceRect: Rect,
  options: GenerateOverlayOptions,
) => {
  const {
    windowInnerWidth,
    windowInnerHeight,
    stagePadding = 8,
    stageRadius = 5,
  } = options;

  const stageWidth = referenceRect.width + stagePadding * 2;
  const stageHeight = referenceRect.height + stagePadding * 2;

  // prevent glitches when stage is too small for radius
  const limitedRadius = Math.min(stageRadius, stageWidth / 2, stageHeight / 2);

  // no value below 0 allowed + round down
  const normalizedRadius = Math.floor(Math.max(limitedRadius, 0));

  const highlightBoxX = referenceRect.x - stagePadding + normalizedRadius;
  const highlightBoxY = referenceRect.y - stagePadding;
  const highlightBoxWidth = stageWidth - normalizedRadius * 2;
  const highlightBoxHeight = stageHeight - normalizedRadius * 2;

  return `M${windowInnerWidth},0L0,0L0,${windowInnerHeight}L${windowInnerWidth},${windowInnerHeight}L${windowInnerWidth},0Z
    M${highlightBoxX},${highlightBoxY} h${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},${normalizedRadius} v${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},${normalizedRadius} h-${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},-${normalizedRadius} v-${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},-${normalizedRadius} z`;
};

interface OverlayProps {
  /** window 宽度，在浏览器环境下是 window.innerWidth */
  windowInnerWidth: number;
  /** window 高度，在浏览器环境下是 window.innerHeight */
  windowInnerHeight: number;
  /** 高亮元素 Rect */
  referenceRect: Rect;
}

const Overlay: React.FC<OverlayProps> = (props) => {
  const { referenceRect, windowInnerWidth, windowInnerHeight } = props;

  const { platform, overlayClassName = 'tour-overlay' } =
    useContext(TourContext);

  const pathString = generateOverlaySvgPathString(referenceRect, {
    windowInnerWidth,
    windowInnerHeight,
  });

  const svgStr = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${windowInnerWidth} ${windowInnerHeight}"><path d="${pathString}" fill="black" /></svg>`;

  const svgUrl = 'data:image/svg+xml,' + encodeURIComponent(svgStr);

  const element = platform.createElement();

  return React.cloneElement(element, {
    className: overlayClassName,
    style: { background: `url(${svgUrl})` },
  });
};

export default Overlay;
