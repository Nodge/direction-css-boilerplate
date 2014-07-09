module.exports = function(grunt, config) {
	var less_packages = config.options.assets.less;

	var result = {
		options: {
			strictMath: true,
			relativeUrls: true
		}
	};

	grunt.util._.each(less_packages, function(items, name) {
		var files = {};

		items.forEach(function(file) {
			var key = '.tmp' + file.substring(config.options.paths.src.length);
			key = key.replace(/\.less$/, '.css');
			files[key] = file;
		});

		result[name] = {
			files: files
		};
	});

	return result;
};