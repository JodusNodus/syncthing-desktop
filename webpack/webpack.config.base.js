import path from 'path'

export default {
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/,
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }],
  },
  output: {
    path: path.join(__dirname, '../dist/client'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
    modulesDirectories: ['node_modules', 'app'],
  },
  plugins: [

  ],
  //Shared packages between main and renderer
  externals: [
    'lodash',
    'auto-launch',
    'electron-json-storage',
    'redux',
    'redux-electron-store',
    'redux-thunk',
    'reselect',
  ],
}
