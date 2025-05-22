import { Promisable } from './types';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VirtualElement {
  readonly id: string;
  [key: string]: any;
}

export interface VirtualWindow {
  readonly innerWidth: number;
  readonly innerHeight: number;
}

export abstract class Platform {
  abstract readonly window: VirtualWindow;
  /** 通过 id 查找元素 */
  abstract getElementById(id: string): Promisable<VirtualElement | null>;
  /** 通过 id 查找元素的 Rect */
  abstract getElementRectById(id: string): Promisable<Rect | null>;
  /** 创建元素 */
  abstract createElement(): React.ReactElement;
  /** 创建 SVG 元素 */
  abstract createSVGImageElement(src: string): React.ReactElement;
  /** 获取设备像素比 */
  abstract getDevicePixelRatio(): number;
  /** 监听窗口 resize 事件 */
  abstract onResize(callback: () => void): { cleanup: () => void };
  /** 监听窗口 scroll 事件 */
  abstract onScroll(callback: () => void): { cleanup: () => void };
}
