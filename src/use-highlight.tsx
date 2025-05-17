import {
  useFloating,
  autoUpdate,
  flip,
  offset,
  Placement,
} from '@floating-ui/react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { TourContext } from './context';
import Overlay from './overlay';
import { UseHighlightProps } from './types';

export const useHighlight = (props: UseHighlightProps) => {
  const { onDestroy } = props;

  const onDestroyRef = useRef(onDestroy);
  onDestroyRef.current = onDestroy;

  const context = useContext(TourContext);

  const overlayRootRef = useRef<any>();
  const popoverRootRef = useRef<any>();

  const overlayContainerRef = useRef<any>();
  const popoverContainerRef = useRef<any>();

  const [placement, setPlacement] = useState<Placement>();

  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    placement,
    middleware: [flip(), offset(15)],
  });

  useEffect(() => {
    if (!popoverContainerRef.current) return;
    Object.assign(popoverContainerRef.current.style, floatingStyles);
  }, [floatingStyles]);

  const destroy = useCallback(() => {
    if (!overlayRootRef.current || !popoverRootRef.current) return;

    overlayRootRef.current?.unmount?.();
    popoverRootRef.current?.unmount?.();

    onDestroyRef.current?.();
  }, []);

  useEffect(() => {
    const rootContainer = context.getTourContainer();
    if (!rootContainer) {
      return console.error(`rootContainer is not found!`);
    }

    // 获取蒙层节点
    let overlayContainer = context.getElementById(context.overlayContainerId);
    if (!overlayContainer) {
      overlayContainer = context.createElement();
      overlayContainer.id = context.overlayContainerId;
      overlayContainer.style.zIndex = '1000';
      overlayContainer.style.position = 'absolute';
      context.appendChild(rootContainer, overlayContainer);
      overlayContainerRef.current = overlayContainer;
    }

    // 获取弹窗节点
    let popoverContainer = context.getElementById(context.popoverContainerId);
    if (!popoverContainer) {
      popoverContainer = context.createElement();
      popoverContainer.id = context.popoverContainerId;
      popoverContainer.style.zIndex = '1001';
      popoverContainer.style.position = 'absolute';
      context.appendChild(rootContainer, popoverContainer);
      popoverContainerRef.current = popoverContainer;
    }
    refs.setFloating(popoverContainer);
  }, [context, destroy, refs]);

  const highlight = useCallback(
    (
      id: string,
      popover: React.ReactNode,
      placement: Placement = 'bottom',
    ): void => {
      setPlacement(placement);
      const targetNode = context.getElementById(id);
      if (!targetNode) {
        return console.error(`targetNode is not found!`);
      }
      refs.setReference(targetNode);

      // 挂载蒙层节点
      const overlayRoot = context.createRoot(overlayContainerRef.current);
      overlayRootRef.current = overlayRoot;

      // 挂载弹窗节点
      const popoverRoot = context.createRoot(popoverContainerRef.current);
      popoverRootRef.current = popoverRoot;

      const stagePosition = context.getStagePosition?.(targetNode);
      if (!stagePosition) {
        return console.error(`stagePosition is not found!`);
      }
      const windowInnerWidth = context.getWindowInnerWidth?.();
      if (!windowInnerWidth) {
        return console.error(`windowInnerWidth is not found!`);
      }

      const windowInnerHeight = context.getWindowInnerHeight?.();
      if (!windowInnerHeight) {
        return console.error(`windowInnerHeight is not found!`);
      }

      overlayRootRef.current?.render?.(
        <Overlay
          onClick={destroy}
          className="tour-overlay"
          windowInnerWidth={windowInnerWidth}
          windowInnerHeight={windowInnerHeight}
          stagePosition={stagePosition}
        />,
      );

      popoverRootRef.current?.render?.(
        <div className="tour-popover">{popover}</div>,
      );
    },
    [context, refs, destroy],
  );

  return [highlight, destroy] as const;
};
