module.exports = () => {
  /* eslint-disable */
  const darkTheme = require('@ant-design/dark-theme');
  const { getThemeVariables } = require('antd/dist/theme');

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

  return withCSS({
    ...withLess({
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: modifyVars  // make your antd custom effective
      }
    }),
    // cssModules: true,
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: '[local]___[hash:base64:5]'
    }
  });
};
