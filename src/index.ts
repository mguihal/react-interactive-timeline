import Timeline from './Timeline';

import { panTimeline, zoomTimeline } from './interactions';

import calendar from './calendar';

import { PeriodVariantProps } from './Period/Period';

const interactions = {
  pan: panTimeline,
  zoom: zoomTimeline,
};

export {
  Timeline,
  interactions,
  calendar,
};

export type TimelinePeriodVariantProps = PeriodVariantProps;

export default {
  Timeline,
  interactions,
  calendar
};
