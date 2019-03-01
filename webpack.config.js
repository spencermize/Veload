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
		chunkFilename: '[name].[contenthash:8].js',
		path: path.resolve(__dirname,'public/js'),
		publicPath: '/js/',
		sourceMapFilename: '[name].js.map'
	},
	node: {
		fs: 'empty'
	},
	cache: true,
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
		},
		modules: [
			'src/js/modules/',
			'node_modules/'
		]
	},
	module: {
		rules: [{
			loader: 'babel-loader',
			test: /\.js$/,
			exclude: /node_modules/,
			include: [
				path.join(__dirname,'src'),
				path.join(__dirname,'test')
			],
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
		new MomentLocalesPlugin(), //To strip all locales except “en”
		new webpack.HashedModuleIdsPlugin(), //so that file hashes don't change unexpectedly
		new webpack.ProvidePlugin({
			'$': 'jquery',
			'Handlebars': 'handlebars'
		})
	]
};
