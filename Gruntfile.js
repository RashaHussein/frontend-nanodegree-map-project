'use strict';

var ngrok = require('ngrok');
var compression = require('compression');

module.exports = function(grunt) {
	// Load grunt tasks
	require('load-grunt-tasks')(grunt);

	// Grunt configuration
	grunt.initConfig({
		pagespeed: {
			options: {
				nokey: true,
				locale: 'en_GB',
				threshold: 90
			},
			local: {
				options: {
					strategy: 'desktop'
				}
			},
			mobile: {
				options: {
					strategy: 'mobile'
				}
			}
		},
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            'dist/*',
            '!dist/.git*'
          ]
        }]
      },
    },
    imagemin: {
		  dist: {
	      options: {
	        optimizationLevel: 7
	      },
	      files: [{
	        expand: true,                  // Enable dynamic expansion
	        cwd: 'img/',                   // Src matches are relative to this path
	        src: ['*.{png,jpg,gif}'],   // Actual patterns to match
	        dest: 'dist/img'                  // Destination path prefix
	      }]
		  }
		},
		cssmin: {
			dist: {
			  files: [{
			    expand: true,
		      src: ['styles/*.css'],
		      dest: 'dist',
		      ext: '.css'
			  }]
			}
		},
		uglify: {
			dist: {
			  files: [{
			    expand: true,
		      src: ['js/*.js', 'bower_components/knockout/dist/knockout.js'],
		      dest: 'dist',
		      ext: '.js'
			  }]
			}
		},
		assets_inline: {
	    all: {
	      options: {
	        minify: true
	      },
	      files: {
	        'dist/index.html': 'index.html'
	      },
	    },
	  },
    htmlmin: {
      dist: {
        files: [{
          expand: true,
          src: ['*.html'],
          dest: 'dist'
        }]
      }
    },
    connect: {
    	dev: {
	      options: {
	        port: 8000,
	        hostname: '0.0.0.0',
      		keepalive: true
	      }
    	},
      prod: {
        options: {
	        port: 8000,
	        hostname: '0.0.0.0',
          open: true,
          base: 'dist',
      		keepalive: true,
	        middleware: function (connect, options, middlewares) {
	          middlewares.unshift(compression());
	          return middlewares;
	        }
        }
      }
    }
	});

	 // Register customer task for ngrok
  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 8000;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      done();
    });
  });

	// Register default tasks
	grunt.registerTask('default', 'connect:prod');
  grunt.registerTask('perf', ['psi-ngrok']);
  grunt.registerTask('build', [
  	'clean:dist',
  	'htmlmin',
  	'cssmin',
  	'uglify',
  	// 'assets_inline',
  	'imagemin'
  ]);
};