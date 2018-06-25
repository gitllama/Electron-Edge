import WebPack from 'webpack'

export default (env) => {
  const MAIN = env && env.main
  const PROD = env && env.prod
  return {
    target: MAIN ? 'electron-main' : 'electron-renderer',
    entry: MAIN ? './src/main.js' : './src/index.jsx',
    output: {
      path: PROD ? `${__dirname}/dist` : `${__dirname}/dist/src`,
      filename: MAIN ? 'main.js' : 'index.js'
    },
    devtool: PROD ? '' : 'source-map',
    node: {
      __dirname: false,
      __filename: false
    },
    module: {
      rules: [
          {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              options: {
                  presets: ['react']
              }
          }
      ]
      // rules: [
      //   {
      //     test: /\.js$/,
      //     exclude: /node_modules/,
      //     use: {
      //       loader: 'babel-loader'
      //     }
      //   }
      // ]
    },
    // plugins: PROD ? [
    //   new MinifyPlugin({
    //     replace: {
    //       'replacements': [
    //         {
    //           'identifierName': 'DEBUG',
    //           'replacement': {
    //             'type': 'numericLiteral',
    //             'value': 0
    //           }
    //         }
    //       ]
    //     }
    //   }, {}),
    //   new WebPack.DefinePlugin({
    //     'process.env.NODE_ENV': JSON.stringify('production')
    //   })
    // ] : [
    //   // development
    // ]
  }
}

// module.exports = {
//     target: 'electron-renderer',
//     entry: './src/index.jsx',
//     output: {
//         path: __dirname + '/dist',
//         publicPath: '/',
//         filename: 'index.js'
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.jsx?$/,
//                 loader: 'babel-loader',
//                 options: {
//                     presets: ['react']
//                 }
//             },
//             // {
//             //     test: /\.css$/,
//             //     loader: ExtractTextPlugin.extract({
//             //       loader: 'css-loader',
//             //       options: {
//             //         modules: true
//             //       }
//             //     })
//             // },
//             // {
//             //     test: /\.(png|jpg|gif|svg)$/,
//             //     loader: 'file-loader',
//             //     query: {
//             //         name: '[name].[ext]?[hash]'
//             //     }
//             // }
//         ]
//     },
//     // plugins: [
//     //     new ExtractTextPlugin({
//     //         filename: 'bundle.css',
//     //         disable: false,
//     //         allChunks: true
//     //     })
//     // ],
//     resolve: {
//       extensions: ['.js', '.json', '.jsx']
//     }
//
// }
