const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
 
module.exports = {
  entry: {
	  main: './src/js/main.js'
  },
  output: {
    filename: '[name].js',
		path: path.resolve(__dirname, 'public/js'),
		publicPath: '/js/'		
  },
  node: {
		fs: 'empty'
	},
	cache :false,
  devtool: 'cheap-module-source-map',
  mode: 'production',
  optimization: {
    minimizer: [
			new TerserPlugin({
				terserOptions:{
					output: {
						comments: false,
						beautify: false
					},
					compress: {
						drop_console: true
					}
				},
				sourceMap: false,				
			})
		],
		noEmitOnErrors: true,			
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
				presets: [['@babel/env', { 'targets': { 'node': 6 } }]]
			}
		}]
	},	
	plugins: [
    // To strip all locales except “en”
    new MomentLocalesPlugin(),
	/*	new BundleAnalyzerPlugin({
			analyzerMode: 'static'
		}),*/
		new webpack.ProvidePlugin({
			'$': 'jquery',
			'Handlebars': 'handlebars'
		})
    ]
};