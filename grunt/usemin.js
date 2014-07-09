module.exports = function(grunt, config) {
	var result = {},
		paths = config.options.paths;

	function target(target) {
		var result = {};

		result[target + 'HTML'] = {
			options: {
				type: 'html',
				dirs: [ paths[target] ]
			},
			files: [
				{
					src: [ paths[target] + '/*.html' ]
				}
			]
		};

		result[target + 'CSS'] = {
			options: {
				type: 'css',
				dirs: [ paths[target] ]
			},
			files: [
				{
					src: [ paths[target] + '/css/*.css' ]
				}
			]
		};

		return result;
	}

	var extend = grunt.util._.extend;

	extend(result, target('release'));
	extend(result, target('preview'));

	return result;
};