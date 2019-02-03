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
    path: path.resolve(__dirname, 'public/js')
  },
  watchOptions: {
    ignored: /node_modules/
  },
  node: {
	fs: 'empty'
  },
  devtool: false,
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({
		include: /\/node_modules/,
		sourceMap: false,
		terserOptions:{
			output: {
				comments: false,
				beautify: false
			},
			compress: {
				drop_console: true
			}
		}
	})]
	},  
	//fix handlebars warnings
	resolve: {
		alias: {
			handlebars: 'handlebars/dist/handlebars.min.js'
		}
	},	
	plugins: [
        // To strip all locales except “en”
        new MomentLocalesPlugin(),
		new BundleAnalyzerPlugin({
			analyzerMode: 'static'
		}),
		new webpack.ProvidePlugin({
			'$': 'jquery',
			'Handlebars': 'handlebars',
			'_': 'lodash'
		})
    ]
};