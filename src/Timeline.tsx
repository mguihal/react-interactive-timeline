import React, { useCallback, useState, useEffect, useRef } from 'react';
import classnames from 'classnames/bind';
import ReactResizeDetector from 'react-resize-detector';

import {
  TimelineContext,
  TimelineContextContent,
  Calendar,
  CalendarStep,
  DisplayStep,
} from './context';

import { Theme, ThemeContext, defaultTheme } from './theme';

import defaultCalendar from './calendar';

import useMousePanning from './interactions/useMousePanning';

import CurrentDateBar from './interactions/CurrentDateBar';
import Controls from './interactions/Controls';

import StepBars from './Steps/StepBars';
import StepLabels from './Steps/StepLabels';

import TimelineRow from './TimelineRow';
import Event from './Period/Event';
import Period from './Period/Period';

import styles from './Timeline.module.css';

const cx = classnames.bind(styles);

interface Props<InputDate, ParsedDate, InputDuration, Units>
  extends React.HTMLAttributes<HTMLDivElement> {
  startDate: InputDate;
  endDate: InputDate;
  className?: string;
  stepMinWidth: string | number;
  minDate?: InputDate;
  maxDate?: InputDate;
  minDuration?: InputDuration;
  maxDuration?: InputDuration;
  mousePanning: boolean;
  calendar: Calendar<InputDate, ParsedDate, InputDuration, Units>;
  theme: Theme;
}

