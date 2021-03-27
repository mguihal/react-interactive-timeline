import React from 'react';

export type Theme = {
  theme?: string;
  timeline?: string;

  stepLabels?: string;

  stepLevel?: string;
  stepLevel0?: string;
  stepLevel1?: string;
  stepLevel2?: string;
  stepLevel3?: string;

  stepLabel?: string;

  controls?: string;
  baseControl?: string;
} & { [key: string]: string };

export const ThemeContext = React.createContext<Theme>({});
