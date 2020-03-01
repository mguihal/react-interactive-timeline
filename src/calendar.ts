export type Units =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'month'
  | 'year';

export type InputDate = string;
export type ParsedDate = Date;

type InputDuration = {
  [U in Units]?: number;
};

interface Step {
  date: ParsedDate;
  unit: Units;
  scale: number;
}

interface ZoomLevel {
  unit: Units;
  duration: number;
  isMajorLevel: (mainLevel: ZoomLevel) => boolean;
  getSteps: (startDate: ParsedDate, endDate: ParsedDate) => Step[];
}

const SECOND_IN_MILLISECONDS = 1000;
const MINUTE_IN_MILLISECONDS = 60 * SECOND_IN_MILLISECONDS;
const HOUR_IN_MILLISECONDS = 60 * MINUTE_IN_MILLISECONDS;
const DAY_IN_MILLISECONDS = 24 * HOUR_IN_MILLISECONDS;
const MONTH_IN_MILLISECONDS = 30 * DAY_IN_MILLISECONDS;
const YEAR_IN_MILLISECONDS = 12 * MONTH_IN_MILLISECONDS;

const units = [
  'millisecond',
  'second',
  'minute',
  'hour',
  'day',
  'month',
  'year',
];

function parse(minUnit: Units): (date: InputDate) => ParsedDate {
  return date => startOf(new Date(date), minUnit);
}

function unparse(date: ParsedDate): InputDate {
  return date.toISOString();
}

function parseDuration(duration: InputDuration): number {
  let milliseconds = 0;

  milliseconds += duration.millisecond ? duration.millisecond : 0;
  milliseconds += duration.second
    ? duration.second * SECOND_IN_MILLISECONDS
    : 0;
  milliseconds += duration.minute
    ? duration.minute * MINUTE_IN_MILLISECONDS
    : 0;
  milliseconds += duration.hour ? duration.hour * HOUR_IN_MILLISECONDS : 0;
  milliseconds += duration.day ? duration.day * DAY_IN_MILLISECONDS : 0;
  milliseconds += duration.month ? duration.month * MONTH_IN_MILLISECONDS : 0;
  milliseconds += duration.year ? duration.year * YEAR_IN_MILLISECONDS : 0;

  return milliseconds;
}

function getMinimumDuration(minUnit: Units): () => number {
  return () => {
    switch (minUnit) {
      case 'second':
        return SECOND_IN_MILLISECONDS;
      case 'minute':
        return MINUTE_IN_MILLISECONDS;
      case 'hour':
        return HOUR_IN_MILLISECONDS;
      case 'day':
        return DAY_IN_MILLISECONDS;
      case 'month':
        return MONTH_IN_MILLISECONDS;
      case 'year':
        return YEAR_IN_MILLISECONDS;
      default:
        return 1;
    }
  };
}

function isBefore(dateA: ParsedDate, dateB: ParsedDate): boolean {
  return dateA.getTime() < dateB.getTime();
}

function diff(dateA: ParsedDate, dateB: ParsedDate): number {
  return dateA.getTime() - dateB.getTime();
}

function add(
  date: ParsedDate,
  amount: number,
  unit: Units = 'millisecond'
): ParsedDate {
  let newDate = new Date(date.getTime());

  switch (unit) {
    case 'millisecond':
      return new Date(date.getTime() + amount);
    case 'second':
      return add(date, amount * SECOND_IN_MILLISECONDS, 'millisecond');
    case 'minute':
      return add(date, amount * MINUTE_IN_MILLISECONDS, 'millisecond');
    case 'hour':
      return add(date, amount * HOUR_IN_MILLISECONDS, 'millisecond');
    case 'day':
      newDate.setDate(date.getDate() + amount);
      return newDate;
    case 'month':
      const desiredMonth = date.getMonth() + amount;
      const lastDayOfMonth = new Date(date.getFullYear(), desiredMonth + 1, 0);

      newDate.setMonth(
        desiredMonth,
        Math.min(lastDayOfMonth.getDate(), date.getDate())
      );
      return newDate;
    case 'year':
      return add(date, amount * 12, 'month');
    default:
      return date;
  }
}

function subtract(
  date: ParsedDate,
  amount: number,
  unit: Units = 'millisecond'
): ParsedDate {
  return add(date, -amount, unit);
}

function startOf(date: ParsedDate, unit: Units): ParsedDate {
  let newDate = new Date(date.getTime());

  switch (unit) {
    case 'second':
      newDate.setMilliseconds(0);
      return newDate;
    case 'minute':
      newDate.setSeconds(0, 0);
      return newDate;
    case 'hour':
      newDate.setMinutes(0, 0, 0);
      return newDate;
    case 'day':
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    case 'month':
      newDate.setDate(1);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    case 'year':
      newDate.setFullYear(date.getFullYear(), 0, 1);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    default:
      return newDate;
  }
}

function get(date: ParsedDate, unit: Units): number {
  switch (unit) {
    case 'millisecond':
      return date.getMilliseconds();
    case 'second':
      return date.getSeconds();
    case 'minute':
      return date.getMinutes();
    case 'hour':
      return date.getHours();
    case 'day':
      return date.getDate();
    case 'month':
      return date.getMonth();
    case 'year':
      return date.getFullYear();
  }
}

