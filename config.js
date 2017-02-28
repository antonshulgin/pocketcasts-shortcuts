// jshint node: true
// jshint esnext: true
'use strict';

const PROJECT_NAME = 'pocketcasts-shortcuts';

module.exports = {

	src: {
		root: 'src/',
		js: [
			'src/**/*.js'
		],
		assets: [
			'src/**/*.json'
		]
	},

	dist: {
		root: 'dist/',
		filenames: {
			js: PROJECT_NAME + '.js'
		}
	}

};
