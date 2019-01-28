const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const webpack = require('webpack');
new webpack.ProvidePlugin({
	'$': 'jquery',
	'Handlebars': 'handlebars'
 })
 
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js',
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
        new MomentLocalesPlugin()
    ],
};