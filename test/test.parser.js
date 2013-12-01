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

casper.test.begin('Parser', function (test) {
    var Parser = require(srcdir + '/parser'),
        parser,
        resp;

    // initReport
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

casper.test.begin('onlyUnique', function (test) {
    var Parser = require(srcdir + '/parser'),
        parser,
        resp;

    parser = new Parser();

    test.assertEquals(parser.onlyUnique('unique', 0, ['unique']), true, 'returns true when the element is unique');
    test.assertEquals(parser.onlyUnique('unique', 0, ['unique', 'test']), true, 'returns true when the element is unique');
    test.assertEquals(parser.onlyUnique('test', 1, ['unique', 'test']), true, 'returns true when the element is unique');
    test.assertEquals(parser.onlyUnique('unique', 0, ['unique', 'unique']), true, 'returns true when the element is unique');

    parser = new Parser();

    test.assertEquals(parser.onlyUnique('unique', 1, ['unique', 'unique']), false, 'returns false when the element is not unique');
    test.assertEquals(parser.onlyUnique(undefined, 0, [undefined, 'unique', 'unique']), false, 'returns false when the element is not unique');

    test.done();
});

casper.test.begin('normaliseData', function (test) {
    var Parser = require(srcdir + '/parser'),
        parser,
        resp;

    parser = new Parser();

    test.assertEquals(parser.normaliseData('http://www.example.com/?%C3%A0=1'), {'à': '1'}, 'encodes correctly');
    test.assertEquals(parser.normaliseData('http://www.example.com/?a=%3D'), {a: '='}, 'encodes correctly');

    parser = new Parser();

    test.assertEquals(parser.normaliseData('http://www.example.com/?a=1&a=2'), {a: '2'}, 'removes duplicates');

    parser = new Parser();

    test.assertEquals(parser.normaliseData('http://www.example.com/?b=1&a=2'), {a: '2', b: '1'}, 'orders alphabetically');

    parser = new Parser();

    test.assertEquals(parser.normaliseData('http://www.example.com/?'), {}, 'returns empty array when input is not array');
    test.assertEquals(parser.normaliseData([]), {}, 'returns empty array when input is not array');
    test.assertEquals(parser.normaliseData({}), {}, 'returns empty array when input is not array');
    test.assertEquals(parser.normaliseData(1), {}, 'returns empty array when input is not array');

    test.done();
});

casper.test.begin('arrayToQuery', function (test) {
    var Parser = require(srcdir + '/parser'),
        parser,
        resp;

    parser = new Parser();

    test.assertEquals(parser.arrayToQuery({}), '', 'works correctly');
    test.assertEquals(parser.arrayToQuery({a: 1}), 'a=1', 'works correctly');
    test.assertEquals(parser.arrayToQuery({a: 1, b: 2}), 'a=1&b=2', 'works correctly');
    test.assertEquals(parser.arrayToQuery({'&agrave;': 1}), '%26agrave%3B=1', 'works correctly');
    test.assertEquals(parser.arrayToQuery({'à': 1}), '%C3%A0=1', 'works correctly');

    parser = new Parser();

    test.assertEquals(parser.arrayToQuery({a: [1, 2]}), 'a%5B0%5D=1&a%5B1%5D=2', 'handles matrixes correctly');

    parser = new Parser();

    test.assertEquals(parser.arrayToQuery(1), '', 'returns empty string when input is not array');
    test.assertEquals(parser.arrayToQuery(''), '', 'returns empty string when input is not array');
    test.assertEquals(parser.arrayToQuery('test'), '', 'returns empty string when input is not array');

    test.done();
});

casper.test.begin('normaliseUrl', function (test) {
    var Parser = require(srcdir + '/parser'),
        parser,
        resp;

    parser = new Parser();

    test.assertEquals(parser.normaliseUrl('/?b=2', 'http://www.example.com/?a=1'), 'http://www.example.com/?b=2', 'strips querystring when baseUrl contains a querystring');

    parser = new Parser();

    test.assertEquals(parser.normaliseUrl('/#def', 'http://www.example.com/#abc'), 'http://www.example.com/#def', 'strips hash when baseUrl contains an hash');

    parser = new Parser();

    test.assertEquals(parser.normaliseUrl('/', 'http://www.example.com'), 'http://www.example.com/', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('/#', 'http://www.example.com'), 'http://www.example.com/#', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('/?param=value', 'http://www.example.com'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('/?param=value#', 'http://www.example.com'), 'http://www.example.com/?param=value#', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('/', 'http://www.example.com/#'), 'http://www.example.com/', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('/#', 'http://www.example.com/#'), 'http://www.example.com/#', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('/?param=value', 'http://www.example.com/#'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('/?param=value#', 'http://www.example.com/#'), 'http://www.example.com/?param=value#', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('/', 'http://www.example.com/?param=value'), 'http://www.example.com/', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('/#', 'http://www.example.com/?param=value'), 'http://www.example.com/#', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('/?param=value', 'http://www.example.com/?param=value'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('/?param=value#', 'http://www.example.com/?param=value'), 'http://www.example.com/?param=value#', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('?param=value', 'http://www.example.com/'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('?param=value', 'http://www.example.com/#'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('?param=value', 'http://www.example.com/?param=value'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('?param=value', 'http://www.example.com/?param=value#'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('#', 'http://www.example.com/'), 'http://www.example.com/#', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('#', 'http://www.example.com/#'), 'http://www.example.com/#', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('#', 'http://www.example.com/?param=value'), 'http://www.example.com/?param=value#', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('#', 'http://www.example.com/?param=value#'), 'http://www.example.com/?param=value#', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('', 'http://www.example.com/'), 'http://www.example.com/', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('http://www.example.com/', 'http://www.example.com/'), 'http://www.example.com/', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('http://www.example2.com/', 'http://www.example.com/'), undefined, 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('http://www.example.com/directory/', 'http://www.example.com/'), 'http://www.example.com/directory/', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('//www.example.com/directory', 'http://www.example.com/'), 'http://www.example.com/directory', 'convert properly other URLs');
    test.assertEquals(parser.normaliseUrl('//www.example.com/directory', 'https://www.example.com/'), 'https://www.example.com/directory', 'convert properly other URLs');

    test.done();
});