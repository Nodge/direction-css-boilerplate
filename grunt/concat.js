module.exports = function(grunt, config) {
	var css_packages = config.options.assets.css,
		js_packages = config.options.assets.js;

	var release = {
		files: []
	};

	// css
	grunt.util._.each(css_packages, function(files, name) {
		if (!name.match(/_external$/)) {
			release.files.push({
				dest: '.tmp/app/main/css/' + name.replace('_', '-') + '.css',
				src: files
			});
		}
	});

	// js
	grunt.util._.each(js_packages, function(files, name) {
		if (!name.match(/_external$/)) {
			release.files.push({
				dest: '.tmp/app/main/js/' + name.replace('_', '-') + '.js',
				src: files
			});
		}
	});

	return {
		options: {
			banner: config.options.banner,
//			stripBanners: true,
//			separator: ';',
			process: function(src, filepath) {
				return '\n\n/* BEGIN ' + filepath + ' */\n\n' + src + '\n\n/* END ' + filepath + ' */\n\n';
			},
			rename: function (dest, src) {
				return dest;
			}
		},
		release: release,
		preview: {
			// nothing to do
		}
	};
};