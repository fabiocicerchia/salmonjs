/**
 *               __                         _____ _______
 * .-----.---.-.|  |.--------.-----.-----._|     |     __|
 * |__ --|  _  ||  ||        |  _  |     |       |__     |
 * |_____|___._||__||__|__|__|_____|__|__|_______|_______|
 *
 * salmonJS v0.4.0
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

var casper   = casper || {},
    fs       = require('fs'),
    rootdir  = fs.absolute('.'),
    srcdir   = rootdir + (casper.cli.has('coverage') ? '/src-cov' : '/src');

casper.options.onPageInitialized = function () {
    casper.page.injectJs(srcdir + '/sha1.js');
    casper.page.injectJs(srcdir + '/events.js');
};

casper.on('remote.message', function (msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

casper.test.begin('setUpPage', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = {
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
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {config: config});
    phantom.reset();

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
    test.assertEquals(phantom.page.settings.userAgent,       'salmonJS/0.4.0 (+http://fabiocicerchia.github.io/salmonjs)', 'it has been set up properly');

    test.done();
});

casper.test.begin('onOpen', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

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
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    test.assertEquals(phantom.onResourceTimeout(), true);

    test.done();
});

casper.test.begin('onError', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

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
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    phantom.onResourceReceived({stage: 'end', url: 'about:blank', headers: []});
    test.assertEquals(phantom.report.resources, { 'about:blank': { headers: [] } });

    test.done();
});

casper.test.begin('onAlert', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    phantom.onAlert('message');
    test.assertType(phantom.report.alerts, 'array');
    test.assertEquals(phantom.report.alerts, ['message']);

    test.done();
});

casper.test.begin('onConfirm', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    test.assertEquals(phantom.onConfirm('message'), true);
    test.assertType(phantom.report.confirms, 'array');
    test.assertEquals(phantom.report.confirms, ['message']);

    test.done();
});

casper.test.begin('onConfirm #2', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        settings      = {
            data: {
                CONFIRM: {
                    message: false
                }
            }
        },
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), settings);
    phantom.reset();

    phantom.report.confirms = []; // TODO: WHY?
    test.assertEquals(phantom.onConfirm('message'), false);
    test.assertType(phantom.report.confirms, 'array');
    test.assertEquals(phantom.report.confirms, ['message']);

    test.done();
});

casper.test.begin('onPrompt', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    test.assertEquals(phantom.onPrompt('message', ''), '');
    test.assertType(phantom.report.prompts, 'array');
    test.assertEquals(phantom.report.prompts, [{msg: 'message', defaultVal: ''}]);

    test.done();
});

casper.test.begin('onPrompt #2', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        settings      = {
            data: {
                PROMPT: {
                    message: 'value'
                }
            }
        },
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), settings);
    phantom.reset();

    phantom.report.prompts = []; // TODO: WHY?
    test.assertEquals(phantom.onPrompt('message', ''), 'value');
    test.assertType(phantom.report.prompts, 'array');
    test.assertEquals(phantom.report.prompts, [{msg: 'message', defaultVal: ''}]);

    test.done();
});

casper.test.begin('onConsoleMessage', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    phantom.onConsoleMessage('message', 1, '');
    test.assertType(phantom.report.console, 'array');
    test.assertEquals(phantom.report.console, [{msg: 'message', lineNum: 1, sourceId: ''}]);

    test.done();
});

casper.test.begin('onLoadFinished', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    phantom.parsePage = function () { test.done(); };
    phantom.onLoadFinished();
});

casper.test.begin('onLoadFinished #2', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    phantom.stepStack = [{event: 'click', xPath: 'window'}];
    phantom.parsePage = function () { };
    phantom.page.evaluate = function () { test.done(); };
    phantom.onLoadFinished();
});

casper.test.begin('onLoadFinished #3', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    phantom.stepStack = [{event: 'click', xPath: '/html/body'}];
    phantom.parsePage = function () { };
    phantom.page.evaluate = function () { test.done(); };
    phantom.onLoadFinished();
});

casper.test.begin('parsePage', function (test) {
    // TBD
    test.done();
});

casper.test.begin('onEvaluate', function (test) {
    // TBD
    test.done();
});

casper.test.begin('onEvaluateNonHtml', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom,
        content,
        resp;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    content = 'http://username:password@hostname/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'http://hostname/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'http://username:password@127.0.0.1/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'http://127.0.0.1/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'https://username:password@hostname/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'https://hostname/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'https://username:password@127.0.0.1/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'https://127.0.0.1/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'ftp://username:password@hostname/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'ftp://hostname/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'ftp://username:password@127.0.0.1/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'ftp://127.0.0.1/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = '//username:password@hostname/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = '//hostname/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = '//username:password@127.0.0.1/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = '//127.0.0.1/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    //content = '/path?arg=value#anchor';
    //resp = phantom.onEvaluateNonHtml(content);
    //test.assertEquals(resp, {mixed:[content]});

    content = 'http://username:password@hostname:80/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'http://hostname:80/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'http://username:password@127.0.0.1:80/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'http://127.0.0.1:80/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'https://username:password@hostname:80/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'https://hostname:80/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'https://username:password@127.0.0.1:80/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'https://127.0.0.1:80/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'ftp://username:password@hostname:21/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'ftp://hostname:21/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'ftp://username:password@127.0.0.1:21/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = 'ftp://127.0.0.1:21/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = '//username:password@hostname:80/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = '//hostname:80/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = '//username:password@127.0.0.1:80/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    content = '//127.0.0.1:80/path?arg=value#anchor';
    resp = phantom.onEvaluateNonHtml(content);
    test.assertEquals(resp, {mixed:[content]});

    //content = '/path?arg=value#anchor';
    //resp = phantom.onEvaluateNonHtml(content);
    //test.assertEquals(resp, {mixed:[content]});

    test.done();
});

casper.test.begin('parseGet', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = new (require(srcdir + '/utils'))(),
        config        = {
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
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {config: config});
    phantom.reset();

    phantom.url = 'about:blank';
    phantom.data = '';
    phantom.onOpen = function () {};
    phantom.onLoadFinished = function () {
        test.done();
    };
    test.assertEquals(phantom.parseGet(), undefined);
});

casper.test.begin('parseGet #2', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = new (require(srcdir + '/utils'))(),
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    phantom.url = 'http://www.example.com/?c=1&a=2';
    phantom.data = {GET:{ a: 1, b: 2}, COOKIE: {}};
    phantom.setUpPage = function () {};
    phantom.onOpen = function () {};
    phantom.onLoadFinished = function () {};
    test.assertEquals(phantom.parseGet(), undefined);
    test.assertEquals(phantom.url, 'http://www.example.com/?a=1&b=2&c=1');
    test.done();
});

casper.test.begin('parseGet #3', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = new (require(srcdir + '/utils'))(),
        config        = {
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
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {config: config});
    phantom.reset();

    phantom.url = 'about:blank';
    phantom.data = {HEADERS:{ 'X-Test': 1}};
    phantom.onOpen = function () {};
    phantom.onLoadFinished = function () {
        test.done();
    };
    test.assertEquals(phantom.parseGet(), undefined);
    test.assertEquals(phantom.page.customHeaders['X-Test'], 1);
});

casper.test.begin('parseGet #4', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = new (require(srcdir + '/utils'))(),
        config        = {
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
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {config: config});
    phantom.reset();

    phantom.url = 'http://www.html-kit.com/tools/cookietester/';
    phantom.type = 'GET';
    phantom.setUpPage = function() { };
    phantom.data = {COOKIE:{ 'test': 1}};
    phantom.onLoadFinished = function () {
        test.assertEquals(phantom.page.content.indexOf('This page did not receive any cookies'), -1);
        test.assertEquals(phantom.page.content.indexOf('Number of cookies received: 0'), -1);
        test.assertNotEquals(phantom.page.content.indexOf('Number of cookies received: 1'), -1);
        test.done();
    };
    test.assertEquals(phantom.parseGet(), undefined);
});

if (require('system').env.TRAVIS !== 'true') {
    casper.test.begin('parsePost', function (test) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = new (require(srcdir + '/utils'))(),
            config        = {
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
            phantom;

        phantom = new PhantomParser(utils, {}, require('webpage').create(), {config: config});
        phantom.reset();

        phantom.url = 'about:blank';
        phantom.data = {};
        phantom.onOpen = function () {};
        phantom.onLoadFinished = function () {
            test.done();
        };
        test.assertEquals(phantom.parsePost(), undefined);
    });
}

casper.test.begin('parsePost #2', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = new (require(srcdir + '/utils'))(),
        config        = {
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
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {config: config});
    phantom.reset();

    phantom.url = 'http://www.example.com/?c=1&a=2';
    phantom.data = {GET:{ a: 1, b: 2}};
    phantom.onOpen = function () {};
    phantom.onLoadFinished = function () {};
    test.assertEquals(phantom.parsePost(), undefined);
    test.assertEquals(phantom.url, 'http://www.example.com/?a=1&b=2&c=1');
    test.done();
});

if (require('system').env.TRAVIS !== 'true') {
    casper.test.begin('parsePost #3', function (test) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = new (require(srcdir + '/utils'))(),
            config        = {
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
            phantom;

        phantom = new PhantomParser(utils, {}, require('webpage').create(), {config: config});
        phantom.reset();

        phantom.url = 'about:blank';
        phantom.data = {HEADERS:{ 'X-Test': 1}};
        phantom.onOpen = function () {};
        phantom.onLoadFinished = function () {
            test.done();
        };
        test.assertEquals(phantom.parsePost(), undefined);
        test.assertEquals(phantom.page.customHeaders['X-Test'], 1);
    });
}

casper.test.begin('parsePost #4', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = new (require(srcdir + '/utils'))(),
        config        = {
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
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {config: config});
    phantom.reset();

    phantom.url = 'http://www.html-kit.com/tools/cookietester/';
    phantom.type = 'POST';
    phantom.setUpPage = function() { };
    phantom.data = {COOKIE:{ 'test': 1}};
    phantom.onLoadFinished = function () {
        test.assertEquals(phantom.page.content.indexOf('This page did not receive any cookies'), -1);
        test.assertEquals(phantom.page.content.indexOf('Number of cookies received: 0'), -1);
        test.assertNotEquals(phantom.page.content.indexOf('Number of cookies received: 1'), -1);
        test.done();
    };
    test.assertEquals(phantom.parsePost(), undefined);
});

casper.test.begin('parsePost #5', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = new (require(srcdir + '/utils'))(),
        config        = {
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
        phantom;

    phantom = new PhantomParser(utils, require('child_process').spawn, require('webpage').create(), {config: config});
    phantom.reset();

    phantom.url = 'http://www.example.com/?c=1&a=2';
    phantom.data = {POST:{ a: 1, b: 2, c: '@' + srcdir + '/../test/assets/test_01.html'}};
    phantom.onOpen = function () {};
    phantom.onLoadFinished = function () {
        test.done();
    };
    test.assertEquals(phantom.parsePost(), undefined);
});

casper.test.begin('onInitialized', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    var page = {};
    page.injectJs = function() {
        test.done();
    };
    test.assertEquals(phantom.onInitialized(page), undefined);
});

casper.test.begin('onNavigationRequested', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        settings      = {},
        phantom,
        resp;

    settings.followRedirects = false;
    phantom = new PhantomParser(utils, {}, require('webpage').create(), settings);
    phantom.reset();

    phantom.url = 'about:blank';
    phantom.exit = function () { return true; };
    resp = phantom.onNavigationRequested('', '', '', '');
    test.assertEquals(resp, true);

    phantom.url = 'http://www.example.com';
    phantom.exit = function () { return true; };
    resp = phantom.onNavigationRequested('about:blank', '', '', '');
    test.assertEquals(resp, undefined);

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

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

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

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    test.done();
});

casper.test.begin('cloneWebPage', function (test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom,
        resp;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), {});
    phantom.reset();

    phantom.setUpPage = function(page) {
        page.onInitialized = function() {
        };
    };
    resp = phantom.cloneWebPage({content: 'content', url: 'url'});
    test.assertEquals(resp.content, '<html><head></head><body>content</body></html>');
    test.assertEquals(resp.url, 'url');
    test.done();
});

casper.test.begin('sanitise', function (test) {
    var phantom,
        resp;

    var params  = {
        idCrawler:       undefined,
        execId:          undefined,
        idRequest:       undefined,
        username:        undefined,
        password:        undefined,
        url:             'file://' + rootdir + '/test/assets/test_32.html',
        type:            'GET',
        data:            {},
        evt:             undefined,
        xPath:           undefined,
        storeDetails:    false,
        followRedirects: true,
        proxy:           '',
        sanitise:        true,
        config:          {
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
        }
    };

    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = {},
        phantom,
        spawn         = function(cmd, args) {
            var p = require('child_process').spawn(cmd, args);
            var sanitisedHtml = '';

            p.stdout.on('data', function(d) {
                sanitisedHtml += d.toString();
            });
            p.stderr.on('data', function(d) {
                console.log(d.toString());
            });
            p.on('exit', function(d) {
                fs.remove(args[1]);

                test.assertEquals(sanitisedHtml, '\n<!DOCTYPE html>\n<html>\n<head>\n<title></title>\n</head>\n<body>\n<table>\n<tbody>\n<tr>\n<td>badly formatted html</td>\n</tr>\n</tbody>\n</table>\n</body>\n</html>\n\n');
                test.done();
            });

            return {
                stdout: { on:function(){}},
                stderr: { on:function(){}},
                on: function() { }
            };
        };

    phantom = new PhantomParser(utils, spawn, require('webpage').create(), params);
    phantom.reset();

    phantom.page.content = fs.read(rootdir + '/test/assets/test_32.html');
    phantom.onLoadFinished();
});

casper.test.begin('Test #24', function (test) {
    // TODO: Make sure the variable phantom is clean and doesn't contain any previous data
    var phantom,
        resp;

    var params  = {
        idCrawler:       undefined,
        execId:          undefined,
        idRequest:       undefined,
        username:        undefined,
        password:        undefined,
        url:             'file://' + rootdir + '/test/assets/test_32.html',
        type:            'GET',
        data:            {},
        evt:             undefined,
        xPath:           undefined,
        storeDetails:    false,
        followRedirects: true,
        proxy:           '',
        sanitise:        false,
        config:          {
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
        }
    };

    var PhantomParser = require(srcdir + '/parser/phantom'),
        utils         = new (require(srcdir + '/utils'))({}),
        phantom;

    phantom = new PhantomParser(utils, {}, require('webpage').create(), params);
    phantom.reset();

    phantom.page.setContent(fs.read(rootdir + '/test/assets/test_24.html'), 'file://' + rootdir + '/test/assets/test_24.html');
    phantom.exit = function () {
        test.assertEquals(JSON.stringify(phantom.links), '{\"a\":[\"file:///home/fabio/c9/salmonjs/test/assets/test_24.html#whatever1\",\"file:///home/fabio/c9/salmonjs/test/assets/test_24.html#whatever2\"],\"link\":[],\"script\":[\"file:///home/fabio/c9/salmonjs/test/assets/test_24.html\"],\"meta\":[],\"form\":[],\"events\":[],\"mixed\":[]}');
        test.done();
    };
    phantom.evaluateAndParse();
});
