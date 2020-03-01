import React, { useContext } from 'react';
import classnames from 'classnames/bind';

import { TimelineContext, TimelineContextContent } from '../context';
import { Theme, ThemeContext } from '../theme';

import styles from './StepBars.module.css';

const cx = classnames.bind(styles);

const StepBars = <InputDate, ParsedDate, InputDuration, Units>() => {
  const themeContext = useContext<Theme>(ThemeContext);
  const timelineContext = useContext<TimelineContextContent<
    InputDate,
    ParsedDate,
    InputDuration,
    Units
  > | null>(TimelineContext);

  const getColor = (levelIndex: number, isImportant: boolean) => {
    if (levelIndex === 0) {
      return isImportant
        ? themeContext.secondaryColor
        : themeContext.primaryColor;
    } else if (levelIndex === 1) {
      return isImportant
        ? themeContext.tertiaryColor
        : themeContext.secondaryColor;
    } else {
      return themeContext.tertiaryColor;
    }
  };

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
                  className={cx('stepBar')}
                  style={{
                    left: step.offset + '%',
                    borderColor: getColor(
                      levelIndex,
                      timelineContext.calendar.isImportantStep(step)
                    ),
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
