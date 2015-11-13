module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),       // Read in package variable from package.json

    // Construct a banner containing package and build information
    banner: '/* <%= pkg.name %> | <%= pkg.url %> | <%= pkg.license %>\n' +
            ' * <%= pkg.author %> | <%= pkg.contact %>\n' +
            ' */\n',

    title: 'Lego Ipsum',

    filename: '<%= pkg.name %>',

    s: 'src/',  // The source directory
    d: 'dist/', // The distributable directory, where built files will end up
    t: 'test/', // The test directory, for unit test files/specs

    /**
     * Concatenation setup. Concatenated files are built to a temp concat folder, ready to be picked up by the uglify task
     * Includes closure banner and footer. Keep these in if you want to wrap concatenated code in closures
     */
    concat: {
      options: {
        banner: '<%= banner %>' +
                'var Lorem;' +
                '\n;(function() {\n\n"use strict";\n\n',
        footer: '\n})();\n'
      },
      dist: {
        src: ['<%= s %>js/*.js'],                    // Define specific files in dependency order if required 
        dest: '<%= s %>js/concat/<%= filename %>.js' // Build to a temp concat folder (will be picked up by uglify task)
      }
    },

    /**
     * Uglification (minification) setup. Uglified files are built to the js directory and get a .min suffix
     */
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: {
          '<%= d %>js/<%= filename %>.min.js': ['<%= concat.dist.dest %>'] // Each concatenated file will get an uglified version
        }
      }
    },

    /**
     * JSHint static analysis setup
     */
    jshint: {
      files: ['gruntfile.js', '<%= s %>**/*.js', '<%= t %>**/*.js'], // Analyse this file and all source and test files for errors
      options: {
        browser: true, // Assume general browser globals
        globals: {
          predef: []   // Any global variables go here, if required 
        }
      }
    },

    /**
     * Jasmine unit test setup. Includes Istanbul code coverage setup with Coveralls-friendly output
     */
    jasmine: {
      test: {
        src: ['<%= s %>js/**/*.js'], // Define specific files in dependency order if required 
        options: {
          specs: '<%= t %>**/*.js',
        }
      },
      dist: {
        src: ['<%= s %>js/**/*.js'], // Define specific files in dependency order if required 
        options: {
          specs: '<%= t %>**/*.js',
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'coverage/coverage.json',
            report: [
              { type: 'lcov', options: { dir: 'coverage' }},      // Create .lcov report, required by Coveralls
              { type: 'html', options: { dir: 'coverage/html' }}, // Create an html report, readable by humans
              { type: 'text-summary' }                            // Output results to console post-build
            ],
            thresholds: {
              // Test result thresholds all set to 0 to begin with. Commented values are suggestions
              lines: 0, // 75
              statements: 0, // 75
              branches: 0, // 75
              functions: 0 // 75
            }
          }
        }
      }   
    },

    /**
     * Coveralls setup. Tells Coveralls where to find code coverage information
     */
    coveralls: {
      options: {
        force: true
      },
      src: 'coverage/lcov.info'
    },

    /**
     * Less setup
     */
    less: {
      dev: {
        options: {
          paths: ['<%= s %>less/**/*.less']                       // Process all Less files in Less folder
        },
        files: {
          "<%= s %>css/<%= filename %>.css": "<%= s %>less/_styles.less",  // Build app.css based on _styles.less
        }
      },
      dist: {
        options: {
          paths: '<%= less.dev.options.paths %>',
          compress: true
        },
        files: {
          "<%= d %>css/<%= filename %>.min.css": "<%= s %>less/_styles.less" // Build app.min.css version for build
        }
      }
    },

    /**
     * Copy setup
     */
    copy: {
      dist: {
        files: [
          // Favicon files
          {
            expand: true,
            cwd: '<%= s %>favicon/realFavicon',
            src: '*',
            dest: '<%= d %>favicon',
            filter: 'isFile'
          },
          // Image files
          {
            expand: true,
            cwd: '<%= s %>img',
            src: '*',
            dest: '<%= d %>img',
            filter: 'isFile'
          }
        ]
      }
    },

    /**
     * Process HTML step. Replaces sections of index.html to create a production copy
     */
    processhtml: {
      dist: {
        options: {
          data: {
            title: '<%= title %>',
            filename: '<%= filename %>'
          }
        },
        files: {
          'index.html': ['<%= s %>index.html'] // Create index.html in root to enable easy publication to GitHub Pages
        }
      }
    },

    /**
     * Favicon setup. The src image will be used to create favicons, manifest etc in the dist html
     */
    realFavicon: {
      dist: {
        src: '<%= s %>favicon/example.png',
        dest: '<%= d %>favicon',
        options: {
          iconsPath: './<%= d %>favicon',
          html: [ 'index.html' ],
          design: {
            ios: {
              pictureAspect: 'backgroundAndMargin',
              backgroundColor: '#ffffff',
              margin: '14%'
            },
            desktopBrowser: {},
            windows: {
              pictureAspect: 'whiteSilhouette',
              backgroundColor: '#da532c',
              onConflict: 'override'
            },
            androidChrome: {
              pictureAspect: 'backgroundAndMargin',
              margin: '17%',
              backgroundColor: '#ffffff',
              themeColor: '#ffffff',
              manifest: {
                name: 'projectName',
                display: 'browser',
                orientation: 'notSet',
                onConflict: 'override'
              }
            },
            safariPinnedTab: {
              pictureAspect: 'blackAndWhite',
              threshold: 75,
              themeColor: '#5bbad5'
            }
          },
          settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
          }
        }
      }
    },

    /**
     * Watch setup. The configured tasks will run when and of the files tested by JSHint are changed
     */
    watch: {
      js: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint', 'jasmine:test']
      },
      less: {
        files: ['<%= less.dev.options.paths %>'],
        tasks: ['less:dev']
      }
    }

  });

  // Load tasks in this order
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-processhtml'); 
  grunt.loadNpmTasks('grunt-real-favicon');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register test and build tasks. These can be run from the command line with "grunt test" or "grunt build"
  grunt.registerTask('test', ['jshint', 'jasmine:test']);
  grunt.registerTask('build', ['jshint', 'jasmine:dist', 'less:dist', 'concat:dist', 'uglify:dist', 'copy:dist', 'processhtml:dist', 'realFavicon:dist']);

  // Register travis task. This is used by Travis CI to run the test tasks followed by a call to Coveralls
  grunt.registerTask('travis', ['jshint', 'jasmine:dist', 'coveralls']);

  // "grunt watch" should be run while developing to notify you when things go wrong

};