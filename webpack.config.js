const webpack = require('webpack');
const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	entry: {
		main: './src/js/main.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname,'public/js'),
		publicPath: '/js/',
		sourceMapFilename: '[name].js.map'
	},
	node: {
		fs: 'empty'
	},
	cache: false,
	devtool: 'false',
	mode: 'production',
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					output: {
						comments: false,
						beautify: false
					},
					compress: {
						drop_console: true
					}
				},
				sourceMap: false
			})
		],
		noEmitOnErrors: true
	},
	//fix handlebars warnings
	resolve: {
		alias: {
			handlebars: 'handlebars/dist/handlebars.min.js'
		}
	},
	module: {
		rules: [{
			loader: 'babel-loader',
			test: /\.js$/,
			exclude: /node_modules/,
			query: {
				plugins: ['lodash','@babel/plugin-syntax-dynamic-import'],
				presets: [['@babel/env',{ 'targets': { 'node': 6 } }]]
			}
		},
		{
			test: /\.js$/,
			use: ['source-map-loader'],
			enforce: 'pre'
		}
		]
	},
	plugins: [
		//To strip all locales except “en”
		new MomentLocalesPlugin(),
		new webpack.ProvidePlugin({
			'$': 'jquery',
			'Handlebars': 'handlebars'
		})
	]
};
