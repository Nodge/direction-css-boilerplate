var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var through = require('through2');
var rework = require('rework');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var gulp = require('gulp');
var $p = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var gruntTasks = $p.grunt.tasks();
var config = require('./config')();
var pkg = config.pkg;
var options;
var originalOptions = config.options;


/**
 * Util functions
 * ----------------------
 */

/**
 *
 * @param source
 * @param target
 */
function copyFile(source, target) {
	return fs.writeFileSync(target, fs.readFileSync(source));
}

/**
 *
 * @param options
 * @returns {*}
 */
function assets(options) {
	options = _.extend({
		root: './',
		srcDir: './',
		targetDir: './',
		assetsDir: './',
		flatten: false
		// todo: assets filter
	}, options);

	function process(css) {
		return rework(css)
			.use(rework.url(function(url) {
				if (url.indexOf('data:') === 0) {
					return url;
				}

				var srcFile = path.join(options.srcDir, url);
				if (!fs.existsSync(srcFile)) {
					$p.util.log('[assets] Can not file asset file: ', srcFile);
					return url;
				}

				var targetFile = url.split('/').join(path.sep);

				if (options.flatten) {
					targetFile = path.relative(path.resolve(options.root), path.join(options.srcDir, targetFile));
					targetFile = targetFile.split(path.sep).join('__');
				}
				targetFile = path.join(options.assetsDir, targetFile);

				mkdirp.sync(path.dirname(targetFile));
				copyFile(srcFile, targetFile);

				url = path.relative(options.targetDir, targetFile);
				url = url.split(path.sep).join('/');

				return url;
			}))
			.toString();
	}

	return through.obj(function(file, enc, cb) {
		var css = process(file.contents.toString());
		file.contents = new Buffer(css);

		this.push(file);
		cb();
	});
}

/**
 *
 * @param next
 * @returns {*}
 */
function sync(next) {
	return through.obj(function (record, encoding, callback) {
		callback();
	}, function(callback) {
		callback();
		next();
	});
}

/**
 * @param fn
 * @returns {*}
 */
function getFile(fn) {
	return through.obj(function (record, encoding, callback) {
		fn(record.path);
		callback();
	}, function(callback) {
		callback();
	});
}

/**
 * Task functions
 * ----------------------
 */

/**
 *
 */
gulp.task('initOptions', function() {
	options = _.clone(originalOptions, true);
});

/**
 *
 */
gulp.task('clean', ['cleanTmp'], function(done) {
	$p.util.log('[clean] Cleaning up the build files...');

	var files = [];

	gulp.src([
		options.paths.dist + '/**/*',
		'!' + options.paths.dist + '/.git*'
	])
	.pipe(getFile(function(path) {
		files.push(path);
	}))
	.pipe(sync(function() {
		files.forEach(function(file) {
			rimraf.sync(file);
		});

		$p.util.log('[clean] Done.');
		done();
	}));
});

/**
 *
 */
gulp.task('cleanTmp', function(done) {
	$p.util.log('[cleanTmp] Cleaning up temporary files...');

	var files = [];

	gulp.src([
		'.tmp',
		options.paths.src + '/*.html'
	])
	.pipe(getFile(function(path) {
		files.push(path);
	}))
	.pipe(sync(function() {
		files.forEach(function(file) {
			rimraf.sync(file);
		});

		$p.util.log('[cleanTmp] Done.');
		done();
	}));
});

gulp.task('lint', function() {
	var js = options.assets.js,
		project_scripts = js.head.concat(js.bottom);

	return gulp.src(project_scripts)
		.pipe($p.jshint())
		.pipe($p.jshint.reporter('default'));
});

/**
 *
 */
gulp.task('assemble', function(done) {
	$p.util.log('[assemble] Assembling pages...');

	gruntTasks['grunt-assemble'](function() {
		$p.util.log('[assemble] Done.');
		done();
	});
});

/**
 *
 */
