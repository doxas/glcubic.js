
const webpack = require('webpack');
const path = require('path');

let devmode = false;

if(process.env.NODE_ENV === 'release'){
    console.log('🍶 release build');
}else{
    devmode = 'inline-source-map';
    console.log('☕ debug build');
}

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
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['env']
                    ]
                }
            }]
        }]
    },
    cache: true,
    devtool: devmode
};
