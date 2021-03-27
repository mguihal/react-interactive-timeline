import classnames from 'classnames/bind';
import React, { useContext } from 'react';
import { TimelineContext, TimelineContextContent } from '../context';
import LabelAbovePeriod from './LabelAbovePeriod';
import styles from './Period.module.css';

const cx = classnames.bind(styles);

type PeriodPosition =
  | 'outside'
  | 'inside'
  | 'headOnly'
  | 'tailOnly'
  | 'cropped';

export interface PeriodVariantProps {
  label: string;
  sizeRefs: React.RefObject<HTMLDivElement>[];
  position: PeriodPosition;
  color?: string;
  [customProp: string]: any;
}

interface Props<InputDate> {
  startDate: InputDate;
  endDate: InputDate;
  label: string;
  className?: string;
  color?: string;
  component?: React.FunctionComponent<PeriodVariantProps>;
  sizeRefs?: React.RefObject<HTMLDivElement>[];
  fullHeight?: boolean;
  [customProp: string]: any;
}

const TimelinePeriod = <InputDate, ParsedDate, InputDuration, Units>(
  props: Props<InputDate>
) => {
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
    ...rest
  } = props;
  const {
    startDate: timelineStartDate,
    endDate: timelineEndDate,
    calendar,
  } = timelineContext;

  const parsedStartDate = calendar.parse(startDate);
  const parsedEndDate = calendar.parse(endDate);

  if (
    startDate !== endDate &&
    !calendar.isBefore(parsedStartDate, parsedEndDate)
  ) {
    console.error(
      `The endDate is before the startDate prop for the period "${label}"`
    );
    return null;
  }

  if (
    calendar.isBefore(parsedEndDate, timelineStartDate) ||
    calendar.isBefore(timelineEndDate, parsedStartDate)
  ) {
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

  let PeriodComponent: React.FunctionComponent<PeriodVariantProps> = LabelAbovePeriod;

  if (component) {
    PeriodComponent = component;
  }

  const customStyle: React.CSSProperties = {
    left: offsetLeft + '%',
    width: width + '%',
  };

  if (fullHeight) {
    customStyle.height = '100%';
  }

  const containerRef = React.createRef<HTMLDivElement>();

  sizeRefs.push(containerRef);

  return (
    <div
      ref={containerRef}
      className={cx('period', className)}
      style={customStyle}
    >
      <PeriodComponent
        label={label}
        startDate={startDate}
        endDate={endDate}
        sizeRefs={sizeRefs}
        position={periodPosition}
        color={color}
        {...rest}
      />
    </div>
  );
};

export default React.memo(TimelinePeriod);
