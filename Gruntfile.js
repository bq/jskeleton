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
        docs : 'docs',
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
                files: ['<%= config.src %>{,*/}*.js', '<%= config.examples %>{,*/}*.js'],
                tasks: ['preprocess'],
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
            },
        },
        // The actual grunt server settings
        browserSync: {
            options: {
                open: true,
                port: 9000
            },
            dev: {
                bsFiles: {
                    src : [
                        '<%= config.examples %>/**/*.js',
                        '<%= config.examples %>/**/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: '<%= config.examples %>'
                }
            },
            todo: {
                bsFiles: {
                    src : [
                        '<%= config.examples %>/**/*.js',
                        '<%= config.examples %>/**/*.html',
                        '<%= config.examples %>/**/*.css'
                    ]
                },
                options: {
                    watchTask: true,
                    server:{
                        files: ['*.js'],
                        baseDir:  '<%= config.examples %>',
                        directory: true,
                        routes: {
                            '/bower_components' : 'bower_components',
                            '/dist' : 'dist'
                        }
                    }
                }
            },
            lab: {
                bsFiles: {
                    src : [
                        '<%= config.examples %>/**/*.js',
                        '<%= config.examples %>/**/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: '<%= config.examples %>'
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
            server: '.tmp'
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.src %>{,*/}*.js',
                '!<%= config.examples %>{,*/}*.js',
                'test/spec/{,*/}*.js'
            ]
        },

        // Mocha testing framework configuration options
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
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
                    '<%= config.src %>/build/jskeleton.min.js': [
                        '<%= config.src %>/build/jskeleton.js'
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
            }
        },
        preprocess: {
            'default': {
                src: '<%= config.build %>/main.js',
                dest: '<%= config.dist %>/<%= pkg.name %>.js'
            },
            'lite' : {
                src : '<%= config.build %>/main-lite.js',
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
            options : {
                dst : './docs',
                layout : 'parallel'
            },
            docs: {
                files : [
                    {
                        expand: true,
                        cwd: '<%= config.dist %>',
                        src: [
                            '<%= pkg.name %>_lite.js',
                        ]
                    }
                ]
            }
        }
    });
    
     
    grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function(target) {
        /*if (grunt.option('allow-remote')) {
            grunt.config.set('connect.options.hostname', '0.0.0.0');
        }*/
        if (target === 'lab') {
            return grunt.task.run(['build', 'browserSync:lab','watch']);
        }
        if (target === 'todo') {
            return grunt.task.run(['build', 'browserSync:todo','watch']);
        }
        
        grunt.task.run(['build', 'browserSync','watch']);


    });

    grunt.registerTask('server', function(target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run([target ? ('serve:' + target) : 'serve']);
    });

    grunt.registerTask('test', function(target) {
        if (target !== 'watch') {
            grunt.task.run([
                'clean:server',
                'concurrent:test'
            ]);
        }

        grunt.task.run([
            'connect:test',
            'mocha'
        ]);
    });

    grunt.registerTask('build', [
        'jshint:all',
        'clean:dist',
        'preprocess',
        'preprocess:lite',
        'concat',
        'docco',
        'wiredep'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};
