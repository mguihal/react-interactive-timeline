import React, { useContext, CSSProperties } from 'react';
import classnames from 'classnames/bind';

import { TimelineContext, TimelineContextContent } from '../context';
import { Theme, ThemeContext } from '../theme';
import { panParsedTimeline, zoomParsedTimeline } from '.';

import styles from './Controls.module.css';

const cx = classnames.bind(styles);

interface Props<InputDuration> {
  panDuration?: InputDuration;
  zoomFactor?: number;
  className?: string;
  style?: CSSProperties;
  renderer?: (
    pan: (panDuration: InputDuration) => void,
    zoom: (zoomFactor: number) => void
  ) => JSX.Element;
}

interface BaseControlProps {
  label: string;
  callback: () => void;
}

const BaseControl = (props: BaseControlProps) => {
  const themeContext = useContext<Theme>(ThemeContext);

  return (
    <button
      className={cx('baseControl')}
      onClick={props.callback}
      style={{
        backgroundColor: themeContext.backgroundColor,
        color: themeContext.primaryColor,
      }}
    >
      <span>{props.label}</span>
    </button>
  );
};

const Controls = <InputDate, ParsedDate, InputDuration, Units>(
  props: React.PropsWithChildren<Props<InputDuration>>
) => {
  const themeContext = useContext<Theme>(ThemeContext);
  const timelineContext = useContext<TimelineContextContent<
    InputDate,
    ParsedDate,
    InputDuration,
    Units
  > | null>(TimelineContext);

  const { panDuration, zoomFactor, className, style, renderer } = props;

  if (!timelineContext) {
    return null;
  }

  const parsedPanDuration =
    panDuration && timelineContext.calendar.parseDuration(panDuration);

  if (renderer) {
    return renderer(
      (panDurationArg: InputDuration) =>
        panParsedTimeline(timelineContext, panDurationArg),
      (zoomFactorArg: number) =>
        zoomParsedTimeline(timelineContext, zoomFactorArg)
    );
  }

  return (
    <div className={cx('controls', className)} style={style}>
      <style>{`
        .${cx('baseControl')}:focus {
          border-color: ${themeContext.secondaryColor};
        }
      `}</style>

      {parsedPanDuration && (
        <BaseControl
          label="‹"
          callback={() => {
            panParsedTimeline(timelineContext, -parsedPanDuration);
          }}
        />
      )}

      {parsedPanDuration && (
        <BaseControl
          label="›"
          callback={() => {
            panParsedTimeline(timelineContext, parsedPanDuration);
          }}
        />
      )}

      {zoomFactor && (
        <BaseControl
          label="+"
          callback={() => {
            zoomParsedTimeline(timelineContext, zoomFactor);
          }}
        />
      )}

      {zoomFactor && (
        <BaseControl
          label="-"
          callback={() => {
            zoomParsedTimeline(timelineContext, -zoomFactor);
          }}
        />
      )}
    </div>
  );
};

export default Controls;
