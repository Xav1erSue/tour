import { Align, Middleware, Placement, Position, Side } from './types';
import { VirtualElement, Platform } from '../platform';

export interface ComputePositionOptions {
  placement?: Placement;
  platform: Platform;
  middlewares: Middleware<unknown>[];
}

export const computePosition = async (
  reference: VirtualElement,
  floating: VirtualElement,
  options: ComputePositionOptions,
): Promise<Position> => {
  const { placement = 'bottom', platform, middlewares } = options;

  const [referenceRect, floatingRect] = await Promise.all([
    platform.getElementRectById(reference.id),
    platform.getElementRectById(floating.id),
  ]);

  let x = 0;
  let y = 0;

  if (!referenceRect || !floatingRect) {
    return { x, y };
  }

  const [side, align] = placement.split('-') as [Side, Align | undefined];

  if (side === 'top') {
    y = referenceRect.y - floatingRect.height;
  }

  if (side === 'bottom') {
    y = referenceRect.y + referenceRect.height;
  }

  if (side === 'left') {
    x = referenceRect.x - floatingRect.width;
  }

  if (side === 'right') {
    x = referenceRect.x + referenceRect.width;
  }

  if (align === 'start') {
    if (['top', 'bottom'].includes(side)) {
      x = referenceRect.x;
    } else {
      y = referenceRect.y + (referenceRect.height - floatingRect.height) / 2;
    }
  }

  if (align === 'end') {
    if (['top', 'bottom'].includes(side)) {
      x = referenceRect.x + referenceRect.width - floatingRect.width;
    } else {
      y = referenceRect.y + (referenceRect.height - floatingRect.height) / 2;
    }
  }

  if (!align) {
    if (['top', 'bottom'].includes(side)) {
      x = referenceRect.x + (referenceRect.width - floatingRect.width) / 2;
    } else {
      y = referenceRect.y + (referenceRect.height - floatingRect.height) / 2;
    }
  }

  let ctx = {
    reference,
    floating,
    position: { x, y },
    platform,
    side,
    align,
  };

  for (const middleware of middlewares) {
    ctx = await middleware.fn(ctx);
  }

  return ctx.position;
};
