import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import env from 'env'
import npmPackage from '../package.json'
import vendors from '../dll/vendors.json'

// import UnusedFilesWebpackPlugin from "unused-files-webpack-plugin";

/*
 * Configuration invoked from start run script.
 */

const root = process.cwd();
const clientInclude = [
	path.join(root, 'src')
]

const prefetches = []

const prefetchPlugins = prefetches.map((specifier) => new webpack.PrefetchPlugin(specifier))

export default {
	devtool: 'source-maps',
	//devtool: 'eval',
	context: path.join(root, 'src'),
	entry: {
		app: [
			'react-hot-loader/patch',
			'index.js'
		]
	},
	output: {
		filename: 'index.js',
		// don't hash for performance
		chunkFilename: '[name].chunk.js',
		path: path.join(root, 'build'),
		publicPath: '/static/'
	},
	performance: {
		hints: false
	},
	plugins: [
		...prefetchPlugins,
		new webpack.NamedModulesPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			__CLIENT__: true,
			__PRODUCTION__: false,
			__WEBPACK__: true,
			__APP_VERSION__: JSON.stringify(npmPackage.version),
			'process.env.NODE_ENV': JSON.stringify('development')
		}),
		new webpack.DllReferencePlugin({
			context: root,
			manifest: vendors
		}),
		// new UnusedFilesWebpackPlugin()
	],
	resolve: {
		alias: {
			// necessary when using symlinks that require these guys
			react: path.join(root, 'node_modules', 'react'),
			'react-dom': path.join(root, 'node_modules', 'react-dom'),
		},
		extensions: ['.js'],
		modules: [path.join(root, 'src'), 'node_modules']
	},
	module: {
		rules: [
			{
				test: /\.json$/,
				use: [{ loader: 'json-loader' }]
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)(\?\S*)?$/,
				use: [{ loader: 'url-loader?limit=1000' }]
			},
			{
				test: /\.(eot|ttf|wav|mp3|woff|woff2)(\?\S*)?$/,
				use: [{ loader: 'file-loader' }]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'css-loader',
						options: {
							localIdentName: "[path]_[name]_[local]"
						}
					},
					'postcss-loader'
				],
				include: clientInclude
			},
			{
				test: /\.js$/,
				use: [
					'react-hot-loader/webpack',
					'babel-loader?cacheDirectory'
				],
				include: clientInclude
			}
		]
	},
	devServer: {
		contentBase: path.join(root, "build"),
		publicPath: '/static/',
		index: 'index.html',
		host: env('DEV_HOST'),
		port: env('DEV_PORT'),
		hot: true,
		historyApiFallback: true,
		inline: true,
		open: true,
    noInfo: false,
		stats: {
			chunks: false,
			colors: true,
			modules: true,
			reasons: true,
			errorDetails: true
		}
	}
}
