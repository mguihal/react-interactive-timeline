import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { CSSProperties, useContext } from 'react';
import { TimelineContext, TimelineContextContent } from '../context';
import { panParsedTimeline, zoomParsedTimeline } from '../interactions';
import { Theme, ThemeContext } from '../theme';
import styles from './Controls.module.css';

const cx = classnames.bind(styles);

interface Props<InputDuration> {
  panDuration?: InputDuration;
  zoomFactor?: number;
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
      className={cx('baseControl', themeContext.baseControl)}
      onClick={props.callback}
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

  const { panDuration, zoomFactor, style, renderer } = props;

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
    <div className={cx('controls', themeContext.controls)} style={style}>
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
            zoomParsedTimeline(timelineContext, 1 / zoomFactor);
          }}
        />
      )}
    </div>
  );
};

Controls.propTypes = {
  panDuration: PropTypes.any,
  zoomFactor: PropTypes.number,
  style: PropTypes.object,
  renderer: PropTypes.func,
};

export default Controls;
