import { Platform } from './platform';
import { Placement } from './use-floating';

export type Promisable<T> = T | Promise<T>;

export interface TourContextType {
  platform: Platform;
  popoverClassName?: string;
  overlayClassName?: string;
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
