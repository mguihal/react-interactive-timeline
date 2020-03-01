declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'react-interactive-timeline' {
  // Context

  interface CalendarStep<ParsedDate, Units> {
    date: ParsedDate;
    unit: Units;
    scale: number;
  }

  interface CalendarZoomLevel<ParsedDate, Units> {
    unit: Units;
    duration: number;
    isMajorLevel: (mainLevel: CalendarZoomLevel<ParsedDate, Units>) => boolean;
    getSteps: (
      startDate: ParsedDate,
      endDate: ParsedDate
    ) => CalendarStep<ParsedDate, Units>[];
  }

  interface Calendar<InputDate, ParsedDate, InputDuration, Units> {
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

  // Timeline

  interface StepLabelsProps {
    className?: string;
  }

  interface Theme {
    backgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
    eventColor: string;
  }

  interface TimelineProps<InputDate, ParsedDate, InputDuration, Units>
    extends React.HTMLAttributes<HTMLDivElement> {
    startDate: InputDate;
    endDate: InputDate;
    className?: string;
    stepMinWidth?: string | number;
    minDate?: InputDate;
    maxDate?: InputDate;
    minDuration?: InputDuration;
    maxDuration?: InputDuration;
    mousePanning?: boolean;
    calendar?: Calendar<InputDate, ParsedDate, InputDuration, Units>;
    theme?: Theme;
  }

  export const Timeline: (<InputDate, ParsedDate, InputDuration, Units>(
    props: React.PropsWithChildren<
      TimelineProps<InputDate, ParsedDate, InputDuration, Units>
    >
  ) => JSX.Element) & {
    StepBars: <InputDate, ParsedDate, InputDuration, Units>() => JSX.Element;
    StepLabels: <InputDate, ParsedDate, InputDuration, Units>(
      props: StepLabelsProps
    ) => JSX.Element;
    CurrentDateBar: <
      InputDate,
      ParsedDate,
      InputDuration,
      Units
    >() => JSX.Element;

    PanControl: <InputDate, ParsedDate, InputDuration, Units>(
      props: React.PropsWithChildren<PanControlProps<InputDuration>>
    ) => JSX.Element;
    ZoomControl: <InputDate, ParsedDate, InputDuration, Units>(
      props: React.PropsWithChildren<ZoomControlProps>
    ) => JSX.Element;

    Row: <InputDate, ParsedDate, InputDuration, Units>(
      props: React.PropsWithChildren<RowProps>
    ) => JSX.Element;
    Period: <InputDate, ParsedDate, InputDuration, Units>(
      props: PeriodProps<InputDate>
    ) => JSX.Element;
    Event: <InputDate, ParsedDate, InputDuration, Units>(
      props: EventProps<InputDate>
    ) => JSX.Element;
  };

  // Interactions

  interface InputTimelineInteractionContextContent<
    InputDate,
    ParsedDate,
    InputDuration,
    Units
  > {
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

  export const interactions: {
    pan: <InputDate, ParsedDate, InputDuration, Units>(
      timelineContext: InputTimelineInteractionContextContent<
        InputDate,
        ParsedDate,
        InputDuration,
        Units
      >,
      duration: InputDuration
    ) => void;
    zoom: <InputDate, ParsedDate, InputDuration, Units>(
      timelineContext: InputTimelineInteractionContextContent<
        InputDate,
        ParsedDate,
        InputDuration,
        Units
      >,
      zoom: number
    ) => void;
  };

  interface PanControlProps<InputDuration> {
    renderer: (pan: (duration: InputDuration) => void) => JSX.Element;
  }

  interface ZoomControlProps {
    renderer: (zoom: (zoom: number) => void) => JSX.Element;
  }

  // Calendar

  type Locale = 'en' | 'fr';
  type Units =
    | 'millisecond'
    | 'second'
    | 'minute'
    | 'hour'
    | 'day'
    | 'month'
    | 'year';

  type InputDuration = {
    [U in Units]?: number;
  };

  export const calendar: (
    locale: Locale,
    minUnit?: Units,
    maxUnit?: Units
  ) => Calendar<string, Date, InputDuration, Units>;

  // Row

  interface RowProps {
    fixedHeight?: boolean;
    fullHeight?: boolean;
    className?: string;
  }

  // Period

  type EventRefs = {
    containerRef: React.RefObject<HTMLDivElement>;
    barSizeRef: React.RefObject<HTMLDivElement>;
    labelSizeRef: React.RefObject<HTMLDivElement>;
  };

  type PeriodPosition =
    | 'outside'
    | 'inside'
    | 'headOnly'
    | 'tailOnly'
    | 'cropped';

  interface PeriodVariantProps {
    label: string;
    sizeRefs: EventRefs;
    position: PeriodPosition;
    containerLeft: number;
    containerWidth: number;
    color?: string;
  }

  interface PeriodProps<InputDate> {
    startDate: InputDate;
    endDate: InputDate;
    label: string;
    className?: string;
    color?: string;
    component?: React.FunctionComponent<PeriodVariantProps>;
    sizeRefs?: EventRefs;
    fullHeight?: boolean;
  }

  namespace Timeline.Period {
    export interface Props extends PeriodVariantProps {}
  }

  // Event

  interface EventProps<InputDate> {
    date: InputDate;
    label: string;
    className?: string;
    color?: string;
    component?: React.FunctionComponent<PeriodVariantProps>;
    sizeRefs?: EventRefs;
  }
}
