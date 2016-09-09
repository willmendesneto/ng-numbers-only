'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

// OBS:
//  Replace the string with informations
//  '<%= yeoman.moduleName %>' = Module name
//  '<%= yeoman.moduleDescription %>' = Module description
//  '<%= yeoman.moduleUrl %>' = Module url

module.exports = function (grunt) {

  // Load informations of "bower.json" file
  var packageInfo = require('./package.json');

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: packageInfo.appPath || 'app',
      dist: 'dist',
      moduleName: packageInfo.name,
      moduleDescription: packageInfo.description,
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: [
          'Gruntfile.js'
        ],
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: '**/*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>/scripts/',
          dest: '<%= yeoman.dist %>/scripts/',
          src: '**'
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [],
      test: [],
      dist: []
    },

    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          //  package name
          '<%= yeoman.dist %>/<%= yeoman.moduleName %>.min.js': [
            //  List of all files in scripts folder (if have some file in "scripts" root folder)
            '<%= yeoman.app %>/scripts/*.js',
            //  List of all services
            '<%= yeoman.app %>/scripts/directives/**/*.js'
          ]
        }
      }
    },

    concat: {
      dist: {
        src: [
            //  List of all files in scripts folder (if have some file in "scripts" root folder)
            '<%= yeoman.app %>/scripts/*.js',
            //  List of all services
            '<%= yeoman.app %>/scripts/directives/**/*.js'
        ],
        dest: '<%= yeoman.dist %>/<%= yeoman.moduleName %>.js'
      },
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

 grunt.registerTask('badge', 'Generate Coveralls Badge for projects', function(){
    require('child_process').exec('cat ./coverage/report-lcov/lcov.info | ./node_modules/.bin/coveralls', function(error, stdin, stdout) {
      if (!error) {
        console.log('Coverage task is not running automatically');
      }
    });

  });

  grunt.registerTask('buildNgModuleFile', 'Task for build ng module script file.', function(filename) {
    var path = require('path'),
        fs = require('fs'),
        SCRIPTS_DIST_DIR = 'dist/'
    ;

    //  uncompressed and compressed module
    var buildFile = function(filename){

      var angularModule = {
        contentUncompressed: {
          header: '(function(window, angular, undefined) {' +
                              '\n' +
                              '\'use strict\';' +
                              '\n',
          footer: '\n' +
                  '})(window, window.angular);'
        },
        contentCompressed: {
          header: '(function(window, angular, undefined){ "use strict";',
          footer: '})(window, window.angular);'
        }
      };

      var remove = ['\'use strict\';', '"use strict";'];

      //  Verifying template for include in compiled file
      var templateNgModule = (filename.indexOf('.min.') !== (-1)) ? angularModule.contentUncompressed : angularModule.contentCompressed;

      var data = fs.readFileSync(filename, 'utf8');
      data = templateNgModule.header + data.replace(new RegExp(remove[0], 'g'), '').replace(new RegExp(remove[1], 'g'), '') + templateNgModule.footer;
      fs.writeFileSync(filename, data, 'utf8');
      console.log('Build of filename "'+filename+'" finished with success');
    };

    fs.readdirSync(SCRIPTS_DIST_DIR).forEach(function(file) {
      if ( file.indexOf(filename) !== (-1) ) {
        buildFile(SCRIPTS_DIST_DIR + filename);
      }
    });
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    target = ':'+target || '';
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve'+target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'connect:test',
    'karma',
    'badge'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'uglify',
    'buildNgModuleFile:'+grunt.config.get('yeoman')['moduleName']+'.js',
    'buildNgModuleFile:'+grunt.config.get('yeoman')['moduleName']+'.min.js'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
