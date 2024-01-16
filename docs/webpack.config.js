const path = require('path');

module.exports = {
    entry: './App.mjs',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
