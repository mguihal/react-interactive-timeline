# react-interactive-timeline

> A timeline component for React

[![NPM](https://img.shields.io/npm/v/react-interactive-timeline.svg)](https://www.npmjs.com/package/react-interactive-timeline) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Timeline example](https://user-images.githubusercontent.com/303807/76136013-2e9c2000-602d-11ea-9307-54c322768828.png)]

## Install

Using npm:

```bash
$ npm install --save react-interactive-timeline
```

Using yarn:

```bash
$ yarn add react-interactive-timeline
```

## Usage

Basic example:

```tsx
import React from 'react';

import Timeline from 'react-interactive-timeline';

const BasicExample = () => {
  return (
    <Timeline
      startDate={'2018-09-01'}
      endDate={'2019-06-30'}
    >
      <Timeline.Row>
        <Timeline.Event date="2018-12-12" label="My event" />
      </Timeline.Row>
      <Timeline.Row fixedHeight>
        <Timeline.StepLabels />
      </Timeline.Row>
    </Timeline>
  );
};
```

More complete example:

```tsx
import React from 'react';

import Timeline, { calendar } from 'react-interactive-timeline';

const MoreCompleteExample = () => {
  return (
    <Timeline
      calendar={calendar('en', 'day')}
      startDate={'1966-01-01'}
      endDate={'1974-01-01'}
      theme={{
        backgroundColor: '#323232',
        primaryColor: '#AAA',
        secondaryColor: '#AA0',
        tertiaryColor: '#A50',
        eventColor: '#AAA',
      }}
      stepMinWidth="70px"
    >
      <Timeline.Controls panDuration={{ month: 6 }} zoomFactor={2} />
      <Timeline.StepBars />
      <Timeline.CurrentDateBar />

      <Timeline.Row style={{ marginTop: '30px' }}>
        <Timeline.Period startDate="1963-11-22" endDate="1969-01-20" label="Lyndon B. Johnson" color="#1DB1F1" />
        <Timeline.Period startDate="1969-01-20" endDate="1974-08-09" label="Richard Nixon" color="#E61A28" />
      </Timeline.Row>

      <Timeline.Row>
        <Timeline.Event date="1967-01-27" label="Apollo 1" />
        <Timeline.Event date="1968-10-11" label="Apollo 7" />
        <Timeline.Event date="1968-12-21" label="Apollo 8" />
        <Timeline.Event date="1969-03-03" label="Apollo 9" />
        <Timeline.Event date="1969-05-18" label="Apollo 10" />
        <Timeline.Event date="1969-07-16" label="Apollo 11" color="#81996A" />
        <Timeline.Event date="1969-11-14" label="Apollo 12" />
        <Timeline.Event date="1970-04-11" label="Apollo 13" />
        <Timeline.Event date="1971-01-31" label="Apollo 14" />
        <Timeline.Event date="1971-07-26" label="Apollo 15" />
        <Timeline.Event date="1972-04-16" label="Apollo 16" />
        <Timeline.Event date="1972-12-07" label="Apollo 17" />
      </Timeline.Row>

      <Timeline.Row fixedHeight>
        <Timeline.StepLabels />
      </Timeline.Row>
    </Timeline>
  );
};
```

## License

MIT © [mguihal](https://github.com/mguihal)
