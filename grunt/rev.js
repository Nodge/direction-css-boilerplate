module.exports = function(grunt, config) {
	function target(target) {
		return {
			files: {
				src: [
					'<%= options.paths.' + target + ' %>/js/{,*/}*.js',
					'<%= options.paths.' + target + ' %>/css/{,*/}*.css',
					'<%= options.paths.' + target + ' %>/images/*',
					'<%= options.paths.' + target + ' %>/<%= options.paths.resources %>/**/*'
				]
			}
		};
	}

	return {
		options: {
			length: 4
		},
		release: target('release'),
		preview: target('preview')
	};
};