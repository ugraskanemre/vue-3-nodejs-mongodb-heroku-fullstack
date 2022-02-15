const path = require("path");

module.exports = {

    //outputDir: path.resolve(__dirname, "../public"), /*Only prod */
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    },
    //Only prod start
    /*devServer: {
        proxy: {
            '/': {
                target: 'http://localhost:5500'
            }
        },
        disableHostCheck: true,
        port: 4000,
        public: '0.0.0.0:4000'
    },
    publicPath: "/"/*Only prod */
}