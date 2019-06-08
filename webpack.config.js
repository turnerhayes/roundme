const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const jsxFilenameRegex = /\.jsx?$/;

const IS_DEVELOPMENT = true;

module.exports = {
	"entry": "./client/scripts/index.jsx",

	"output": {
		"path": path.resolve(__dirname, "client", "dist"),
		"publicPath": "/static/",
		"filename": "js/bundle.js"
	},

	"module": {
		"rules": [
			{
				"test": jsxFilenameRegex,
				"exclude": /node_modules/,
				"use": ["babel-loader", "eslint-loader"]
			},

			{
				"test": /\.less$/,
				"loader": ExtractTextPlugin.extract(
					{
						"use": "css-loader?sourceMap!postcss-loader!less-loader?" +
						JSON.stringify({
							"sourceMap": true,
							"modifyVars": {
								"fa-font-path": '"/static/fonts/font-awesome/"'
							}
						}),
						"publicPath": "/static/css"
					}
				)
			},

			{
				"test": /\.css$/,
				"loader": ExtractTextPlugin.extract({
					"use": "css-loader?sourceMap!postcss",
					"publicPath": "/static/css"
				})
			},

			{
				"test": /\.woff(2)?(\?.*)?$/,
				"loader": "url-loader?limit=10000&mimetype=application/font-woff"
			},

			{
				"test": /\.ttf(\?.*)?$/,
				"loader": "file-loader"
			},

			{
				"test": /\.eot(\?.*)?$/,
				"loader": "file-loader"
			},

			{
				"test": /\.svg(\?.*)?$/,
				"loader": "file-loader"
			}
		]
	},

	"plugins": [
		new webpack.ProvidePlugin({
			"React": "react"
		}),

		// jQuery and Tether required by Bootstrap
		new webpack.ProvidePlugin({
			"jQuery": "jquery",
			"$": "jquery"
		}),

		new webpack.DefinePlugin({
			"IS_DEVELOPMENT": JSON.stringify(IS_DEVELOPMENT),
		}),

		new ExtractTextPlugin(
			{
				"filename": "css/bundle.css",
				"allChunks": true
			}
		)
	],

	"resolve": {
		"extensions": [".js", ".jsx", ".json", ".less", ".css"],
		"modules": [
			path.resolve(__dirname, "node_modules"),
			path.resolve(__dirname, "client"),
			path.resolve(__dirname, "client", "styles")
		]
	},

	"node": {
		"events": true
	},

	"devtool": "source-map"
	// "devtool": "cheap-eval-source-map"
};
