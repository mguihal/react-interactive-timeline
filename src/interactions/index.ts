import { Calendar } from '../context';

interface InputTimelineInteractionContextContent<InputDate, ParsedDate, InputDuration, Units> {
  calendar: Calendar<InputDate, ParsedDate, InputDuration, Units>;
  startDate: InputDate;
  endDate: InputDate;
  setStartDate: (date: InputDate) => void;
  setEndDate: (date: InputDate) => void;
  minDate?: InputDate;
  maxDate?: InputDate;
  minDuration?: InputDuration;
  maxDuration?: InputDuration;
}

interface ParsedTimelineInteractionContextContent<InputDate, ParsedDate, InputDuration, Units> {
  calendar: Calendar<InputDate, ParsedDate, InputDuration, Units>;
  startDate: ParsedDate;
  endDate: ParsedDate;
  setStartDate: (date: ParsedDate) => void;
  setEndDate: (date: ParsedDate) => void;
  minDate?: ParsedDate;
  maxDate?: ParsedDate;
  minDuration?: number;
  maxDuration?: number;
}

function parseContext<InputDate, ParsedDate, InputDuration, Units>(timelineContext: InputTimelineInteractionContextContent<InputDate, ParsedDate, InputDuration, Units>) {
  return {
    calendar: timelineContext.calendar,
    startDate: timelineContext.calendar.parse(timelineContext.startDate),
    endDate: timelineContext.calendar.parse(timelineContext.endDate),
    setStartDate: (date: ParsedDate) => timelineContext.setStartDate(timelineContext.calendar.unparse(date)),
    setEndDate: (date: ParsedDate) => timelineContext.setEndDate(timelineContext.calendar.unparse(date)),
    minDate: timelineContext.minDate ? timelineContext.calendar.parse(timelineContext.minDate) : undefined,
    maxDate: timelineContext.maxDate ? timelineContext.calendar.parse(timelineContext.maxDate) : undefined,
    minDuration: timelineContext.minDuration ? timelineContext.calendar.parseDuration(timelineContext.minDuration) : undefined,
    maxDuration: timelineContext.maxDuration ? timelineContext.calendar.parseDuration(timelineContext.maxDuration) : undefined,
  };
}

function checkMinMaxBounds<InputDate, ParsedDate, InputDuration, Units>(timelineContext: ParsedTimelineInteractionContextContent<InputDate, ParsedDate, InputDuration, Units>) {
  const { calendar, startDate, endDate, minDate, maxDate, minDuration, maxDuration } = timelineContext;

  let newStartDate = startDate;
  let newEndDate = endDate;
  let duration = calendar.diff(newEndDate, newStartDate);

  const realMinDuration = minDuration || calendar.getMinimumDuration();
  const realMaxDuration = maxDuration || ((minDate && maxDate) ? calendar.diff(maxDate, minDate) : undefined);

  if (duration < realMinDuration) {
    const offset = (realMinDuration - duration) / 2;

    newStartDate = calendar.subtract(newStartDate, offset);
    newEndDate = calendar.add(newEndDate, offset);
    duration = calendar.diff(newEndDate, newStartDate);
  }

  if (realMaxDuration && duration > realMaxDuration) {
    const offset = (duration - realMaxDuration) / 2;

    newStartDate = calendar.add(newStartDate, offset);
    newEndDate = calendar.subtract(newEndDate, offset);
    duration = calendar.diff(newEndDate, newStartDate);
  }

  if (minDate && calendar.isBefore(newStartDate, minDate)) {
    const offset = calendar.diff(minDate, newStartDate);

    newStartDate = calendar.add(newStartDate, offset);
    newEndDate = calendar.add(newEndDate, offset);
  }

  if (maxDate && calendar.isBefore(maxDate, newEndDate)) {
    const offset = calendar.diff(newEndDate, maxDate);

    newStartDate = calendar.subtract(newStartDate, offset);
    newEndDate = calendar.subtract(newEndDate, offset);
  }

  timelineContext.setStartDate(newStartDate);
  timelineContext.setEndDate(newEndDate);
}

export function panParsedTimeline<InputDate, ParsedDate, InputDuration, Units>(timelineContext: ParsedTimelineInteractionContextContent<InputDate, ParsedDate, InputDuration, Units>, duration: InputDuration | number) {
  const { calendar, startDate, endDate } = timelineContext;
  const parsedDuration = typeof duration === 'number' ? duration : calendar.parseDuration(duration);

  checkMinMaxBounds({
    ...timelineContext,
    startDate: calendar.add(startDate, parsedDuration),
    endDate: calendar.add(endDate, parsedDuration),
  });
}

export function zoomParsedTimeline<InputDate, ParsedDate, InputDuration, Units>(timelineContext: ParsedTimelineInteractionContextContent<InputDate, ParsedDate, InputDuration, Units>, zoom: number) {
  const { calendar, startDate, endDate } = timelineContext;
  const duration = calendar.diff(endDate, startDate);

  const offset = duration / 2 / (zoom < 1 ? zoom / 2 : zoom);

  checkMinMaxBounds({
    ...timelineContext,
    startDate: calendar.add(startDate, offset),
    endDate: calendar.subtract(endDate, offset),
  });
}

export function panTimeline<InputDate, ParsedDate, InputDuration, Units>(timelineContext: InputTimelineInteractionContextContent<InputDate, ParsedDate, InputDuration, Units>, duration: InputDuration) {
  panParsedTimeline(parseContext(timelineContext), duration);
}

export function zoomTimeline<InputDate, ParsedDate, InputDuration, Units>(timelineContext: InputTimelineInteractionContextContent<InputDate, ParsedDate, InputDuration, Units>, zoom: number) {
  zoomParsedTimeline(parseContext(timelineContext), zoom);
}
