const path = require('path');

module.exports = {
    entry: './js/react/bundle.jsx',
    output: {
        path: path.join(__dirname, 'public/js/'), // absolute path
        filename: 'react-bundle.js', // file name
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.jsx', '.js'],
    },
};
