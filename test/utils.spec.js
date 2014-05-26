/**
 *               __                         _____ _______
 * .-----.---.-.|  |.--------.-----.-----._|     |     __|
 * |__ --|  _  ||  ||        |  _  |     |       |__     |
 * |_____|___._||__||__|__|__|_____|__|__|_______|_______|
 *
 * salmonJS v0.5.0
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
    srcdir  = rootdir + (process.env.SALMONJS_COV ? '/src-cov' : '/src'),
    chai    = require('chai'),
    expect  = chai.expect;

describe('serialise', function() {
    it('serialise', function (done) {
        var Utils  = require(srcdir + '/utils'),
            crypto = {},
            utils;

        utils = new Utils(crypto);
        expect(utils.serialise({})).to.equal(''); // encode entities properly
        expect(utils.serialise({a: 1, b: 2})).to.equal('a=1&b=2'); // encode entities properly
        expect(utils.serialise([])).to.equal(''); // encode entities properly
        expect(utils.serialise(['a', 'b'])).to.equal('0=a&1=b'); // encode entities properly

        done();
    });
});

describe('serialise2', function() {
    it('serialise2', function (done) {
        var Utils  = require(srcdir + '/utils'),
            crypto = {},
            utils;

        utils = new Utils(crypto);
        expect(utils.serialise('')).to.equal(''); // doesn\'t process a string
        expect(utils.serialise('test')).to.equal(''); // doesn\'t process a string

        done();
    });
});
describe('serialise3', function() {
    it('serialise3', function (done) {
        var Utils  = require(srcdir + '/utils'),
            crypto = {},
            utils;

        utils = new Utils(crypto);
        expect(utils.serialise(1)).to.equal(''); // doesn\'t process an integer
        expect(utils.serialise(-1)).to.equal(''); // doesn\'t process an integer
        expect(utils.serialise(0)).to.equal(''); // doesn\'t process an integer

        done();
    });
});
describe('sha1', function() {
    it('sha1', function (done) {
        var Utils  = require(srcdir + '/utils'),
            crypto = {createHash: function () { return {update: function () { return {digest: function () { return 'fake'; }}; }}; }},
            utils;

        utils = new Utils(crypto);

        expect(utils.sha1('test')).to.equal('fake');

        done();
    });
});
describe('htmlEscape', function() {
    it('htmlEscape', function (done) {
        var Utils  = require(srcdir + '/utils'),
            crypto = {},
            utils,
            unescaped;

        utils = new Utils(crypto);

        expect(utils.htmlEscape('&')).to.equal('&amp;'); // escape "ampersand" correctly

        utils = new Utils(crypto);

        expect(utils.htmlEscape('"')).to.equal('&quot;'); // escape "double quote" correctly

        utils = new Utils(crypto);

        expect(utils.htmlEscape('\'')).to.equal('&#39;'); // escape "single quote" correctly

        utils = new Utils(crypto);

        expect(utils.htmlEscape('<')).to.equal('&lt;'); // escape "less than" correctly

        utils = new Utils(crypto);

        expect(utils.htmlEscape('>')).to.equal('&gt;'); // escape "greater than" correctly

        utils = new Utils(crypto);

        unescaped = 'abcdefghijklmnopqrstuvwxyz0123456789\\|!£$%/()=?^[]{}@#;,:.-_+';
        expect(utils.htmlEscape(unescaped)).to.equal(unescaped); // doesn\'t escape anything else

        done();
    });
});
describe('normaliseData', function() {
    it('normaliseData', function (done) {
        var Utils  = require(srcdir + '/utils'),
            crypto = {},
            utils;

        // normaliseData
        utils = new Utils(crypto);

        expect(utils.normaliseData('http://www.example.com/?%C3%A0=1')).to.deep.equal({'à': '1'}); // encodes correctly
        expect(utils.normaliseData('http://www.example.com/?a=%3D')).to.deep.equal({a: '='}); // encodes correctly

        utils = new Utils(crypto);

        expect(utils.normaliseData('http://www.example.com/?a=1&a=2')).to.deep.equal({a: '2'}); // removes duplicates

        utils = new Utils(crypto);

        expect(utils.normaliseData('http://www.example.com/?b=1&a=2')).to.deep.equal({a: '2', b: '1'}); // orders alphabetically

        utils = new Utils(crypto);

        expect(utils.normaliseData('http://www.example.com/?')).to.deep.equal({}); // returns empty array when input is not array
        expect(utils.normaliseData([])).to.deep.equal({}); // returns empty array when input is not array
        expect(utils.normaliseData({})).to.deep.equal({}); // returns empty array when input is not array
        expect(utils.normaliseData(1)).to.deep.equal({}); // returns empty array when input is not array

        done();
    });
});
describe('sleep', function() {
    it('sleep', function (done) {
        var Utils  = require(srcdir + '/utils'),
            crypto = {},
            utils;

        utils = new Utils(crypto);

        var t = (new Date()).getTime();
        utils.sleep(100);
        expect((new Date()).getTime() - t >= 100).to.equal(true); // it waits for 100ms
        utils.sleep(500);
        expect((new Date()).getTime() - t >= 500).to.equal(true); // it waits for 500ms
        utils.sleep(1000);
        expect((new Date()).getTime() - t >= 1000).to.equal(true); // it waits for 1000ms

        done();
    });
});
describe('onlyUnique', function() {
    it('onlyUnique', function (done) {
        var Utils  = require(srcdir + '/utils'),
            crypto = {},
            utils;

        utils = new Utils(crypto);

        expect(utils.onlyUnique('unique', 0, ['unique'])).to.equal(true); // returns true when the element is unique
        expect(utils.onlyUnique('unique', 0, ['unique', 'test'])).to.equal(true); // returns true when the element is unique
        expect(utils.onlyUnique('test', 1, ['unique', 'test'])).to.equal(true); // returns true when the element is unique
        expect(utils.onlyUnique('unique', 0, ['unique', 'unique'])).to.equal(true); // returns true when the element is unique

        utils = new Utils(crypto);

        expect(utils.onlyUnique('unique', 1, ['unique', 'unique'])).to.equal(false); // returns false when the element is not unique
        expect(utils.onlyUnique(undefined, 0, [undefined, 'unique', 'unique'])).to.equal(false); // returns false when the element is not unique

        done();
    });
});
describe('fireEventObject', function() {
    it('not found', function (done) {
        var Utils = require(srcdir + '/utils'),
            crypto   = {},
            utils;

        utils = new Utils(crypto);

        window = {
            dispatchEvent: function () {},
            eventContainer: {
                getElementByXpath: function () {
                    return {
                        dispatchEvent: function () {}
                    };
                }
            }
        };
        document = {
            createEvent: function () {
                return {
                    initCustomEvent: function () {}
                };
            }
        };

        var type = typeof utils.fireEventDOM({'event': 'click', xPath: 'window'});
        expect(type === 'customevent' || type === 'object').to.equal(true);

        expect(utils.fireEventObject({'event': 'click', xPath: undefined})).to.equal(undefined);

        done();
    });
    it('found', function (done) {
        var Utils = require(srcdir + '/utils'),
            crypto   = {},
            utils;

        utils = new Utils(crypto);

        var evt = {
            initCustomEvent: function () {}
        };
        window = {
            dispatchEvent: function () {},
            eventContainer: {
                getElementByXpath: function () {
                    return {
                        dispatchEvent: function () {}
                    };
                }
            }
        };
        document = {
            createEvent: function () {
                return evt;
            }
        };

        var type = typeof utils.fireEventDOM({'event': 'click', xPath: 'window'});
        expect(type === 'customevent' || type === 'object').to.equal(true);

        expect(utils.fireEventObject({'event': 'click', xPath: 'window'})).to.deep.equal(evt);

        done();
    });
});
describe('fireEventDOM', function() {
    it('not found', function (done) {
        var Utils = require(srcdir + '/utils'),
            crypto   = {},
            utils;

        utils = new Utils(crypto);

        window = {};
        document = {
            createElement: function () {
                return {
                    dispatchEvent: function () {}
                };
            },
            createEvent: function () {
                return {
                    initCustomEvent: function () {}
                };
            }
        };
        window.eventContainer = {
            getElementByXpath: function() {
                return undefined;
            }
        };

        var type = typeof utils.fireEventDOM({'event': 'click', xPath: '//*'});
        expect(type).to.equal('undefined');

        window.eventContainer = {
            getElementByXpath: function() {
                return undefined;
            }
        };

        expect(utils.fireEventDOM({'event': 'click', xPath: undefined})).to.equal(undefined);

        done();
    });
    it('found', function (done) {
        var Utils = require(srcdir + '/utils'),
            crypto   = {},
            utils;

        utils = new Utils(crypto);

        window = {};
        document = {
            createElement: function () {
                return {
                    dispatchEvent: function () {}
                };
            },
            createEvent: function () {
                return {
                    initCustomEvent: function () {}
                };
            }
        };
        window.eventContainer = {
            getElementByXpath: function() {
                return document.createElement('div');
            }
        };

        var type = typeof utils.fireEventDOM({'event': 'click', xPath: '//*'});
        expect(type === 'customevent' || type === 'object').to.equal(true);

        window.eventContainer = {
            getElementByXpath: function() {
                return undefined;
            }
        };

        expect(utils.fireEventDOM({'event': 'click', xPath: '//div[0]'})).to.equal(undefined);

        done();
    });
});
describe('arrayToQuery', function() {
    it('arrayToQuery', function (done) {
        var Utils  = require(srcdir + '/utils'),
            crypto = {},
            utils;

        utils = new Utils(crypto);

        expect(utils.arrayToQuery({})).to.equal(''); // works correctly
        expect(utils.arrayToQuery({a: 1})).to.equal('a=1'); // works correctly
        expect(utils.arrayToQuery({a: 1, b: 2})).to.equal('a=1&b=2'); // works correctly
        expect(utils.arrayToQuery({'&agrave;': 1})).to.equal('%26agrave%3B=1'); // works correctly
        expect(utils.arrayToQuery({'à': 1})).to.equal('%C3%A0=1'); // works correctly

        utils = new Utils(crypto);

        expect(utils.arrayToQuery({a: [1, 2]})).to.equal('a%5B0%5D=1&a%5B1%5D=2'); // handles matrixes correctly

        utils = new Utils(crypto);

        expect(utils.arrayToQuery(1)).to.equal(''); // returns empty string when input is not array
        expect(utils.arrayToQuery('')).to.equal(''); // returns empty string when input is not array
        expect(utils.arrayToQuery('test')).to.equal(''); // returns empty string when input is not array

        done();
    });
});
describe('normaliseUrl', function() {
    it('normaliseUrl', function (done) {
        var Utils  = require(srcdir + '/utils'),
            crypto = {},
            utils;

        utils = new Utils(crypto);

        expect(utils.normaliseUrl('/?b=2', 'http://www.example.com/?a=1')).to.equal('http://www.example.com/?b=2'); // strips querystring when baseUrl contains a querystring

        utils = new Utils(crypto);

        expect(utils.normaliseUrl('/#def', 'http://www.example.com/#abc')).to.equal('http://www.example.com/#def'); // strips hash when baseUrl contains an hash

        utils = new Utils(crypto);

        expect(utils.normaliseUrl('/', 'http://www.example.com')).to.equal('http://www.example.com/'); // convert properly other URLs
        //expect(utils.normaliseUrl('/#', 'http://www.example.com')).to.equal('http://www.example.com/#'); // convert properly other URLs
        expect(utils.normaliseUrl('/?param=value', 'http://www.example.com')).to.equal('http://www.example.com/?param=value'); // convert properly other URLs
        //expect(utils.normaliseUrl('/?param=value#', 'http://www.example.com')).to.equal('http://www.example.com/?param=value#'); // convert properly other URLs
        expect(utils.normaliseUrl('/', 'http://www.example.com/#')).to.equal('http://www.example.com/'); // convert properly other URLs
        //expect(utils.normaliseUrl('/#', 'http://www.example.com/#')).to.equal('http://www.example.com/#'); // convert properly other URLs
        expect(utils.normaliseUrl('/?param=value', 'http://www.example.com/#')).to.equal('http://www.example.com/?param=value'); // convert properly other URLs
        //expect(utils.normaliseUrl('/?param=value#', 'http://www.example.com/#')).to.equal('http://www.example.com/?param=value#'); // convert properly other URLs
        expect(utils.normaliseUrl('/', 'http://www.example.com/?param=value')).to.equal('http://www.example.com/'); // convert properly other URLs
        //expect(utils.normaliseUrl('/#', 'http://www.example.com/?param=value')).to.equal('http://www.example.com/#'); // convert properly other URLs
        expect(utils.normaliseUrl('/?param=value', 'http://www.example.com/?param=value')).to.equal('http://www.example.com/?param=value'); // convert properly other URLs
        //expect(utils.normaliseUrl('/?param=value#', 'http://www.example.com/?param=value')).to.equal('http://www.example.com/?param=value#'); // convert properly other URLs
        expect(utils.normaliseUrl('?param=value', 'http://www.example.com/')).to.equal('http://www.example.com/?param=value'); // convert properly other URLs
        expect(utils.normaliseUrl('?param=value', 'http://www.example.com/#')).to.equal('http://www.example.com/?param=value'); // convert properly other URLs
        expect(utils.normaliseUrl('?param=value', 'http://www.example.com/?param=value')).to.equal('http://www.example.com/?param=value'); // convert properly other URLs
        expect(utils.normaliseUrl('?param=value', 'http://www.example.com/?param=value#')).to.equal('http://www.example.com/?param=value'); // convert properly other URLs
        //expect(utils.normaliseUrl('#', 'http://www.example.com/')).to.equal('http://www.example.com/#'); // convert properly other URLs
        //expect(utils.normaliseUrl('#', 'http://www.example.com/#')).to.equal('http://www.example.com/#'); // convert properly other URLs
        //expect(utils.normaliseUrl('#', 'http://www.example.com/?param=value')).to.equal('http://www.example.com/?param=value#'); // convert properly other URLs
        //expect(utils.normaliseUrl('#', 'http://www.example.com/?param=value#')).to.equal('http://www.example.com/?param=value#'); // convert properly other URLs
        expect(utils.normaliseUrl('', 'http://www.example.com/')).to.equal('http://www.example.com/'); // convert properly other URLs
        expect(utils.normaliseUrl('http://www.example.com/', 'http://www.example.com/')).to.equal('http://www.example.com/'); // convert properly other URLs
        expect(utils.normaliseUrl('http://www.example2.com/', 'http://www.example.com/')).to.equal(undefined); // convert properly other URLs
        expect(utils.normaliseUrl('http://www.example.com/directory/', 'http://www.example.com/')).to.equal('http://www.example.com/directory/'); // convert properly other URLs
        expect(utils.normaliseUrl('//www.example.com/directory', 'http://www.example.com/')).to.equal('http://www.example.com/directory'); // convert properly other URLs

        expect(utils.normaliseUrl('/?b=2&a=1', 'http://www.example.com/')).to.equal('http://www.example.com/?a=1&b=2'); // convert properly other URLs
        expect(utils.normaliseUrl('http://www.example.com/directory/#whatever', 'http://www.example.com/directory/#something')).to.equal('http://www.example.com/directory/#whatever'); // convert properly other URLs

        expect(utils.normaliseUrl('http://www.example.com/directory2/#whatever', 'http://www.example.com/directory')).to.equal('http://www.example.com/directory2/#whatever'); // convert properly other URLs

        expect(utils.normaliseUrl('./page.html', 'http://www.example.com/directory/index.html')).to.equal('http://www.example.com/directory/page.html'); // convert properly other URLs
        expect(utils.normaliseUrl('./page.html', 'http://www.example.com/directory/')).to.equal('http://www.example.com/directory/page.html'); // convert properly other URLs
        expect(utils.normaliseUrl('../page.html', 'http://www.example.com/directory/index.html')).to.equal('http://www.example.com/page.html'); // convert properly other URLs
        expect(utils.normaliseUrl('../page.html', 'http://www.example.com/directory/')).to.equal('http://www.example.com/page.html'); // convert properly other URLs
        expect(utils.normaliseUrl('../../page.html', 'http://www.example.com/directory/index.html')).to.equal('http://www.example.com/page.html'); // convert properly other URLs
        expect(utils.normaliseUrl('../../page.html', 'http://www.example.com/directory/')).to.equal('http://www.example.com/page.html'); // convert properly other URLs
        expect(utils.normaliseUrl('../../fake1/fake2/../../../../page.html', 'http://www.example.com/directory/index.html')).to.equal('http://www.example.com/page.html'); // convert properly other URLs
        expect(utils.normaliseUrl('../../fake1/fake2/../../../../page.html', 'http://www.example.com/directory/')).to.equal('http://www.example.com/page.html'); // convert properly other URLs

        done();
    });
});
describe('parseINIString', function() {
    it('parseINIString', function (done) {
        var Utils   = require(srcdir + '/utils'),
            crypto   = {},
            utils   = new Utils(crypto),
            ini;

        utils = new Utils(crypto);

        ini = '; This is a sample configuration file';
        expect(utils.parseINIString(ini)).to.deep.equal({});

        ini = '; This is a sample configuration file\n\n; This is a sample configuration file';
        expect(utils.parseINIString(ini)).to.deep.equal({});

        ini = '[first_section]\none = 1\nfive = 5\nanimal = BIRD';
        expect(utils.parseINIString(ini)).to.deep.equal({'first_section':{'one':'1','five':'5','animal':'BIRD'}});

        ini = '[second_section]\npath = "/usr/local/bin"\nURL = "http://www.example.com/~username"';
        expect(utils.parseINIString(ini)).to.deep.equal({'second_section':{'path':'/usr/local/bin','URL':'http://www.example.com/~username'}});

        ini = '[third_section]\ncontainer[] = "1"\ncontainer[] = "2"\ncontainer[] = "3"\ncontainer[] = "4"';
        expect(utils.parseINIString(ini)).to.deep.equal({'third_section':{'container':['1','2','3','4']}});

        ini = 'container[] = "1"\ncontainer[] = "2"\ncontainer[] = "3"\ncontainer[] = "4"';
        expect(utils.parseINIString(ini)).to.deep.equal({'container':['1','2','3','4']});

        ini = 'global_value1 = 1\n[section1]\nkey = value';
        expect(utils.parseINIString(ini)).to.deep.equal({'global_value1':'1','section1':{'key':'value'}});

        ini = '[first_section]\none = 1\n\nfive = 5\nanimal = BIRD';
        expect(utils.parseINIString(ini)).to.deep.equal({'first_section':{'one':'1','five':'5','animal':'BIRD'}});

        done();
    });
});
