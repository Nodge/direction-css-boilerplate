module.exports = function(grunt, config) {
	return {
		options: {
			flatten: true,
			pkg: '<%= pkg %>',
			layout: 'default.hbs',
			layoutdir: '<%= options.paths.src %>/templates/layouts',
			partials: '<%= options.paths.src %>/templates/partials/**/*.hbs',
			data: [
				'<%= options.paths.src %>/templates/data/*.json',
				'./page-list.json',
				'./assets-config.json',
				'./build-options.json'
			],
			helpers: [
				'prettify',
				'./hbs-helpers.js'
			],
			prettify: {
				condense: true,
				padcomments: false,
				indent: 4,
				indent_char: " ",
				indent_inner_html: true,
				wrap_line_length: 0
			},
			readmeFile: '<%= options.paths.src %>/README.md'
		},
		pages: {
			files: {
				'<%= options.paths.src %>/': [
					'<%= options.paths.src %>/templates/pages/*.hbs'
				]
			}
		}
	};
};