var path = require("path");


module.exports = {
	entry: {
		app: ["./src/player.js"]
	},
	output: {
		libraryTarget: "umd",
		path: path.join(__dirname, './dist/'),
		filename: "minimal-dash.js"
	},
	module: {
	  rules: [
	    {
	      test: /\.js?$/,
	      exclude: /(dist|lib|node_modules)/,
	      loader: 'babel-loader'
	    }
	  ]
	}
}
