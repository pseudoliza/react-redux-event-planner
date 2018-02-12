var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: path.resolve('dist'),
        filename: 'bundle.js'
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [
        'node_modules',
      ],
      alias: {
        components: path.resolve(__dirname, `./src/components/`),
        containers: path.resolve(__dirname, `.src/containers/`),
        lib: path.resolve(__dirname, `./src/lib/`),
      },
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-3']
                }
            },
            { test: /\.css$/, loader: 'style-loader!css-loader'},
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body'
    })],
    devServer: {
        historyApiFallback: true
    }
}
