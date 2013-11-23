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


var casper   = casper || {},
    srcdir   = fs.absolute('.') + (casper.cli.has('coverage') ? '/src-cov' : '/src'),
    fs       = require('fs'),
    glob     = require(srcdir + '/glob'),
    basePath = fs.absolute('.') + '/../test/assets/';

casper.on('remote.message', function(msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

casper.test.begin('CasperParser', function(test, casper) {
    var CasperParser = require(srcdir + '/parser/casper'),
        config       = require(srcdir + '/config');

    // setUpPage
    var cloneCasper = require('casper').create();
    var casperObj = new CasperParser(cloneCasper);

    casperObj.setUpPage();

    test.assertEquals(casperObj.engine.resourceTimeout,            config.parser.timeout, 'it has been set up properly');
    test.assertEquals(casperObj.engine.options.onTimeout,          casperObj.onResourceTimeout, 'it has been set up properly');
    test.assertEquals(casperObj.engine.options.onError,            casperObj.onError, 'it has been set up properly');
    test.assertEquals(casperObj.engine.options.onPageInitialized,  casperObj.onInitialized, 'it has been set up properly');
    test.assertEquals(casperObj.engine.options.onResourceReceived, casperObj.onResourceReceived, 'it has been set up properly');
    test.assertEquals(casperObj.engine.options.onAlert,            casperObj.onAlert, 'it has been set up properly');
    //currentParser.engine.on('page.confirm',   currentParser.onConfirm);
    //currentParser.engine.on('page.prompt',    currentParser.onPrompt);
    //currentParser.engine.on('remote.message', currentParser.onConsoleMessage);

    /*
    // fireEventObject
    // TBD
    test.assertEquals(false, true);

    // fireEventDOM
    // TBD
    test.assertEquals(false, true);
    */

    // onOpen
    var cloneCasper = require('casper').create();
    var casperObj = new CasperParser(cloneCasper);
    casperObj.engine.start('about:blank', function() {});
    casperObj.onLoadFinished = function() { return 'OK'; }
    test.assertEquals(casperObj.onOpen(), 'OK');

    test.assertType(casperObj.report.time.start, 'number');
    test.assertType(casperObj.report.time.end, 'number');
    test.assertType(casperObj.report.time.total, 'number');
    //test.assertType(casperObj.page.navigationLocked, 'boolean');
    //test.assertEquals(casperObj.page.navigationLocked, false);

    // onResourceTimeout
    var cloneCasper = require('casper').create();
    var casperObj = new CasperParser(cloneCasper);
    test.assertEquals(casperObj.onResourceTimeout(), true);

    // onError
    var cloneCasper = require('casper').create();
    var casperObj = new CasperParser(cloneCasper);
    casperObj.onError('error1');
    test.assertEquals(casperObj.report.errors, ['ERROR: error1']);

    casperObj.report.errors = [];
    casperObj.onError('error2', [{file: 'file', line: 1}]);
    test.assertEquals(casperObj.report.errors, ['ERROR: error2\nTRACE:\n -> file: 1']);

    casperObj.report.errors = [];
    casperObj.onError('error3', [{file: 'file', line: 1, function: 'test'}]);
    test.assertEquals(casperObj.report.errors, ['ERROR: error3\nTRACE:\n -> file: 1 (in function "test")']);

    // onResourceReceived
    var cloneCasper = require('casper').create();
    var casperObj = new CasperParser(cloneCasper);
    casperObj.onResourceReceived({stage: 'end', url: 'about:blank', headers: []});
    test.assertEquals(casperObj.report.resources, { 'about:blank': { headers: [] } });

    // onAlert
    var cloneCasper = require('casper').create();
    var casperObj = new CasperParser(cloneCasper);
    casperObj.onAlert('message');
    test.assertType(casperObj.report.alerts, 'array');
    test.assertEquals(casperObj.report.alerts, ['message']);

    // onConfirm
    var cloneCasper = require('casper').create();
    var casperObj = new CasperParser(cloneCasper);
    test.assertEquals(casperObj.onConfirm('message'), true);
    test.assertType(casperObj.report.confirms, 'array');
    test.assertEquals(casperObj.report.confirms, ['message']);

    // onPrompt
    var cloneCasper = require('casper').create();
    var casperObj = new CasperParser(cloneCasper);
    test.assertEquals(casperObj.onPrompt('message', ''), '');
    test.assertType(casperObj.report.prompts, 'array');
    test.assertEquals(casperObj.report.prompts, [{msg: 'message', defaultVal: ''}]);

    // onConsoleMessage
    var cloneCasper = require('casper').create();
    var casperObj = new CasperParser(cloneCasper);
    casperObj.onConsoleMessage('message', 1, '');
    test.assertType(casperObj.report.console, 'array');
    test.assertEquals(casperObj.report.console, [{msg: 'message', lineNum: 1, sourceId: ''}]);

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

casper.test.begin('CasperParser Async', function(test) {
    var CasperParser = require(srcdir + '/parser/casper'),
        config       = require(srcdir + '/config');

    // parseGet
    var cloneCasper = require('casper').create();
    var casperObj = new CasperParser(cloneCasper);
    casperObj.setUpPage = function() {};
    casperObj.engine.start = function() {};
    casperObj.engine.run = function() {
        test.done();
    };
    casperObj.url = 'about:blank';
    casperObj.data = '';
    test.assertEquals(casperObj.parseGet(), undefined);
});

casper.test.begin('CasperParser Async #2', function(test) {
    var CasperParser = require(srcdir + '/parser/casper'),
        config       = require(srcdir + '/config');

    // parsePost
    var cloneCasper = require('casper').create();
    var casperObj = new CasperParser(cloneCasper);
    casperObj.setUpPage = function() {};
    casperObj.engine.start = function() {};
    casperObj.engine.run = function() {
        test.done();
    };
    casperObj.url = 'about:blank';
    casperObj.data = {};
    test.assertEquals(casperObj.parsePost(), undefined);
});

/*
casper.test.begin('CasperParser Async #3', function(test) {
    var CasperParser = require(srcdir + '/parser/casper'),
        config        = require(srcdir + '/config');

    // onInitialized
    var casperObj = new CasperParser(casper.page);
    casperObj.page.injectJs = function() {
        test.done();
    };
    test.assertEquals(casperObj.onInitialized(), undefined);
});
*/
