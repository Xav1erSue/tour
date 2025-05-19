import React from 'react';
import { Card } from './components';
import { TourContext, TourContextType, TourStep, useTour } from '../../../src';
import './styles.css';

const contextValue: Required<TourContextType> = {
  component: 'div',
  popoverClassName: 'tour-popover',
  overlayClassName: 'tour-overlay',
  getElementById: (id) => Promise.resolve(document.getElementById(id)),
  getStagePosition: (node) => Promise.resolve(node.getBoundingClientRect()),
  getWindowInnerWidth: () => Promise.resolve(window.innerWidth),
  getWindowInnerHeight: () => Promise.resolve(window.innerHeight),
  getPortalContainer: () => document.body,
};

const steps: TourStep[] = [
  {
    id: 'step-1',
    placement: 'bottom',
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
    placement: 'bottom',
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
    placement: 'bottom',
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
  const { start, renderOverlay, renderPopover } = useTour({ steps });

  return (
    <>
      <button onClick={() => start()}>start</button>
      <div id="step-1">step 1</div>
      <div id="step-2">step 2</div>
      <div id="step-3">step 3</div>
      {renderOverlay()}
      {renderPopover()}
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
