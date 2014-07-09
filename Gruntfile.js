'use strict';

/**
 *
 * @param path
 * @param grunt
 * @param config
 * @returns {{}}
 */
function loadConfig(path, grunt, config) {
	var glob = require('glob'),
		object = {},
		key;

	glob.sync('*', { cwd: path }).forEach(function(option) {
		key = option.replace(/\.js$/,'');
		object[key] = require(path + option)(grunt, config);
	});

	return object;
}

module.exports = function(grunt) {
	// Show elapsed time at the end
	require('time-grunt')(grunt);

	// Load all grunt tasks
	require('load-grunt-tasks')(grunt);

	// Manually load grunt tasks
	grunt.loadNpmTasks('assemble');
	require('./grunt-css-rebase')(grunt);
	require('./grunt-image-embed')(grunt);

	// Load config
	var config = require('./config.js')(grunt);
	grunt.util._.extend(config, loadConfig('./grunt/', grunt, config));
	grunt.initConfig(config);

	// Create tasks
	grunt.util._.each(config.aliases, function(value, key) {
		grunt.registerTask(key, value);
	});
};