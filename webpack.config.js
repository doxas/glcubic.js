
const webpack = require('webpack');
const path = require('path');

let devmode = false;
if('--debug' in process.argv){devmode = 'inline-source-map';}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        script: './gl3Core.js'
    },
    output: {
        path: path.resolve(__dirname, 'build/js'),
        publicPath: './',
        filename: 'glcubic.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['es2015']
                    ]
                }
            }]
        }]
    },
    cache: true,
    devtool: devmode
};
