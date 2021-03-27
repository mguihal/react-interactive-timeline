import classnames from 'classnames/bind';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TimelineContext, TimelineContextContent } from '../context';
import { Theme, ThemeContext } from '../theme';
import styles from './CurrentDateBar.module.css';

const cx = classnames.bind(styles);

const CurrentDateBar = <InputDate, ParsedDate, InputDuration, Units>() => {
  const themeContext = useContext<Theme>(ThemeContext);
  const timelineContext = useContext<TimelineContextContent<
    InputDate,
    ParsedDate,
    InputDuration,
    Units
  > | null>(TimelineContext);
  const [currentDate, setCurrentDate] = useState<ParsedDate>();

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (
        !timelineContext ||
        !timelineContext.timelineRef ||
        !timelineContext.timelineRef.current
      ) {
        return null;
      }

      const { startDate, endDate, calendar } = timelineContext;
      const timelineBounds = timelineContext.timelineRef.current.getBoundingClientRect();

      const distance = event.clientX - timelineBounds.left;

      const totalDuration = calendar.diff(endDate, startDate);
      const duration = totalDuration * (distance / timelineBounds.width);

      setCurrentDate(calendar.add(startDate, duration));
    },
    [timelineContext]
  );

  useEffect(() => {
    if (
      timelineContext &&
      timelineContext.timelineRef &&
      timelineContext.timelineRef.current
    ) {
      const ref = timelineContext.timelineRef.current;

      ref.addEventListener('mousemove', onMouseMove);

      return () => {
        ref.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, [timelineContext, onMouseMove]);

  if (!timelineContext) {
    return null;
  }

  const { startDate, endDate, calendar } = timelineContext;
  const timelineDuration = calendar.diff(endDate, startDate);
  const currentDateDuration = currentDate
    ? calendar.diff(currentDate, startDate)
    : 0;
  const offsetLeft = (currentDateDuration / timelineDuration) * 100.0;

  return (
    <div
      className={cx('currentDateBar')}
      style={{
        left: offsetLeft + '%',
      }}
    >
      <div>{currentDate && calendar.format(currentDate)}</div>
    </div>
  );
};

export default CurrentDateBar;
