const config = require('@rancher/shell/vue.config');
const webpack = require('webpack');

const isStandalone = process.env.IS_STANDALONE === 'true';
let montyApi = process.env.MONTY_API || 'http://localhost:8888';

if (montyApi && !montyApi.startsWith('http')) {
  montyApi = `http://${ montyApi }`;
}

if (montyApi) {
  console.log(`MONTY API: ${ montyApi }`); // eslint-disable-line no-console
}

console.log(`IS STANDALONE`, isStandalone); // eslint-disable-line no-console

const baseConfig = config(__dirname, {
  excludes: [],
  // excludes: ['fleet', 'example']
});

const baseConfigureWebpack = baseConfig.configureWebpack;

baseConfig.devServer.proxy = {
  '/monty-api': {
    secure:      false,
    target:      montyApi,
    pathRewrite: { '^/monty-api': '' }
  },
};

baseConfig.configureWebpack = (config) => {
  config.plugins.push(new webpack.DefinePlugin({ 'process.env.isStandalone': JSON.stringify(isStandalone) }));

  baseConfigureWebpack(config);
};

// Makes the public path relative so that the <base> element will affect the assets.
if (!isStandalone) {
  baseConfig.publicPath = './';
}

// We need to add a custom script to the index in order to change how assets for the monty backendso we have to override the index.html
if (isStandalone) {
  baseConfig.pages.index.template = './pkg/monty/index.html';
}

module.exports = baseConfig;
