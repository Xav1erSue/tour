import { VirtualElement, Platform } from '../platform';
import { Promisable } from '../types';

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'end' | 'center';

/** 位置 */
export type Placement = `${Side}` | `${Side}-${Align}`;

export interface Position {
  x: number;
  y: number;
}

export interface MiddlewareContext {
  reference: VirtualElement;
  floating: VirtualElement;
  position: Position;
  platform: Platform;
  side: Side;
  align: Align;
}

export interface Middleware<T = any> {
  name: string;
  options: T;
  fn: (ctx: MiddlewareContext) => Promisable<void>;
}
