import React, { useContext } from 'react';
import classnames from 'classnames/bind';

import { TimelineContext, TimelineContextContent } from '../context';
import { Theme, ThemeContext } from '../theme';

import LabelAbovePeriod from './LabelAbovePeriod';

import styles from './Period.module.css';

const cx = classnames.bind(styles);

export type EventRefs = {
  containerRef: React.RefObject<HTMLDivElement>;
  barSizeRef: React.RefObject<HTMLDivElement>;
  labelSizeRef: React.RefObject<HTMLDivElement>;
};

type PeriodPosition =
  | 'outside'
  | 'inside'
  | 'headOnly'
  | 'tailOnly'
  | 'cropped';

export interface PeriodVariantProps {
  label: string;
  sizeRefs: EventRefs;
  position: PeriodPosition;
  containerLeft: number;
  containerWidth: number;
  color: string;
}

interface Props<InputDate> {
  startDate: InputDate;
  endDate: InputDate;
  label: string;
  className?: string;
  color?: string;
  component?: React.FunctionComponent<PeriodVariantProps>;
  sizeRefs?: EventRefs;
  fullHeight?: boolean;
}

const TimelinePeriod = <InputDate, ParsedDate, InputDuration, Units>(
  props: Props<InputDate>
) => {
  const themeContext = useContext<Theme>(ThemeContext);
  const timelineContext = useContext<TimelineContextContent<
    InputDate,
    ParsedDate,
    InputDuration,
    Units
  > | null>(TimelineContext);

  if (!timelineContext) {
    return null;
  }

  const {
    startDate,
    endDate,
    label,
    className,
    color,
    component,
    sizeRefs,
    fullHeight,
  } = props;
  const {
    startDate: timelineStartDate,
    endDate: timelineEndDate,
    calendar,
  } = timelineContext;

  const parsedStartDate = calendar.parse(startDate);
  const parsedEndDate = calendar.parse(endDate);

  if (!calendar.isBefore(parsedStartDate, parsedEndDate)) {
    console.error('The endDate is before the startDate prop for the period');
    return null;
  }

  const timelineDuration = calendar.diff(timelineEndDate, timelineStartDate);
  const periodStartDateOffset = calendar.diff(
    parsedStartDate,
    timelineStartDate
  );
  const periodEndDateOffset = calendar.diff(parsedEndDate, timelineStartDate);

  const offsetLeft = (periodStartDateOffset / timelineDuration) * 100.0;
  const width =
    ((periodEndDateOffset - periodStartDateOffset) / timelineDuration) * 100.0;

  if (!sizeRefs) {
    return null;
  }

  const periodPosition =
    offsetLeft < 0 && offsetLeft + width > 0
      ? 'tailOnly'
      : offsetLeft >= 0 && offsetLeft + width <= 100
      ? 'inside'
      : offsetLeft < 100 && offsetLeft + width > 100
      ? 'headOnly'
      : offsetLeft < 0 && offsetLeft + width > 100
      ? 'cropped'
      : 'outside';

  let DefaultPeriod: React.FunctionComponent<PeriodVariantProps> = LabelAbovePeriod;

  if (component) {
    DefaultPeriod = component;
  }

  const customStyle: React.CSSProperties = {
    left: offsetLeft + '%',
    width: width + '%',
  };

  if (fullHeight) {
    customStyle.height = '100%';
  }

  return (
    <div
      ref={sizeRefs.containerRef}
      className={cx('period', className)}
      style={customStyle}
    >
      <DefaultPeriod
        label={label}
        sizeRefs={sizeRefs}
        position={periodPosition}
        containerLeft={offsetLeft}
        containerWidth={width}
        color={color || themeContext.eventColor}
      />
    </div>
  );
};

export default React.memo(TimelinePeriod);
