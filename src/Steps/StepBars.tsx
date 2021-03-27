import classnames from 'classnames/bind';
import React, { useContext } from 'react';
import { TimelineContext, TimelineContextContent } from '../context';
import styles from './StepBars.module.css';

const cx = classnames.bind(styles);

const StepBars = <InputDate, ParsedDate, InputDuration, Units>() => {
  const timelineContext = useContext<TimelineContextContent<
    InputDate,
    ParsedDate,
    InputDuration,
    Units
  > | null>(TimelineContext);

  return (
    <div className={cx('stepBars')}>
      {timelineContext &&
        timelineContext.stepLevels.flatMap((level, levelIndex) => {
          return level.steps.map((step, stepIndex) => {
            return (
              step.offset > 0 &&
              step.offset <= 100 && (
                <div
                  key={`stepBar-${levelIndex}-${stepIndex}`}
                  className={cx(
                    'stepBar',
                    `stepBar-level${levelIndex}`,
                    timelineContext.calendar.isImportantStep(step)
                      ? 'important'
                      : ''
                  )}
                  style={{
                    left: step.offset + '%',
                  }}
                />
              )
            );
          });
        })}
    </div>
  );
};

export default StepBars;
