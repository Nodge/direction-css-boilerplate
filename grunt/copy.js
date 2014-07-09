module.exports = function(grunt, config) {
	var css_packages = config.options.assets.css,
		js_packages = config.options.assets.js,
		path = require('path');

	var imageEmbed = {
		options: {
			process: function(content, srcpath) {
				return config.options.banner + "\n" + content;
			}
		},
		files: []
	};

	if (config.options.css_no_base64) {
		grunt.util._.each(css_packages, function(files, name) {
			files.forEach(function(file) {
				imageEmbed.files.push({
					expand: true,
					dot: true,
					cwd: path.dirname(file),
					dest: path.dirname(file),
					src: [ path.basename(file) ],
					rename: function(dest, src) {
						return dest + '/' + src.replace(/\.css$/, '') + '-no-base64.css';
					}
				});
			});
		});
	}


	function target(target) {
		var paths = config.options.paths,
			targetDir = paths[target];

		// Basic resources
		var files = [{
			expand: true,
			dot: true,
			cwd: paths.src,
			dest: targetDir,
			src: config.options.pages[target].map(function(page) {
				return page.id + '.html'
			})
		}, {
			expand: true,
			dot: true,
			cwd: paths.src,
			dest: targetDir,
			src: [
				target === 'preview' ? 'page-list-preview.html' : '*.html',
				'*.{ico,png,txt,md}',
				'.htaccess',
				paths.resources + '/**/*'
			]
		}];

		return {
			files: files
		};
	}

	function targetSourceFiles(target) {
		var paths = config.options.paths,
			targetDir = paths[target];

		var files = [
			{
				expand: true,
				dot: true,
				cwd: '.tmp/app/main/css/',
				dest: targetDir + '/css',
				src: [ '*.css' ]
			},
			{
				expand: true,
				dot: true,
				cwd: '.tmp/app/main/js/',
				dest: targetDir + '/js',
				src: [ '*.js' ]
			}
		];

		if (config.options.vendor_src) {
			grunt.util._.each(js_packages, function(items, name) {
				if (name.match(/_vendor$/)) {
					files.push({
						expand: true,
						dot: true,
						flatten: true,
						dest: targetDir + '/js/vendor-src',
						src: items
					});
				}
			});
		}

		if (config.options.script_src) {
			grunt.util._.each(js_packages, function(items, name) {
				if (!name.match(/_(vendor|external)$/)) {
					files.push({
						expand: true,
						dot: true,
//						flatten: true,
						dest: targetDir + '/js/script-src',
						src: items,
						rename: function(dest, src) {
							return dest + '/' + src.split('/').join('__');
						}
					});
				}
			});
		}

		return {
			files: files
		};
	}

	function targetCustomAssets(target) {
		var paths = config.options.paths,
			targetDir = paths[target],
			files = [];

		if (config.options.custom_assets) {
			files = [
				{
					expand: true,
					dot: true,
					cwd: paths.src + '/app/main/css',
					dest: targetDir + '/css',
					src: [ 'custom-style.css' ]
				}, {
					expand: true,
					dot: true,
					cwd: paths.src + '/app/main/js',
					dest: targetDir + '/js',
					src: [ 'custom-script.js' ]
				}
			];
		}

		return {
			files: files
		};
	}

	return {
		imageEmbed: imageEmbed,
		release: target('release'),
		preview: target('preview'),
		releaseSourceFiles: targetSourceFiles('release'),
		previewSourceFiles: targetSourceFiles('preview'),
		releaseCustomAssets: targetCustomAssets('release'),
		previewCustomAssets: targetCustomAssets('preview')
	};
};