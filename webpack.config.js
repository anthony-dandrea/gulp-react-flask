var path        = require('path'),
    I18nPlugin  = require('i18n-webpack-plugin'),
    webpack     = require('webpack'),
    getFiles    = require('./lib/getFiles.js'),
    languages   = {
        "en": null,
        "es": require('./src/locale/es.po.json')
    };

module.exports = Object.keys(languages).map(function(language) {
    return {
        name: language,
        entry: getFiles('src/static/scripts'),
        output: {
            path: path.join(__dirname, 'dist/static/scripts'),
            filename: language + '.[name].output.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel'
                },
                {
                    test: /\.json$/,
                    exclude: /node_modules/,
                    loaders: ['json-loader']
                }
            ]
        },
        plugins: [
            new I18nPlugin(
                languages[language]
            )
        ]
    };
});
