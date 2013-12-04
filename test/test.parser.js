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

casper.test.begin('parse', function (test) {
    var Parser = require(srcdir + '/parser'),
        parser,
        resp;

    parser = new Parser();

    parser.parseGet   = function () { return 'GET'; };
    parser.initReport = function () {};

    test.assertEquals(parser.parse('', 'GET', '', '', ''), 'GET', 'parses a GET request');
    test.assertEquals(parser.url, '', 'parses a GET request');
    test.assertEquals(parser.type, 'GET', 'parses a GET request');
    test.assertEquals(parser.data, '', 'parses a GET request');
    test.assertEquals(parser.event, '', 'parses a GET request');
    test.assertEquals(parser.xPath, '', 'parses a GET request');

    test.assertEquals(parser.parse('', 'GET', '', 'click', '/html/body'), 'GET', 'parses a GET request');
    test.assertEquals(parser.url, '', 'parses a GET request');
    test.assertEquals(parser.type, 'GET', 'parses a GET request');
    test.assertEquals(parser.data, '', 'parses a GET request');
    test.assertEquals(parser.event, 'click', 'parses a GET request');
    test.assertEquals(parser.xPath, '/html/body', 'parses a GET request');

    test.done();
});

casper.test.begin('parse #2', function (test) {
    var Parser = require(srcdir + '/parser'),
        parser,
        resp;

    parser = new Parser();

    parser.parsePost  = function () { return 'POST'; };
    parser.initReport = function () {};

    test.assertEquals(parser.parse('', 'POST', '', '', ''), 'POST', 'parses a POST request');
    test.assertEquals(parser.url, '', 'parses a POST request');
    test.assertEquals(parser.type, 'POST', 'parses a POST request');
    test.assertEquals(parser.data, '', 'parses a POST request');
    test.assertEquals(parser.event, '', 'parses a POST request');
    test.assertEquals(parser.xPath, '', 'parses a POST request');

    test.done();
});

casper.test.begin('parse #3', function (test) {
    var Parser = require(srcdir + '/parser'),
        parser,
        resp;

    parser = new Parser();

    parser.initReport = function () {};

    test.assertEquals(parser.parse('', 'HEAD', '', '', ''), undefined, 'doesn\'t parse anything else');

    test.done();
});

casper.test.begin('initReport', function (test) {
    var Parser = require(srcdir + '/parser'),
        parser,
        resp;

    parser = new Parser();

    parser.type  = 'type';
    parser.event = 'event';
    parser.xPath = 'xPath';
    parser.data  = 'data';
    parser.initReport();

    test.assertType(parser.report.time.start, 'number', 'sets up the report container');
    test.assertEquals(parser.report.httpMethod, 'type', 'sets up the report container');
    test.assertEquals(parser.report.event, 'event', 'sets up the report container');
    test.assertEquals(parser.report.xPath, 'xPath', 'sets up the report container');
    test.assertEquals(parser.report.data, 'data', 'sets up the report container');

    test.done();
});

casper.test.begin('parseGet', function (test) {
    var Parser = require(srcdir + '/parser'),
        parser,
        resp;

    parser = new Parser();
    resp   = parser.parseGet();

    test.assertEquals(resp, undefined, 'doesn\'t do anything');

    test.done();
});

casper.test.begin('parsePost', function (test) {
    var Parser = require(srcdir + '/parser'),
        parser,
        resp;

    parser = new Parser();
    resp   = parser.parsePost();

    test.assertEquals(resp, undefined, 'doesn\'t do anything');

    test.done();
});
