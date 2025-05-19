import {
  useFloating,
  autoUpdate,
  flip,
  offset,
  Placement,
} from '@floating-ui/react';
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { TourContext } from './context';
import Overlay from './overlay';
import { StageDefinition, UseHighlightProps } from './types';

export const useHighlight = (props: UseHighlightProps) => {
  const { onDestroy } = props;

  const onDestroyRef = useRef(onDestroy);
  onDestroyRef.current = onDestroy;

  const {
    component: Component = 'div',
    popoverClassName = 'tour-popover',
    overlayClassName = 'tour-overlay',
    getElementById,
    getStagePosition,
    getWindowInnerWidth,
    getWindowInnerHeight,
    getPortalContainer,
  } = useContext(TourContext);

  const [placement, setPlacement] = useState<Placement>();
  const [windowInnerWidth, setWindowInnerWidth] = useState(0);
  const [windowInnerHeight, setWindowInnerHeight] = useState(0);
  const [stagePosition, setStagePosition] = useState<StageDefinition | null>();
  const [popover, setPopover] = useState<React.ReactNode>();

  const { refs, floatingStyles, elements } = useFloating({
    whileElementsMounted: autoUpdate,
    placement,
    middleware: [flip(), offset(15)],
  });

  const destroy = useCallback(() => {
    setPlacement(undefined);
    setStagePosition(undefined);
    setWindowInnerWidth(0);
    setWindowInnerHeight(0);
    setPopover(undefined);
    refs.setReference(null);
    refs.setFloating(null);
    onDestroyRef.current?.();
  }, [refs]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!elements.domReference) return;
      getStagePosition?.(elements.domReference).then(setStagePosition);
      getWindowInnerWidth?.().then(setWindowInnerWidth);
      getWindowInnerHeight?.().then(setWindowInnerHeight);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [
    elements.domReference,
    getStagePosition,
    getWindowInnerWidth,
    getWindowInnerHeight,
  ]);

  const highlight = useCallback(
    async (
      id: string,
      popover: React.ReactNode,
      placement: Placement = 'bottom',
    ) => {
      const targetNode = await getElementById(id);
      if (!targetNode) {
        return console.error(`targetNode is not found!`);
      }
      refs.setReference(targetNode);
      setPopover(popover);
      setPlacement(placement);
      getStagePosition?.(targetNode).then(setStagePosition);
      getWindowInnerWidth?.().then(setWindowInnerWidth);
      getWindowInnerHeight?.().then(setWindowInnerHeight);
    },
    [
      getElementById,
      refs,
      getStagePosition,
      getWindowInnerWidth,
      getWindowInnerHeight,
    ],
  );

  const portalContainer = getPortalContainer?.();

  const renderOverlay = () => {
    if (!stagePosition || !portalContainer) return null;

    return createPortal(
      <Overlay
        className={overlayClassName}
        windowInnerWidth={windowInnerWidth}
        windowInnerHeight={windowInnerHeight}
        stagePosition={stagePosition}
      />,
      portalContainer,
    );
  };

  const renderPopover = () => {
    if (!stagePosition || !portalContainer) return null;

    const componentProps = {
      className: popoverClassName,
      style: floatingStyles,
    };

    return createPortal(
      // @ts-expect-error 复杂类型
      <Component {...componentProps} ref={refs.setFloating}>
        {popover}
      </Component>,
      portalContainer,
    );
  };

  return {
    highlight,
    destroy,
    renderOverlay,
    renderPopover,
  };
};
