module.exports = function(grunt, config) {
	function targetAssets(target) {
		var path = config.options.paths[target];
		return {
			options: {
				mode: 'gzip',
				level: 5,
				pretty: true
			},
			expand: true,
			cwd: path,
			src: [
				'js/*.js',
				'css/*.css'
			],
			dest: path
		};
	}

	function targetBuild(target) {
		var path = config.options.paths[target];
		return {
			options: {
				archive: path + '/<%= pkg.name %>-<%= pkg.version %>.zip',
				mode: 'zip',
				pretty: true
			},
			files: [
				{ src: '**/*', expand: true, cwd : path }
			]
		};
	}

	return {
		releaseAssets: targetAssets('release'),
		previewAssets: targetAssets('preview'),
		releaseBuild: targetBuild('release'),
		previewBuild: targetBuild('preview')
	};
};