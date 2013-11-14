/**
 *               __     __
 * .-----.-----.|__|.--|  |.-----.--.--.
 * |__ --|  _  ||  ||  _  ||  -__|  |  |
 * |_____|   __||__||_____||_____|___  |
 *       |__|                    |_____|
 *
 * SPIDEY v0.2.0
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


var fs       = require('fs'),
    glob     = require('../src/glob'),
    basePath = fs.absolute('.') + '/test/assets/';

casper.options.onPageInitialized = function () {
    casper.page.injectJs(basePath + '../../src/sha1.js');
    casper.page.injectJs(basePath + '../../src/events.js');
};

casper.on('remote.message', function(msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

casper.test.begin('Crawler', function(test) {
    var Crawler  = require('../src/crawler'),
        config   = require('../src/config'),
        spawn    = {},
        crypto   = {createHash: function() { return {update: function () { return {digest: function() { return ''}}}}; }},
        testObj  = require('../src/test'),
        client   = {},
        winston  = {error:function(){},info:function(){},warn:function(){}},
        fs       = require('../src/fs'),
        optimist = {argv: {$0: ['casperjs']}};

    // serialise
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    test.assertEquals(crawler.serialise({}), '', 'encode entities properly');
    test.assertEquals(crawler.serialise({a: 1, b: 2}), 'a=1&b=2', 'encode entities properly');
    test.assertEquals(crawler.serialise([]), '', 'encode entities properly');
    test.assertEquals(crawler.serialise(['a', 'b']), '0=a&1=b', 'encode entities properly');

    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    test.assertEquals(crawler.serialise(''), '', 'doesn\'t process a string');
    test.assertEquals(crawler.serialise('test'), '', 'doesn\'t process a string');

    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    test.assertEquals(crawler.serialise(1), '', 'doesn\'t process an integer');
    test.assertEquals(crawler.serialise(-1), '', 'doesn\'t process an integer');
    test.assertEquals(crawler.serialise(0), '', 'doesn\'t process an integer');

    // run
    // runs
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    config.parser.interface = 'phantom';
    crawler.execPhantomjs = function () { return 'OK' };

    test.assertEquals(crawler.run('', '', '', '', ''), 'OK');

    // analiseRedisResponse
    // runs
    //var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    //test.assertEquals(false, true);

    // checkAndRun
    // runs
    //var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    //test.assertEquals(false, true);

    // checkRunningCrawlers
    // doesn\'t exit when there are running crawlers
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    crawler.possibleCrawlers = 1;
    test.assertEquals(crawler.checkRunningCrawlers(), true);

    // exits when there are no running crawlers
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    crawler.possibleCrawlers = 0;
    test.assertEquals(crawler.checkRunningCrawlers(), false);

    // onStdOut
    // collect the data from response
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    crawler.processOutput = '';
    crawler.onStdOut('test\n');
    test.assertEquals(crawler.processOutput, 'test\n');

    crawler.onStdOut('test2\n');
    test.assertEquals(crawler.processOutput, 'test\ntest2\n');

    // onStdErr
    // runs
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    crawler.handleError = function() {};

    var resp = crawler.onStdErr('');
    test.assertEquals(undefined, resp);

    // handleError
    // doesn\'t try to run another crawler if max attempts is reached
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    crawler.tries = 10;
    test.assertEquals(crawler.handleError(), false);

    // onExit
    // runs
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    crawler.processPage = function () { return true; };

    test.assertEquals(crawler.onExit(), true);

    // htmlEscape
    // escape "ampersand" correctly
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.htmlEscape('&'), '&amp;');

    // escape "double quote" correctly
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.htmlEscape('"'), '&quot;');

    // escape "single quote" correctly
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.htmlEscape('\''), '&#39;');

    // escape "less than" correctly
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.htmlEscape('<'), '&lt;');

    // escape "greater than" correctly
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    test.assertEquals(crawler.htmlEscape('>'), '&gt;');

    // doesn\'t escape anything else
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    var unescaped = 'abcdefghijklmnopqrstuvwxyz0123456789\\|!£$%/()=?^[]{}@#;,:.-_+';
    test.assertEquals(crawler.htmlEscape(unescaped), unescaped);

    // storeDetailsToFile
    // save properly a report file
    //var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    //test.assertEquals(false, true);

    // processPage
    // process an empty page
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    var data = {
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
    var content = '###' + JSON.stringify(data);

    crawler.checkRunningCrawlers = function () { return 'OK'; };
    crawler.checkAndRun          = function () {};

    test.assertEquals(crawler.processPage(content), 'OK');
    test.assertEquals(crawler.possibleCrawlers, 0);

    // process a page with 1 link
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    var data = {
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
    var content = '###' + JSON.stringify(data);

    crawler.checkRunningCrawlers = function () { return 'OK'; };
    crawler.checkAndRun          = function () {};

    test.assertEquals(crawler.processPage(content), 'OK');
    test.assertEquals(crawler.possibleCrawlers, 1);

    // process a page with 2 links
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    var data = {
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
    var content = '###' + JSON.stringify(data);

    crawler.checkRunningCrawlers = function () { return 'OK'; };
    crawler.checkAndRun          = function () {};

    test.assertEquals(crawler.processPage(content), 'OK');
    test.assertEquals(crawler.possibleCrawlers, 2);

    // process a page with 1 event
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    var data = {
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
    var content = '###' + JSON.stringify(data);

    crawler.checkRunningCrawlers = function () { return 'OK'; };
    crawler.checkAndRun          = function () {};

    test.assertEquals(crawler.processPage(content), 'OK');
    test.assertEquals(crawler.possibleCrawlers, 1);

    // process a page with 2 events
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    var data = {
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
    var content = '###' + JSON.stringify(data);

    crawler.checkRunningCrawlers = function () { return 'OK'; };
    crawler.checkAndRun          = function () {};

    test.assertEquals(crawler.processPage(content), 'OK');
    test.assertEquals(crawler.possibleCrawlers, 2);

    // process a page with 1 link and 1 event
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    var data = {
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
    var content = '###' + JSON.stringify(data);

    crawler.checkRunningCrawlers = function () { return 'OK'; };
    crawler.checkAndRun          = function () {};

    test.assertEquals(crawler.processPage(content), 'OK');
    test.assertEquals(crawler.possibleCrawlers, 2);

    // process a page with 2 links and 2 events
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);

    var data = {
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
    var content = '###' + JSON.stringify(data);

    crawler.checkRunningCrawlers = function () { return 'OK'; };
    crawler.checkAndRun          = function () {};

    test.assertEquals(crawler.processPage(content), 'OK');
    test.assertEquals(crawler.possibleCrawlers, 4);

    test.done();
});

/*
// TODO: Not working
casper.test.begin('Crawler Async', function(test) {
    var Crawler  = require('../src/crawler'),
        config   = require('../src/config'),
        spawn    = {
            stdout: function() { return {on:function(){}}},
            stderr: function() { return {on:function(){}}},
            on: function() { return {on:function(param, callback){ if (param ==='exit') { callback(); }}}}
        },
        crypto   = {createHash: function() { return {update: function () { return {digest: function() { return ''}}}}; }},
        testObj  = require('../src/test'),
        client   = {},
        winston  = {error:function(){},info:function(){},warn:function(){}},
        fs       = require('../src/fs'),
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

casper.test.begin('Crawler Async #2', function(test) {
    var Crawler  = require('../src/crawler'),
        config   = require('../src/config'),
        spawn    = {},
        crypto   = {createHash: function() { return {update: function () { return {digest: function() { return ''}}}}; }},
        testObj  = require('../src/test'),
        client   = {},
        winston  = {error:function(){},info:function(){},warn:function(){}},
        fs       = require('../src/fs'),
        optimist = {argv: {$0: []}};

    // handleError
    // tries to run another crawler if max attempts is not reached
    var crawler = new Crawler(config, spawn, crypto, testObj, client, winston, fs, optimist);
    crawler.run = function () {
        test.done();
    };
    crawler.tries = 0;
    test.assertEquals(crawler.handleError(), true);
});
*/