gulp.task('less', function(done) {
	$p.util.log('[less] Compile LESS files...');

	var packages = _.map(options.assets.less, function(files, packageName) {
		return packageName;
	});

	async.eachSeries(packages, function(packageName, next) {
		$p.util.log('[less] Package: ' + packageName + '...');

		if (!options.assets.css.hasOwnProperty(packageName)) {
			options.assets.css[packageName] = [];
		}

		var files = options.assets.less[packageName];
		if (!files.length) {
			next();
			return;
		}

		async.eachSeries(files, function(file, next) {
			var dest = '.tmp' + file.substring(options.paths.src.length);
			dest = path.dirname(dest);

			gulp.src(file)
				.pipe($p.less({
					strictMath: true,
					relativeUrls: true,
					paths: [ path.join(__dirname, options.paths.src, 'app/main/css') ]
				}))
				.pipe(gulp.dest(dest))
				.pipe(sync(function() {
					options.assets.css[packageName].push(path.join(dest, $p.util.replaceExtension(path.basename(file), '.css')));
					next();
				}));
		}, function() {
			$p.util.log('[less] Package done: ' + packageName + '...');
			next();
		});
	}, function(err) {
		if (!err) {
			$p.util.log('[less] Done.');
		}
		done(err);
	});
});

/**
 *
 */
gulp.task('assets', function(done) {
	var packages = _.map(options.assets.css, function(files, packageName) {
		return packageName;
	});

	async.eachSeries(packages, function(packageName, next) {
		$p.util.log('[assets] Package: ' + packageName + '...');

		var packageFiles = options.assets.css[packageName];
		async.eachSeries(packageFiles, function(file, next) {
			gulp.src(file, { cwdbase: true })
				.pipe(assets({
					root: path.join(options.paths.src, 'app'),
					srcDir: path.join(options.paths.src, 'app/main/css'),
					targetDir: path.join(options.paths.dist, 'css'),
					assetsDir: path.join(options.paths.dist, 'images'),
					flatten: true
				}))
				.pipe(gulp.dest('.tmp'))
				.pipe(sync(function() {
					// replace asset file
					var index = packageFiles.indexOf(file);
					options.assets.css[packageName][index] = path.join('.tmp', file);

					next();
				}));
		}, function() {
			$p.util.log('[assets] Package done: ' + packageName + '...');
			next();
		});
	}, function(err) {
		if (!err) {
			$p.util.log('[assets] Done.');
		}
		done(err);
	});
});

/**
 *
 */
gulp.task('resources', function() {
	return gulp.src([
		path.join(options.paths.src, options.paths.resources, '**', '*')
	], {
		base: options.paths.src,
		dot: true
	})
		.pipe(gulp.dest(options.paths.dist));
});

/**
 *
 */
gulp.task('images', function() {
	return gulp.src([
		path.join(options.paths.dist, 'images', '**', '*'),
		path.join(options.paths.dist, options.paths.resources, '**', '*')
	], { base: options.paths.dist })
	.pipe($p.imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}]
	}))
	.pipe(gulp.dest(options.paths.dist));
});

/**
 *
 */
gulp.task('css', function(done) {
	var destDir = path.join(options.paths.dist, 'css');

	var packages = _.map(options.assets.css, function(files, packageName) {
		return packageName;
	});

	async.eachSeries(packages, function(packageName, next) {
		$p.util.log('[css] Package: ' + packageName + '...');

		var files = options.assets.css[packageName];
		if (!files.length) {
			next();
			return;
		}

		gulp.src(files)
			.pipe($p.concatUtil(packageName + '.css', {
				process: function(src) {
					var filepath = path.relative(path.resolve('./'), this.path);
					filepath = filepath.split(path.sep).join('/');
					return '\n\n/* BEGIN ' + filepath + ' */\n\n' + src + '\n\n/* END ' + filepath + ' */\n\n';
				}
			}))
			.pipe($p.concatUtil.header(options.banner))
			.pipe($p.autoprefixer({
				browsers: options.browsers
			}))
			.pipe($p.base64({
				baseDir: destDir,
//				exclude: [],
				maxImageSize: 16*1024, // 16KB
				debug: false
			}))
			.pipe(gulp.dest(destDir))
			.pipe($p.rename({ suffix: '.min' }))
			.pipe($p.sourcemaps.init())
			.pipe($p.cssmin())
			.pipe($p.sourcemaps.write('./'))
			.pipe(gulp.dest(destDir))
			.pipe(sync(function() {
				options.assets.css[packageName] = [ path.join(destDir, packageName + '.min.css') ];
				$p.util.log('[css] Package done: ' + packageName + '...');
				next();
			}));
	}, function(err) {
		if (!err) {
			$p.util.log('[css] Done.');
		}
		done(err);
	});
});

/**
 *
 */