const Timeline = <InputDate, ParsedDate, InputDuration, Units>(
  props: React.PropsWithChildren<
    Props<InputDate, ParsedDate, InputDuration, Units>
  >
) => {
  const {
    calendar,
    startDate,
    endDate,
    stepMinWidth,
    className,
    minDate,
    maxDate,
    minDuration,
    maxDuration,
    mousePanning,
    theme,
    children,
    ...rest
  } = props;

  const containerRef = React.createRef<HTMLDivElement>();
  const [containerWidth, setContainerWidth] = useState(1);

  const [parsedStartDate, setParsedStartDate] = useState(
    calendar.parse(startDate)
  );
  const [parsedEndDate, setParsedEndDate] = useState(calendar.parse(endDate));
  const previousDateValues = useRef({ startDate, endDate });

  const getParsedStepMinWidth = useCallback(() => {
    const unit = String(stepMinWidth).indexOf('%') !== -1 ? '%' : 'px';
    const value = parseFloat(stepMinWidth as string);

    if (value <= 0) {
      console.error('The stepMinWidth has zero or negative value');
    }

    return {
      value: Math.max(0, value),
      unit,
    };
  }, [stepMinWidth]);

  const computeStepsPosition = useCallback(
    (
      steps: CalendarStep<ParsedDate, Units>[],
      startDate: ParsedDate,
      duration: number
    ) => {
      let lastOffset: number | null = null;

      return steps.reduceRight<DisplayStep<ParsedDate, Units>[]>(
        (acc, step) => {
          const offset = (calendar.diff(step.date, startDate) / duration) * 100;
          const size = lastOffset !== null ? lastOffset - offset : null;

          lastOffset = offset;

          return size !== null ? [{ ...step, offset, size }, ...acc] : acc;
        },
        []
      );
    },
    [calendar]
  );

  const computeStepLevels = useCallback(
    (startDate: ParsedDate, endDate: ParsedDate) => {
      const duration = calendar.diff(endDate, startDate);

      const parsedStepMinWidth = getParsedStepMinWidth();
      const maxSteps =
        parsedStepMinWidth.unit === '%'
          ? 100 / parsedStepMinWidth.value
          : containerWidth / parsedStepMinWidth.value;

      const stepMinDuration = duration / maxSteps;

      const [
        chosenMainLevel,
        ...chosenSecondaryLevels
      ] = calendar.zoomLevels.filter(zoomLevel => {
        return stepMinDuration < zoomLevel.duration;
      });

      const mainLevel = chosenMainLevel
        ? chosenMainLevel
        : calendar.zoomLevels[calendar.zoomLevels.length - 1];
      const secondaryLevels = chosenSecondaryLevels.filter(zoomLevel =>
        zoomLevel.isMajorLevel(mainLevel)
      );

      return [mainLevel, ...secondaryLevels].map(level => {
        return {
          steps: computeStepsPosition(
            level.getSteps(startDate, endDate),
            startDate,
            duration
          ),
        };
      });
    },
    [calendar, computeStepsPosition, containerWidth, getParsedStepMinWidth]
  );

  const onResize = useCallback((width: number) => {
    setContainerWidth(width);
  }, []);

  useEffect(() => {
    if (startDate !== previousDateValues.current.startDate) {
      setParsedStartDate(calendar.parse(startDate));
    }

    if (endDate !== previousDateValues.current.endDate) {
      setParsedEndDate(calendar.parse(endDate));
    }
  }, [calendar, startDate, endDate]);

  useEffect(() => {
    previousDateValues.current = { startDate, endDate };
  });

  const parsedMinDate = minDate ? calendar.parse(minDate) : undefined;
  const parsedMaxDate = maxDate ? calendar.parse(maxDate) : undefined;

  const parsedMinDuration = minDuration
    ? calendar.parseDuration(minDuration)
    : undefined;
  const parsedMaxDuration = maxDuration
    ? calendar.parseDuration(maxDuration)
    : undefined;

  const stepLevels = computeStepLevels(parsedStartDate, parsedEndDate);

  const timelineContext: TimelineContextContent<
    InputDate,
    ParsedDate,
    InputDuration,
    Units
  > = {
    calendar,
    stepLevels,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    setStartDate: setParsedStartDate,
    setEndDate: setParsedEndDate,
    timelineRef: containerRef,
    minDate: parsedMinDate,
    maxDate: parsedMaxDate,
    minDuration: parsedMinDuration,
    maxDuration: parsedMaxDuration,
  };

  useMousePanning(mousePanning, timelineContext, containerRef);

  if (!calendar.isBefore(parsedStartDate, parsedEndDate)) {
    console.error('The endDate is before the startDate prop');
    return null;
  }

  if (parsedMinDate && calendar.isBefore(parsedStartDate, parsedMinDate)) {
    console.error('The minDate is after the startDate prop');
    return null;
  }

  if (parsedMaxDate && calendar.isBefore(parsedMaxDate, parsedEndDate)) {
    console.error('The maxDate is before the endDate prop');
    return null;
  }

  if (
    parsedMinDuration &&
    parsedMaxDuration &&
    parsedMinDuration > parsedMaxDuration
  ) {
    console.error('The minDuration is bigger than the maxDuration');
    return null;
  }

  if (parsedMinDuration && parsedMinDuration < calendar.getMinimumDuration()) {
    console.error(
      'The minDuration is lesser than the calendar minimum duration'
    );
    return null;
  }

  const timelineDuration = calendar.diff(parsedEndDate, parsedStartDate);

  if (parsedMinDuration && parsedMinDuration > timelineDuration) {
    console.error('The minDuration is bigger than the timeline duration');
    return null;
  }

  if (parsedMaxDuration && parsedMaxDuration < timelineDuration) {
    console.error('The maxDuration is lesser than the timeline duration');
    return null;
  }

  return (
    <ThemeContext.Provider value={theme}>
      <div
        className={cx('timeline', className)}
        style={{ backgroundColor: theme.backgroundColor }}
        ref={containerRef}
        {...rest}
      >
        <ReactResizeDetector handleWidth onResize={onResize} />
        <TimelineContext.Provider value={timelineContext}>
          {children}
        </TimelineContext.Provider>
      </div>
    </ThemeContext.Provider>
  );
};

Timeline.defaultProps = {
  stepMinWidth: '40px',
  mousePanning: true,
  calendar: defaultCalendar(),
  theme: defaultTheme,
};

Timeline.StepBars = StepBars;
Timeline.StepLabels = StepLabels;

Timeline.CurrentDateBar = CurrentDateBar;
Timeline.Controls = Controls;

Timeline.Row = TimelineRow;
Timeline.Period = Period;
Timeline.Event = Event;

export default Timeline;
