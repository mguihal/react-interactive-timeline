import React from 'react';

export interface CalendarStep<ParsedDate, Units> {
  date: ParsedDate;
  unit: Units;
  scale: number;
}

export interface DisplayStep<ParsedDate, Units> extends CalendarStep<ParsedDate, Units> {
  offset: number;
  size: number;
}

export interface CalendarZoomLevel<ParsedDate, Units> {
  unit: Units;
  duration: number;
  isMajorLevel: (mainLevel: CalendarZoomLevel<ParsedDate, Units>) => boolean;
  getSteps: (startDate: ParsedDate, endDate: ParsedDate) => CalendarStep<ParsedDate, Units>[]
}

export interface DisplayZoomLevel<ParsedDate, Units> {
  steps: DisplayStep<ParsedDate, Units>[];
}

export interface Calendar<InputDate, ParsedDate, InputDuration, Units> {
  parse: (date: InputDate) => ParsedDate;
  unparse: (date: ParsedDate) => InputDate;
  parseDuration: (duration: InputDuration) => number;
  getMinimumDuration: () => number;
  isBefore: (dateA: ParsedDate, dateB: ParsedDate) => boolean;
  diff: (dateA: ParsedDate, dateB: ParsedDate) => number;
  add: (date: ParsedDate, amount: number, unit?: Units) => ParsedDate;
  subtract: (date: ParsedDate, amount: number, unit?: Units) => ParsedDate;
  format: (date: ParsedDate, unit?: Units, onlyUnit?: boolean) => string;
  isImportantStep: (step: CalendarStep<ParsedDate, Units>) => boolean;
  zoomLevels: CalendarZoomLevel<ParsedDate, Units>[];
}

export interface TimelineContextContent<InputDate, ParsedDate, InputDuration, Units> {
  calendar: Calendar<InputDate, ParsedDate, InputDuration, Units>;
  stepLevels: DisplayZoomLevel<ParsedDate, Units>[];
  startDate: ParsedDate;
  endDate: ParsedDate;
  setStartDate: (date: ParsedDate) => void;
  setEndDate: (date: ParsedDate) => void;
  timelineRef: React.RefObject<HTMLDivElement>;
  minDate?: ParsedDate;
  maxDate?: ParsedDate;
  minDuration?: number;
  maxDuration?: number;
}

export const TimelineContext = React.createContext<TimelineContextContent<any, any, any, any> | null>(null);
