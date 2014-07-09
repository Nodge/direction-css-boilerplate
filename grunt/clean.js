module.exports = function(grunt, config) {
	function target(target) {
		return {
			files: [
				{
					dot: true,
					src: [
						'.tmp',
						config.options.paths.src + '/*.html',
						config.options.paths[target] + '/*',
						'!' + config.options.paths[target] + '/.git*'
					]
				}
			]
		};
	}

	function targetFinal(target) {
		return {
			files: [
				{
					dot: true,
					src: [
						'.tmp',
						config.options.paths[target] + '/js/custom-script.map'
					]
				}
			]
		};
	}

	return {
		server: {
			files: [
				{
					dot: true,
					src: [
						'.tmp',
						'<%= options.paths.src %>/*.html'
					]
				}
			]
		},

		release: target('release'),
		preview: target('preview'),
		finalRelease: targetFinal('release'),
		finalPreview: targetFinal('preview')
	};
};