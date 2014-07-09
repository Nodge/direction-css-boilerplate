module.exports = function(grunt, config) {
	var target = function(target) {
		return {
			options: {
				dest: config.options.paths[target]
			},
			files: [{
				src: [
					config.options.paths.src + '/index.html'
				]
			}]
		};
	};

	return {
		release: target('release'),
		preview: target('preview')
	};
};