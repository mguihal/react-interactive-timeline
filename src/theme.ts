import React from 'react';

export interface Theme {
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  eventColor: string;
}

export const defaultTheme: Theme = {
  backgroundColor: '#323232',
  primaryColor: '#AAA',
  secondaryColor: '#AA0',
  tertiaryColor: '#A50',
  eventColor: '#81996A',
};

export const ThemeContext = React.createContext<Theme>(defaultTheme);
