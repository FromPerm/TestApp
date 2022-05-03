const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  var mode = env.NODE_ENV;
  
  return {
    entry: path.resolve(__dirname, 'Js', 'app.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'app.js'
    },
    devtool: mode === 'production' ? 'nosources-source-map': 'source-map',
    target: ['web', 'es5'],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      server: {
        type: 'http',
      },
      port: process.env.npm_package_config_dev_server_port || 3000,
      static: {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/',
      },
    },
    module: {
      rules: [
        {
          test: /\.(tsx|ts)$/,
          include: path.resolve(__dirname, 'Js'),
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  "targets": "defaults" 
                }],
                '@babel/preset-react'
              ]
            }
          }]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: '../' },
            },
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
          ],
        },
        {
          test: /\.css$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: '../' },
            },
            { loader: 'css-loader', options: { modules: false, sourceMap: true } },
          ],
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: './Css/[name].css' }),
      new HtmlWebpackPlugin({
        filename: `index.html`,
        template: `./Views/index.html`,
        inject: 'body',
      })
    ]
  }
};