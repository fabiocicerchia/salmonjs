module.exports = function(grunt) {
    grunt.initConfig({
        jasmine_node: {
            coverage: {
                report: [ 'lcov', 'html' ],
                savePath: 'build/reports/coverage',
                excludes: [ ]
            },
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec',
                captureExceptions: true,
                junitreport: {
                    report: false,
                    savePath : './build/reports/jasmine/',
                    useDotNotation: true,
                    consolidate: true
                }
            }
        },
        jshint: {
            options :{
                ignores: [
                    'src/sha1.js'
                ],
                globals: {
                    __dirname: false,
                    json: false,
                    settings: true,
                    SHA1: false,
                    // PHANTOMJS
                    webpage: false
                },
                asi: false,
                bitwise: true,
                boss: false,
                browser: true,
                camelcase: false,
                couch: false,
                curly: true,
                debug: false,
                devel: true,
                dojo: false,
                eqeqeq: true,
                eqnull: false,
                es3: false,
                esnext: false,
                evil: true,
                expr: false,
                forin: true,
                freeze: false,
                funcscope: false,
                gcl: false,
                globalstrict: false,
                immed: true,
                indent: 4,
                iterator: false,
                jquery: false,
                lastsemic: false,
                latedef: true,
                laxbreak: false,
                laxcomma: false,
                loopfunc: true,
                maxcomplexity: 22, // TODO: Set to 5
                maxdepth: 5,
                maxerr: 100,
                maxlen: 300,
                maxparams: 10, // TODO: Set to 5
                maxstatements: 126, // TODO: Set to 35
                mootools: false,
                moz: false,
                multistr: false,
                newcap: true,
                noarg: true,
                node: true,
                noempty: false,
                nonew: true,
                nonstandard: false,
                notypeof: false,
                phantom: true,
                plusplus: false,
                proto: false,
                prototypejs: false,
                quotmark: 'single',
                rhino: false,
                scripturl: false,
                shadow: false,
                smarttabs: false,
                strict: false,
                sub: false,
                supernew: false,
                trailing: true,
                undef: true,
                unused: true,
                validthis: false,
                worker: false,
                wsh: false,
                yui: false
            },
            uses_defaults: [
                'Gruntfile.js',
                'bin/**/*.js',
                'src/**/*.js'
            ],
            with_overrides: {
                options: {
                    globals: {
                        __dirname: true,
                        json: false,
                        settings: true,
                        test: true,
                        // BROWSER
                        document: true,
                        window: true,
                        // JASMINE
                        jasmine: false,
                        describe: false,
                        it: false,
                        beforeEach: false,
                        waitsFor: false,
                        runs: false
                    },
                    expr: true,
                    maxlen: 1000,
                    maxstatements: 1000
                },
                files: {
                    src: [
                        'test/**/*.js'
                    ]
                },
            }
        },
        release: {
            options: {
                bump: true,
                file: 'package.json',
                add: true,
                commit: true,
                tag: true,
                push: true,
                pushTags: true,
                npm: true,
//                npmtag: true, //default: no tag
//                folder: 'folder/to/publish/to/npm', //default project root
                tagName: '<%= version %>',
                commitMessage: 'release <%= version %>',
                tagMessage: 'Version <%= version %>'
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'path/to/source/code/',
                    themedir: 'path/to/custom/theme/',
                    outdir: 'where/to/save/docs/'
                }
            }
        },
        todo: {
            options: {
                marks: [
                    {
                        name: 'FIX',
                        pattern: /FIXME/,
                        color: 'red'
                    },
                    {
                        name: 'TODO',
                        pattern: /TODO/,
                        color: 'yellow'
                    },
                    {
                        name: 'NOTE',
                        pattern: /NOTE/,
                        color: 'blue'
                    }
                ],
                file: 'TODO.md'
            },
            src: [
                'bin/*',
                'src/*',
                'test/*'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-jasmine-node-coverage');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-todo');
    grunt.loadNpmTasks('grunt-verb');
    grunt.loadNpmTasks('grunt-sloc');

//    grunt.registerTask('default', 'jasmine_node');
};
