const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    resolve: { 
        extensions: ['.js',] 
    },
    entry: {
        'packages/RP': './app/server',
        'client_packages': './app/client',
    },
    output: {
        path: path.resolve(__dirname),
        filename: '[name]/index.js'
    },
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    plugins: [
        new CopyWebpackPlugin([
            { from: 'app/client/Browsers', to: 'client_packages/RP/Browsers' }
        ])
    ]
};