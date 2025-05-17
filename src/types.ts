import { Placement } from '@floating-ui/react';

interface Root {
  /** 将组件渲染到节点中 */
  render: (component: React.ReactNode) => void;
  /** 卸载节点 */
  unmount: () => void;
}

export interface TourContextType<Node = HTMLElement> {
  /** 创建根节点方法 */
  createRoot: (targetNode: Node) => Root;
  /** 获取节点方法 */
  getElementById: (id: string) => Node | null;
  /** 获取 stage 位置方法 */
  getStagePosition: (node: Node) => StageDefinition | null;
  /** 获取窗口宽度 */
  getWindowInnerWidth: () => number;
  /** 获取窗口高度 */
  getWindowInnerHeight: () => number;
  /** 创建元素方法 */
  createElement: () => Node;
  /** 添加子节点方法 */
  appendChild: (parentNode: Node, targetNode: Node) => void;
  /** 获取 tour 组件挂载的容器 */
  getTourContainer: () => Node | null;
  /** overlay 容器 id */
  overlayContainerId: string;
  /** popover 容器 id */
  popoverContainerId: string;

  /** 设置元素样式 */
  setStyle: (node: Node, styles: React.CSSProperties) => void;
  /** 获取元素父节点 */
  getParentElement: (node: Node) => Node | null;
  /** 添加事件监听 */
  addEventListener: (
    node: Node | Window,
    eventName: string,
    handler: () => void,
  ) => void;
  /** 移除事件监听 */
  removeEventListener: (
    node: Node | Window,
    eventName: string,
    handler: () => void,
  ) => void;
}

// 抽象观察器接口
export interface ResizeObserverType {
  observe: (target: any) => void;
  disconnect: () => void;
}

export interface MutationObserverType {
  observe: (target: any, options: any) => void;
  disconnect: () => void;
}

export interface StageDefinition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OverlayProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
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
  placement?: Placement;
}

export interface UseTourProps {
  steps: TourStep[];
}
