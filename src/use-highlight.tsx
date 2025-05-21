import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { TourContext } from './context';
import Overlay from './overlay';
import { Rect } from './platform';
import Popover from './popover';
import { UseHighlightProps } from './types';
import { flip, offset, Placement, useFloating } from './use-floating';

export const useHighlight = (props: UseHighlightProps) => {
  const { onDestroy } = props;

  const onDestroyRef = useRef(onDestroy);
  onDestroyRef.current = onDestroy;

  const { platform } = useContext(TourContext);

  const [placement, setPlacement] = useState<Placement>();
  const [referenceRect, setReferenceRect] = useState<Rect | null>(null);
  const [popover, setPopover] = useState<React.ReactNode>();

  const { refs, floatingStyles, update } = useFloating({
    placement,
    platform,
    middlewares: [offset({}), flip()],
  });

  const destroy = useCallback(() => {
    setReferenceRect(null);
    setPlacement(undefined);
    setPopover(undefined);
    refs.setReference(null);
    refs.setFloating(null);
    onDestroyRef.current?.();
  }, [refs]);

  useLayoutEffect(() => {
    const handleResize = async () => {
      if (!refs.reference.current) return;
      const rect = await platform.getElementRectById(refs.reference.current.id);
      setReferenceRect(rect);
    };

    const { cleanup: cleanupResize } = platform.onResize(handleResize);
    const { cleanup: cleanupScroll } = platform.onScroll(handleResize);
    return () => {
      cleanupResize();
      cleanupScroll();
    };
  }, [refs.reference, platform, update]);

  const highlight = useCallback(
    async (
      id: string,
      popover: React.ReactNode,
      placement: Placement = 'bottom',
    ) => {
      const [targetNode, targetNodeRect] = await Promise.all([
        platform.getElementById(id),
        platform.getElementRectById(id),
      ]);
      if (!targetNode || !targetNodeRect) {
        return console.error(`targetNode is not found!`);
      }
      refs.setReference({ ...targetNode, id });
      setReferenceRect(targetNodeRect);
      setPopover(popover);
      setPlacement(placement);
    },
    [refs, platform],
  );

  useEffect(() => {
    update();
  }, [referenceRect, update, placement]);

  const renderOverlay = () => {
    if (!referenceRect) return null;

    return (
      <Overlay
        referenceRect={referenceRect}
        windowInnerWidth={platform.window.innerWidth}
        windowInnerHeight={platform.window.innerHeight}
      />
    );
  };

  const renderPopover = () => {
    if (!referenceRect) return null;

    return (
      <Popover style={floatingStyles} setRef={refs.setFloating}>
        {popover}
      </Popover>
    );
  };

  return {
    highlight,
    destroy,
    renderOverlay,
    renderPopover,
  };
};
