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
                use: [
                    {
                        loader: 'babel-loader',
                        options: { exclude: /node_modules/,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.jsx', '.js', '.module.css'],
    },
};
