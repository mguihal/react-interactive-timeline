import React, { useContext } from 'react';

import { TimelineContext, TimelineContextContent } from '../context';
import { zoomParsedTimeline } from '.';

interface Props {
  renderer: (zoom: (zoom: number) => void) => JSX.Element;
}

const ZoomControl = <InputDate, ParsedDate, InputDuration, Units>(
  props: React.PropsWithChildren<Props>
) => {
  const timelineContext = useContext<TimelineContextContent<
    InputDate,
    ParsedDate,
    InputDuration,
    Units
  > | null>(TimelineContext);

  return props.renderer((zoom: number) => {
    if (timelineContext) {
      zoomParsedTimeline(timelineContext, zoom);
    }
  });
};

export default ZoomControl;
