import { Placement } from '@floating-ui/react';

export interface TourContextType<Node = Element> {
  component: keyof JSX.IntrinsicElements;
  /** 弹窗类名 */
  popoverClassName?: string;
  /** 遮罩层类名 */
  overlayClassName?: string;
  /** 获取节点方法 */
  getElementById: (id: string) => Promise<Node | null>;
  /** 获取 stage 位置方法 */
  getStagePosition: (node: Node) => Promise<StageDefinition | null>;
  /** 获取窗口宽度 */
  getWindowInnerWidth: () => Promise<number>;
  /** 获取窗口高度 */
  getWindowInnerHeight: () => Promise<number>;
}

export interface StageDefinition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OverlayProps {
  /** 类名 */
  className?: string;
  /** window 宽度，在浏览器环境下是 window.innerWidth */
  windowInnerWidth: number;
  /** window 高度，在浏览器环境下是 window.innerHeight */
  windowInnerHeight: number;
  /** stage 位置 */
  stagePosition: StageDefinition;
}

export interface UseHighlightProps {
  /** 销毁回调 */
  onDestroy?: () => void;
}

export interface TourStepContext {
  /** 下一步 */
  next: () => void;
  /** 销毁 */
  destroy: () => void;
  /** 当前步骤索引 */
  index: number;
  /** 当前步骤配置 */
  step: TourStep;
}

export interface TourStep {
  /** 高亮元素的 id */
  id: string;
  /** 高亮元素的弹窗内容 */
  popover: React.ReactNode | ((context: TourStepContext) => React.ReactNode);
  /** 弹窗位置 */
  placement?: Placement;
}

export interface UseTourProps {
  steps: TourStep[];
}
