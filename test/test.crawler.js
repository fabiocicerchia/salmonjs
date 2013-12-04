/**
 *               __     __
 * .-----.-----.|__|.--|  |.-----.--.--.
 * |__ --|  _  ||  ||  _  ||  -__|  |  |
 * |_____|   __||__||_____||_____|___  |
 *       |__|                    |_____|
 *
 * SPIDEY v0.2.1
 *
 * Copyright (C) 2013 Fabio Cicerchia <info@fabiocicerchia.it>
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

var casper   = casper || {},
    fs       = require('fs'),
    srcdir   = fs.absolute('.') + (casper.cli.has('coverage') ? '/src-cov' : '/src'),
    glob     = require(srcdir + '/glob'),
    basePath = fs.absolute('.') + '/test/assets/';

casper.options.onPageInitialized = function () {
    casper.page.injectJs(srcdir + '/sha1.js');
    casper.page.injectJs(srcdir + '/events.js');
};

casper.on('remote.message', function (msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

casper.test.begin('run', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    utils.sha1 = function () { return ''; };
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);
    config.parser.interface = 'phantom';
    crawler.execPhantomjs = function () { return 'OK'; };
    test.assertEquals(crawler.run('', '', '', '', ''), 'OK', 'runs');

    test.done();
});

casper.test.begin('run #2', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    utils.sha1 = function () { return ''; };
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);
    config.parser.interface = 'fake';
    test.assertEquals(crawler.run('', '', '', '', ''), undefined, 'doesn\'t run');

    test.done();
});

casper.test.begin('analiseRedisResponse', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = function() {
            return {
                stdout: { on:function(){}},
                stderr: { on:function(){}},
                on: function(param, callback){ if (param ==='exit') { test.done(); }}
            };
        },
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {hset: function () {}},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    utils.sha1 = function () { return ''; };
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

    __dirname = '';

    crawler.analiseRedisResponse(undefined, null, '', {url: '', type: '', data: {}, evt: '', xPath: ''}, spawn);
});

casper.test.begin('analiseRedisResponse #2', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = function() {
            return {
                stdout: { on:function(){}},
                stderr: { on:function(){}},
                on: function(param, callback){ if (param ==='exit') { test.done(); }}
            };
        },
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {hset: function () {}},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);
    try {
        crawler.analiseRedisResponse('err', null, '', {url: '', type: '', data: {}, evt: '', xPath: ''}, spawn);
    } catch (err) {
        test.assertEquals(err, 'err');
    }

    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);
    crawler.checkRunningCrawlers = function () { test.done(); };

    crawler.analiseRedisResponse(undefined, 'whatever', '', {url: '', type: '', data: {}, evt: '', xPath: ''}, spawn);
    test.assertEquals(crawler.possibleCrawlers, -1);
});

casper.test.begin('checkAndRun', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {hgetall: function(id, cb) { test.done(); } },
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    utils.sha1 = function (str) { test.assertEquals(str, 'GET{}'); return ''; };
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

    crawler.checkAndRun('', '', '', '', '');
});

casper.test.begin('checkRunningCrawlers', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

    crawler.possibleCrawlers = 1;
    test.assertEquals(crawler.checkRunningCrawlers(), true, 'doesn\'t exit when there are running crawlers');

    test.done();
});

casper.test.begin('checkRunningCrawlers #1', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

    crawler.possibleCrawlers = 0;
    test.assertEquals(crawler.checkRunningCrawlers(), false, 'exits when there are no running crawlers');

    test.done();
});

casper.test.begin('onStdOut', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

    crawler.processOutput = '';
    crawler.onStdOut('test\n');
    test.assertEquals(crawler.processOutput, 'test\n', 'collect the data from response');

    crawler.onStdOut('test2\n');
    test.assertEquals(crawler.processOutput, 'test\ntest2\n', 'collect the data from response');

    test.done();
});

casper.test.begin('onStdErr', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

    crawler.handleError = function () {};

    resp = crawler.onStdErr('');
    test.assertEquals(undefined, resp, 'runs');

    test.done();
});

casper.test.begin('handleError', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);
    crawler.tries = 10;
    crawler.storeDetails = true;
    crawler.storeDetailsToFile = function () {};
    test.assertEquals(crawler.handleError(), false, 'doesn\'t try to run another crawler if max attempts is reached');

    test.done();
});

casper.test.begin('onExit', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

    crawler.processPage = function () { return true; };

    test.assertEquals(crawler.onExit(), true, 'runs');

    test.done();
});

casper.test.begin('storeDetailsToFile', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = {mkdir: function() {test.done();}},
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    utils.sha1 = function () { return ''; };
    utils.htmlEscape = function () { return ''; };
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

    var report = {
        errors:     [],
        alerts:     [],
        confirms:   [],
        prompts:    [],
        console:    [],
        failure:    true,
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

casper.test.begin('processPage', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

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

    test.assertEquals(crawler.processPage(content), 'OK', 'process an empty page');
    test.assertEquals(crawler.possibleCrawlers, 0, 'process an empty page');

    test.done();
});

casper.test.begin('processPage #2', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

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

    test.assertEquals(crawler.processPage(content), 'OK', 'process a page with 1 link');
    test.assertEquals(crawler.possibleCrawlers, 1, 'process a page with 1 link');

    test.done();
});

casper.test.begin('processPage #3', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

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

    test.assertEquals(crawler.processPage(content), 'OK', 'process a page with 2 links');
    test.assertEquals(crawler.possibleCrawlers, 2, 'process a page with 2 links');

    test.done();
});

casper.test.begin('processPage #4', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    utils.sha1 = function () { return ''; };
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

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

    test.assertEquals(crawler.processPage(content), 'OK', 'process a page with 1 event');
    test.assertEquals(crawler.possibleCrawlers, 1, 'process a page with 1 event');

    test.done();
});

casper.test.begin('processPage #5', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    utils.sha1 = function () { return ''; };
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

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

    test.assertEquals(crawler.processPage(content), 'OK', 'process a page with 2 events');
    test.assertEquals(crawler.possibleCrawlers, 2, 'process a page with 2 events');

    test.done();
});

casper.test.begin('processPage #6', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    utils.sha1 = function () { return ''; };
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

    data = {
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

    test.assertEquals(crawler.processPage(content), 'OK', 'process a page with 1 link and 1 event');
    test.assertEquals(crawler.possibleCrawlers, 2, 'process a page with 1 link and 1 event');

    test.done();
});

casper.test.begin('processPage #7', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    utils.sha1 = function () { return ''; };
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

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

    test.assertEquals(crawler.processPage(content), 'OK', 'process a page with 2 links and 2 events');
    test.assertEquals(crawler.possibleCrawlers, 4, 'process a page with 2 links and 2 events');

    test.done();
});

/*
casper.test.begin('processPage #9', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

    crawler.storeDetails = false;
    crawler.storeDetailsToFile = function () {};
    crawler.handleError = function () {
        test.done();
    };

    content = '###AB"C';
    crawler.processPage(content);
});
*/

