module.exports = function(grunt, config) {
	var js = config.options.assets.js,
		project_scripts = js.head.concat(js.bottom);

	return {
		options: {
			jshintrc: '.jshintrc'
		},
		system: [
			'Gruntfile.js',
			'config.js',
			'hbs-helpers.js',
			'grunt/*.js'
		],
		project: project_scripts
	};
};