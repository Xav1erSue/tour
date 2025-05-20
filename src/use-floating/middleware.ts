import type { Middleware, Side } from './types';

export interface OffsetOptions {
  offsetX?: number;
  offsetY?: number;
}

export const offset = (options: OffsetOptions): Middleware<OffsetOptions> => ({
  name: 'offset',
  options,
  fn: (context) => {
    if (context.side === 'top') {
      if (options.offsetY) {
        context.position.y = context.position.y - options.offsetY;
      }
      if (options.offsetX) {
        context.position.x = context.position.x + options.offsetX;
      }
    }

    if (context.side === 'bottom') {
      if (options.offsetY) {
        context.position.y = context.position.y + options.offsetY;
      }
      if (options.offsetX) {
        context.position.x = context.position.x + options.offsetX;
      }
    }

    if (context.side === 'left') {
      if (options.offsetX) {
        context.position.x = context.position.x - options.offsetX;
      }
      if (options.offsetY) {
        context.position.y = context.position.y + options.offsetY;
      }
    }

    if (context.side === 'right') {
      if (options.offsetX) {
        context.position.x = context.position.x + options.offsetX;
      }
      if (options.offsetY) {
        context.position.y = context.position.y + options.offsetY;
      }
    }

    return context;
  },
});

const FLIP_MAP: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

export const flip = (): Middleware => ({
  name: 'flip',
  options: {},
  fn: async (context) => {
    const [referenceRect, floatingRect] = await Promise.all([
      context.platform.getElementRectById(context.reference.id),
      context.platform.getElementRectById(context.floating.id),
    ]);

    if (!referenceRect || !floatingRect) return context;

    if (
      context.side === 'top' &&
      context.position.y - floatingRect.height <= 0
    ) {
      context.side = FLIP_MAP[context.side];
      context.position.y =
        referenceRect.y - context.position.y + referenceRect.height;
    }

    if (
      context.side === 'left' &&
      context.position.x - floatingRect.width <= 0
    ) {
      context.side = FLIP_MAP[context.side];
      context.position.x =
        referenceRect.x - context.position.x + referenceRect.width;
    }

    if (
      context.side === 'bottom' &&
      context.position.y + floatingRect.height >=
        context.platform.window.innerHeight
    ) {
      context.side = FLIP_MAP[context.side];
      context.position.y =
        context.position.y - referenceRect.y + referenceRect.height;
    }

    if (
      context.side === 'right' &&
      context.position.x + floatingRect.width >
        context.platform.window.innerWidth
    ) {
      context.side = FLIP_MAP[context.side];
      context.position.x =
        context.position.x - referenceRect.x + referenceRect.width;
    }

    return context;
  },
});
