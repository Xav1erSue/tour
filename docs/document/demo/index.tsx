import React from 'react';
import { Card } from './components';
import {
  TourContext,
  TourStep,
  useTour,
  Platform,
  VirtualElement,
} from '../../../src';
import './styles.css';

class PlatformH5 extends Platform {
  window = window;

  getElementById(id: string) {
    return document.getElementById(id) as VirtualElement;
  }

  getElementRectById(id: string) {
    const element = document.getElementById(id);
    if (!element) {
      return null;
    }
    return element.getBoundingClientRect();
  }

  createElement(): React.ReactElement {
    return <div />;
  }

  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }

  onResize(callback: () => void) {
    window.addEventListener('resize', callback);
    return {
      cleanup: () => window.removeEventListener('resize', callback),
    };
  }

  onScroll(callback: () => void) {
    window.addEventListener('scroll', callback);
    return {
      cleanup: () => window.removeEventListener('scroll', callback),
    };
  }
}

const steps: TourStep[] = [
  {
    id: 'step-1',
    placement: 'bottom-start',
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
    placement: 'bottom-start',
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
    placement: 'bottom-start',
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
    <TourContext.Provider value={{ platform: new PlatformH5() }}>
      <Demo />
    </TourContext.Provider>
  );
};

export default App;
