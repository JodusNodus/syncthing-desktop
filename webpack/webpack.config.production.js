import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import baseConfig from './webpack.config.base';

const config = {
  ...baseConfig,

  devtool: 'source-map',

  entry: './app/client/index.js',

  output: {
    ...baseConfig.output,
  },

  module: {
    ...baseConfig.module,

    loaders: [
      ...baseConfig.module.loaders,
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?localIdentName=[path][name]--[local]!postcss-loader!sass'
        ),
      },
    ]
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      __DEV__: false,
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    }),
    new ExtractTextPlugin('style.css', { allChunks: true })
  ],

  target: 'electron-renderer'
};

export default config;
