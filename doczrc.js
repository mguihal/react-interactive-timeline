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
};
