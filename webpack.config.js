'use strict';
var path        = require('path'),
    webpack     = require('webpack'),
    getFiles    = require('./getFiles.js');

module.exports = {
    entry: getFiles('src/static/scripts'),
    output: {
        path: path.join(__dirname, "dist/static/scripts"),
        filename: "en.[name].output.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ["babel-loader"],
            }
        ]
    },
    watch: true
}
