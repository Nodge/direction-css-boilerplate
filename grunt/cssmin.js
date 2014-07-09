module.exports = function(grunt, config) {
	var css_packages = config.options.assets.css;

	function target(target) {
		var result = {
			files: []
		};

		grunt.util._.each(css_packages, function(files, name) {
			if (!name.match(/_external$/)) {
				result.files.push({
					dest: config.options.paths[target] + '/css/' + name.replace('_', '-') + '.min.css',
					src: '.tmp/app/main/css/' + name.replace('_', '-') + '.css'
				});
			}
		});

		return result;
	}

	return {
		release: target('release'),
		preview: target('preview')
	};
};