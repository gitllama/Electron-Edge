import WebPack from 'webpack'

// generatorの変換を止めておかないと
// regeneratorRuntime is not defined
// がでる
// loader: 'babel?blacklist[]=regenerator'かelectronにtargetsを合わせる

export default (env) => {
  const MAIN = env && env.main
  const PROD = env && env.prod
  return {
    mode : "production",
    target: MAIN ? 'electron-main' : 'electron-renderer',
    entry: MAIN ? './src/main.js' : './src/index.jsx',
    output: {
      path: PROD ? `${__dirname}/dist` : `${__dirname}/dist/src`,
      filename: MAIN ? 'bundle.js' : 'index.js',
      // library: "dist",
      // libraryTarget: 'commonjs2',
      // globalObject  : 'this'
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
                presets: [
                  [
                    'env',
                    {
                      "targets": { "node": "8.9.3" }
                    }
                  ],
                  'react'
                ]
            }
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: [
                  [
                    'env',
                    {
                      "targets": { "node": "8.9.3" }
                    }
                  ]
                ]
            }
          }
      ]
    }
  }
}

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
