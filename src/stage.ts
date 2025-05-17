import { StageDefinition } from './types';

interface GenerateStageOptions {
  /** window 宽度，在浏览器环境下是 window.innerWidth */
  windowInnerWidth: number;
  /** window 高度，在浏览器环境下是 window.innerHeight */
  windowInnerHeight: number;
  /** stage padding */
  stagePadding?: number;
  /** stage radius */
  stageRadius?: number;
}

/**
 * 生成舞台的 svg 路径字符串
 */
export const generateStageSvgPathString = (
  stage: StageDefinition,
  options: GenerateStageOptions,
) => {
  const {
    windowInnerWidth,
    windowInnerHeight,
    stagePadding = 8,
    stageRadius = 5,
  } = options;

  const stageWidth = stage.width + stagePadding * 2;
  const stageHeight = stage.height + stagePadding * 2;

  // prevent glitches when stage is too small for radius
  const limitedRadius = Math.min(stageRadius, stageWidth / 2, stageHeight / 2);

  // no value below 0 allowed + round down
  const normalizedRadius = Math.floor(Math.max(limitedRadius, 0));

  const highlightBoxX = stage.x - stagePadding + normalizedRadius;
  const highlightBoxY = stage.y - stagePadding;
  const highlightBoxWidth = stageWidth - normalizedRadius * 2;
  const highlightBoxHeight = stageHeight - normalizedRadius * 2;

  return `M${windowInnerWidth},0L0,0L0,${windowInnerHeight}L${windowInnerWidth},${windowInnerHeight}L${windowInnerWidth},0Z
    M${highlightBoxX},${highlightBoxY} h${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},${normalizedRadius} v${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},${normalizedRadius} h-${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},-${normalizedRadius} v-${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},-${normalizedRadius} z`;
};
