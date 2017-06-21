const { series, crossEnv, concurrent, rimraf } = require('nps-utils')
const { config: { port: E2E_PORT } } = require('./test/protractor.conf')

module.exports = {
  scripts: {
    run: concurrent.nps(
      'clean',
      'main',
      'renderer'
    ),

    build: concurrent.nps(
      'clean',
      'main.build.prod',
      'renderer.build.prod'
    ),

    clean: rimraf('dist'),

    release: 'build -c electron-builder.yml',
    main: {
      default: series(
        'nps main.build.dev',
        'nps main.run'
      ),
      run: 'cross-env NODE_ENV=development electron ./dist',
      build: {
        dev: 'webpack --config webpack.config.main.js --progress -d',
        prod: 'webpack --config webpack.config.main.js --progress --env.production'
      }
    },
    renderer: {
      default: 'nps renderer.build.dev',
      build: {
        dev: 'webpack --watch --progress -d',
        prod: 'webpack --progress --env.production'
      }
    }
  }
}
