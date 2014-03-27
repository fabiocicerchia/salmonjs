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

var rootdir = require('path').resolve('.'),
    srcdir  = rootdir + (process.env.SALMONJS_COV ? '/src-cov' : '/src');

describe('parse', function() {
    it('parse', function (done) {
        var Parser = require(srcdir + '/parser'),
            parser;

        parser = new Parser();

        parser.parseGet   = function () { return 'GET'; };
        parser.initReport = function () {};

        expect(parser.parse('', 'GET', '', '', '')).toEqual('GET'); // 'parses a GET request'
        expect(parser.url).toEqual(''); // 'parses a GET request'
        expect(parser.type).toEqual('GET'); // 'parses a GET request'
        expect(parser.data).toEqual(''); // 'parses a GET request'
        expect(parser.event).toEqual(''); // 'parses a GET request'
        expect(parser.xPath).toEqual(''); // 'parses a GET request'

        expect(parser.parse('', 'GET', '', 'click', '/html/body')).toEqual('GET'); // 'parses a GET request'
        expect(parser.url).toEqual(''); // 'parses a GET request'
        expect(parser.type).toEqual('GET'); // 'parses a GET request'
        expect(parser.data).toEqual(''); // 'parses a GET request'
        expect(parser.event).toEqual('click'); // 'parses a GET request'
        expect(parser.xPath).toEqual('/html/body'); // 'parses a GET request'

        done();
    });
});
describe('parse2', function() {
    it('parse2', function (done) {
        var Parser = require(srcdir + '/parser'),
            parser;

        parser = new Parser();

        parser.parsePost  = function () { return 'POST'; };
        parser.initReport = function () {};

        expect(parser.parse('', 'POST', '', '', '')).toEqual('POST'); // 'parses a POST request'
        expect(parser.url).toEqual(''); // 'parses a POST request'
        expect(parser.type).toEqual('POST'); // 'parses a POST request'
        expect(parser.data).toEqual(''); // 'parses a POST request'
        expect(parser.event).toEqual(''); // 'parses a POST request'
        expect(parser.xPath).toEqual(''); // 'parses a POST request'

        done();
    });
});
describe('parse3', function() {
    it('parse3', function (done) {
        var Parser = require(srcdir + '/parser'),
            parser;

        parser = new Parser();

        parser.initReport = function () {};

        expect(parser.parse('', 'HEAD', '', '', '')).toEqual(undefined); // 'doesn\'t parse anything else'

        done();
    });
});
describe('initReport', function() {
    it('initReport', function (done) {
        var Parser = require(srcdir + '/parser'),
            parser;

        parser = new Parser();

        parser.type  = 'type';
        parser.event = 'event';
        parser.xPath = 'xPath';
        parser.data  = 'data';
        parser.initReport();

        expect(typeof parser.report.time.start).toEqual('number'); // 'sets up the report container'
        expect(parser.report.httpMethod).toEqual('type'); // 'sets up the report container'
        expect(parser.report.event).toEqual('event'); // 'sets up the report container'
        expect(parser.report.xPath).toEqual('xPath'); // 'sets up the report container'
        expect(parser.report.data).toEqual('data'); // 'sets up the report container'

        done();
    });
});
describe('parseGet', function() {
    it('parseGet', function (done) {
        var Parser = require(srcdir + '/parser'),
            parser,
            resp;

        parser = new Parser();
        resp   = parser.parseGet();

        expect(resp).toEqual(undefined); // 'doesn\'t do anything'

        done();
    });
});
describe('parsePost', function() {
    it('parsePost', function (done) {
        var Parser = require(srcdir + '/parser'),
            parser,
            resp;

        parser = new Parser();
        resp   = parser.parsePost();

        expect(resp).toEqual(undefined); // 'doesn\'t do anything'

        done();
    });
});
