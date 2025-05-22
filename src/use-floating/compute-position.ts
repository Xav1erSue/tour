import {
  Align,
  Middleware,
  MiddlewareContext,
  Placement,
  Position,
  Side,
} from './types';
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

  const [side = 'bottom', align = 'center'] = placement.split('-') as [
    Side,
    Align,
  ];

  const sideOffsets: Record<Side, Position> = {
    top: { x: 0, y: referenceRect.y - floatingRect.height },
    bottom: { x: 0, y: referenceRect.y + referenceRect.height },
    left: { x: referenceRect.x - floatingRect.width, y: 0 },
    right: { x: referenceRect.x + referenceRect.width, y: 0 },
  };

  const alignOffsets: Record<Align, Record<Side, Position>> = {
    start: {
      top: { x: referenceRect.x, y: 0 },
      bottom: { x: referenceRect.x, y: 0 },
      left: {
        x: 0,
        y: referenceRect.y + (referenceRect.height - floatingRect.height) / 2,
      },
      right: {
        x: 0,
        y: referenceRect.y + (referenceRect.height - floatingRect.height) / 2,
      },
    },
    end: {
      top: {
        x: referenceRect.x + referenceRect.width - floatingRect.width,
        y: 0,
      },
      bottom: {
        x: referenceRect.x + referenceRect.width - floatingRect.width,
        y: 0,
      },
      left: {
        x: 0,
        y: referenceRect.y + (referenceRect.height - floatingRect.height) / 2,
      },
      right: {
        x: 0,
        y: referenceRect.y + (referenceRect.height - floatingRect.height) / 2,
      },
    },
    center: {
      top: {
        x: referenceRect.x + (referenceRect.width - floatingRect.width) / 2,
        y: 0,
      },
      bottom: {
        x: referenceRect.x + (referenceRect.width - floatingRect.width) / 2,
        y: 0,
      },
      left: {
        x: 0,
        y: referenceRect.y + (referenceRect.height - floatingRect.height) / 2,
      },
      right: {
        x: 0,
        y: referenceRect.y + (referenceRect.height - floatingRect.height) / 2,
      },
    },
  };

  const sideOffset = sideOffsets[side];
  const alignOffset = alignOffsets[align][side];

  x = sideOffset.x + alignOffset.x;
  y = sideOffset.y + alignOffset.y;

  const ctx: MiddlewareContext = {
    reference,
    floating,
    position: { x, y },
    platform,
    side,
    align,
  };

  for (const middleware of middlewares) {
    await middleware.fn(ctx);
  }

  return ctx.position;
};
