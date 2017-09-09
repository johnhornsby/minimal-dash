var path = require("path");
var webpack = require("webpack");


module.exports = {
	entry: {
		'dev': [
			"webpack-dev-server/client?http://localhost:4000",
			'./dev/index.js'
		]
	},

	output: {
		filename: '[name].js',
	},

	module: {
	  rules: [
	    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
	  ]
	},

  	devServer: {
		noInfo: true
	},

	devtool: 'source-map"'
}