function format(locale: string, minUnit: Units, maxUnit: Units) {
  function internFormat(
    date: ParsedDate,
    unit?: Units,
    onlyUnit: boolean = false
  ): string {
    const monthLabels: { [locale: string]: string[] } = {
      en: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      fr: [
        'janv.',
        'févr.',
        'mars',
        'avr.',
        'mai',
        'juin',
        'juil.',
        'août',
        'sept.',
        'oct.',
        'nov.',
        'déc.',
      ],
    };

    const padded = (u: number) => (u < 10 ? `0${u}` : `${u}`);
    const paddedMs = (u: number) =>
      u < 10 ? `00${u}` : u < 100 ? `0${u}` : `${u}`;

    switch (unit) {
      case 'millisecond':
        return onlyUnit
          ? `${date.getMilliseconds()}ms`
          : `${internFormat(date, 'second')}.${paddedMs(
              date.getMilliseconds()
            )}`;
      case 'second':
        return onlyUnit
          ? `${padded(date.getSeconds())}s`
          : `${internFormat(date, 'minute')}:${padded(date.getSeconds())}`;
      case 'minute':
        return `${padded(date.getHours())}:${padded(date.getMinutes())}`;
      case 'hour':
        return onlyUnit
          ? `${padded(date.getHours())}:00`
          : `${padded(date.getHours())}h`;
      case 'day':
        return onlyUnit
          ? `${padded(date.getDate())}`
          : `${padded(date.getDate())} ${internFormat(date, 'month')}`;
      case 'month':
        const formattedMonth = monthLabels[locale][date.getMonth()];
        return onlyUnit
          ? `${formattedMonth}`
          : `${formattedMonth} ${internFormat(date, 'year')}`;
      case 'year':
        return `${date.getFullYear()}`;
      default:
        const part1 =
          units.indexOf(minUnit) > units.indexOf('day')
            ? `${internFormat(date, minUnit)}`
            : `${internFormat(date, 'day')}`;
        const part2 =
          units.indexOf(minUnit) < units.indexOf('day')
            ? ` - ${internFormat(date, minUnit)}`
            : '';

        return `${part1}${part2}`;
    }
  }

  return internFormat;
}

function getSteps(unit: Units, n: number) {
  return (startDate: ParsedDate, endDate: ParsedDate) => {
    const list = [];

    let offsetUnits = get(startDate, unit);

    if (unit === 'day') {
      const correctedStartDate = subtract(
        startDate,
        n > 1 && get(startDate, unit) >= 30 ? n : 0,
        unit
      ); // Fix to hide days 30 and 31
      const moduloDay = get(correctedStartDate, unit) < n ? 1 : 0; // Fix to round to 1st day of month
      offsetUnits = get(correctedStartDate, unit) - moduloDay;
    }

    let date = subtract(startOf(startDate, unit), offsetUnits % n, unit);
    let stop = false;

    while (!stop) {
      if (!isBefore(date, endDate)) {
        stop = true; // We need to go an extra step after the end date to compute the last step size
      }

      list.push({ date, unit, scale: n });

      let durationToAdd = n;
      const previousMonth = unit === 'day' ? get(date, 'month') : null;

      if (unit === 'day' && n > 1 && get(date, unit) === 1) {
        durationToAdd = n - 1; // Fix due to the round of 1st day of month
      }

      date = add(date, durationToAdd, unit);

      if (unit === 'day') {
        date = add(date, n > 1 && get(date, unit) >= 30 ? 1 : 0, 'month'); // Fix to hide days 30 and 31

        if (get(date, 'month') !== previousMonth) {
          date = startOf(date, 'month');
        }
      }
    }

    return list;
  };
}

function isImportantStep(step: Step) {
  if (step.unit === 'year') {
    return get(step.date, 'year') % (10 * step.scale) === 0;
  }

  return false;
}

