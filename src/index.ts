import Timeline from './Timeline';

import { panTimeline, zoomTimeline } from './interactions';

import calendar from './calendar';

const interactions = {
  pan: panTimeline,
  zoom: zoomTimeline,
};

export { interactions, calendar };

export default Timeline;
