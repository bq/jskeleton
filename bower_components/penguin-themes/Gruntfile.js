/* global module, require */

'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        bw: grunt.file.readJSON('bower.json'),
        pkg: grunt.file.readJSON('package.json'),
        theme: undefined,
        themeUrl: 'themes/<%= theme %>',
        clean: {
            dist: ["<%= theme %>/dist"]
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none',
                    loadPath: 'bower_components/'
                },
                files: {
                    '<%= themeUrl %>/dist/css/<%= theme %>.css': '<%= themeUrl %>/src/css/main.scss'
                }
            }
        },
        watch: {
            css: {
                files: ['<%= themeUrl %>/src/css/**/*.scss'],
                tasks: ['sass']
            },
            options: {
                spawn: false
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= themeUrl %>/dist/css',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= themeUrl %>/dist/css',
                    ext: '.min.css'
                }]
            }
        },
        bump: {
            options: {
                files: ['bower.json'],
                updateConfigs: ['bw'],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['bower.json', 'CHANGELOG.md'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: '<%= bw.repository.url %>',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        },
        changelog: {
            options: {
                version: '<%= bw.version %>',
                repository: '<%= bw.repository.url %>'
            }
        },
    });

    grunt.registerTask('_commit', [
        'changelog',
        'bump-commit'
    ]);

    var evalTheme = function(theme) {

        if (!theme) {
            grunt.fail.fatal('You must specify a theme to build');
        }

        if (!grunt.file.exists('themes/' + theme)) {
            grunt.fail.fatal('theme folder not found');
        }
    };

    grunt.registerTask('serve', function(theme) {

        evalTheme(theme);

        grunt.config.set('theme', theme);
        grunt.task.run(['clean', 'sass', 'watch']);
    });

    grunt.registerTask('build-theme', function(theme) {

        evalTheme(theme);

        grunt.config.set('theme', theme);
        grunt.task.run(['clean', 'sass', 'cssmin']);

    });

    grunt.registerTask('release', function(version) {
        var semVer = /\bv?(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?\b/ig;

        if (!semVer.test(version)) {
            grunt.option('setversion', false);
            grunt.task.run('bump-only:' + version);
        } else {
            grunt.option('setversion', version);
            grunt.task.run('bump-only');
        }

        grunt.task.run('_commit');
    });

};