gulp.task('js', ['autopolyfiller'], function(done) {
	var destDir = path.join(options.paths.dist, 'js');

	var packages = _.map(options.assets.js, function(files, packageName) {
		return packageName;
	});

	async.eachSeries(packages, function(packageName, next) {
		if (packageName.match(/_external$/)) {
			next();
			return;
		}

		var files = options.assets.js[packageName];
		if (!files.length) {
			next();
			return;
		}

		$p.util.log('[js] Package: ' + packageName + '...');

		gulp.src(files)
			.pipe($p.concatUtil(packageName + '.js', {
				process: function(src) {
					var filepath = path.relative(path.resolve(options.paths.src), this.path);
					filepath = filepath.split(path.sep).join('/');
					return '\n\n/* BEGIN ' + filepath + ' */\n\n' + src + '\n\n/* END ' + filepath + ' */\n\n';
				}
			}))
			.pipe($p.concatUtil.header(options.banner))
			.pipe(gulp.dest(destDir))
			.pipe($p.rename({ suffix: '.min' }))
			.pipe($p.sourcemaps.init())
			.pipe($p.uglify({
				preserveComments: 'some'
			}))
			.pipe($p.sourcemaps.write('./'))
			.pipe(gulp.dest(destDir))
			.pipe(sync(function() {
				options.assets.js[packageName] = [ path.join(destDir, packageName + '.min.js') ];
				$p.util.log('[js] Package done: ' + packageName + '...');
				next();
			}));
	}, function(err) {
		if (!err) {
			$p.util.log('[js] Done.');
		}
		done(err);
	});
});

/**
 *
 */
gulp.task('vendor-src', function(done) {
	var destDir = path.join(options.paths.dist, 'js', 'vendor-src');

	var packages = _.map(options.assets.js, function(files, packageName) {
		return packageName;
	}).filter(function(name) {
		return name.match(/_vendor$/) || name === 'html5shiv';
	});

	async.eachSeries(packages, function(packageName, next) {
		var files = options.assets.js[packageName];
		if (!files.length) {
			next();
			return;
		}

		$p.util.log('[vendor-src] Package: ' + packageName + '...');

		gulp.src(files)
			.pipe($p.rename(function (path) {
				path.dirname = '';
			}))
			.pipe(gulp.dest(destDir))
			.pipe(sync(function() {
				$p.util.log('[vendor-src] Package done: ' + packageName + '...');
				next();
			}));
	}, function(err) {
		if (!err) {
			$p.util.log('[vendor-src] Done.');
		}
		done(err);
	});
});

/**
 *
 */
gulp.task('script-src', function(done) {
	var destDir = path.join(options.paths.dist, 'js', 'script-src');

	var packages = _.map(options.assets.js, function(files, packageName) {
		return packageName;
	}).filter(function(name) {
		return !name.match(/_(vendor|external)$/);
	});

	async.eachSeries(packages, function(packageName, next) {
		var files = options.assets.js[packageName];
		if (!files.length) {
			next();
			return;
		}

		$p.util.log('[script-src] Package: ' + packageName + '...');

		gulp.src(files, { base: options.paths.src })
			.pipe($p.rename(function (filePath) {
				var dir = filePath.dirname.split(path.sep).join('__');
				if (dir) {
					filePath.basename =  dir + '__' + filePath.basename;
				}
				filePath.dirname = '';
			}))
			.pipe(gulp.dest(destDir))
			.pipe(sync(function() {
				$p.util.log('[script-src] Package done: ' + packageName + '...');
				next();
			}));
	}, function(err) {
		if (!err) {
			$p.util.log('[vendor-src] Done.');
		}
		done(err);
	});
});

/**
 *
 */
