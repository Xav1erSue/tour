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
import {
  MutationObserverType,
  ResizeObserverType,
  UseHighlightProps,
} from './types';

export const useHighlight = (props: UseHighlightProps) => {
  const { onDestroy } = props;

  const onDestroyRef = useRef(onDestroy);
  onDestroyRef.current = onDestroy;

  const context = useContext(TourContext);

  const overlayRootRef = useRef<any>();
  const popoverRootRef = useRef<any>();

  const overlayContainerRef = useRef<any>();
  const popoverContainerRef = useRef<any>();

  // 添加状态存储当前高亮的元素ID和弹窗内容
  const currentHighlightIdRef = useRef<string | null>(null);
  const currentPopoverRef = useRef<React.ReactNode | null>(null);
  const currentPlacementRef = useRef<Placement | undefined>();

  // 添加状态存储观察器
  const resizeObserverRef = useRef<ResizeObserverType | null>(null);
  const mutationObserverRef = useRef<MutationObserverType | null>(null);

  const [placement, setPlacement] = useState<Placement>();

  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    placement,
    middleware: [flip(), offset(15)],
  });

  useEffect(() => {
    if (!popoverContainerRef.current) return;
    context.setStyle(popoverContainerRef.current, floatingStyles);
  }, [floatingStyles, context]);

  // 清理所有观察器
  const cleanupObservers = useCallback(() => {
    // 清理 ResizeObserver
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }

    // 清理 MutationObserver
    if (mutationObserverRef.current) {
      mutationObserverRef.current.disconnect();
      mutationObserverRef.current = null;
    }
  }, []);

  const destroy = useCallback(() => {
    if (!overlayRootRef.current || !popoverRootRef.current) return;

    overlayRootRef.current?.unmount?.();
    popoverRootRef.current?.unmount?.();

    // 清除当前高亮的元素ID和弹窗内容
    currentHighlightIdRef.current = null;
    currentPopoverRef.current = null;
    currentPlacementRef.current = undefined;

    // 清理所有观察器
    cleanupObservers();

    onDestroyRef.current?.();
  }, [cleanupObservers]);

  // 抽离渲染蒙层和弹窗的共同逻辑
  const renderOverlayAndPopover = useCallback(
    (targetNode: any, popover: React.ReactNode) => {
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

      // 设置引用元素
      refs.setReference(targetNode);

      // 渲染蒙层
      overlayRootRef.current?.render?.(
        <Overlay
          onClick={destroy}
          className="tour-overlay"
          windowInnerWidth={windowInnerWidth}
          windowInnerHeight={windowInnerHeight}
          stagePosition={stagePosition}
        />,
      );

      // 渲染弹窗内容
      popoverRootRef.current?.render?.(
        <div className="tour-popover">{popover}</div>,
      );

      return true;
    },
    [context, refs, destroy],
  );

  // 更新蒙层和弹窗的位置和尺寸
  const updateHighlight = useCallback(() => {
    if (!currentHighlightIdRef.current || !currentPopoverRef.current) return;

    const targetNode = context.getElementById(currentHighlightIdRef.current);
    if (!targetNode) return;

    renderOverlayAndPopover(targetNode, currentPopoverRef.current);
  }, [context, renderOverlayAndPopover]);

  // 设置观察器监听元素变化
  const setupObservers = useCallback(
    (targetNode: any) => {
      // 清理之前的观察器
      cleanupObservers();

      // 创建 ResizeObserver 监听元素大小变化
      resizeObserverRef.current = new ResizeObserver(() => {
        updateHighlight();
      });
      resizeObserverRef.current.observe(targetNode);

      // 创建 MutationObserver 监听元素属性变化（如位置、样式等）
      mutationObserverRef.current = new MutationObserver((mutations) => {
        const shouldUpdate = mutations.some(
          (mutation) =>
            mutation.type === 'attributes' &&
            (mutation.attributeName === 'style' ||
              mutation.attributeName === 'class'),
        );

        if (shouldUpdate) {
          updateHighlight();
        }
      });

      mutationObserverRef.current.observe(targetNode, {
        attributes: true,
        attributeFilter: ['style', 'class'],
      });

      // 监听父元素的滚动事件
      let parent = context.getParentElement(targetNode);
      while (parent) {
        context.addEventListener(parent, 'scroll', updateHighlight);
        parent = context.getParentElement(parent);
      }

      // 监听window的滚动事件
      context.addEventListener(window, 'scroll', updateHighlight);

      return () => {
        // 移除滚动事件监听
        let parent = context.getParentElement(targetNode);
        while (parent) {
          context.removeEventListener(parent, 'scroll', updateHighlight);
          parent = context.getParentElement(parent);
        }
        context.removeEventListener(window, 'scroll', updateHighlight);
      };
    },
    [cleanupObservers, updateHighlight, context],
  );

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
      context.setStyle(overlayContainer, {
        zIndex: '1000',
        position: 'absolute',
      });
      context.appendChild(rootContainer, overlayContainer);
      overlayContainerRef.current = overlayContainer;
    }

    // 获取弹窗节点
    let popoverContainer = context.getElementById(context.popoverContainerId);
    if (!popoverContainer) {
      popoverContainer = context.createElement();
      popoverContainer.id = context.popoverContainerId;
      context.setStyle(popoverContainer, {
        zIndex: '1001',
        position: 'absolute',
      });
      context.appendChild(rootContainer, popoverContainer);
      popoverContainerRef.current = popoverContainer;
    }
    refs.setFloating(popoverContainer);
  }, [context, destroy, refs]);

  // 添加窗口大小变化的监听
  useEffect(() => {
    // 创建一个防抖函数，避免频繁更新
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateHighlight();
      }, 100);
    };

    // 添加窗口大小变化的监听
    context.addEventListener(window, 'resize', handleResize);

    // 清除监听
    return () => {
      context.removeEventListener(window, 'resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [updateHighlight, context]);

  const highlight = useCallback(
    (
      id: string,
      popover: React.ReactNode,
      placement: Placement = 'bottom',
    ): void => {
      setPlacement(placement);

      // 保存当前高亮的元素ID和弹窗内容
      currentHighlightIdRef.current = id;
      currentPopoverRef.current = popover;
      currentPlacementRef.current = placement;

      const targetNode = context.getElementById(id);
      if (!targetNode) {
        return console.error(`targetNode is not found!`);
      }

      // 挂载蒙层节点
      const overlayRoot = context.createRoot(overlayContainerRef.current);
      overlayRootRef.current = overlayRoot;

      // 挂载弹窗节点
      const popoverRoot = context.createRoot(popoverContainerRef.current);
      popoverRootRef.current = popoverRoot;

      // 渲染蒙层和弹窗
      const renderSuccess = renderOverlayAndPopover(targetNode, popover);

      if (renderSuccess) {
        // 设置观察器监听元素变化
        setupObservers(targetNode);
      }
    },
    [context, renderOverlayAndPopover, setupObservers],
  );

  return [highlight, destroy] as const;
};
