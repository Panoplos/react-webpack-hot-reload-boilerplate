const path = require('path');
const webpack = require('webpack');

const root = process.cwd();

module.exports = {
	context: root,
	entry: {
		vendors: [
			'core-js',
			'graphql-tag',
			'react',
			'react-dom',
			'react-apollo',
			'react-router',
			'react-router-redux',
			'react-semantic-ui',
			'recompose',
			'redux',
			'redux-socket-cluster',
			'socketcluster-client'
		]
	},

	devtool: 'eval',
	output: {
		filename: '[name].dll.js',
		path: path.join(root, 'build'),
		library: '[name]',
	},
	plugins: [
		new webpack.DllPlugin({
			name: '[name]',
			path: path.join(root, 'dll', '[name].json')
		}), // eslint-disable-line no-new
	]
};
