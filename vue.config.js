const webpack = require('webpack');

module.exports = {
    lintOnSave: false,
    devServer: {
        // proxy: "http://127,0,0,1:8081"
    },

    pages: {
        index: {
            entry: 'example/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'BASE-UI DEMO',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },

    // transpileDependencies: [/@?element-ui/],
    outputDir: './demo',
    productionSourceMap: false,

    configureWebpack: {
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {}
        },
        plugins: [
            new webpack.ProvidePlugin({})
        ]
    },
    parallel: true,

    css: {
        loaderOptions: {}
    }
};
