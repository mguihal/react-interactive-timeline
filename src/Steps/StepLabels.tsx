import classnames from 'classnames/bind';
import React, { useContext } from 'react';
import { TimelineContext, TimelineContextContent } from '../context';
import { Theme, ThemeContext } from '../theme';
import styles from './StepLabels.module.css';

const cx = classnames.bind(styles);

interface Props {}

const StepLabels = <InputDate, ParsedDate, InputDuration, Units>(
  props: Props
) => {
  const themeContext = useContext<Theme>(ThemeContext);
  const timelineContext = useContext<TimelineContextContent<
    InputDate,
    ParsedDate,
    InputDuration,
    Units
  > | null>(TimelineContext);

  return (
    <div className={cx('stepLabels', themeContext.stepLabels)}>
      {timelineContext &&
        timelineContext.stepLevels.map((stepLevel, stepLevelIndex) => (
          <div
            key={`stepLevel-${stepLevelIndex}`}
            className={cx(
              'stepLevel',
              `stepLevel-${stepLevelIndex}`,
              themeContext.stepLevel,
              themeContext[`stepLevel-${stepLevelIndex}`]
            )}
          >
            {stepLevel.steps.map((step, stepIndex) => {
              let left = step.offset;
              let width = step.size;

              if (stepLevelIndex > 0) {
                if (step.offset < 0) {
                  left = 0;
                  width = width + step.offset;
                }

                if (step.offset + step.size > 100) {
                  width = width - (step.offset + step.size - 100);
                }
              }

              return (
                <div
                  key={`stepLabel${stepLevelIndex}-${stepIndex}`}
                  className={cx(
                    'stepLabel',
                    `stepLabel-${step.scale}-${step.unit}`,
                    timelineContext.calendar.isImportantStep(step)
                      ? 'important'
                      : '',
                    themeContext.stepLabel,
                    themeContext[`stepLabel-${step.scale}-${step.unit}`]
                  )}
                  style={{
                    left: left + '%',
                    width: width + '%',
                  }}
                >
                  <div>
                    {timelineContext.calendar.format(
                      step.date,
                      step.unit,
                      stepLevelIndex === 0
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
};

export default StepLabels;
