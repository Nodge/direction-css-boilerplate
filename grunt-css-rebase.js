/*
 * Based on grunt-cssrb
 * https://github.com/iadramelk/grunt-cssrb
 *
 * Copyright (c) 2013 Aleksey Ivanov
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(grunt) {

	var path = require('path');

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('cssRebase', 'CSS resources rebase plugun', function() {

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
				copy: false,
				move: false,
				patterns: { '': '' },
				root: false,
				prefixSep: '__'
			}),
			cssURLSEdit = require('css-url-edit'),
			URLS,
			urls_collection;

		if (!grunt.file.isPathAbsolute(options.old_base)) {
			options.old_base = path.join(process.cwd(), options.old_base);
		}

		if (!grunt.file.isPathAbsolute(options.new_base)) {
			options.new_base = path.join(process.cwd(), options.new_base);
		}

		if (options.root) {
			if (!grunt.file.isPathAbsolute(options.root)) {
				options.root = path.join(process.cwd(), options.root);
			}
		}

		// Iterate over all specified file groups.
		this.files.forEach(function(f) {

			// Concat specified files.
			var files = f.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				}
				else {
					return true;
				}
			});

			var aSrc = files.map(function(filepath) {
				// Read file source.
				return grunt.file.read(filepath);
			});

			if (f.dest) {
				aSrc = [ aSrc.join(grunt.util.normalizelf('\n')) ];
				files = [ f.dest ];
			}

			aSrc.forEach(function(src, i) {
				var destFile = files[i];

				URLS = cssURLSEdit(src);

				var patterns = options.patterns,
					key,
					mask;

				for (key in patterns) {

					if (patterns.hasOwnProperty(key)) {

						if (typeof key === 'string') {

							mask = new RegExp(key);

						} else if (key instanceof RegExp === true) {

							mask = key;

						} else {

							grunt.log.error('"' + key + '" pattern is ignored. Must be RegExp or String.');

						}

						urls_collection = URLS.getURLs(mask);

						urls_collection.forEach(function(path_url) {
							var path_old = path.join(options.old_base, path_url),
								prefix = options.root ? path.dirname(path_old).replace(options.root + path.sep, '').split(path.sep).join(options.prefixSep) : '',
								new_file_name = prefix + options.prefixSep + path.basename(path_url),
								path_new = path.join(options.new_base, patterns[ key ], new_file_name),
								file_exists;

							if (path_old.indexOf('?') !== -1) {

								path_old = path_old.slice(0, path_old.indexOf('?'));
								path_new = path_new.slice(0, path_new.indexOf('?'));
							}

							if (path_old.indexOf('#') !== -1) {

								path_old = path_old.slice(0, path_old.indexOf('#'));
								path_new = path_new.slice(0, path_new.indexOf('#'));
							}

							file_exists = grunt.file.exists(path_old);

							var path_regex = path_url.replace(/\//gi, '\\/');
							path_regex = path_regex.replace(/\?/gi, '\\?');
							path_regex = path_regex.replace(/\./gi, '\\.');

							URLS.changeURLContent(new RegExp(path_regex), path.join(patterns[ key ], new_file_name).split(path.sep).join('/'));

							if (options.move && file_exists) {

								grunt.file.copy(path_old, path_new);
								grunt.file.delete(path_old);

								grunt.log.writeln('Moved "' + path.relative(process.cwd(), path_old) + '" to "' + path.relative(process.cwd(), path_new) + '".');

							} else if (options.copy && file_exists) {

								grunt.file.copy(path_old, path_new);

								grunt.log.writeln('Copied "' + path.relative(process.cwd(), path_old) + '" to "' + path.relative(process.cwd(), path_new) + '".');

							} else if (options.copy || options.move) {

								grunt.log.warn('File not found "' + path_old + '".');

							}

						});

					}
				}

				// Write the destination file.
				grunt.file.write(destFile, URLS.rebuildCSS());

				// Print a success message.
				grunt.log.writeln('File "' + destFile + '" created.');
			});
		});

	});

};
