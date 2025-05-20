import { useCallback, useMemo, useRef, useState } from 'react';
import { computePosition } from './compute-position';
import { Middleware, Placement, Position } from './types';
import { VirtualElement, Platform } from '../platform';

const useLatest = <T>(value: T) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};

export interface UseFloatingOptions {
  placement?: Placement;
  platform: Platform;
  middlewares: Middleware<unknown>[];
  strategy?: 'absolute' | 'fixed';
}

export const useFloating = (options: UseFloatingOptions) => {
  const { placement, platform, middlewares, strategy = 'fixed' } = options;

  const placementRef = useLatest(placement);
  const platformRef = useLatest(platform);
  const middlewaresRef = useLatest(middlewares);

  const reference = useRef<VirtualElement | null>(null);
  const setReference = useCallback((element: VirtualElement | null) => {
    reference.current = element;
  }, []);

  const floating = useRef<VirtualElement | null>(null);
  const setFloating = useCallback((element: VirtualElement | null) => {
    floating.current = element;
  }, []);

  const refs = useMemo(
    () => ({
      reference,
      setReference,
      floating,
      setFloating,
    }),
    [reference, setReference, floating, setFloating],
  );

  const [position, setPosition] = useState<Position>();

  const update = useCallback(async () => {
    if (!reference.current || !floating.current) {
      return;
    }

    const options = {
      placement: placementRef.current,
      platform: platformRef.current,
      middlewares: middlewaresRef.current,
    };

    const position = await computePosition(
      reference.current,
      floating.current,
      options,
    );

    setPosition(position);
  }, [placementRef, platformRef, middlewaresRef]);

  const floatingStyles = useMemo<React.CSSProperties>(() => {
    if (!position)
      return {
        position: strategy,
        left: '0',
        top: '0',
      };

    const dpr = platform.getDevicePixelRatio();
    const toPx = (value: number) => `${Math.round(value * dpr) / dpr}px`;

    return {
      position: strategy,
      left: toPx(position.x),
      top: toPx(position.y),
    };
  }, [position, strategy, platform]);

  return {
    refs,
    floatingStyles,
    update,
  };
};
