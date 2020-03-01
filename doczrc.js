import { css } from 'docz-plugin-css';

export default {
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
