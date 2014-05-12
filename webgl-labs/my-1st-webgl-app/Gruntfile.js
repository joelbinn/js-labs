// Generated on 2014-04-29 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/**/*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    folders: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: ['<%= folders.app %>/scripts/**/*.js'],
        tasks: ['newer:jshint:all']
      },
      gruntfile: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= folders.app %>/**/*.js',
          '<%= folders.app %>/**/*.html',
          '.tmp/styles/**/*.css',
          '<%= folders.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9942,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35742
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= folders.app %>'
          ]
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= folders.app %>/scripts/**/*.js'
      ]
    },

    // Empties folders to start fresh
    clean: {
      server: '.tmp'
    }

  });


  grunt.registerTask('serve', function () {
    grunt.task.run([
      'clean:server',
      'connect:livereload',
      'watch'
    ]);
  });
};
