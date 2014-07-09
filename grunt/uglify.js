module.exports = function(grunt, config) {
	var js_packages = config.options.assets.js;

	function target(target) {
		var result = {
			files: []
		};

		grunt.util._.each(js_packages, function(files, name) {
			if (!name.match(/_external$/)) {
				result.files.push({
					dest: config.options.paths[target] + '/js/' + name.replace('_', '-') + '.min.js',
					src: '.tmp/app/main/js/' + name.replace('_', '-') + '.js'
				});
			}
		});

		return result;
	}

	return {
		options: {
//			banner: '<%= banner%>',
			sourceMap: true,
			preserveComments: 'some'
		},
		release: target('release'),
		preview: target('preview')
	};
};