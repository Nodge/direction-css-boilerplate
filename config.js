'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function() {
	var pkg = require('./package.json');

	var paths = {
		src: 'src',
		resources: 'res',
		dist: 'dist'
	};

	// load pages config
	var pages = require('./page-list.json'),
		options = require('./build-options.json');

	// load scripts config
	var assets = require('./assets-config.json');
	_.each(assets, function(packages, type) {
		_.each(packages, function(files, packageName) {
			assets[type][packageName] = files.map(function(file) {
				if (file.match(/^(\w+:)?\/\//i)) {
					return file;
				}
				else {
					file = file.split('/').join(path.sep);
					if (fs.existsSync(paths.src + '/' + file)) {
						return paths.src + '/' + file;
					}
					return file;
				}
			});
		});
	});

	// transform script assets
	if (!options.vendor_external) {
		_.each(assets.js, function(files, packageName) {
			if (packageName.match(/_vendor$/)) {
				var name = packageName.replace(/_vendor$/, '');
				if (assets.js[name]) {
					assets.js[name] = files.concat(assets.js[name]);
				}
				else {
					assets.js[name] = files;
				}
				assets.js[packageName] = [];
			}
		});
	}

	if (!options.html5shiv) {
		assets.js.html5shiv = [];
	}

	_.extend(options, {
		paths: paths,
		assets: assets,
		pages: pages,

		banner: '/*!\n' +
			' * The "' + pkg.name + '" project v' + pkg.version + '\n' +
			' * Build date: ' + (new Date()).toLocaleDateString() + '\n' +
			' * Author: Maxim Zemskov <nodge@yandex.ru>\n' +
			' * See README.md for details.\n' +
			' */\n'
	});

	return {
		options: options,
		pkg: pkg
	};
};