gulp.task('html', function() {
	return gulp.src(path.join(options.paths.src, '*.html'))
		.pipe($p.replace(/(<!--\[if lt IE 9\]>)([^!]*)(<!\[endif\]-->)/g, '$1-->$2<!--$3'))
		.pipe($p.cheerio(function($) {
			['js', 'css'].forEach(function(type) {
				_.each(options.assets[type], function(files, packageName) {
					var $links = $('[data-build="' + packageName + '"]');
					files.forEach(function(file, i) {
						var url = file;

						if (!file.match(/^(https?:)?\/\//i)) {
							url = path.relative(path.resolve(options.paths.dist), file);
							url = url.split(path.sep).join('/');
						}

						var tag;

						if (type === 'css') {
							tag = '<link type="text/css" rel="stylesheet" href="' + url + '" media="all" />';
						}
						else {
							tag = '<script src="' + url + '"></script>';
						}

						tag += "\n    ";

						$links.first().before(tag);
					});
					$links.replaceWith('<!-- remove -->');
				});
			});
		}))
		.pipe($p.replace(/[ ]*<!-- remove -->[ ]*\r?\n/g, ''))
		.pipe($p.replace(/(<!--\[if lt IE 9\]>)-->/g, '$1'))
		.pipe($p.replace(/<!--(<!\[endif\]-->)/g, '$1'))
		/*.pipe($p.htmlmin({
			removeComments: true,
			removeCommentsFromCDATA: true,
			collapseWhitespace: true,
			collapseBooleanAttributes: true,
			removeAttributeQuotes: false,
			removeRedundantAttributes: true,
			useShortDoctype: true,
			removeEmptyAttributes: true,
			removeOptionalTags: true
		}))*/
		.pipe(gulp.dest(options.paths.dist));
});

gulp.task('custom-scripts', function(done) {
	var steps = [
		function(next) {
			gulp.src(path.join(options.paths.src, 'app', 'custom-script.js'))
				.pipe(gulp.dest(path.join(options.paths.dist, 'js')))
				.pipe(sync(function() {
					next();
				}));
		},
		function(next) {
			gulp.src(path.join(options.paths.src, 'app', 'custom-style.css'))
				.pipe(gulp.dest(path.join(options.paths.dist, 'css')))
				.pipe(sync(function() {
					next();
				}));
		},
		function(next) {
			gulp.src(path.join(options.paths.dist, '*.html'))
				.pipe($p.cheerio(function($) {
					var customScript = '<script src="js/custom-script.js"></script>';
					$('[data-build="custom-script"]').replaceWith(customScript);

					var customStyle = '<link type="text/css" rel="stylesheet" href="css/custom-style.css" media="all" />';
					$('[data-build="custom-style"]').replaceWith(customStyle);
				}))
				.pipe(gulp.dest(options.paths.dist))
				.pipe(sync(function() {
					next();
				}));
		}
	];

	async.eachSeries(steps, function(fn, next) {
		fn(next);
	}, function(err) {
		done(err);
	});
});

/**
 *
 */
gulp.task('rev', function() {
	return gulp.src(path.join(options.paths.dist, '**', '*'))
		.pipe($p.revAll({
			ignore: [
				/^\/favicon.ico$/g,
				'.html',
				'.map'
			],
			transformFilename: function (file, hash) {
				var ext = path.extname(file.path);
				return hash.substr(0,4) + '.'  + path.basename(file.path, ext) + ext;
			}
		}))
		.pipe(gulp.dest(options.paths.dist));
});

/**
 *
 */
gulp.task('gzip', function() {
	gulp.src([
		path.join(options.paths.dist, '**', '*.min.js'),
		path.join(options.paths.dist, '**', '*.min.css')
	])
		.pipe($p.gzip())
		.pipe(gulp.dest(options.paths.dist));
});

/**
 *
 */
gulp.task('package', function() {
	return gulp.src(path.join(options.paths.dist, '**', '*'))
		.pipe($p.zip(pkg.name + '-' + pkg.version + '.zip'))
		.pipe(gulp.dest(options.paths.dist));
});

/**
 *
 */
gulp.task('autopolyfiller', function() {
	var packages = _.map(options.assets.js, function(files, packageName) {
		return {
			name: packageName,
			files: files
		};
	}).filter(function(p) {
		return !p.name.match(/_external$/);
	});

	if (!options.polyfills.vendor) {
		packages = packages.filter(function(p) {
			return !p.name.match(/_vendor$/);
		});
	}

	var targetFile = '.tmp/polyfills.js';

	// create empty polyfills file
	fs.writeFileSync(targetFile, '', { encoding: 'utf8' });

	var files = [ targetFile ];

	packages.forEach(function(p) {
		files = files.concat(p.files);
	});

	return gulp.src(files)
		.pipe($p.autopolyfiller(path.basename(targetFile), {
			browsers: options.browsers,
			include: options.polyfills.include,
			exclude: options.polyfills.exclude
		}))
		.pipe(gulp.dest(path.dirname(targetFile)))
		.pipe(sync(function() {
			// todo: lookup for polyfills file in assets config
			if (options.vendor_external) {
				options.assets.js.head_vendor.unshift(targetFile);
			}
			else {
				options.assets.js.head.unshift(targetFile);
			}
		}));
});

/**
 *
 */
gulp.task('serveProcessCss', ['less'], function(done) {
	var packages = _.map(options.assets.css, function(files, packageName) {
		return packageName;
	});

	async.eachSeries(packages, function(packageName, next) {
		$p.util.log('[serveProcessCss] Package: ' + packageName + '...');

		var files = options.assets.css[packageName];
		if (!files.length) {
			next();
			return;
		}

		gulp.src(files, { base: './' })
			.pipe($p.autoprefixer({
				browsers: options.browsers
			}))
			.pipe($p.rename(function(filePath) {
				filePath.dirname = filePath.dirname.split(path.sep).slice(1).join(path.sep);
			}))
			.pipe(gulp.dest('.tmp'))
			.pipe(sync(function() {
				$p.util.log('[serveProcessCss] Package done: ' + packageName + '...');
				next();
			}));
	}, function(err) {
		if (!err) {
			$p.util.log('[serveProcessCss] Done.');
		}
		done(err);
	});
});

/**
 *
 */
gulp.task('serveProcessJs', ['autopolyfiller'], function(done) {
	var packages = _.map(options.assets.js, function(files, packageName) {
		return packageName;
	}).filter(function(name) {
		return !name.match(/_(vendor|external)$/);
	});

	async.eachSeries(packages, function(packageName, next) {
		$p.util.log('[serveProcessJs] Package: ' + packageName + '...');

		var files = options.assets.js[packageName];
		if (!files.length) {
			next();
			return;
		}

		gulp.src(files, { base: './' })
			// todo: do something with javascript (e.x. browserify)
			.pipe($p.rename(function(filePath) {
				filePath.dirname = filePath.dirname.split(path.sep).slice(1).join(path.sep);
			}))
			.pipe(gulp.dest('.tmp'))
			.pipe(sync(function() {
				$p.util.log('[serveProcessJs] Package done: ' + packageName + '...');
				next();
			}));
	}, function(err) {
		if (!err) {
			$p.util.log('[serveProcessJs] Done.');
		}
		done(err);
	});
});

/**
 * Tasks
 * ----------------------
 */

/**
 *
 */
gulp.task('build', ['initOptions'], function(done) {
	runSequence(
		'lint',
		'clean',
		'assemble',
		'less',
		'assets',
		'resources',
		'images',
		['css', 'js'/*, 'vendor-src', 'script-src'*/],
		'html',
		'custom-scripts',
//		'rev',
		'gzip',
		'package',
		'cleanTmp',
		done
	);
});

/**
 *
 */
gulp.task('serve', [
	'initOptions',
/*
	'autoprefixer',
	'autopolyfiller',
*/
], function() {
	runSequence(
		'cleanTmp',
		'assemble',
		'serveProcessCss',
		'serveProcessJs',

		function() {
			gulp.watch(path.join(options.paths.src, '**', '*.{css,less}'), ['serveProcessCss']);
			gulp.watch(path.join(options.paths.src, '**', '*.js'), ['serveProcessJs']);
			gulp.watch(path.join(options.paths.src, '**', '*.hbs'), ['assemble']);
			gulp.watch('./assets-config.json', ['serveProcessCss', 'serveProcessJs', 'assemble']);
			gulp.watch('./build-options.json', ['serveProcessCss', 'serveProcessJs', 'assemble']);
			gulp.watch('./page-list.json', ['assemble']);

			gulp.src([
				'.tmp',
				options.paths.src
			])
			.pipe($p.webserver(options.server));
		}
	);
});

/**
 *
 */
gulp.task('serve-dist', function() {
	gulp.src([options.paths.dist])
		.pipe($p.webserver(options.server));
});

/**
 *
 */
gulp.task('watch', function() {
	runSequence(
		'build',

		function() {
			gulp.watch([
				path.join(options.paths.src, '**', '*.{css,less}'),
				path.join(options.paths.src, '**', '*.js'),
				path.join(options.paths.src, '**', '*.hbs'),
				'./assets-config.json',
				'./build-options.json',
				'./page-list.json',
			], ['build']);
		}
	);
});

/**
 *
 */
gulp.task('default', [
	'serve'
]);