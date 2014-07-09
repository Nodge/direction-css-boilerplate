/*
 * Grunt Image Embed
 * https://github.com/ehynds/grunt-image-embed
 *
 * Copyright (c) 2013 Eric Hynds
 * Licensed under the MIT license.
 */

// Internal libs
var grunt_encode = require("./node_modules/grunt-image-embed/tasks/lib/encode");

module.exports = function(grunt) {
  "use strict";

  // Grunt lib init
  var encode = grunt_encode.init(grunt);

  // Grunt utils
  var async = grunt.util.async;

  grunt.registerMultiTask("imageEmbedSync", "Embed images as base64 data URIs inside your stylesheets", function() {
    var opts = this.options();

    // Process each src file
    this.files.forEach(function(file) {
      var dest = file.dest;

	  var callback = function(err, output) {
        grunt.file.write(dest, output);
        grunt.log.writeln('File "' + dest + '" created.');
      };
	  
	  file.src.forEach(function(srcFile) {
		encode.stylesheet(srcFile, opts, callback);
	  });
    });
  });

};
