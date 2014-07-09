module.exports = function(grunt, config) {
	// todo:
	function target(target) {
		return {
			options: {
				removeComments: true,
				removeCommentsFromCDATA: true,
				collapseWhitespace: true,
				collapseBooleanAttributes: true,
				removeAttributeQuotes: false,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeOptionalTags: true
			},
			files: [
				{
					expand: true,
					cwd: config.options.paths[target],
					src: [ '*.html' ],
					dest: config.options.paths[target]
				}
			]
		};
	}

	return {
		release: target('release'),
		preview: target('preview')
	};
};