module.exports = function(grunt, config) {
	return {
		options: {
			browsers: config.options.browsers
//			diff: true
		},
		all: {
			expand: true,
			flatten: true,
			src: '.tmp/app/main/css/*.css',
			dest: '.tmp/app/main/css'
		}
	};
};