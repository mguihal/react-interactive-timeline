import classnames from 'classnames';
import React, { CSSProperties, useCallback, useEffect } from 'react';
import styles from './Timeline.module.css';

type RowElement = {
  left: number;
  right: number;
  height: number;
};

interface Props {
  fixedHeight?: boolean;
  fullHeight?: boolean;
  className?: string;
  style?: CSSProperties;
}

const SECURITY_MARGIN = 5; // px
const VERTICAL_MARGIN = 20; // px

const TimelineRow = <InputDate, ParsedDate, InputDuration, Units>(
  props: React.PropsWithChildren<Props>
) => {
  const { fixedHeight, fullHeight, className, style } = props;

  const rowRef = React.createRef<HTMLDivElement>();
  const refs: React.RefObject<HTMLDivElement>[][] = [];

  const getEventBoundingBox = useCallback(
    (refs: React.RefObject<HTMLDivElement>[]) => {
      const boundingBoxes = refs.map(
        ref => ref.current && ref.current.getBoundingClientRect()
      );

      const getMax = (getAttribute: (e: ClientRect) => number) =>
        Math.max(
          ...boundingBoxes.map(ref =>
            ref ? getAttribute(ref) : Number.NEGATIVE_INFINITY
          )
        );

      const getMin = (getAttribute: (e: ClientRect) => number) =>
        Math.min(
          ...boundingBoxes.map(ref =>
            ref ? getAttribute(ref) : Number.POSITIVE_INFINITY
          )
        );

      return {
        left: getMin(e => e.left) - SECURITY_MARGIN,
        right: getMax(e => e.right) + SECURITY_MARGIN,
        height: getMax(e => e.height),
      };
    },
    []
  );

  useEffect(() => {
    const lines: RowElement[][] = [[]];
    const linesHeight = [0];
    const lineByRefIndex: { [key: number]: number } = {};

    const canBeAddedOnLine = (
      currentLine: RowElement[],
      currentElement: RowElement
    ) => {
      return !currentLine.some(
        testedElement =>
          (currentElement.left <= testedElement.left &&
            currentElement.right >= testedElement.right) ||
          (testedElement.left <= currentElement.left &&
            testedElement.right >= currentElement.right) ||
          (currentElement.left >= testedElement.left &&
            currentElement.left <= testedElement.right) ||
          (testedElement.left >= currentElement.left &&
            testedElement.left <= currentElement.right) ||
          (currentElement.right >= testedElement.left &&
            currentElement.right <= testedElement.right) ||
          (testedElement.right >= currentElement.left &&
            testedElement.right <= currentElement.right)
      );
    };

    refs.forEach((ref, refIndex) => {
      const currentElement = getEventBoundingBox(ref);
      let foundLine = false;

      for (
        let currentLineIndex = 0;
        currentLineIndex < lines.length;
        currentLineIndex++
      ) {
        if (canBeAddedOnLine(lines[currentLineIndex], currentElement)) {
          foundLine = true;
          lines[currentLineIndex].push(currentElement);
          linesHeight[currentLineIndex] = Math.max(
            linesHeight[currentLineIndex] || 0,
            currentElement.height
          );
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
      if (ref[0] && ref[0].current) {
        ref[0].current.style.top =
          VERTICAL_MARGIN * lineByRefIndex[refIndex] +
          linesHeight.reduce((acc, height, index) => {
            return acc + (index < lineByRefIndex[refIndex] ? height : 0);
          }, 0) +
          'px';
      }
    });

    if (rowRef && rowRef.current && !fixedHeight && !fullHeight) {
      rowRef.current.style.height =
        VERTICAL_MARGIN * (lines.length - 1) +
        linesHeight.reduce((acc, height) => {
          return acc + height;
        }, 0) +
        'px';
    }
  });

  return (
    <div
      className={classnames(
        styles.timelineRow,
        fullHeight ? styles.timelineRowFullHeight : null,
        className
      )}
      style={style}
      ref={rowRef}
    >
      {React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
          const sizeRefs: React.RefObject<HTMLDivElement>[] = [];

          refs.push(sizeRefs);
          return React.cloneElement(child, { sizeRefs, fullHeight });
        }
      })}
    </div>
  );
};

export default React.memo(TimelineRow);