function getZoomLevels(minUnit: Units, maxUnit: Units) {
  const zoomLevels: ZoomLevel[] = [];

  if (
    units.indexOf(minUnit) <= units.indexOf('millisecond') &&
    units.indexOf(maxUnit) >= units.indexOf('millisecond')
  ) {
    zoomLevels.push(
      {
        unit: 'millisecond',
        duration: 1,
        isMajorLevel: () => false,
        getSteps: getSteps('millisecond', 1),
      },
      {
        unit: 'millisecond',
        duration: 100,
        isMajorLevel: () => false,
        getSteps: getSteps('millisecond', 100),
      },
      {
        unit: 'millisecond',
        duration: 500,
        isMajorLevel: () => false,
        getSteps: getSteps('millisecond', 500),
      }
    );
  }

  if (
    units.indexOf(minUnit) <= units.indexOf('second') &&
    units.indexOf(maxUnit) >= units.indexOf('second')
  ) {
    zoomLevels.push(
      {
        unit: 'second',
        duration: 1 * SECOND_IN_MILLISECONDS,
        isMajorLevel: mainLevel => mainLevel.unit === 'millisecond',
        getSteps: getSteps('second', 1),
      },
      {
        unit: 'second',
        duration: 5 * SECOND_IN_MILLISECONDS,
        isMajorLevel: () => false,
        getSteps: getSteps('second', 5),
      },
      {
        unit: 'second',
        duration: 10 * SECOND_IN_MILLISECONDS,
        isMajorLevel: () => false,
        getSteps: getSteps('second', 10),
      },
      {
        unit: 'second',
        duration: 30 * SECOND_IN_MILLISECONDS,
        isMajorLevel: () => false,
        getSteps: getSteps('second', 30),
      }
    );
  }

  if (
    units.indexOf(minUnit) <= units.indexOf('minute') &&
    units.indexOf(maxUnit) >= units.indexOf('minute')
  ) {
    zoomLevels.push(
      {
        unit: 'minute',
        duration: 1 * MINUTE_IN_MILLISECONDS,
        isMajorLevel: mainLevel => mainLevel.unit === 'second',
        getSteps: getSteps('minute', 1),
      },
      {
        unit: 'minute',
        duration: 5 * MINUTE_IN_MILLISECONDS,
        isMajorLevel: () => false,
        getSteps: getSteps('minute', 5),
      },
      {
        unit: 'minute',
        duration: 10 * MINUTE_IN_MILLISECONDS,
        isMajorLevel: () => false,
        getSteps: getSteps('minute', 10),
      },
      {
        unit: 'minute',
        duration: 30 * MINUTE_IN_MILLISECONDS,
        isMajorLevel: () => false,
        getSteps: getSteps('minute', 30),
      }
    );
  }

  if (
    units.indexOf(minUnit) <= units.indexOf('hour') &&
    units.indexOf(maxUnit) >= units.indexOf('hour')
  ) {
    zoomLevels.push(
      {
        unit: 'hour',
        duration: 1 * HOUR_IN_MILLISECONDS,
        isMajorLevel: mainLevel => mainLevel.unit === 'minute',
        getSteps: getSteps('hour', 1),
      },
      {
        unit: 'hour',
        duration: 3 * HOUR_IN_MILLISECONDS,
        isMajorLevel: () => false,
        getSteps: getSteps('hour', 3),
      },
      {
        unit: 'hour',
        duration: 6 * HOUR_IN_MILLISECONDS,
        isMajorLevel: () => false,
        getSteps: getSteps('hour', 6),
      }
    );
  }

  if (
    units.indexOf(minUnit) <= units.indexOf('day') &&
    units.indexOf(maxUnit) >= units.indexOf('day')
  ) {
    zoomLevels.push(
      {
        unit: 'day',
        duration: 1 * DAY_IN_MILLISECONDS,
        isMajorLevel: mainLevel =>
          ['hour', 'minute', 'second', 'millisecond'].includes(mainLevel.unit),
        getSteps: getSteps('day', 1),
      },
      {
        unit: 'day',
        duration: 5 * DAY_IN_MILLISECONDS,
        isMajorLevel: () => false,
        getSteps: getSteps('day', 5),
      },
      {
        unit: 'day',
        duration: 10 * DAY_IN_MILLISECONDS,
        isMajorLevel: () => false,
        getSteps: getSteps('day', 10),
      }
    );
  }

  if (
    units.indexOf(minUnit) <= units.indexOf('month') &&
    units.indexOf(maxUnit) >= units.indexOf('month')
  ) {
    for (const i of [1, 2, 4, 6]) {
      zoomLevels.push({
        unit: 'month',
        duration: i * MONTH_IN_MILLISECONDS,
        isMajorLevel: mainLevel => mainLevel.unit === 'day' && i === 1,
        getSteps: getSteps('month', i),
      });
    }
  }

  if (
    units.indexOf(minUnit) <= units.indexOf('year') &&
    units.indexOf(maxUnit) >= units.indexOf('year')
  ) {
    for (const i of [1, 10, 100, 1000]) {
      zoomLevels.push(
        {
          unit: 'year',
          duration: i * YEAR_IN_MILLISECONDS,
          isMajorLevel: mainLevel => mainLevel.unit === 'month' && i === 1,
          getSteps: getSteps('year', i),
        },
        {
          unit: 'year',
          duration: 2 * i * YEAR_IN_MILLISECONDS,
          isMajorLevel: () => false,
          getSteps: getSteps('year', 2 * i),
        },
        {
          unit: 'year',
          duration: 5 * i * YEAR_IN_MILLISECONDS,
          isMajorLevel: () => false,
          getSteps: getSteps('year', 5 * i),
        }
      );
    }
  }

  return zoomLevels;
}

export default (
  locale: string = 'en',
  minUnit: Units = 'millisecond',
  maxUnit: Units = 'year'
) => ({
  parse: parse(minUnit),
  unparse,
  parseDuration,
  getMinimumDuration: getMinimumDuration(minUnit),
  isBefore,
  diff,
  add,
  subtract,
  format: format(locale, minUnit, maxUnit),
  isImportantStep,
  zoomLevels: getZoomLevels(minUnit, maxUnit),
});
