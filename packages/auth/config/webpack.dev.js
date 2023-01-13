const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("../package.json");

const devConfig = {
    mode: "development",
    output: {
        publicPath: "http://localhost:8082/",
        // this is needed so the the main.js is served from the root (/).
        // issue with this project because it has routes by default like /auth/signin and main.js is not in those paths
        // need to use localhost:8082 because of the federation has to load the remoteEntry from there. normally just / would be fine
    },
    devServer: {
        port: 8082,
        historyApiFallback: {
            index: "/index.html",
        },
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "auth",
            filename: "remoteEntry.js",
            exposes: {
                "./AuthApp": "./src/bootstrap",
            },
            shared: packageJson.dependencies,
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
};

module.exports = merge(commonConfig, devConfig);
