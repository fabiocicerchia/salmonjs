/**
 *               __                         _____ _______
 * .-----.---.-.|  |.--------.-----.-----._|     |     __|
 * |__ --|  _  ||  ||        |  _  |     |       |__     |
 * |_____|___._||__||__|__|__|_____|__|__|_______|_______|
 *
 * salmonJS v0.2.1
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
    rootdir  = fs.absolute('.'),
    srcdir   = rootdir + (casper.cli.has('coverage') ? '/src-cov' : '/src'),
    glob     = require(srcdir + '/glob'),
    basePath = fs.absolute('.') + '/../test/assets/';

casper.options.onPageInitialized = function () {
    casper.page.injectJs(srcdir + '/sha1.js');
    casper.page.injectJs(srcdir + '/events.js');
};

casper.on('remote.message', function (msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

casper.test.begin('setUpPage', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());

    phantom.setUpPage(phantom.page);

    test.assertEquals(phantom.page.settings.resourceTimeout, config.parser.timeout, 'it has been set up properly');
    test.assertEquals(phantom.page.onResourceTimeout,        phantom.onResourceTimeout, 'it has been set up properly');
    test.assertEquals(phantom.page.onError,                  phantom.onError, 'it has been set up properly');
    test.assertEquals(phantom.page.onInitialized,            phantom.onInitialized, 'it has been set up properly');
    test.assertEquals(phantom.page.onResourceReceived,       phantom.onResourceReceived, 'it has been set up properly');
    test.assertEquals(phantom.page.onAlert,                  phantom.onAlert, 'it has been set up properly');
    test.assertEquals(phantom.page.onConfirm,                phantom.onConfirm, 'it has been set up properly');
    test.assertEquals(phantom.page.onPrompt,                 phantom.onPrompt, 'it has been set up properly');
    test.assertEquals(phantom.page.onConsoleMessage,         phantom.onConsoleMessage, 'it has been set up properly');
    test.assertEquals(phantom.page.onNavigationRequested,    phantom.onNavigationRequested, 'it has been set up properly');
    test.assertEquals(phantom.page.viewportSize,             { width: 1024, height: 800 }, 'it has been set up properly');
    test.assertEquals(phantom.page.settings.userAgent,       'salmonJS/0.2.1 (+http://fabiocicerchia.github.io/salmonjs)', 'it has been set up properly');

    test.done();
});

casper.test.begin('onOpen', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());
    phantom.onOpen('failure');

    test.assertType(phantom.report.time.start, 'number');
    test.assertType(phantom.report.time.end, 'number');
    test.assertType(phantom.report.time.total, 'number');
    test.assertType(phantom.page.navigationLocked, 'boolean');
    test.assertEquals(phantom.page.navigationLocked, false);

    phantom.onOpen('success');

    test.assertType(phantom.report.time.start, 'number');
    test.assertType(phantom.report.time.end, 'number');
    test.assertType(phantom.report.time.total, 'number');
    test.assertType(phantom.page.navigationLocked, 'boolean');
    test.assertEquals(phantom.page.navigationLocked, false);

    test.done();
});

casper.test.begin('onResourceTimeout', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());
    test.assertEquals(phantom.onResourceTimeout(), true);

    test.done();
});

casper.test.begin('onError', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());
    phantom.onError('error1');
    test.assertEquals(phantom.report.errors, ['ERROR: error1']);

    phantom.report.errors = [];
    phantom.onError('error2', [{file: 'file', line: 1}]);
    test.assertEquals(phantom.report.errors, ['ERROR: error2\nTRACE:\n -> file: 1']);

    phantom.report.errors = [];
    phantom.onError('error3', [{file: 'file', line: 1, function: 'test'}]);
    test.assertEquals(phantom.report.errors, ['ERROR: error3\nTRACE:\n -> file: 1 (in function "test")']);

    test.done();
});

casper.test.begin('onResourceReceived', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());
    phantom.onResourceReceived({stage: 'end', url: 'about:blank', headers: []});
    console.log(JSON.stringify(phantom.report.resources));
    test.assertEquals(phantom.report.resources, { 'about:blank': { headers: [] } });

    test.done();
});

casper.test.begin('onAlert', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());
    phantom.onAlert('message');
    test.assertType(phantom.report.alerts, 'array');
    test.assertEquals(phantom.report.alerts, ['message']);

    test.done();
});

casper.test.begin('onConfirm', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());
    test.assertEquals(phantom.onConfirm('message'), true);
    test.assertType(phantom.report.confirms, 'array');
    test.assertEquals(phantom.report.confirms, ['message']);

    test.done();
});

casper.test.begin('onPrompt', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());
    test.assertEquals(phantom.onPrompt('message', ''), '');
    test.assertType(phantom.report.prompts, 'array');
    test.assertEquals(phantom.report.prompts, [{msg: 'message', defaultVal: ''}]);

    test.done();
});

casper.test.begin('onConsoleMessage', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());
    phantom.onConsoleMessage('message', 1, '');
    test.assertType(phantom.report.console, 'array');
    test.assertEquals(phantom.report.console, [{msg: 'message', lineNum: 1, sourceId: ''}]);

    test.done();
});

casper.test.begin('onLoadFinished', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());

    phantom.parsePage = function () { test.done(); };
    phantom.onLoadFinished();
});

casper.test.begin('onLoadFinished #2', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());

    phantom.stepStack = [{event: 'click', xPath: 'window'}];
    phantom.parsePage = function () { };
    phantom.page.evaluate = function () { test.done(); };
    phantom.onLoadFinished();
});

casper.test.begin('onLoadFinished #3', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());

    phantom.stepStack = [{event: 'click', xPath: '/html/body'}];
    phantom.parsePage = function () { };
    phantom.page.evaluate = function () { test.done(); };
    phantom.onLoadFinished();
});

casper.test.begin('parsePage', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    // TBD
    test.done();
});

casper.test.begin('onEvaluate', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config'),
        utils         = {},
        phantom;

    // TBD
    test.done();
});

casper.test.begin('parseGet', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());
    phantom.url = 'about:blank';
    phantom.data = '';
    phantom.onOpen = function () {};
    phantom.onLoadFinished = function () {
        test.done();
    };
    test.assertEquals(phantom.parseGet(), undefined);
});

casper.test.begin('parsePost', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());
    phantom.url = 'about:blank';
    phantom.data = {};
    phantom.onOpen = function () {};
    phantom.onLoadFinished = function () {
        test.done();
    };
    test.assertEquals(phantom.parsePost(), undefined);
});

//casper.test.begin('onInitialized', function (test) {
//    var PhantomParser = require(srcdir + '/parser/phantom'),
//        config        = require(srcdir + '/config'),
//        utils         = {},
//        phantom;
//
//    phantom = new PhantomParser(utils, require('webpage').create());
//    phantom.page.injectJs = function() {
//        test.done();
//    };
//    test.assertEquals(phantom.onInitialized(), undefined);
//});

casper.test.begin('onNavigationRequested', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom,
        resp;

    phantom = new PhantomParser(utils, require('webpage').create());

    followRedirects = false;
    phantom.url = 'about:blank';
    phantom.exit = function () { return true; };
    resp = phantom.onNavigationRequested('', '', '', '');
    test.assertEquals(resp, true);

    phantom.url = 'http://www.example.com';
    phantom.exit = function () { return true; };
    resp = phantom.onNavigationRequested('about:blank', '', '', '');
    test.assertEquals(resp, true);

    phantom.url = 'http://www.example.com';
    phantom.exit = function () { return true; };
    resp = phantom.onNavigationRequested('http://www.example2.com', '', '', '');
    test.assertEquals(resp, true);

    phantom.url = 'http://www.example.com';
    phantom.exit = function () { return true; };
    resp = phantom.onNavigationRequested('http://www.example.com', '', '', '');
    test.assertEquals(resp, undefined);

    test.done();
});

casper.test.begin('putPageInStack', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom,
        page;

    phantom = new PhantomParser(utils, require('webpage').create());
    page = {data:{}, evaluate: function (a, b) { this.data = b; }};
    phantom.cloneWebPage = function() {
        return {data:{}, evaluate: function (a, b) { this.data = b; }};
    };

    page.data.event = '';
    page.data.xPath = '';
    phantom.putPageInStack('', '', '');
    test.assertEquals(phantom.stackPages, [page]);

    page = {data:{}, evaluate: function (a, b) { this.data = b; }};
    page.data.event = 'evt';
    page.data.xPath = 'xPath';
    phantom.stackPages = [];
    phantom.putPageInStack('', 'evt', 'xPath');
    test.assertEquals(phantom.stackPages, [page]);

    page = {data:{}, evaluate: function (a, b) { this.data = b; }};
    page.data.event = 'click';
    page.data.xPath = 'window';
    phantom.stackPages = [];
    phantom.putPageInStack('', 'click', 'window');
    test.assertEquals(phantom.stackPages, [page]);

    page = {data:{}, evaluate: function (a, b) { this.data = b; }};
    page.data.event = 'click';
    page.data.xPath = '/html/body';
    phantom.stackPages = [];
    phantom.putPageInStack('', 'click', '/html/body');
    test.assertEquals(phantom.stackPages, [page]);

    test.done();
});

// TODO: do it
casper.test.begin('exit', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, require('webpage').create());
    test.done();
});

casper.test.begin('cloneWebPage', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom,
        resp;

    phantom = new PhantomParser(utils, require('webpage').create());

    phantom.setUpPage = function(page) {
        page.onInitialized = function() {
        }
    };
    resp = phantom.cloneWebPage({content: 'content', url: 'url'});
    test.assertEquals(resp.content, '<html><head></head><body>content</body></html>');
    test.assertEquals(resp.url, 'url');
    test.done();
});

// -----------------------------------------------------------------------------
// FUNCTIONAL TESTS ------------------------------------------------------------
// -----------------------------------------------------------------------------

if (casper.cli.options.post !== 'src/reporter/coverage.js') {
    casper.test.begin("Test #1", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_01.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, []);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #2", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_02.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_02.html#',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #3", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_03.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_03.html#',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #4", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_04.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_04.html#',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #5", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_05.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_05.html#',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #6", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_06.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_06.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_06.html#whatever2',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #7", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_07.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_07.html#whatever1',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #8", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_08.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_08.html#whatever1',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #9", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_09.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_09.html#whatever1',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #10", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_10.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_10.html#whatever1',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #11", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_11.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_11.html#whatever1',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #12", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_12.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            console.log(data+'');
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, []);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #13", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_13.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, []);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #14", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_14.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_14.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_14.html#whatever2',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #15", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_15.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            console.log(data+'');
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_15.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_15.html#whatever2',
                   'file://' + rootdir + '/test/assets/test_15.html#whatever3',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #16", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_16.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_16.html?a=1&b=2',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #17", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_17.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_17.html#',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #18", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_18.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_18.html', // TODO: Not totally correct
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #19", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_19.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, []);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #20", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_20.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, []);
                test.assertEquals(resp.links.meta, [
                   'file://' + rootdir + '/test/assets/test_20.html#'
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #21", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_21.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a.sort(), [
                   'file://' + rootdir + '/test/assets/test_21.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_21.html#whatever2',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #22", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_22.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a.sort(), [
                   'file://' + rootdir + '/test/assets/test_22.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_22.html#whatever2',
                   'file://' + rootdir + '/test/assets/test_22.html#whatever3',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #23", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_23.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a.sort(), [
                   'file://' + rootdir + '/test/assets/test_23.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_23.html#whatever2',
                   'file://' + rootdir + '/test/assets/test_23.html#whatever3',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #24", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_24.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a.sort(), [
                   'file://' + rootdir + '/test/assets/test_24.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_24.html#whatever2',
                   'file://' + rootdir + '/test/assets/test_24.html#whatever3',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #25", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_25.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_25.html',
                   'file://' + rootdir + '/test/assets/test_25.html#whatever2',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #25", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_25.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_25.html',
                   'file://' + rootdir + '/test/assets/test_25.html#whatever2',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #25 #2", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_25.html',
            'GET',
            { POST: {}, CONFIRM: {"whatever": false} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_25.html',
                   'file://' + rootdir + '/test/assets/test_25.html#whatever3',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #26", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_26.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever', 'whatever', 'whatever']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_26.html#whatever2'
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #26 #2", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_26.html',
            'GET',
            { POST: {}, CONFIRM: { "whatever": false } },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever', 'whatever', 'whatever']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_26.html#whatever3'
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #27", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_27.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_27.html#something',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #27 #2", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_27.html',
            'GET',
            { POST: {}, CONFIRM: { "whatever": true, "something": false} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_27.html#whatever2',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #27 #3", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_27.html',
            'GET',
            { POST: {}, CONFIRM: { "whatever": false, "something": true} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_27.html#something2',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #27 #4", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_27.html',
            'GET',
            { POST: {}, CONFIRM: { "whatever": false, "something": false} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_27.html#whatever3',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #28 #2", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_28.html',
            'GET',
            { POST: {}, CONFIRM: {}, PROMPT: { "whatever": 'aaa'} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.prompts, [{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''}]);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_28.html#whatever3',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Test #28", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_28.html',
            'GET',
            { POST: {}, CONFIRM: {}, PROMPT: { "whatever": ''} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.prompts, [{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''}]);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_28.html#something2',
                ]);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            test.done();
        });
    });

    casper.test.begin("Upload", function (test) {
        var phantom,
            resp,
            nickname = 'salmonJS_' + Date.now();

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'http://imagebin.org/index.php?page=add',
            'POST',
            { POST: {image: '@' + rootdir + '/test/assets/pixel.gif', nickname: nickname, disclaimer_agree: 'Y', title: '', description: '', Submit: 'Submit', mode: 'add'} },
            undefined,
            undefined,
            false,
            true
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, []);
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
        });
        phantom.on('exit', function() {
            casper.start('http://imagebin.org/index.php', function() {
                test.assertTextExists(nickname);
            }).run(function() {
                test.done();
            });
        });
    });
}
