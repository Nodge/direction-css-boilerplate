module.exports = function(grunt, config) {
	var paths = config.options.paths;

	var liveReloadSnippet = require('connect-livereload')({ port: config.options.server.livereload_port });

	var mountFolder = function(connect, dir) {
		return connect.static(require('path').resolve(dir));
	};

	return {
		options: {
			port: config.options.server.port,
			hostname: config.options.server.addr
		},
		livereload: {
			options: {
				middleware: function(connect) {
					return [
						liveReloadSnippet,
						mountFolder(connect, '.tmp'),
						mountFolder(connect, paths.src)
					];
				}
			}
		},
		release: {
			options: {
				middleware: function(connect) {
					return [
						mountFolder(connect, paths.release)
					];
				}
			}
		},
		preview: {
			options: {
				middleware: function(connect) {
					return [
						mountFolder(connect, paths.preview)
					];
				}
			}
		}
	};
};