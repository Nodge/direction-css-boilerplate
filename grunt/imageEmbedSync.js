module.exports = function(grunt, config) {
	var css_packages = config.options.assets.css;

	function target(target) {
		var result = [];

		grunt.util._.each(css_packages, function(files, name) {
			files.forEach(function(file) {
				result.push({
					src: file,
					dest: file
				});
			});
		});

		return {
			files: result
		};
	}

	return {
		options: {
			maxImageSize: 32768/2,
			deleteAfterEncoding: false
		},
		release: target('release'),
		preview: target('preview')
	};
};