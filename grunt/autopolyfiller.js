module.exports = function(grunt, config) {
	var js = config.options.assets.js,
		project_scripts = js.head.concat(js.bottom);

	if (config.options.polyfills.vendor) {
		project_scripts = project_scripts.concat(js.head_vendor, js.bottom_vendor);
	}

	return {
		options: {
			browsers: config.options.browsers,
			include: config.options.polyfills.include,
			exclude: config.options.polyfills.exclude
		},
		all: {
//			expand: true,
//			flatten: true,
			src: project_scripts,
			dest: '.tmp/polyfills.js'
		}
	};
};