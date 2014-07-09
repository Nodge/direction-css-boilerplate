module.exports = function(grunt, config) {
	function target(target) {
		return {
			files: [{
				expand: true,
				dot: true,
				cwd: '.tmp/app/main/images',
				dest: config.options.paths[target] + '/images',
				src: [
					'*'
				]
			}]
		};
	}

	function targetResources(target) {
		var paths = config.options.paths;
		return {
			files: [{
				expand: true,
				dot: true,
				cwd: paths.src + '/' + paths.resources,
				dest: paths[target] + '/' + paths.resources,
				src: [
					'**/*.{png,gif,jpeg,jpg}'
				]
			}]
		};
	}

	return {
		release: target('release'),
		preview: target('preview'),
		resourcesRelease: targetResources('release'),
		resourcesPreview: targetResources('preview')
	};
};