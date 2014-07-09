module.exports = function(grunt, config) {
	return {
		release: [
//			'jshint:project',
			'clean:release',
			'assemble',
			'less',
			'autoprefixer',
			'useminPrepare:release',
			'cssRebase:release',
			'imagemin:release',
			'copy:imageEmbed',
			'imageEmbedSync:release',
			'concat:generated',
			'concat:release',
			'cssmin:generated',
			'cssmin:release',
			'uglify:generated',
			'uglify:release',
			'copy:release',
			'copy:releaseSourceFiles',
			'copy:releaseCustomAssets',
			'imagemin:resourcesRelease',
//			'rev:release',
			'usemin:releaseHTML',
			'usemin:releaseCSS',
//			'htmlmin:release',
			'clean:finalRelease',
			'compress:releaseAssets',
			'compress:releaseBuild'
		],

		preview: [
//			'jshint:project',
			'clean:preview',
			'assemble',
			'less',
			'autoprefixer',
			'useminPrepare:preview',
			'cssRebase:preview',
			'imagemin:preview',
//			'copy:imageEmbed',
			'imageEmbedSync:preview',
			'concat:generated',
			'concat:preview',
			'cssmin:generated',
			'cssmin:preview',
			'uglify:generated',
			'uglify:preview',
			'copy:preview',
//			'copy:previewSourceFiles',
			'copy:previewCustomAssets',
			'imagemin:resourcesPreview',
			'rev:preview',
			'usemin:previewHTML',
			'usemin:previewCSS',
//			'htmlmin:preview',
			'clean:finalPreview',
			'compress:previewAssets',
			'compress:previewBuild'
		],

		default: [
			'release'
		],

		serve: function(target) {
			if (!target) {
				return grunt.task.run([
					'clean:server',
					'assemble',
					'less',
					'connect:livereload',
					'watch'
				]);
			}
			else {
				return grunt.task.run([
					'connect:' + target + ':keepalive'
				]);
			}
		}
	};
};