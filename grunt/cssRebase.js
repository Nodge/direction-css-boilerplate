module.exports = function(grunt, config) {
	var css_packages = config.options.assets.css;

	var result = {

	};

	function target(files, target) {
		return {
			src: files,
			options: {
				old_base: config.options.paths.src + '/app/main/css',
				new_base: '.tmp/app/main/css',
				root: config.options.paths.src + '/app',
				patterns:  { '.*': '../images' },
				copy: true
			}
		};
	}

	var releaseFiles = [],
		previewFiles = [];

	grunt.util._.each(css_packages, function(files, name) {
		releaseFiles = releaseFiles.concat(files);
		previewFiles = previewFiles.concat(files);
	});

	result['release'] = target(releaseFiles, 'release');
	result['preview'] = target(previewFiles, 'preview');

	return result;
};