casper.test.begin('processPage #10', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs cli --test']}},
        utils    = {},
        crawler,
        content,
        unescaped,
        data,
        resp;

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

    crawler.storeDetails = true;
    crawler.storeDetailsToFile = function () {};

    content = '###{"links":{}}';
    crawler.checkRunningCrawlers = function () { return 'OK'; };

    test.assertEquals(crawler.processPage(content), 'OK', 'process an empty page');
    test.assertEquals(crawler.possibleCrawlers, 0, 'process an empty page');

    test.done();
});

casper.test.begin('execPhantomjs', function(test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = function() {
            return {
                stdout: { on:function(){}},
                stderr: { on:function(){}},
                on: function(param, callback){ if (param ==='exit') { callback(); }}
            };
        },
        crypto   = {createHash: function() { return {update: function () { return {digest: function() { return ''}}}}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error:function(){},info:function(){},warn:function(){}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: []}},
        utils    = {};

    utils.sha1 = function () { return ''; };
    utils.serialise = function () { return ''; };
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);
    crawler.onStdOut = function() {};
    crawler.onStdErr = function() {};
    crawler.onExit = function() {
        test.done();
    };

    config.parser.interface = 'phantom';
    crawler.execPhantomjs();
});

casper.test.begin('execPhantomjs #2', function(test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = function() {
            return {
                stdout: { on:function(){}},
                stderr: { on:function(){}},
                on: function(param, callback){ if (param ==='exit') { callback(); }}
            };
        },
        crypto   = {createHash: function() { return {update: function () { return {digest: function() { return ''}}}}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error:function(){},info:function(){},warn:function(){}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: []}},
        utils    = {};

    utils.sha1 = function () { return ''; };
    utils.serialise = function () { return ''; };
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);
    crawler.onStdOut = function() {};
    crawler.onStdErr = function() {};
    crawler.onExit = function() {
        throw new Error();
    };
    crawler.handleError = function() {
        test.done();
    };

    config.parser.interface = 'phantom';
    crawler.execPhantomjs();
});

casper.test.begin('handleError #2', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: []}},
        utils    = {},
        crawler;

    // tries to run another crawler if max attempts is not reached
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);
    crawler.run = function () {
        test.done();
    };
    crawler.tries = 0;
    test.assertEquals(crawler.handleError(), true);
});

casper.test.begin('init', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {on: function (evt, cb) { cb({}); }},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs --cli test']}},
        utils    = {},
        crawler;

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist, utils);

    process = {pid: 123};

    crawler.init();
    test.assertType(crawler.idCrawler, 'string');
    test.assertEquals(crawler.idCrawler, '123');

    test.done();
});
