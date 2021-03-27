import React, { useContext } from 'react';
import { TimelineContext, TimelineContextContent } from '../context';
import LabelAboveEvent from './LabelAboveEvent';
import Period, { PeriodVariantProps } from './Period';

interface Props<InputDate> {
  date: InputDate;
  label: string;
  className?: string;
  color?: string;
  component?: React.FunctionComponent<PeriodVariantProps>;
  sizeRefs?: React.RefObject<HTMLDivElement>[];
  [customProp: string]: any;
}

const TimelineEvent = <InputDate, ParsedDate, InputDuration, Units>(
  props: Props<InputDate>
) => {
  const timelineContext = useContext<TimelineContextContent<
    InputDate,
    ParsedDate,
    InputDuration,
    Units
  > | null>(TimelineContext);

  const { label, date, className, color, component, sizeRefs, ...rest } = props;

  if (!timelineContext) {
    return null;
  }

  let PeriodComponent: React.FunctionComponent<PeriodVariantProps> = LabelAboveEvent;

  if (component) {
    PeriodComponent = component;
  }

  return (
    <Period
      label={label}
      className={className}
      startDate={date}
      endDate={date}
      component={PeriodComponent}
      sizeRefs={sizeRefs}
      color={color}
      {...rest}
    />
  );
};

export default React.memo(TimelineEvent);
