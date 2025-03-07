import path from 'path';

import webpack from 'webpack';

import HtmlPlugin from 'html-webpack-plugin';
import FaviconsPlugin from 'favicons-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import packageJson from './package.json';

const { DefinePlugin } = webpack;

const port = process.env.PORT || 6663;

export default (env, argv) => {
  const { mode } = argv;
  return {
    context: path.resolve(__dirname, 'src'),
    entry: {
      [packageJson.name]: ['core-js/stable', 'regenerator-runtime/runtime', './index.js']
    },
    output: {
      path: path.resolve(__dirname, 'dist')
    },
    devtool: mode === 'development' ? 'source-map' : false,
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist')
      },
      port,
      historyApiFallback: true
    },
    resolve: {
      symlinks: false,
      extensions: ['.tsx', '.ts', '.js']
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        use: 'babel-loader',
        include: path.resolve(__dirname, 'src')
      }, {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: { publicPath: '../' } },
          'css-loader',
          'postcss-loader',
          { loader: 'resolve-url-loader', options: { keepQuery: true } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      }, {
        test: /\.(jpg|png)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash:6][ext]'
        }
      }, {
        test: /\.(eot|otf|svg|ttf|woff2?)/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:6][ext]'
        }
      }, {
        test: /\.mp3$/,
        type: 'asset/resource',
        generator: {
          filename: 'sound/[name].[hash:6].[ext]'
        }
      }]
    },
    plugins: [
      new DefinePlugin({
        NODE_ENV: JSON.stringify(mode),
        VERSION: JSON.stringify(packageJson.version)
      }),
      new HtmlPlugin({
        title: 'Арифметика',
        template: path.resolve(__dirname, 'src/index.html'),
        minify: {
          collapseWhitespace: mode === 'production'
        }
      }),
      new FaviconsPlugin(path.resolve(__dirname, 'src/yellowberry.png')),
      new MiniCssExtractPlugin({
        filename: `css/${mode === 'development' ? '[name].css' : '[name].[hash:6].css'}`,
        chunkFilename: `css/${mode === 'development' ? '[name].css' : '[name].[hash:6].css'}`
      })
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /node_modules/,
            chunks: 'initial',
            enforce: true
          }
        }
      },
      runtimeChunk: true,
      minimize: mode === 'production',
      minimizer: [
        new TerserPlugin({
          extractComments: false
        }),
        new CssMinimizerPlugin()
      ]
    },
    performance: {
      maxEntrypointSize: 1024 * 1024,
      maxAssetSize: 1024 * 1024
    }
  };
};
