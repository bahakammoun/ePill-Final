var CopyWebpackPlugin = require('copy-webpack-plugin');

const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    mode: 'development',

    devtool: 'inline-source-map',

    entry: [
        './src/index.js'
    ],
    devtool: 'source-map',
    output: {
        path: __dirname + '/../resources/public',
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new CopyPlugin({
            patterns:[
                {from: 'assets/**/*'},
                {from: 'locales/**/*'},
                {from: 'index.html'}
            ]})
    ],
    module: {
        rules: [{
            exclude: /node_modules/,

            loader: 'babel-loader' ,
            query: {
                presets: ['react', 'es2015', 'stage-1'],
            },

        } ,   {
            test: /\.css$/,
            include: /node_modules/,
            use: ['style-loader', 'css-loader'],
        },{
            test: /\.(png|gif|woff|woff2|eot|ttf|svg)$/,
            loader: "url-loader?limit=100000"
        }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },


};