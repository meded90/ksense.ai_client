module.exports = () => {
  const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
  const { getThemeVariables } = require('antd/dist/theme');

  const withAntd = require('./next-antd.config');

  const withLess = require('@zeit/next-less');
  const withCSS = require('@zeit/next-css');
  const lessToJS = require('less-vars-to-js');
  const fs = require('fs');
  const path = require('path');
  // Where your antd-custom.less file lives
  const themeVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8'));
  // fix: prevents error when .less files are required by node
  if (typeof require !== 'undefined') {
    require.extensions['.less'] = file => {
    };
  }

  let modifyVars = Object.assign({}, getThemeVariables({
    dark: true,
    compact: true,
  }), themeVariables);

  return withAntd({
    cssModules: true,
    cssLoaderOptions: {
      sourceMap: false,
      importLoaders: 1,
    },
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: modifyVars,
    },
    webpack: config => {
      config.plugins.push(
        new FilterWarningsPlugin({
          // ignore ANTD chunk styles [mini-css-extract-plugin] warning
          exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
        }),
      );

      return config;
    },
  })
};
