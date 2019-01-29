const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 
const webpack = require('webpack');
 
module.exports = {
  entry: {
	  main: './build/js/main.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/js')
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  node: {
	fs: 'empty'
  },
	//fix handlebars warnings
	resolve: {
		alias: {
			handlebars: 'handlebars/dist/handlebars.min.js'
		}
	},
	mode: "development",
	
	plugins: [
        // To strip all locales except “en”
        new MomentLocalesPlugin(),
		new BundleAnalyzerPlugin(),
		new webpack.ProvidePlugin({
			'$': 'jquery',
			'Handlebars': 'handlebars',
			'_': 'lodash'
		})
    ]
};
