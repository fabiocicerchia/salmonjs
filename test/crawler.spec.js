/**
 *               __                         _____ _______
 * .-----.---.-.|  |.--------.-----.-----._|     |     __|
 * |__ --|  _  ||  ||        |  _  |     |       |__     |
 * |_____|___._||__||__|__|__|_____|__|__|_______|_______|
 *
 * salmonJS v0.5.0
 *
 * Copyright (C) 2014 Fabio Cicerchia <info@fabiocicerchia.it>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var rootdir = require('path').resolve('.'),
    srcdir  = rootdir + (process.env.SALMONJS_COV ? '/src-cov' : '/src'),
    chai    = require('chai'),
    expect  = chai.expect;

describe('run', function() {
    it('run', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {sleep: function () {}},
            crawler;

        utils.sha1 = function () { return ''; };
        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);
        config.parser.interface = 'phantom';
        crawler.execSubProcess = function () { return 'OK'; };
        expect(crawler.run({url: '', type: '', data: '', evt: '', xPath: ''})).to.equal('OK'); // runs

        done();
    });
});
describe('run2', function() {
    it('run2', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {sleep: function () {}},
            crawler;

        utils.sha1 = function () { return ''; };
        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);
        config.parser.interface = 'fake';
        expect(crawler.run({url: '', type: '', data: '', evt: '', xPath: ''})).to.equal(undefined); // doesn\'t run

        done();
    });
});
describe('analiseRedisResponse', function() {
    it('analiseRedisResponse', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = function() {},
            testObj  = require(srcdir + '/test'),
            client   = {hset: function () {}},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            pool     = {
                addToQueue: function (settings, options) {
                    options.exit();
                }
            },
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler;

        utils.sha1 = function () { return ''; };
        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils, pool);

        __dirname = '';

        crawler.checkRunningCrawlers = function () {
            done();
        };
        crawler.analiseRedisResponse(undefined, null, '', {url: '', type: '', data: {}, evt: '', xPath: ''}, spawn);
    });
});
describe('analiseRedisResponse2', function() {
    it('analiseRedisResponse2', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = function() {},
            testObj  = require(srcdir + '/test'),
            client   = {hset: function () {}},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);
        try {
            crawler.analiseRedisResponse('err', null, '', {url: '', type: '', data: {}, evt: '', xPath: ''}, spawn);
        } catch (err) {
            expect(err).to.equal('err');
        }

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);
        crawler.checkRunningCrawlers = function () { done(); };

        crawler.analiseRedisResponse(undefined, 'whatever', '', {url: '', type: '', data: {}, evt: '', xPath: ''}, spawn);
        expect(crawler.possibleCrawlers).to.equal(-1);
    });
});
describe('checkAndRun', function() {
    it('checkAndRun', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {
                hgetall: function(key, callback) {
                    callback();
                }
            },
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler;

        utils.sha1 = function (str) { expect(str).to.equal('http://www.example.comGET{"GET":{},"POST":{},"COOKIE":{},"HEADERS":{},"CONFIRM":{},"PROMPT":{}}'); return ''; };
        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        crawler.analiseRedisResponse = function () {
            done();
        };
        crawler.checkAndRun({url: 'http://www.example.com', type: '', data: '', evt: '', xPath: ''});
    });
});
describe('checkRunningCrawlers', function() {
    it('checkRunningCrawlers', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        crawler.possibleCrawlers = 1;
        expect(crawler.checkRunningCrawlers()).to.equal(true); // doesn\'t exit when there are running crawlers

        done();
    });
});
describe('checkRunningCrawlers1', function() {
    it('checkRunningCrawlers1', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        crawler.possibleCrawlers = 0;
        expect(crawler.checkRunningCrawlers()).to.equal(false); // exits when there are no running crawlers

        done();
    });
});
describe('onStdOut', function() {
    it('onStdOut', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        crawler.processOutput = '';
        crawler.onStdOut('test\n');
        expect(crawler.processOutput).to.equal('test\n'); // collect the data from response

        crawler.onStdOut('test2\n');
        expect(crawler.processOutput).to.equal('test\ntest2\n'); // collect the data from response

        done();
    });
});
describe('onStdErr', function() {
    it('onStdErr', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler,
            resp;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        crawler.handleError = function () {};

        resp = crawler.onStdErr('');
        expect(undefined).to.equal(resp); // runs

        done();
    });
});
describe('handleError', function() {
    it('handleError', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);
        crawler.tries = 10;
        crawler.storeDetails = true;
        crawler.storeDetailsToFile = function () {};
        expect(crawler.handleError()).to.equal(false); // doesn\'t try to run another crawler if max attempts is reached

        done();
    });
});
describe('onExit', function() {
    it('onExit', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        crawler.processPage = function () { return true; };

        expect(crawler.onExit()).to.equal(true); // runs

        done();
    });
});
describe('storeDetailsToFile', function() {
    it('storeDetailsToFile', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = {mkdir: function() {}, existsSync: function () {}, mkdirSync: function () {done();}, writeFileSync: function () {}, appendFileSync: function () {}},
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler;

        utils.sha1 = function () { return ''; };
        utils.htmlEscape = function () { return ''; };
        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        var report = {
            errors:     [],
            alerts:     [],
            confirms:   [],
            prompts:    [],
            console:    [],
            failure:    false,
            resources:  {},
            time:       { start: 0, end: 0, total: 0 },
            content:    '',
            httpMethod: crawler.type,
            event:      crawler.evt,
            xPath:      crawler.xPath,
            data:       crawler.data
        };

        crawler.storeDetailsToFile(report);
    });
});
describe('storeDetailsToFile2', function() {
    it('storeDetailsToFile2', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = {mkdir: function() {}, existsSync: function () {}, mkdirSync: function () {done();}, writeFileSync: function () {}, appendFileSync: function () {}},
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler;

        utils.sha1 = function () { return ''; };
        utils.htmlEscape = function () { return ''; };
        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        var report = {
            errors:     ['ERROR: test\nTRACE:\n -> file:line (in function "")'],
            alerts:     ['alert'],
            confirms:   ['confirm'],
            prompts:    [{msg: 'message', defaultVal: true}],
            console:    [{msg: 'message', lineNum: 0, sourceId: false}],
            failure:    true,
            resources:  {'example': {headers: {'test': 'value'}}},
            time:       { start: 0, end: 0, total: 0 },
            content:    '',
            httpMethod: crawler.type,
            event:      crawler.evt,
            xPath:      crawler.xPath,
            data:       crawler.data
        };

        crawler.storeDetailsToFile(report);
    });
});
describe('processPage', function() {
    it('processPage', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            crypto   = {},
            utils    = new (require(srcdir + '/utils'))(crypto),
            glob     = {},
            testObj  = new (require(srcdir + '/test'))(fs, glob, '', utils),
            crawler,
            content,
            data;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        data = {
            idCrawler: '',
            links:     {
                a:      [],
                link:   [],
                script: [],
                meta:   [],
                form:   [],
                events: []
            },
            report:    {
                errors:     [],
                alerts:     [],
                confirms:   [],
                console:    [],
                resources:  {},
                time:       { start: 0, end: 0, total: 0 },
                content:    '',
                httpMethod: '',
                event:      '',
                xPath:      '',
                data:       {}
            }
        };
        content = '###' + JSON.stringify(data);

        crawler.checkRunningCrawlers = function () { return 'OK'; };
        crawler.checkAndRun          = function () {};

        expect(crawler.processPage(content)).to.equal('OK'); // process an empty page
        expect(crawler.possibleCrawlers).to.equal(0); // process an empty page

        done();
    });
});
describe('processPage2', function() {
    it('processPage2', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            crypto   = {},
            utils    = new (require(srcdir + '/utils'))(crypto),
            glob     = {},
            testObj  = new (require(srcdir + '/test'))(fs, glob, '', utils),
            crawler,
            content,
            data;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        data = {
            idCrawler: '',
            links:     {
                a:      ['#'],
                link:   [],
                script: [],
                meta:   [],
                form:   [],
                events: []
            },
            report:    {
                errors:     [],
                alerts:     [],
                confirms:   [],
                console:    [],
                resources:  {},
                time:       { start: 0, end: 0, total: 0 },
                content:    '',
                httpMethod: '',
                event:      '',
                xPath:      '',
                data:       {}
            }
        };
        content = '###' + JSON.stringify(data);

        crawler.checkRunningCrawlers = function () { return 'OK'; };
        crawler.checkAndRun          = function () {};

        expect(crawler.processPage(content)).to.equal('OK'); // process a page with 1 link
        expect(crawler.possibleCrawlers).to.equal(1); // process a page with 1 link

        done();
    });
});
describe('processPage3', function() {
    it('processPage3', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            crypto   = {},
            utils    = new (require(srcdir + '/utils'))(crypto),
            glob     = {},
            testObj  = new (require(srcdir + '/test'))(fs, glob, '', utils),
            crawler,
            content,
            data;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        data = {
            idCrawler: '',
            links:     {
                a:      ['#', '/'],
                link:   [],
                script: [],
                meta:   [],
                form:   [],
                events: []
            },
            report:    {
                errors:     [],
                alerts:     [],
                confirms:   [],
                console:    [],
                resources:  {},
                time:       { start: 0, end: 0, total: 0 },
                content:    '',
                httpMethod: '',
                event:      '',
                xPath:      '',
                data:       {}
            }
        };
        content = '###' + JSON.stringify(data);

        crawler.checkRunningCrawlers = function () { return 'OK'; };
        crawler.checkAndRun          = function () {};

        expect(crawler.processPage(content)).to.equal('OK'); // process a page with 2 links
        expect(crawler.possibleCrawlers).to.equal(2); // process a page with 2 links

        done();
    });
});
describe('processPage4', function() {
    it('processPage4', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            crypto   = {},
            utils    = new (require(srcdir + '/utils'))(crypto),
            glob     = {},
            testObj  = new (require(srcdir + '/test'))(fs, glob, '', utils),
            crawler,
            content,
            data;

        utils.sha1 = function () { return ''; };
        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        data = {
            idCrawler: '',
            links:     {
                a:      [],
                link:   [],
                script: [],
                meta:   [],
                form:   [],
                events: {
                    click: {
                        da39a3ee5e6b4b0d3255bfef95601890afd80709: [
                            '//whatever'
                        ]
                    }
                }
            },
            report:    {
                errors:     [],
                alerts:     [],
                confirms:   [],
                console:    [],
                resources:  {},
                time:       { start: 0, end: 0, total: 0 },
                content:    '',
                httpMethod: '',
                event:      '',
                xPath:      '',
                data:       {}
            }
        };
        content = '###' + JSON.stringify(data);

        crawler.checkRunningCrawlers = function () { return 'OK'; };
        crawler.checkAndRun          = function () {};

        expect(crawler.processPage(content)).to.equal('OK'); // process a page with 1 event
        expect(crawler.possibleCrawlers).to.equal(1); // process a page with 1 event

        done();
    });
});
describe('processPage5', function() {
    it('processPage5', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            crypto   = {},
            utils    = new (require(srcdir + '/utils'))(crypto),
            glob     = {},
            testObj  = new (require(srcdir + '/test'))(fs, glob, '', utils),
            crawler,
            content,
            data;

        utils.sha1 = function () { return ''; };
        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        data = {
            idCrawler: '',
            links:     {
                a:      [],
                link:   [],
                script: [],
                meta:   [],
                form:   [],
                events: {
                    click: {
                        da39a3ee5e6b4b0d3255bfef95601890afd80709: [
                            '//whatever',
                            '//whatever2'
                        ]
                    }
                }
            },
            report:    {
                errors:     [],
                alerts:     [],
                confirms:   [],
                console:    [],
                resources:  {},
                time:       { start: 0, end: 0, total: 0 },
                content:    '',
                httpMethod: '',
                event:      '',
                xPath:      '',
                data:       {}
            }
        };
        content = '###' + JSON.stringify(data);

        crawler.checkRunningCrawlers = function () { return 'OK'; };
        crawler.checkAndRun          = function () {};

        expect(crawler.processPage(content)).to.equal('OK'); // process a page with 2 events
        expect(crawler.possibleCrawlers).to.equal(2); // process a page with 2 events

        done();
    });
});
describe('processPage6', function() {
    it('processPage6', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            crypto   = {},
            utils    = new (require(srcdir + '/utils'))(crypto),
            glob     = {},
            testObj  = new (require(srcdir + '/test'))(fs, glob, '', utils),
            crawler,
            content;

        utils.sha1 = function () { return ''; };
        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        var data = {
            idCrawler: '',
            links:     {
                a:      ['#'],
                link:   [],
                script: [],
                meta:   [],
                form:   [],
                events: {
                    click: {
                        da39a3ee5e6b4b0d3255bfef95601890afd80709: [
                            '//whatever'
                        ]
                    }
                }
            },
            report:    {
                errors:     [],
                alerts:     [],
                confirms:   [],
                console:    [],
                resources:  {},
                time:       { start: 0, end: 0, total: 0 },
                content:    '',
                httpMethod: '',
                event:      '',
                xPath:      '',
                data:       {}
            }
        };
        content = '###' + JSON.stringify(data);

        crawler.checkRunningCrawlers = function () { return 'OK'; };
        crawler.checkAndRun          = function () {};

        expect(crawler.processPage(content)).to.equal('OK'); // process a page with 1 link and 1 event
        expect(crawler.possibleCrawlers).to.equal(2); // process a page with 1 link and 1 event

        done();
    });
});
describe('processPage7', function() {
    it('processPage7', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            crypto   = {},
            utils    = new (require(srcdir + '/utils'))(crypto),
            glob     = {},
            testObj  = new (require(srcdir + '/test'))(fs, glob, '', utils),
            crawler,
            content,
            data;

        utils.sha1 = function () { return ''; };
        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        data = {
            idCrawler: '',
            links:     {
                a:      ['#', '/'],
                link:   [],
                script: [],
                meta:   [],
                form:   [],
                events: {
                    click: {
                        da39a3ee5e6b4b0d3255bfef95601890afd80709: [
                            '//whatever',
                            '//whatever2'
                        ]
                    }
                }
            },
            report:    {
                errors:     [],
                alerts:     [],
                confirms:   [],
                console:    [],
                resources:  {},
                time:       { start: 0, end: 0, total: 0 },
                content:    '',
                httpMethod: '',
                event:      '',
                xPath:      '',
                data:       {}
            }
        };
        content = '###' + JSON.stringify(data);

        crawler.checkRunningCrawlers = function () { return 'OK'; };
        crawler.checkAndRun          = function () {};

        expect(crawler.processPage(content)).to.equal('OK'); // process a page with 2 links and 2 events
        expect(crawler.possibleCrawlers).to.equal(4); // process a page with 2 links and 2 events

        done();
    });
});
describe('processPage9', function() {
    it('processPage9', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler,
            content;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        crawler.storeDetails = false;
        crawler.storeDetailsToFile = function () {};
        crawler.handleError = function () {
            done();
        };

        content = '###AB"C';

        expect(crawler.processPage(content)).to.equal(undefined); // process an empty page
        expect(crawler.possibleCrawlers).to.equal(0); // process an empty page
    });
});
describe('processPage10', function() {
    it('processPage10', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler,
            content;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        crawler.storeDetails = true;
        crawler.storeDetailsToFile = function () {};

        content = '###{"links":{}}';
        crawler.checkRunningCrawlers = function () { return 'OK'; };

        expect(crawler.processPage(content)).to.equal('OK'); // process an empty page
        expect(crawler.possibleCrawlers).to.equal(0); // process an empty page

        done();
    });
});
describe('execSubProcess', function() {
    it('execSubProcess', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = function() {
                return {
                    stdout: { on:function(){}},
                    stderr: { on:function(){}},
                    on: function(param, callback){ if (param ==='exit') { callback(); }}
                };
            },
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: []}},
            utils    = {};

        utils.sha1 = function () { return ''; };
        utils.serialise = function () { return ''; };
        var crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);
        crawler.onStdOut = function() {};
        crawler.onStdErr = function() {};
        crawler.onExit = function() {
            done();
        };

        config.parser.interface = 'phantom';
        crawler.execSubProcess();
    });
});
describe('execSubProcess2', function() {
    it('execSubProcess2', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = function() {
                return {
                    stdout: { on:function(){}},
                    stderr: { on:function(){}},
                    on: function(param, callback){ if (param ==='exit') { callback(); }}
                };
            },
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: []}},
            utils    = {};

        utils.sha1 = function () { return ''; };
        utils.serialise = function () { return ''; };
        var crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);
        crawler.onStdOut = function() {};
        crawler.onStdErr = function() {};
        crawler.onExit = function() {
            throw new Error();
        };
        crawler.handleError = function() {
            done();
        };

        config.parser.interface = 'phantom';
        crawler.execSubProcess();
    });
});
describe('handleError2', function() {
    it('handleError2', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: []}},
            utils    = {},
            crawler;

        // tries to run another crawler if max attempts is not reached
        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);
        crawler.run = function () {
            done();
        };
        crawler.tries = 0;
        expect(crawler.handleError()).to.equal(true);
    });
});
describe('init', function() {
    it('init', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = {},
            testObj  = require(srcdir + '/test'),
            client   = {on: function (evt, cb) { cb({}); }},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {},
            crawler;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);

        crawler.init();
        expect(typeof crawler.idCrawler).to.equal('string');
        expect(crawler.idCrawler).to.be.above(0);

        done();
    });
});
describe('proxySettings', function() {
    it('proxySettings', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = function(cmd, params) {
                return {
                    stdout: { on:function(act, cb){ cb(params); }},
                    stderr: { on:function(){}},
                    on: function(param, callback){ if (param ==='exit') { callback(); }}
                };
            },
            testObj  = require(srcdir + '/test'),
            client   = {on: function (evt, cb) { cb({}); }},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {sha1: function(str) { return str; }, sleep: function () {}},
            crawler;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);
        crawler.proxy = 'username:password@ip:port';

        crawler.onStdOut = function(data) {
            expect(data.toString().indexOf('--proxy-auth=username:password,--proxy=ip:port,') > -1).to.equal(true);
            expect(data.toString().indexOf('"username:password@ip:port"') > -1).to.equal(true);
            done();
        };
        crawler.onStdErr = function() {};
        crawler.onExit = function() {};

        crawler.execSubProcess();
    });
});
describe('proxySettings2', function() {
    it('proxySettings2', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = function(cmd, params) {
                return {
                    stdout: { on:function(act, cb){ cb(params); }},
                    stderr: { on:function(){}},
                    on: function(param, callback){ if (param ==='exit') { callback(); }}
                };
            },
            testObj  = require(srcdir + '/test'),
            client   = {on: function (evt, cb) { cb({}); }},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            utils    = {sha1: function(str) { return str; }},
            crawler;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);
        crawler.proxy = 'ip:port';

        crawler.onStdOut = function(data) {
            expect(data.toString().indexOf('--proxy=ip:port,') > -1).to.equal(true);
            expect(data.toString().indexOf('"ip:port"') > -1).to.equal(true);
            done();
        };
        crawler.onStdErr = function() {};
        crawler.onExit = function() {};

        crawler.execSubProcess();
    });
});
describe('politeness', function() {
    it('politeness', function (done) {
        var Crawler  = require(srcdir + '/crawler'),
            config   = {
                redis: {
                    port: 16379,
                    hostname: '127.0.0.1'
                },
                logging: {
                    level: 'debug', // Possible values: debug, info, warn, error.
                    silent: false
                },
                parser: {
                    interface: 'phantom', // PhantomJS: 'phantom'
                    cmd: 'phantomjs',
                    timeout: 5000 // Resource timeout in milliseconds.
                },
                crawler: {
                    attempts: 5, // Number of tries before stop to execute the request.
                    delay: 5000 // Delay between an attempt and another one in milliseconds.
                }
            },
            spawn    = function(cmd, params) {
                return {
                    stdout: { on:function(act, cb){ cb(params); }},
                    stderr: { on:function(){}},
                    on: function(param, callback){ if (param ==='exit') { callback(); }}
                };
            },
            testObj  = require(srcdir + '/test'),
            client   = {on: function (evt, cb) { cb({}); }},
            winston  = {error: function () {}, info: function () {}, warn: function () {}, debug: function() {}},
            fs       = require(srcdir + '/fs'),
            optimist = {argv: {$0: ['jasmine-node']}},
            crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
            utils    = new (require(srcdir + '/utils'))(crypto),
            crawler;

        crawler = new Crawler(config, spawn, testObj, client, winston, fs, optimist, utils);
        crawler.execSubProcess = function () { return 'OK'; };

        var start = Date.now();
        crawler.run({url: '', type: '', data: '', evt: '', xPath: ''});
        var end = Date.now();
        expect((end-start)/1000 >= 1).to.equal(true); // It waits 1 second

        start = Date.now();
        crawler.politeInterval = 2000;
        crawler.run({url: '', type: '', data: '', evt: '', xPath: ''});
        end = Date.now();
        expect((end-start)/1000 >= 2).to.equal(true); // It waits 2 second

        done();
    });
});
