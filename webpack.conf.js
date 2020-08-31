const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  // mode: 'production',
  mode: 'development',
  devtool: 'cheap-module-source-map',
  context: path.resolve(__dirname, './'),
  performance: { hints: false },
  entry: {
    contentScript: ['./src/content-script/index.js'],
    // background: ['./src/background/index.js'],
    popup: ['@babel/polyfill', './src/popup/index.js'],
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      '~~components': path.resolve(__dirname, 'src', 'popup', 'components'),
      '~~features': path.resolve(__dirname, 'src', 'popup', 'features'),
      '~~utils': path.resolve(__dirname, 'src', 'popup', 'utils'),
      '~~hooks': path.resolve(__dirname, 'src', 'popup', 'hooks'),
    },
    extensions: [
      '.js',
      '.jsx'
    ]
  },
  plugins:
    [
      // new UglifyJsPlugin({
      //   parallel: true,
      //   sourceMap: true,
      // }),
      // new CompressionPlugin(),
    ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          }, {
            loader: 'eslint-loader',
            options: {
              quiet: true,
            },
          }],
        include: [path.resolve('src', 'popup')],
      },
      {
        test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
        options: {} // name: '[path][name].[hash].[ext]'
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(sass|scss)$/,
        loaders: [{
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: loader => [require('autoprefixer')()]
          }
        },
        {
          loader: 'sass-loader'
        },
        {
          loader: 'autoprefixer-loader',
          query: {
            browsers: 'last 2 versions'
          }
        }
        ]
      },
      {
        test: /\.css$/,
        loaders: [{
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: loader => [require('autoprefixer')()]
          }
        }
        ]
      },
      {
        test: /\.less$/,
        loaders: [{
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: loader => [require('autoprefixer')()]
          }
        },
        {
          loader: 'less-loader',
          options: {
            lessOptions: { // If you are using less-loader@5 please spread the lessOptions to options directly
              modifyVars: {
                'font-size-base': '10px',
              },
              javascriptEnabled: true,
            },
          },
        }
        ]
      },
      {
        test: /\.styl$/,
        loaders: [{
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: loader => [require('autoprefixer')()]
          }
        },
        {
          loader: 'stylus-loader'
        }
        ]
      },
      {
        test: /\.html$/,
        loaders: [{
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }]
      }
    ]
  },
};
