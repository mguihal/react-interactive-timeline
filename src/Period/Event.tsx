import React, { useContext } from 'react';

import { TimelineContext, TimelineContextContent } from '../context';
import { Theme, ThemeContext } from '../theme';

import Period, { PeriodVariantProps, EventRefs } from './Period';

import LabelAboveEvent from './LabelAboveEvent';

interface Props<InputDate> {
  date: InputDate;
  label: string;
  className?: string;
  color?: string;
  component?: React.FunctionComponent<PeriodVariantProps>;
  sizeRefs?: EventRefs;
}

const TimelineEvent = <InputDate, ParsedDate, InputDuration, Units>(props: Props<InputDate>) => {
  const themeContext = useContext<Theme>(ThemeContext);
  const timelineContext = useContext<TimelineContextContent<InputDate, ParsedDate, InputDuration, Units> | null>(TimelineContext);

  const { label, date, className, color, component, sizeRefs } = props;

  if (!timelineContext) {
    return null;
  }

  const parsedDate = timelineContext.calendar.parse(date);
  const endDate = timelineContext.calendar.add(parsedDate, timelineContext.calendar.getMinimumDuration());

  let DefaultPeriod: React.FunctionComponent<PeriodVariantProps> = LabelAboveEvent;

  if (component) {
    DefaultPeriod = component;
  }

  return (
    <Period
      label={label}
      className={className}
      startDate={date}
      endDate={endDate}
      component={DefaultPeriod}
      sizeRefs={sizeRefs}
      color={color || themeContext.eventColor}
    />
  );
};

export default React.memo(TimelineEvent);
