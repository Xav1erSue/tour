import React from 'react';
import { createRoot } from 'react-dom/client';
import { TourContext, TourContextType, TourStep, useTour } from 'tour';
import { Card } from './components';

const contextValue: Required<TourContextType<HTMLElement>> = {
  createRoot,
  getTourContainer: () => document.body,
  overlayContainerId: 'tour-overlay-container', // need to be unique
  popoverContainerId: 'tour-popover-container', // need to be unique
  createElement: () => document.createElement('div'),
  appendChild: (parentNode, node) => parentNode.appendChild(node),
  getElementById: (id) => document.getElementById(id),
  getStagePosition: (node) => node.getBoundingClientRect(),
  getWindowInnerWidth: () => window.innerWidth,
  getWindowInnerHeight: () => window.innerHeight,
};

const steps: TourStep[] = [
  {
    id: 'step-1',
    popover: ({ next, destroy }) => (
      <Card
        title="step 1"
        actions={[
          { label: 'cancel', onClick: () => destroy() },
          { label: 'next', onClick: () => next() },
        ]}
      >
        <div>content</div>
      </Card>
    ),
  },
  {
    id: 'step-2',
    popover: ({ next, destroy }) => (
      <Card
        title="step 2"
        actions={[
          { label: 'cancel', onClick: () => destroy() },
          { label: 'next', onClick: () => next() },
        ]}
      >
        <div>content</div>
      </Card>
    ),
  },
  {
    id: 'step-3',
    popover: ({ destroy }) => (
      <Card
        title="step 3"
        actions={[{ label: 'cancel', onClick: () => destroy() }]}
      >
        <div>content</div>
      </Card>
    ),
  },
];

const Demo: React.FC = () => {
  const { start } = useTour({ steps });

  return (
    <>
      <button onClick={() => start()}>start</button>
      <div id="step-1">step 1</div>
      <div id="step-2">step 2</div>
      <div id="step-3">step 3</div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <TourContext.Provider value={contextValue}>
      <Demo />
    </TourContext.Provider>
  );
};

export default App;
