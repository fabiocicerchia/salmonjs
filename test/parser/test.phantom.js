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
    srcdir   = fs.absolute('.') + (casper.cli.has('coverage') ? '/src-cov' : '/src'),
    fs       = require('fs'),
    glob     = require(srcdir + '/glob'),
    basePath = fs.absolute('.') + '/../test/assets/';

casper.options.onPageInitialized = function () {
    casper.page.injectJs(srcdir + '/sha1.js');
    casper.page.injectJs(srcdir + '/events.js');
};

casper.on('remote.message', function(msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

casper.test.begin('PhantomParser', function(test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config');

    // setUpPage
    var phantom = new PhantomParser(require('webpage').create());

    phantom.setUpPage();

    test.assertEquals(phantom.page.settings.resourceTimeout, config.parser.timeout, 'it has been set up properly');
    test.assertEquals(phantom.page.onResourceTimeout,        phantom.onResourceTimeout, 'it has been set up properly');
    test.assertEquals(phantom.page.onError,                  phantom.onError, 'it has been set up properly');
    test.assertEquals(phantom.page.onInitialized,            phantom.onInitialized, 'it has been set up properly');
    test.assertEquals(phantom.page.onResourceReceived,       phantom.onResourceReceived, 'it has been set up properly');
    test.assertEquals(phantom.page.onAlert,                  phantom.onAlert, 'it has been set up properly');
    test.assertEquals(phantom.page.onConfirm,                phantom.onConfirm, 'it has been set up properly');
    test.assertEquals(phantom.page.onPrompt,                 phantom.onPrompt, 'it has been set up properly');
    test.assertEquals(phantom.page.onConsoleMessage,         phantom.onConsoleMessage, 'it has been set up properly');

    /*
    // fireEventObject
    // TBD
    test.assertEquals(false, true);

    // fireEventDOM
    // TBD
    test.assertEquals(false, true);
    */

    // onOpen
    var phantom = new PhantomParser(require('webpage').create());
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
    test.assertEquals(phantom.page.navigationLocked, true);

    // onResourceTimeout
    var phantom = new PhantomParser(require('webpage').create());
    test.assertEquals(phantom.onResourceTimeout(), true);

    // onError
    var phantom = new PhantomParser(require('webpage').create());
    phantom.onError('error1');
    test.assertEquals(phantom.report.errors, ['ERROR: error1']);

    phantom.report.errors = [];
    phantom.onError('error2', [{file: 'file', line: 1}]);
    test.assertEquals(phantom.report.errors, ['ERROR: error2\nTRACE:\n -> file: 1']);

    phantom.report.errors = [];
    phantom.onError('error3', [{file: 'file', line: 1, function: 'test'}]);
    test.assertEquals(phantom.report.errors, ['ERROR: error3\nTRACE:\n -> file: 1 (in function "test")']);

    // onResourceReceived
    var phantom = new PhantomParser(require('webpage').create());
    phantom.onResourceReceived({stage: 'end', url: 'about:blank', headers: []});
    test.assertEquals(phantom.report.resources, { 'about:blank': { headers: [] } });

    // onAlert
    var phantom = new PhantomParser(require('webpage').create());
    phantom.onAlert('message');
    test.assertType(phantom.report.alerts, 'array');
    test.assertEquals(phantom.report.alerts, ['message']);

    // onConfirm
    var phantom = new PhantomParser(require('webpage').create());
    test.assertEquals(phantom.onConfirm('message'), true);
    test.assertType(phantom.report.confirms, 'array');
    test.assertEquals(phantom.report.confirms, ['message']);

    // onPrompt
    var phantom = new PhantomParser(require('webpage').create());
    test.assertEquals(phantom.onPrompt('message', ''), '');
    test.assertType(phantom.report.prompts, 'array');
    test.assertEquals(phantom.report.prompts, [{msg: 'message', defaultVal: ''}]);

    // onConsoleMessage
    var phantom = new PhantomParser(require('webpage').create());
    phantom.onConsoleMessage('message', 1, '');
    test.assertType(phantom.report.console, 'array');
    test.assertEquals(phantom.report.console, [{msg: 'message', lineNum: 1, sourceId: ''}]);

    /*
    // onLoadFinished
    // TBD
    test.assertEquals(false, true);

    // parsePage
    // TBD
    test.assertEquals(false, true);

    // onEvaluate
    // TBD
    test.assertEquals(false, true);
    */

    test.done();
});

casper.test.begin('PhantomParser Async', function(test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config');

    // parseGet
    var phantom = new PhantomParser(require('webpage').create());
    phantom.url = 'about:blank';
    phantom.data = '';
    phantom.onOpen = function() {};
    phantom.onLoadFinished = function() {
        test.done();
    };
    test.assertEquals(phantom.parseGet(), undefined);
});

casper.test.begin('PhantomParser Async #2', function(test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config');

    // parsePost
    var phantom = new PhantomParser(require('webpage').create());
    phantom.url = 'about:blank';
    phantom.data = {};
    phantom.onOpen = function() {};
    phantom.onLoadFinished = function() {
        test.done();
    };
    test.assertEquals(phantom.parsePost(), undefined);
});

/*
casper.test.begin('PhantomParser Async #3', function(test) {
    var PhantomParser = require(srcdir + '/parser/phantom'),
        config        = require(srcdir + '/config');

    // onInitialized
    var phantom = new PhantomParser(require('webpage').create());
    phantom.page.injectJs = function() {
        test.done();
    };
    test.assertEquals(phantom.onInitialized(), undefined);
});
*/