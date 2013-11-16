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
    glob     = require('../../src/glob'),
    basePath = fs.absolute('.') + '/../test/assets/';

casper.options.onPageInitialized = function () {
    casper.page.injectJs(basePath + '../../../src/sha1.js');
    casper.page.injectJs(basePath + '../../../src/events.js');
};

casper.on('remote.message', function(msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

casper.test.begin('PhantomParser', function(test) {
    var PhantomParser = require('../../src/parser/phantom'),
        config        = require('../../src/config');

    // setUpPage
    var phantom = new PhantomParser();

    //phantom.setUpPage();

    //test.assertEquals(phantom.page.settings.resourceTimeout, config.parser.timeout, 'it has been set up properly');
    //page.onResourceTimeout        = this.onResourceTimeout;
    //page.onError                  = this.onError;
    //page.onInitialized            = this.onInitialized;
    //page.onResourceReceived       = this.onResourceReceived;
    //page.onAlert                  = this.onAlert;
    //page.onConfirm                = this.onConfirm;
    //page.onPrompt                 = this.onPrompt;
    //page.onConsoleMessage         = this.onConsoleMessage;

/*
    // parseGet
    // TBD
    test.assertEquals(false, true);

    // parsePost
    // TBD
    test.assertEquals(false, true);

    // fireEventObject
    // TBD
    test.assertEquals(false, true);

    // fireEventDOM
    // TBD
    test.assertEquals(false, true);

    // onOpen
    // TBD
    test.assertEquals(false, true);

    // onResourceTimeout
    // TBD
    test.assertEquals(false, true);

    // onError
    // TBD
    test.assertEquals(false, true);

    // onInitialized
    // TBD
    test.assertEquals(false, true);

    // TODO: do it
    // onResourceReceived
    // TBD
    test.assertEquals(false, true);

    // TODO: do it
    // onAlert
    // TBD
    test.assertEquals(false, true);

    // TODO: do it
    // onConfirm
    // TBD
    test.assertEquals(false, true);

    // TODO: do it
    // onPrompt
    // TBD
    test.assertEquals(false, true);

    // TODO: do it
    // onConsoleMessage
    // TBD
    test.assertEquals(false, true);

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