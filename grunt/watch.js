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
				src + '/app/**/*.{png,jpg,jpeg,gif,webp,svg}',
				'page-list.json',
				'assets-config.json',
				'build-options.json',
				src + '/README.md'
			],
			tasks: [
				'assemble',
				'autoprefixer',
				'autopolyfiller'
			]
		},
		css: {
			options: {
				livereload: config.options.server.livereload_port
			},
			files: [
				'{.tmp,' + src + '}/app/**/*.css'
			],
			tasks: [
				'autoprefixer'
			]
		},
		js: {
			options: {
				livereload: config.options.server.livereload_port
			},
			files: [
				'{.tmp,' + src + '}/app/**/*.js'
			],
			tasks: [
				'autopolyfiller'
			]
		},
		less: {
			options: {
				livereload: config.options.server.livereload_port
			},
			files: [
				src + '/app/**/*.{css,less}'
			],
			tasks: [
				'less'
			]
		}
	};
};