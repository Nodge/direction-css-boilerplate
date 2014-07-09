'use strict';

module.exports = function(grunt) {
	var pkg = grunt.file.readJSON('package.json');

	var paths = {
		src: 'src',
		resources: 'res',
		release: 'build/release',
		preview: 'build/preview'
	};

	// load pages config
	var pages = grunt.file.readJSON('page-list.json'),
		options = grunt.file.readJSON('build-options.json');

	// load scripts config
	var assets = grunt.file.readJSON('assets-config.json');
	grunt.util._.each(assets, function(packages, type) {
		grunt.util._.each(packages, function(files, packageName) {
			assets[type][packageName] = files.map(function(file) {
				return paths.src + '/' + file;
			});
		});
	});

	// transform script assets
	if (!options.vendor_external) {
		grunt.util._.each(assets.js, function(files, packageName) {
			if (packageName.match(/_vendor$/)) {
				var name = packageName.replace(/_vendor$/, '');
				if (assets.js[name]) {
					assets.js[name] = files.concat(assets.js[name]);
				}
				else {
					assets.js[name] = files;
				}
				delete assets.js[packageName];
			}
		});
	}

	grunt.util._.extend(options, {
		paths: paths,
		assets: assets,
		pages: pages,

		banner: '/*!\n' +
			' * The "' + pkg.name + '" project v' + pkg.version + '\n' +
			' * Build date: ' + grunt.template.today("yyyy-mm-dd") + '\n' +
			' * Author: Maxim Zemskov <nodge@yandex.ru>\n' +
			' * See README.md for details.\n' +
			' */\n'
	});

	return {
		options: options,
		pkg: pkg
	};
};