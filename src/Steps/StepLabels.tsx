import React, { useContext } from 'react';
import classnames from 'classnames/bind';

import { TimelineContext, TimelineContextContent } from '../context';
import { Theme, ThemeContext } from '../theme';
import StepBars from './StepBars';

import styles from './StepLabels.module.css';

const cx = classnames.bind(styles);

interface Props {
  className?: string;
}

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

  const getColor = (stepLevel: number, isImportant: boolean) => {
    if (stepLevel === 0) {
      return isImportant
        ? themeContext.secondaryColor
        : themeContext.primaryColor;
    } else if (stepLevel === 1) {
      return isImportant
        ? themeContext.tertiaryColor
        : themeContext.secondaryColor;
    } else {
      return themeContext.tertiaryColor;
    }
  };

  return (
    <div className={cx('stepLabels')}>
      <StepBars />
      {timelineContext &&
        timelineContext.stepLevels.map((stepLevel, stepLevelIndex) => (
          <div
            key={`stepLevel-${stepLevelIndex}`}
            className={cx(
              stepLevelIndex === 0
                ? 'stepLabelsPrimary'
                : 'stepLabelsSecondary',
              `stepLevel-${stepLevelIndex}`
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
                    props.className,
                    'stepLabel',
                    `stepLabel-${step.scale}-${step.unit}`,
                    timelineContext.calendar.isImportantStep(step)
                      ? 'stepLabelImportant'
                      : ''
                  )}
                  style={{
                    left: left + '%',
                    width: width + '%',
                    color: getColor(
                      stepLevelIndex,
                      timelineContext.calendar.isImportantStep(step)
                    ),
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
