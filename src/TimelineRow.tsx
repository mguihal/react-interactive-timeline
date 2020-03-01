import React, { useEffect, useCallback, useContext } from 'react';
import classnames from 'classnames';

import { TimelineContext, TimelineContextContent } from './context';

import styles from './Timeline.module.css';

type RowElement = {
  left: number,
  right: number,
  width: number,
  height: number,
};

interface Props {
  fixedHeight?: boolean;
  fullHeight?: boolean;
  className?: string;
}

const TimelineRow = <InputDate, ParsedDate, InputDuration, Units>(props: React.PropsWithChildren<Props>) => {
  useContext<TimelineContextContent<InputDate, ParsedDate, InputDuration, Units> | null>(TimelineContext);

  const { fixedHeight, fullHeight, className } = props;

  type EventRefs = {
    containerRef: React.RefObject<HTMLDivElement>;
    barSizeRef: React.RefObject<HTMLDivElement>;
    labelSizeRef: React.RefObject<HTMLDivElement>;
  }

  const rowRef = React.createRef<HTMLDivElement>();
  const refs: EventRefs[] = [];

  const getEventBoundingBox = useCallback((ref: EventRefs) => {
    const containerRef = ref.containerRef.current && ref.containerRef.current.getBoundingClientRect();
    const barSizeRef = ref.barSizeRef.current && ref.barSizeRef.current.getBoundingClientRect();
    const labelSizeRef = ref.labelSizeRef.current && ref.labelSizeRef.current.getBoundingClientRect();

    const getMax = (getAttribute: (e: ClientRect) => number) => Math.max(
      containerRef ? getAttribute(containerRef) : Number.NEGATIVE_INFINITY,
      barSizeRef ? getAttribute(barSizeRef) : Number.NEGATIVE_INFINITY,
      labelSizeRef ? getAttribute(labelSizeRef) : Number.NEGATIVE_INFINITY,
    );

    const getMin = (getAttribute: (e: ClientRect) => number) => Math.min(
      containerRef ? getAttribute(containerRef) : Number.POSITIVE_INFINITY,
      barSizeRef ? getAttribute(barSizeRef) : Number.POSITIVE_INFINITY,
      labelSizeRef ? getAttribute(labelSizeRef) : Number.POSITIVE_INFINITY,
    );

    return {
      left: getMin(e => e.left),
      right: getMax(e => e.right),
      width: getMax(e => e.width),
      height: getMax(e => e.height),
    };
  }, []);

  useEffect(() => {
    const lines: RowElement[][] = [[]];
    const linesHeight = [0];
    const lineByRefIndex: {[key: number]: number} = {};

    const canBeAddedOnLine = (currentLine: RowElement[], currentElement: RowElement) => {
      return !currentLine.some(testedElement => (
        (currentElement.left <= testedElement.left && currentElement.right >= testedElement.right) ||
        (testedElement.left <= currentElement.left && testedElement.right >= currentElement.right) ||
        (currentElement.left >= testedElement.left && currentElement.left <= testedElement.right) ||
        (testedElement.left >= currentElement.left && testedElement.left <= currentElement.right) ||
        (currentElement.right >= testedElement.left && currentElement.right <= testedElement.right) ||
        (testedElement.right >= currentElement.left && testedElement.right <= currentElement.right)
      ));
    }

    refs.forEach((ref, refIndex) => {
      const currentElement = getEventBoundingBox(ref);
      let foundLine = false;

      for (let currentLineIndex = 0; currentLineIndex < lines.length; currentLineIndex++) {
        if (canBeAddedOnLine(lines[currentLineIndex], currentElement)) {
          foundLine = true;
          lines[currentLineIndex].push(currentElement);
          linesHeight[currentLineIndex] = Math.max(linesHeight[currentLineIndex] || 0, currentElement.height);
          lineByRefIndex[refIndex] = currentLineIndex;
          break;
        }
      }

      if (!foundLine) {
        lines.push([currentElement]);
        linesHeight[lines.length - 1] = currentElement.height;
        lineByRefIndex[refIndex] = lines.length - 1;
      }
    });

    refs.forEach((ref, refIndex) => {
      if (ref.containerRef.current) {
        ref.containerRef.current.style.top = (20 * lineByRefIndex[refIndex] + linesHeight.reduce((acc, height, index) => {
          return acc + (index < lineByRefIndex[refIndex] ? height : 0);
        }, 0)) + 'px';
      }
    });

    if (rowRef && rowRef.current && !fixedHeight && !fullHeight) {
      rowRef.current.style.height = (20 * (lines.length - 1) + linesHeight.reduce((acc, height) => {
        return acc + height;
      }, 0)) + 'px';
    }
  });

  return (
    <div className={classnames(
      styles.timelineRow,
      fullHeight ? styles.timelineRowFullHeight : null,
      className
    )} ref={rowRef}>
      {React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
          const sizeRefs = {
            containerRef: React.createRef<HTMLDivElement>(),
            barSizeRef: React.createRef<HTMLDivElement>(),
            labelSizeRef: React.createRef<HTMLDivElement>(),
          };

          refs.push(sizeRefs);
          return React.cloneElement(child, { sizeRefs, fullHeight });
        }
      })}
    </div>
  );
};

export default TimelineRow;
