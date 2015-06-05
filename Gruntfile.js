//Skeleton GruntFile
// ------------------
'use strict';
/*globals require, module */

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Configurable paths
    var config = {
        src: 'src',
        build: 'src/build',
        dist: 'dist',
        test: 'test',
        examples: 'examples',
        docs: 'docs',
        bower: 'bower_components'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,
        pkg: grunt.file.readJSON('package.json'),

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= config.src %>/**/*.js', '<%= config.examples %>/**/*.js'],
                tasks: ['preprocess']
            },
            build: {
                files: ['<%= config.src %>/build/{,*/}*.js'],
            },
            jstest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['test:watch']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            }
        },
        // The actual grunt server settings
        browserSync: {
            options: {
                open: true,
                port: 9000,
                watchTask: true,
                server: {
                    files: ['<%= config.examples %>/**/*.js', '<%= config.src %>/**/*.js'],
                    baseDir: '<%= config.examples %>',
                    directory: true,
                    routes: {
                        '/bower_components': 'bower_components',
                        '/dist': 'dist'
                    }
                },
            },
            todo: {
                bsFiles: {
                    src: [
                        '<%= config.examples %>/todo/*.js',
                        '<%= config.examples %>/todo/*.html',
                        '<%= config.examples %>/todo/*.css',
                        '<%= config.dist %>/**/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        directory: false,
                        baseDir: '<%= config.examples %>/todo',
                        index: 'index.html',
                        routes: {
                            '/bower_components': 'bower_components',
                            '/dist': 'dist'
                        }
                    }
                }
            },
            lab: {
                bsFiles: {
                    src: [
                        '<%= config.examples %>/lab/*.js',
                        '<%= config.examples %>/lab/*.html',
                        '<%= config.examples %>/lab/*.css',
                        '<%= config.dist %>/**/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        directory: false,
                        baseDir: '<%= config.examples %>/lab',
                        index: 'index.html',
                        routes: {
                            '/bower_components': 'bower_components',
                            '/dist': 'dist'
                        }
                    }
                }

            }
        },
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*',
                        '<%= config.docs %>/*'
                    ]
                }]
            },
            server: '.tmp',
            coverage: {
                src: ['test/src']
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: true,
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.src %>{,*/}*.js',
                '!<%= config.examples %>{,*/}*.js',
                'test/unit/**/*.js'
            ],
            test: ['test/**/<%= pkg.name %>.js']
        },

        // Mocha testing framework configuration options
        mochaTest: {
            tests: {
                options: {
                    require: 'test/unit/setup/node.js',
                    reporter: grunt.option('mocha-reporter') || 'nyan',
                    clearRequireCache: true,
                    mocha: require('mocha')
                },
                src: [
                    'test/unit/setup/helpers.js',
                    'test/unit/jskeleton-src/*.spec.js',
                    'test/unit/marionette-comp/*.spec.js'
                ]
            },
            src: {
                options: {
                    require: 'test/unit/setup/node.js',
                    reporter: grunt.option('mocha-reporter') || 'nyan',
                    clearRequireCache: true,
                    mocha: require('mocha')
                },
                src: [
                    'test/unit/setup/helpers.js',
                    'test/unit/jskeleton-src/*.spec.js'
                ]
            },
            marionette: {
                options: {
                    require: 'test/unit/setup/node.js',
                    reporter: grunt.option('mocha-reporter') || 'nyan',
                    clearRequireCache: true,
                    mocha: require('mocha')
                },
                src: [
                    'test/unit/marionette-comp/*.spec.js'
                ]
            }
        },
        // Automatically inject Bower components into the HTML file
        wiredep: {
            task: {
                //ignorePath: /^\/|\.\.\//,
                src: ['<%= config.examples %>/**/*.html']
            },
            options: {

            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= config.dist %>/jskeleton.min.js': [
                        '<%= config.dist %>/jskeleton.js'
                    ]
                }
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> \n */'

            },
            dist: {
                src: [
                    '<%= config.dist %>/<%= pkg.name %>.js'
                ],
                dest: '<%= config.dist %>/<%= pkg.name %>.js'
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'images/{,*/}*.webp',
                        '{,*/}*.html',
                        'styles/fonts/{,*/}*.*'
                    ]
                }, {
                    src: 'node_modules/apache-server-configs/dist/.htaccess',
                    dest: '<%= config.dist %>/.htaccess'
                }]
            },
            coverage: {
                expand: true,
                flatten: true,
                src: ['<%= config.dist %>/*.js'],
                dest: 'test/coverage/instrument/build'
            }
        },
        preprocess: {
            'default': {
                src: '<%= config.build %>/main.js',
                dest: '<%= config.dist %>/<%= pkg.name %>.js'
            },
            'lite': {
                src: '<%= config.build %>/main-lite.js',
                dest: '<%= config.dist %>/<%= pkg.name %>_lite.js'
            }
        },
        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [],
            test: [],
            dist: []
        },
        docco: {
            options: {
                dst: './docs',
                layout: 'parallel'
            },
            docs: {
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: [
                        '<%= pkg.name %>_lite.js',
                    ]
                }]
            }
        },
        env: {
            coverage: {
                APP_DIR_FOR_CODE_COVERAGE: '../../../test/src/'
            }
        },
        instrument: {
            files: 'src/**/*.js',
            options: {
                lazy: true,
                basePath: 'test'
            }
        },
        storeCoverage: {
            options: {
                dir: 'coverage'
            }
        },
        makeReport: {
            src: 'coverage/**/*.json',
            options: {
                type: 'lcov',
                dir: 'coverage',
                print: 'detail'
            }
        },
        plato: {
            report: {
                files: {
                    'metrics': ['src/**/*.js', 'test/**/*.js']
                }
            }
        },

        coveralls: {
            'default': {
                src: 'coverage/lcov.info'
            }
        },
        // end - code coverage settings
        /*jshint camelcase: false */
        dom_munger: {
            annotated: {
                options: {
                    callback: function($) {
                        var container = $('#container');
                        $('html').replaceWith(container);
                        $('#container').html($('#container').html().replace('{{', '{ {'));
                    }
                },
                src: './docs/<%= pkg.name %>_lite.html',
                dest: './docs/annotated.html'
            }
        },
        /*jshint camelcase: true */
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

    grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function(target) {
        /*if (grunt.option('allow-remote')) {
            grunt.config.set('connect.options.hostname', '0.0.0.0');
        }*/
        if (target === 'lab') {
            return grunt.task.run(['build', 'browserSync:lab', 'watch']);
        }
        if (target === 'todo') {
            return grunt.task.run(['build', 'browserSync:todo', 'watch']);
        }

        grunt.task.run(['build', 'browserSync', 'watch']);

    });

    grunt.registerTask('server', function(target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run([target ? ('serve:' + target) : 'serve']);
    });

    grunt.registerTask('test', function(target) {

        grunt.task.run(['build']);

        if (target === 'src') {
            return grunt.task.run(['mochaTest:src']);
        }

        if (target === 'examples') {
            return grunt.task.run(['mochaTest:tests']);
        }

        if (target === 'examples') {
            return grunt.task.run(['mochaTest:marionette']);
        }

        // Default all
        grunt.task.run([
            'jshint:test',
            'mochaTest:tests'
        ]);
    });

    grunt.registerTask('coverage', [
        /*'jshint:test',*/
        'clean:coverage',
        'preprocess',
        'env:coverage',
        'instrument',
        'mochaTest:src',
        'storeCoverage',
        'makeReport'
    ]);

    grunt.registerTask('build', [
        'jshint:all',
        'clean:dist',
        'preprocess',
        'preprocess:lite',
        'concat',
        'docco',
        'wiredep'
    ]);

    grunt.registerTask('metrics', [
        'plato'
    ]);

    grunt.registerTask('_commit', [
        'changelog',
        'bump-commit'
    ]);

    grunt.registerTask('annotated', [
        'docco',
        'dom_munger'
    ]);

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

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};