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

casper.test.begin('Crawler', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: ['casperjs']}},
        crawler,
        content,
        unescaped,
        data,
        resp;

    // serialise
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    test.assertEquals(crawler.serialise({}), '', 'encode entities properly');
    test.assertEquals(crawler.serialise({a: 1, b: 2}), 'a=1&b=2', 'encode entities properly');
    test.assertEquals(crawler.serialise([]), '', 'encode entities properly');
    test.assertEquals(crawler.serialise(['a', 'b']), '0=a&1=b', 'encode entities properly');

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    test.assertEquals(crawler.serialise(''), '', 'doesn\'t process a string');
    test.assertEquals(crawler.serialise('test'), '', 'doesn\'t process a string');

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    test.assertEquals(crawler.serialise(1), '', 'doesn\'t process an integer');
    test.assertEquals(crawler.serialise(-1), '', 'doesn\'t process an integer');
    test.assertEquals(crawler.serialise(0), '', 'doesn\'t process an integer');

    // run
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    config.parser.interface = 'phantom';
    crawler.execPhantomjs = function () { return 'OK'; };
    test.assertEquals(crawler.run('', '', '', '', ''), 'OK', 'runs');

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    config.parser.interface = 'casper';
    crawler.execCasperjs = function () { return 'OK'; };
    test.assertEquals(crawler.run('', '', '', '', ''), 'OK', 'runs');

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    config.parser.interface = 'fake';
    test.assertEquals(crawler.run('', '', '', '', ''), undefined, 'doesn\'t run');

    // TODO: do it
    // analiseRedisResponse
    //var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    //test.assertEquals(false, true, 'runs');

    // TODO: do it
    // checkAndRun
    //var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    //test.assertEquals(false, true, 'runs');

    // checkRunningCrawlers
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    crawler.possibleCrawlers = 1;
    test.assertEquals(crawler.checkRunningCrawlers(), true, 'doesn\'t exit when there are running crawlers');

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    crawler.possibleCrawlers = 0;
    test.assertEquals(crawler.checkRunningCrawlers(), false, 'exits when there are no running crawlers');

    // onStdOut
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    crawler.processOutput = '';
    crawler.onStdOut('test\n');
    test.assertEquals(crawler.processOutput, 'test\n', 'collect the data from response');

    crawler.onStdOut('test2\n');
    test.assertEquals(crawler.processOutput, 'test\ntest2\n', 'collect the data from response');

    // onStdErr
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    crawler.handleError = function () {};

    resp = crawler.onStdErr('');
    test.assertEquals(undefined, resp, 'runs');

    // handleError
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    crawler.tries = 10;
    test.assertEquals(crawler.handleError(), false, 'doesn\'t try to run another crawler if max attempts is reached');

    // onExit
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    crawler.processPage = function () { return true; };

    test.assertEquals(crawler.onExit(), true, 'runs');

    // htmlEscape
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.htmlEscape('&'), '&amp;', 'escape "ampersand" correctly');

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.htmlEscape('"'), '&quot;', 'escape "double quote" correctly');

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.htmlEscape('\''), '&#39;', 'escape "single quote" correctly');

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.htmlEscape('<'), '&lt;', 'escape "less than" correctly');

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.htmlEscape('>'), '&gt;', 'escape "greater than" correctly');

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    unescaped = 'abcdefghijklmnopqrstuvwxyz0123456789\\|!£$%/()=?^[]{}@#;,:.-_+';
    test.assertEquals(crawler.htmlEscape(unescaped), unescaped, 'doesn\'t escape anything else');

    // TODO: do it
    // storeDetailsToFile
    //var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    //test.assertEquals(false, true, 'save properly a report file);

    // processPage
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    data = {
        idCrawler: '',
        links:     {
            a:      [],
            link:   [],
            script: [],
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

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    data = {
        idCrawler: '',
        links:     {
            a:      ['#'],
            link:   [],
            script: [],
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

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    data = {
        idCrawler: '',
        links:     {
            a:      ['#', '/'],
            link:   [],
            script: [],
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

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    data = {
        idCrawler: '',
        links:     {
            a:      [],
            link:   [],
            script: [],
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

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    data = {
        idCrawler: '',
        links:     {
            a:      [],
            link:   [],
            script: [],
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

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    data = {
        idCrawler: '',
        links:     {
            a:      ['#'],
            link:   [],
            script: [],
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

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    data = {
        idCrawler: '',
        links:     {
            a:      ['#', '/'],
            link:   [],
            script: [],
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

    // normaliseData
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.normaliseData('http://www.example.com/?%C3%A0=1'), {'à': '1'}, 'encodes correctly');
    test.assertEquals(crawler.normaliseData('http://www.example.com/?a=%3D'), {a: '='}, 'encodes correctly');

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.normaliseData('http://www.example.com/?a=1&a=2'), {a: '2'}, 'removes duplicates');

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.normaliseData('http://www.example.com/?b=1&a=2'), {a: '2', b: '1'}, 'orders alphabetically');

    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.normaliseData('http://www.example.com/?'), {}, 'returns empty array when input is not array');
    test.assertEquals(crawler.normaliseData([]), {}, 'returns empty array when input is not array');
    test.assertEquals(crawler.normaliseData({}), {}, 'returns empty array when input is not array');
    test.assertEquals(crawler.normaliseData(1), {}, 'returns empty array when input is not array');

    test.done();
});

/*
// TODO: Not working
casper.test.begin('Crawler Async', function(test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {
            stdout: function() { return {on:function(){}}},
            stderr: function() { return {on:function(){}}},
            on: function() { return {on:function(param, callback){ if (param ==='exit') { callback(); }}}}
        },
        crypto   = {createHash: function() { return {update: function () { return {digest: function() { return ''}}}}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error:function(){},info:function(){},warn:function(){}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: []}};

    // execPhantomjs
    // runs
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    crawler.onStdOut = function() {};
    crawler.onStdErr = function() {};
    crawler.onExit = function() {
        test.done();
    };

    config.parser.interface = 'phantom';
    crawler.execPhantomjs();
});
*/

casper.test.begin('Crawler Async #2', function (test) {
    var Crawler  = require(srcdir + '/crawler'),
        config   = require(srcdir + '/config'),
        spawn    = {},
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        testObj  = require(srcdir + '/test'),
        client   = {},
        winston  = {error: function () {}, info: function () {}, warn: function () {}},
        fs       = require(srcdir + '/fs'),
        optimist = {argv: {$0: []}},
        crawler;

    // handleError
    // tries to run another crawler if max attempts is not reached
    crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    crawler.run = function () {
        test.done();
    };
    crawler.tries = 0;
    test.assertEquals(crawler.handleError(), true);
});