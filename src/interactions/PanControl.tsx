import React, { useContext } from 'react';

import { TimelineContext, TimelineContextContent } from '../context';
import { panParsedTimeline } from '.';

interface Props<InputDuration> {
  renderer: (pan: (duration: InputDuration) => void) => JSX.Element;
}

const PanControl = <InputDate, ParsedDate, InputDuration, Units>(
  props: React.PropsWithChildren<Props<InputDuration>>
) => {
  const timelineContext = useContext<TimelineContextContent<
    InputDate,
    ParsedDate,
    InputDuration,
    Units
  > | null>(TimelineContext);

  return props.renderer((duration: InputDuration) => {
    if (timelineContext) {
      panParsedTimeline(timelineContext, duration);
    }
  });
};

export default PanControl;
