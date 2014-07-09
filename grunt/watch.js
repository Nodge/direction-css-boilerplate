module.exports = function(grunt, config) {
	var src = config.options.paths.src;

	return {
		livereload: {
			options: {
				livereload: config.options.server.livereload_port
			},
			files: [
				src + '/templates/**/*.hbs',
				src + '/templates/data/**/*.json',
				'{.tmp,' + src + '}/app/**/*.css',
				'{.tmp,' + src + '}/app/**/*.js',
				src + '/app/**/*.{png,jpg,jpeg,gif,webp,svg}',
				'page-list.json',
				'assets-config.json',
				'build-options.json',
				src + '/README.md'
			],
			tasks: ['assemble']
		},
		less: {
			options: {
				livereload: config.options.server.livereload_port
			},
			files: [
				src + '/app/**/*.{css,less}'
			],
			tasks: ['less']
		}
	};
};