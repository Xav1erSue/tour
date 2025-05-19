import { useCallback, useEffect, useState } from 'react';
import { TourStepContext, UseTourProps } from './types';
import { useHighlight } from './use-highlight';

export const useTour = (props: UseTourProps) => {
  const { steps } = props;

  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const { highlight, destroy, renderOverlay, renderPopover } = useHighlight({
    onDestroy: () => setCurrentStepIndex(-1),
  });

  const next = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [currentStepIndex, steps]);

  const start = useCallback(
    (index: number = 0) => setCurrentStepIndex(index),
    [],
  );

  useEffect(() => {
    const currentStep =
      currentStepIndex >= 0 ? steps[currentStepIndex] : undefined;

    if (!currentStep) return;

    const context: TourStepContext = {
      next,
      destroy,
      index: currentStepIndex,
      step: currentStep,
    };

    const popover =
      typeof currentStep.popover === 'function'
        ? currentStep.popover(context)
        : currentStep.popover;

    highlight(currentStep.id, popover, currentStep.placement);
  }, [currentStepIndex, highlight, steps, next, destroy]);

  return { next, destroy, start, renderOverlay, renderPopover };
};
