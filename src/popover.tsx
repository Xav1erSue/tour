import React, { useContext, useEffect, useState } from 'react';
import { TourContext } from './context';
import { VirtualElement } from './platform';

interface PopoverProps
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLElement>> {
  style: React.CSSProperties;
  setRef: (element: VirtualElement) => void;
}

const Popover: React.FC<PopoverProps> = (props) => {
  const { style, setRef, children } = props;
  const [id] = useState(
    `tour-popover-${Math.random().toString(16).substring(2, 8)}`,
  );

  const { platform, popoverClassName = 'tour-popover' } =
    useContext(TourContext);

  const element = platform.createElement();

  useEffect(() => {
    setRef({ id });
  }, [setRef, id]);

  return React.cloneElement(element, {
    id,
    className: popoverClassName,
    style,
    children,
  });
};

export default Popover;
