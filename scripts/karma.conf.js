var path = require('path');
var webpack = require('webpack');

module.exports = function (config) {
  var customLaunchers = {
    BS_Chrome: {
      name: 'Chrome',
      base: 'BrowserStack',
      os: 'Windows',
      os_version: '10',
      browser: 'Chrome',
      browser_version: '73.0'
    },
    // BS_ChromeAndroid: {
    //   base: 'BrowserStack',
    //   device: 'Samsung Galaxy S8',
    //   os_version: '7.0',
    //   real_mobile: true
    // },
    BS_Firefox: {
      name: 'Firefox',
      base: 'BrowserStack',
      os: 'Windows',
      os_version: '10',
      browser: 'Firefox',
      browser_version: '67.0'
    },
    BS_Edge: {
      name: 'Edge',
      base: 'BrowserStack',
      os: 'Windows',
      os_version: '10',
      browser: 'Edge',
      browser_version: '17.0'
    },
    BS_IE11: {
      name: 'IE 11',
      base: 'BrowserStack',
      os: 'Windows',
      os_version: '10',
      browser: 'IE',
      browser_version: '11.0'
    }
    // Safari throws an error if you use replaceState more
    // than 100 times in 30 seconds :/
    // BS_Safari: {
    //   base: 'BrowserStack',
    //   os: 'OS X',
    //   os_version: 'Mojave',
    //   browser: 'Safari',
    //   browser_version: '12.1'
    // }
    // BS_iPhoneX: {
    //   base: 'BrowserStack',
    //   device: 'iPhone X',
    //   os_version: '11',
    //   real_mobile: true
    // },
    // BS_iPhoneXS: {
    //   base: 'BrowserStack',
    //   device: 'iPhone XS',
    //   os_version: '12',
    //   real_mobile: true
    // },
  };

  config.set({
    singleRun: true,
    customLaunchers: customLaunchers,
    browsers: ['Chrome' /*, 'Firefox'*/],
    frameworks: ['mocha' /*, 'webpack' */],
    reporters: ['mocha'],
    files: ['tests.webpack.js'],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    webpack: {
      // TODO: Webpack 4+
      // mode: 'none',
      devtool: 'inline-source-map',
      resolve: {
        modules: [path.resolve(__dirname, '../'), 'node_modules'],
        alias: {
          history: path.resolve(__dirname, '../build/history')
        }
      },
      module: {
        rules: [
          {
            test: /__tests__\/.*\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('test')
        })
      ]
    },
    webpackServer: {
      noInfo: true
    }
  });

  if (process.env.TRAVIS || process.env.USE_CLOUD) {
    config.browsers = Object.keys(customLaunchers);
    config.reporters = ['dots'];
    config.concurrency = 2;
    config.browserDisconnectTimeout = 10000;
    config.browserDisconnectTolerance = 3;

    if (process.env.TRAVIS) {
      config.browserStack = {
        project: 'history',
        build: process.env.TRAVIS_BRANCH
      };
    } else {
      config.browserStack = {
        project: 'history'
      };
    }
  }
};
