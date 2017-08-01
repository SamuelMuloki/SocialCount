var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./src/SocialCount.ts",
    output: {
        path: __dirname + "/dist/tmp",
        filename: "src/widget/SocialCount.js",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [ ".ts", ".js", ".json" ],
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            }) }
        ]
    },
    node: {
        fs: 'empty'
    },
    devtool: "source-map",
    externals: [ /^mxui\/|^mendix\/|^dojo\/|^dijit\// ],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.xml" }
        ], {
            copyUnmodified: true
        }),
        new ExtractTextPlugin("./src/widget/ui/SocialCount.css"),
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ]
};
