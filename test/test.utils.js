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
    srcdir   = fs.absolute('.') + (casper.cli.has('coverage') ? '/src-cov' : '/src');

casper.options.onPageInitialized = function () {
    casper.page.injectJs(srcdir + '/sha1.js');
    casper.page.injectJs(srcdir + '/events.js');
};

casper.on('remote.message', function (msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

casper.test.begin('serialise', function (test) {
    var Utils  = require(srcdir + '/utils'),
        crypto = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        utils;

    utils = new Utils(crypto);
    test.assertEquals(utils.serialise({}), '', 'encode entities properly');
    test.assertEquals(utils.serialise({a: 1, b: 2}), 'a=1&b=2', 'encode entities properly');
    test.assertEquals(utils.serialise([]), '', 'encode entities properly');
    test.assertEquals(utils.serialise(['a', 'b']), '0=a&1=b', 'encode entities properly');

    test.done();
});

casper.test.begin('serialise #2', function (test) {
    var Utils  = require(srcdir + '/utils'),
        crypto = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        utils;

    utils = new Utils(crypto);
    test.assertEquals(utils.serialise(''), '', 'doesn\'t process a string');
    test.assertEquals(utils.serialise('test'), '', 'doesn\'t process a string');

    test.done();
});

casper.test.begin('serialise #3', function (test) {
    var Utils  = require(srcdir + '/utils'),
        crypto = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        utils;

    utils = new Utils(crypto);
    test.assertEquals(utils.serialise(1), '', 'doesn\'t process an integer');
    test.assertEquals(utils.serialise(-1), '', 'doesn\'t process an integer');
    test.assertEquals(utils.serialise(0), '', 'doesn\'t process an integer');

    test.done();
});

casper.test.begin('sha1', function (test) {
    var Utils  = require(srcdir + '/utils'),
        crypto = {createHash: function () { return {update: function () { return {digest: function () { return 'fake'; }}; }}; }},
        utils;

    utils = new Utils(crypto);

    test.assertEquals(utils.sha1('test'), 'fake');

    test.done();
});

casper.test.begin('htmlEscape', function (test) {
    var Utils  = require(srcdir + '/utils'),
        crypto = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        utils,
        unescaped;

    utils = new Utils(crypto);

    test.assertEquals(utils.htmlEscape('&'), '&amp;', 'escape "ampersand" correctly');

    utils = new Utils(crypto);

    test.assertEquals(utils.htmlEscape('"'), '&quot;', 'escape "double quote" correctly');

    utils = new Utils(crypto);

    test.assertEquals(utils.htmlEscape('\''), '&#39;', 'escape "single quote" correctly');

    utils = new Utils(crypto);

    test.assertEquals(utils.htmlEscape('<'), '&lt;', 'escape "less than" correctly');

    utils = new Utils(crypto);

    test.assertEquals(utils.htmlEscape('>'), '&gt;', 'escape "greater than" correctly');

    utils = new Utils(crypto);

    unescaped = 'abcdefghijklmnopqrstuvwxyz0123456789\\|!£$%/()=?^[]{}@#;,:.-_+';
    test.assertEquals(utils.htmlEscape(unescaped), unescaped, 'doesn\'t escape anything else');

    test.done();
});

casper.test.begin('normaliseData', function (test) {
    var Utils  = require(srcdir + '/utils'),
        crypto = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        utils;

    // normaliseData
    utils = new Utils(crypto);

    test.assertEquals(utils.normaliseData('http://www.example.com/?%C3%A0=1'), {'à': '1'}, 'encodes correctly');
    test.assertEquals(utils.normaliseData('http://www.example.com/?a=%3D'), {a: '='}, 'encodes correctly');

    utils = new Utils(crypto);

    test.assertEquals(utils.normaliseData('http://www.example.com/?a=1&a=2'), {a: '2'}, 'removes duplicates');

    utils = new Utils(crypto);

    test.assertEquals(utils.normaliseData('http://www.example.com/?b=1&a=2'), {a: '2', b: '1'}, 'orders alphabetically');

    utils = new Utils(crypto);

    test.assertEquals(utils.normaliseData('http://www.example.com/?'), {}, 'returns empty array when input is not array');
    test.assertEquals(utils.normaliseData([]), {}, 'returns empty array when input is not array');
    test.assertEquals(utils.normaliseData({}), {}, 'returns empty array when input is not array');
    test.assertEquals(utils.normaliseData(1), {}, 'returns empty array when input is not array');

    test.done();
});

casper.test.begin('sleep', function (test) {
    var Utils  = require(srcdir + '/utils'),
        crypto = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        utils;

    utils = new Utils(crypto);

    var t = (new Date()).getTime();
    utils.sleep(100);
    test.assertTruthy((new Date()).getTime() - t >= 100, 'it waits for 100ms');
    utils.sleep(500);
    test.assertTruthy((new Date()).getTime() - t >= 500, 'it waits for 500ms');
    utils.sleep(1000);
    test.assertTruthy((new Date()).getTime() - t >= 1000, 'it waits for 1000ms');

    test.done();
});

casper.test.begin('onlyUnique', function (test) {
    var Utils  = require(srcdir + '/utils'),
        crypto = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        utils;

    utils = new Utils(crypto);

    test.assertEquals(utils.onlyUnique('unique', 0, ['unique']), true, 'returns true when the element is unique');
    test.assertEquals(utils.onlyUnique('unique', 0, ['unique', 'test']), true, 'returns true when the element is unique');
    test.assertEquals(utils.onlyUnique('test', 1, ['unique', 'test']), true, 'returns true when the element is unique');
    test.assertEquals(utils.onlyUnique('unique', 0, ['unique', 'unique']), true, 'returns true when the element is unique');

    utils = new Utils(crypto);

    test.assertEquals(utils.onlyUnique('unique', 1, ['unique', 'unique']), false, 'returns false when the element is not unique');
    test.assertEquals(utils.onlyUnique(undefined, 0, [undefined, 'unique', 'unique']), false, 'returns false when the element is not unique');

    test.done();
});

casper.test.begin('fireEventObject', function (test) {
    var Utils = require(srcdir + '/utils'),
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        utils;

    utils = new Utils(crypto);

    test.assertType(utils.fireEventObject({'event': 'click', xPath: 'window'}), 'customevent');

    test.assertEquals(utils.fireEventObject({'event': 'click', xPath: undefined}), undefined);

    test.done();
});

casper.test.begin('fireEventDOM', function (test) {
    var Utils = require(srcdir + '/utils'),
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        utils;

    utils = new Utils(crypto);

    window.eventContainer = {
        getElementByXpath: function() {
            return document.createElement('div');
        }
    };

    test.assertType(utils.fireEventDOM({'event': 'click', xPath: '//*'}), 'customevent');

    window.eventContainer = {
        getElementByXpath: function() {
            return undefined;
        }
    };

    test.assertEquals(utils.fireEventDOM({'event': 'click', xPath: undefined}), undefined);

    test.done();
});

casper.test.begin('arrayToQuery', function (test) {
    var Utils  = require(srcdir + '/utils'),
        crypto = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        utils;

    utils = new Utils(crypto);

    test.assertEquals(utils.arrayToQuery({}), '', 'works correctly');
    test.assertEquals(utils.arrayToQuery({a: 1}), 'a=1', 'works correctly');
    test.assertEquals(utils.arrayToQuery({a: 1, b: 2}), 'a=1&b=2', 'works correctly');
    test.assertEquals(utils.arrayToQuery({'&agrave;': 1}), '%26agrave%3B=1', 'works correctly');
    test.assertEquals(utils.arrayToQuery({'à': 1}), '%C3%A0=1', 'works correctly');

    utils = new Utils(crypto);

    test.assertEquals(utils.arrayToQuery({a: [1, 2]}), 'a%5B0%5D=1&a%5B1%5D=2', 'handles matrixes correctly');

    utils = new Utils(crypto);

    test.assertEquals(utils.arrayToQuery(1), '', 'returns empty string when input is not array');
    test.assertEquals(utils.arrayToQuery(''), '', 'returns empty string when input is not array');
    test.assertEquals(utils.arrayToQuery('test'), '', 'returns empty string when input is not array');

    test.done();
});

casper.test.begin('normaliseUrl', function (test) {
    var Utils  = require(srcdir + '/utils'),
        crypto = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        utils;

    utils = new Utils(crypto);

    test.assertEquals(utils.normaliseUrl('/?b=2', 'http://www.example.com/?a=1'), 'http://www.example.com/?b=2', 'strips querystring when baseUrl contains a querystring');

    utils = new Utils(crypto);

    test.assertEquals(utils.normaliseUrl('/#def', 'http://www.example.com/#abc'), 'http://www.example.com/#def', 'strips hash when baseUrl contains an hash');

    utils = new Utils(crypto);

    test.assertEquals(utils.normaliseUrl('/', 'http://www.example.com'), 'http://www.example.com/', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('/#', 'http://www.example.com'), 'http://www.example.com/#', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('/?param=value', 'http://www.example.com'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('/?param=value#', 'http://www.example.com'), 'http://www.example.com/?param=value#', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('/', 'http://www.example.com/#'), 'http://www.example.com/', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('/#', 'http://www.example.com/#'), 'http://www.example.com/#', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('/?param=value', 'http://www.example.com/#'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('/?param=value#', 'http://www.example.com/#'), 'http://www.example.com/?param=value#', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('/', 'http://www.example.com/?param=value'), 'http://www.example.com/', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('/#', 'http://www.example.com/?param=value'), 'http://www.example.com/#', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('/?param=value', 'http://www.example.com/?param=value'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('/?param=value#', 'http://www.example.com/?param=value'), 'http://www.example.com/?param=value#', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('?param=value', 'http://www.example.com/'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('?param=value', 'http://www.example.com/#'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('?param=value', 'http://www.example.com/?param=value'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('?param=value', 'http://www.example.com/?param=value#'), 'http://www.example.com/?param=value', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('#', 'http://www.example.com/'), 'http://www.example.com/#', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('#', 'http://www.example.com/#'), 'http://www.example.com/#', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('#', 'http://www.example.com/?param=value'), 'http://www.example.com/?param=value#', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('#', 'http://www.example.com/?param=value#'), 'http://www.example.com/?param=value#', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('', 'http://www.example.com/'), 'http://www.example.com/', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('http://www.example.com/', 'http://www.example.com/'), 'http://www.example.com/', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('http://www.example2.com/', 'http://www.example.com/'), undefined, 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('http://www.example.com/directory/', 'http://www.example.com/'), 'http://www.example.com/directory/', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('//www.example.com/directory', 'http://www.example.com/'), 'http://www.example.com/directory', 'convert properly other URLs');

    test.assertEquals(utils.normaliseUrl('/?b=2&a=1', 'http://www.example.com/'), 'http://www.example.com/?a=1&b=2', 'convert properly other URLs');
    test.assertEquals(utils.normaliseUrl('http://www.example.com/directory/#whatever', 'http://www.example.com/directory/#something'), 'http://www.example.com/directory/#whatever', 'convert properly other URLs');

    test.assertEquals(utils.normaliseUrl('http://www.example.com/directory2/#whatever', 'http://www.example.com/directory'), 'http://www.example.com/directory2/#whatever', 'convert properly other URLs');

    test.done();
});

casper.test.begin('parseINIString', function (test) {
    var Utils   = require(srcdir + '/utils'),
        crypto   = {createHash: function () { return {update: function () { return {digest: function () { return ''; }}; }}; }},
        utils   = new Utils(crypto),
        ini;

    utils = new Utils(crypto);

    ini = '; This is a sample configuration file';
    test.assertEquals(utils.parseINIString(ini), {});

    ini = '; This is a sample configuration file\n\n; This is a sample configuration file';
    test.assertEquals(utils.parseINIString(ini), {});

    ini = '[first_section]\none = 1\nfive = 5\nanimal = BIRD';
    test.assertEquals(utils.parseINIString(ini), {'first_section':{'one':'1','five':'5','animal':'BIRD'}});

    ini = '[second_section]\npath = "/usr/local/bin"\nURL = "http://www.example.com/~username"';
    test.assertEquals(utils.parseINIString(ini), {'second_section':{'path':'/usr/local/bin','URL':'http://www.example.com/~username'}});

    ini = '[third_section]\ncontainer[] = "1"\ncontainer[] = "2"\ncontainer[] = "3"\ncontainer[] = "4"';
    test.assertEquals(utils.parseINIString(ini), {'third_section':{'container':['1','2','3','4']}});

    ini = 'container[] = "1"\ncontainer[] = "2"\ncontainer[] = "3"\ncontainer[] = "4"';
    test.assertEquals(utils.parseINIString(ini), {'container':['1','2','3','4']});

    ini = 'global_value1 = 1\n[section1]\nkey = value';
    test.assertEquals(utils.parseINIString(ini), {'global_value1':'1','section1':{'key':'value'}});

    ini = '[first_section]\none = 1\n\nfive = 5\nanimal = BIRD';
    test.assertEquals(utils.parseINIString(ini), {'first_section':{'one':'1','five':'5','animal':'BIRD'}});

    test.done();
});
