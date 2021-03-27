import { css } from 'docz-plugin-css';

export default {
  base: '/react-interactive-timeline/',
  typescript: true,
  plugins: [
    css({
      preprocessor: 'postcss',
      cssmodules: true,
      loaderOpts: {
        /* whatever your preprocessor loader accept */
      }
    })
  ],
  filterComponents: files => files.filter(filepath => /[w-]*.(js|jsx|ts|tsx)$/.test(filepath)),
};
