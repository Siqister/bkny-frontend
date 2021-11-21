const path = require('path');
const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	devtool: "source-map",
	devServer: {
		host: '0.0.0.0',
		contentBase: path.join(__dirname,'dist')
	}
});