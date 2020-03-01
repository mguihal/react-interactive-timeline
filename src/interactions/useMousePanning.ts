import React, { useState, useCallback, useEffect } from 'react';

import { TimelineContextContent } from '../context';
import { panParsedTimeline } from '.';

export default function usePanning<InputDate, ParsedDate, InputDuration, Units>(
  panningEnabled: boolean,
  timelineContext: TimelineContextContent<InputDate, ParsedDate, InputDuration, Units>,
  timelineRef: React.RefObject<HTMLDivElement>,
) {
  const [panningStartPosition, setPanningStartPosition] = useState<number | null>(null);

  const onMouseDown = useCallback((event: MouseEvent) => {
    setPanningStartPosition(event.clientX);
  }, []);

  const onMouseUp = useCallback(() => {
    setPanningStartPosition(null);
  }, []);

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (panningStartPosition !== null && timelineRef && timelineRef.current) {
      const distance = panningStartPosition - event.clientX;

      const totalDuration = timelineContext.calendar.diff(timelineContext.endDate, timelineContext.startDate);
      const duration = totalDuration * (distance / timelineRef.current.offsetWidth);

      panParsedTimeline(timelineContext, duration);
      setPanningStartPosition(event.clientX);
    }
  }, [panningStartPosition, timelineContext, timelineRef]);

  useEffect(() => {
    if (panningEnabled && timelineRef && timelineRef.current) {
      const ref = timelineRef.current;

      ref.addEventListener('mousedown', onMouseDown);
      ref.addEventListener('mousemove', onMouseMove);
      ref.addEventListener('mouseup', onMouseUp);
      ref.addEventListener('mouseleave', onMouseUp);

      return () => {
        ref.removeEventListener('mousedown', onMouseDown);
        ref.removeEventListener('mousemove', onMouseMove);
        ref.removeEventListener('mouseup', onMouseUp);
        ref.removeEventListener('mouseleave', onMouseUp);
      }
    }
  }, [panningEnabled, timelineRef, onMouseDown, onMouseMove, onMouseUp]);
}
