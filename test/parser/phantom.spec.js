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
    srcdir  = rootdir + (process.env.SALMONJS_COV ? '/src-cov' : '/src'),
    WebPage = function () {
        var currentPage = this;
        this.settings = {};
        this.content = '';
        this.url = '';
        this.addCookie = function () {};
        this.clearCookies = function () {};
        this.onLoadFinished = function() {};
        this.injectJs = function () {};
        this.setContent = function(content, url) {
            this.content = content;
            this.url = url;
        };
        this.open = function (url, method, data, callback) {
            callback = callback || method;
            callback();
            currentPage.onInitialized();
            currentPage.onLoadFinished();
        };
        this.create = function () {
            return this;
        };
        this.evaluate = function (callback, args) {
            GLOBAL.document = {location: {}};
            return callback(args);
        };
        this.navigationLocked = false;
    },
    webpage = new WebPage(),
    chai    = require('chai'),
    expect  = chai.expect;

GLOBAL.btoa    = function () {};
GLOBAL.webpage = new WebPage();
GLOBAL.system  = process;
GLOBAL.phantom = {
    addCookie: function () {},
    clearCookies: function () {},
    exit: function () {}
};

describe('setUpPage', function () {
    it('setUpPage', function (done) {
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
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {config: config});
        phantomParser.reset();

        phantomParser.setUpPage(phantomParser.page);

        expect(phantomParser.page.settings.resourceTimeout).to.equal(config.parser.timeout); // it has been set up properly
        expect(phantomParser.page.onResourceTimeout).to.equal(phantomParser.onResourceTimeout); // it has been set up properly
        expect(phantomParser.page.onError).to.equal(phantomParser.onError); // it has been set up properly
        expect(phantomParser.page.onInitialized).to.equal(phantomParser.onInitialized); // it has been set up properly
        expect(phantomParser.page.onResourceReceived).to.equal(phantomParser.onResourceReceived); // it has been set up properly
        expect(phantomParser.page.onAlert).to.equal(phantomParser.onAlert); // it has been set up properly
        expect(phantomParser.page.onConfirm).to.equal(phantomParser.onConfirm); // it has been set up properly
        expect(phantomParser.page.onPrompt).to.equal(phantomParser.onPrompt); // it has been set up properly
        expect(phantomParser.page.onConsoleMessage).to.equal(phantomParser.onConsoleMessage); // it has been set up properly
        expect(phantomParser.page.onNavigationRequested).to.equal(phantomParser.onNavigationRequested); // it has been set up properly
        expect(phantomParser.page.viewportSize).to.deep.equal({ width: 1024, height: 800 }); // it has been set up properly
        expect(phantomParser.page.settings.userAgent).to.equal('salmonJS/0.4.0 (+http://www.salmonjs.org)'); // it has been set up properly

        done();
    });
});
describe('onOpen', function () {
    it('onOpen', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        phantomParser.onOpen('failure');

        expect(typeof phantomParser.report.time.start).to.equal('number');
        expect(typeof phantomParser.report.time.end).to.equal('number');
        expect(typeof phantomParser.report.time.total).to.equal('number');
        expect(typeof phantomParser.page.navigationLocked).to.equal('boolean');
        expect(phantomParser.page.navigationLocked).to.equal(false);

        phantomParser.onOpen('success');

        expect(typeof phantomParser.report.time.start).to.equal('number');
        expect(typeof phantomParser.report.time.end).to.equal('number');
        expect(typeof phantomParser.report.time.total).to.equal('number');
        expect(typeof phantomParser.page.navigationLocked).to.equal('boolean');
        expect(phantomParser.page.navigationLocked).to.equal(false);

        done();
    });
});
describe('onResourceTimeout', function () {
    it('onResourceTimeout', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        expect(phantomParser.onResourceTimeout()).to.equal(true);

        done();
    });
});
describe('onError', function () {
    it('onError', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        phantomParser.onError('error1');
        expect(phantomParser.report.errors).to.deep.equal(['ERROR: error1']);

        phantomParser.report.errors = [];
        phantomParser.onError('error2', [{file: 'file', line: 1}]);
        expect(phantomParser.report.errors).to.deep.equal(['ERROR: error2\nTRACE:\n -> file: 1']);

        phantomParser.report.errors = [];
        phantomParser.onError('error3', [{file: 'file', line: 1, function: 'test'}]);
        expect(phantomParser.report.errors).to.deep.equal(['ERROR: error3\nTRACE:\n -> file: 1 (in function "test")']);

        done();
    });
});
describe('onResourceReceived', function () {
    it('onResourceReceived', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        phantomParser.onResourceReceived({stage: 'end', url: 'about:blank', headers: []});
        expect(phantomParser.report.resources).to.deep.equal({ 'about:blank': { headers: [] } });

        done();
    });
});
describe('onAlert', function () {
    it('onAlert', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        phantomParser.onAlert('message');
        expect(Object.prototype.toString.call(phantomParser.report.alerts)).to.equal('[object Array]');
        expect(phantomParser.report.alerts).to.deep.equal(['message']);

        done();
    });
});
describe('onConfirm', function () {
    it('onConfirm', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        expect(phantomParser.onConfirm('message')).to.equal(true);
        expect(Object.prototype.toString.call(phantomParser.report.confirms)).to.equal('[object Array]');
        expect(phantomParser.report.confirms).to.deep.equal(['message']);

        done();
    });
});
describe('onConfirm2', function () {
    it('onConfirm2', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            settings      = {
                data: {
                    CONFIRM: {
                        message: false
                    }
                }
            },
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, settings);
        phantomParser.reset();

        phantomParser.report.confirms = []; // TODO: WHY?
        expect(phantomParser.onConfirm('message')).to.equal(false);
        expect(Object.prototype.toString.call(phantomParser.report.confirms)).to.equal('[object Array]');
        expect(phantomParser.report.confirms).to.deep.equal(['message']);

        done();
    });
});
describe('onPrompt', function () {
    it('onPrompt', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        expect(phantomParser.onPrompt('message', '')).to.equal('');
        expect(Object.prototype.toString.call(phantomParser.report.prompts)).to.equal('[object Array]');
        expect(phantomParser.report.prompts).to.deep.equal([{msg: 'message', defaultVal: ''}]);

        done();
    });
});
describe('onPrompt2', function () {
    it('onPrompt2', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            settings      = {
                data: {
                    PROMPT: {
                        message: 'value'
                    }
                }
            },
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, settings);
        phantomParser.reset();

        phantomParser.report.prompts = []; // TODO: WHY?
        expect(phantomParser.onPrompt('message', '')).to.equal('value');
        expect(Object.prototype.toString.call(phantomParser.report.prompts)).to.equal('[object Array]');
        expect(phantomParser.report.prompts).to.deep.equal([{msg: 'message', defaultVal: ''}]);

        done();
    });
});
describe('onConsoleMessage', function () {
    it('onConsoleMessage', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        phantomParser.onConsoleMessage('message', 1, '');
        console.log(JSON.stringify(phantomParser.report.console));
        expect(Object.prototype.toString.call(phantomParser.report.console)).to.equal('[object Array]');
        expect(phantomParser.report.console).to.deep.equal([{msg: 'message', lineNum: 1, sourceId: ''}]);

        done();
    });
});
describe('onLoadFinished', function () {
    it('onLoadFinished', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        phantomParser.parsePage = function () { done(); };
        phantomParser.onLoadFinished();
    });
});
describe('onLoadFinished2', function () {
    it('onLoadFinished2', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        phantomParser.stepStack = [{event: 'click', xPath: 'window'}];
        phantomParser.parsePage = function () { };
        phantomParser.page.evaluate = function () { done(); };
        phantomParser.onLoadFinished();
    });
});
describe('onLoadFinished3', function () {
    it('onLoadFinished3', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        phantomParser.stepStack = [{event: 'click', xPath: '/html/body'}];
        phantomParser.parsePage = function () { };
        phantomParser.page.evaluate = function () { done(); };
        phantomParser.onLoadFinished();
    });
});
describe('parsePage', function () {
    it('parsePage', function (done) {
        // TODO: TBD
        done();
    });
});
describe('onEvaluate', function () {
    it('onEvaluate', function (done) {
        // TODO: TBD
        done();
    });
});
describe('onEvaluateNonHtml', function () {
    it('onEvaluateNonHtml', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser,
            content,
            resp;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        content = 'http://username:password@hostname/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'http://hostname/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'http://username:password@127.0.0.1/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'http://127.0.0.1/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'https://username:password@hostname/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'https://hostname/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'https://username:password@127.0.0.1/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'https://127.0.0.1/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'ftp://username:password@hostname/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'ftp://hostname/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'ftp://username:password@127.0.0.1/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'ftp://127.0.0.1/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = '//username:password@hostname/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = '//hostname/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = '//username:password@127.0.0.1/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = '//127.0.0.1/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        //content = '/path?arg=value#anchor';
        //resp = phantomParser.onEvaluateNonHtml(content);
        //expect(resp).to.deep.equal({mixed:[content]});

        content = 'http://username:password@hostname:80/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'http://hostname:80/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'http://username:password@127.0.0.1:80/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'http://127.0.0.1:80/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'https://username:password@hostname:80/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'https://hostname:80/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'https://username:password@127.0.0.1:80/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'https://127.0.0.1:80/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'ftp://username:password@hostname:21/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'ftp://hostname:21/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'ftp://username:password@127.0.0.1:21/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = 'ftp://127.0.0.1:21/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = '//username:password@hostname:80/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = '//hostname:80/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = '//username:password@127.0.0.1:80/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        content = '//127.0.0.1:80/path?arg=value#anchor';
        resp = phantomParser.onEvaluateNonHtml(content);
        expect(resp).to.deep.equal({mixed:[content]});

        //content = '/path?arg=value#anchor';
        //resp = phantomParser.onEvaluateNonHtml(content);
        //expect(resp).to.deep.equal({mixed:[content]});

        done();
    });
});
describe('parseGet', function () {
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
        phantomParser;

    var done = false;
    var res;

    beforeEach(function(){
        done = false;

        function doStuff(){
            phantomParser = new PhantomParser(utils, {}, webpage, {config: config});
            phantomParser.reset();

            phantomParser.url = 'about:blank';
            phantomParser.data = '';
            phantomParser.onOpen = function () {
                setTimeout(phantomParser.onLoadFinished, 100);
            };
            phantomParser.onLoadFinished = function () {
                done = true;
            };
            res = phantomParser.parseGet();
        }

        runs(doStuff);

        waitsFor(function(){
            return done;
        });
    });

    it('parseGet', function () {
        expect(done).to.equal(true);
        expect(res).to.be.undefined;
    });
});
describe('parseGet2', function () {
    it('parseGet2', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = new (require(srcdir + '/utils'))(),
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        phantomParser.url = 'http://www.example.com/?c=1&a=2';
        phantomParser.data = {GET:{ a: 1, b: 2}, COOKIE: {}};
        phantomParser.setUpPage = function () {};
        phantomParser.onOpen = function () {};
        phantomParser.onLoadFinished = function () {};
        expect(phantomParser.parseGet()).to.be.undefined;
        expect(phantomParser.url).to.equal('http://www.example.com/?a=1&b=2&c=1');
        done();
    });
});
describe('parseGet3', function () {
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
        phantomParser;

    var done = false,
        res,
        customHeader;

    beforeEach(function(){
        done = false;

        function doStuff(){
            phantomParser = new PhantomParser(utils, {}, webpage, {config: config});
            phantomParser.reset();

            phantomParser.url = 'about:blank';
            phantomParser.data = {HEADERS:{ 'X-Test': 1}};
            phantomParser.onOpen = function () {
                setTimeout(phantomParser.onLoadFinished, 100);
            };
            phantomParser.onLoadFinished = function () {
                done = true;
            };
            res = phantomParser.parseGet();
            customHeader = phantomParser.page.customHeaders['X-Test'];
        }

        runs(doStuff);

        waitsFor(function(){
            return done;
        });
    });

    it('parseGet3', function () {
        expect(done).to.equal(true);
        expect(res).to.be.undefined;
        expect(customHeader).to.equal(1);
    });
});
describe('parsePost', function () {
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
        phantomParser;

    var done = false;
    var res;

    beforeEach(function(){
        done = false;

        function doStuff(){
            phantomParser = new PhantomParser(utils, {}, webpage, {config: config});
            phantomParser.reset();

            phantomParser.url = 'about:blank';
            phantomParser.data = '';
            phantomParser.onOpen = function () {
                setTimeout(phantomParser.onLoadFinished, 100);
            };
            phantomParser.onLoadFinished = function () {
                done = true;
            };
            res = phantomParser.parsePost();
        }

        runs(doStuff);

        waitsFor(function(){
            return done;
        });
    });

    it('parsePost', function () {
        expect(done).to.equal(true);
        expect(res).to.be.undefined;
    });
});
describe('parsePost2', function () {
    it('parsePost2', function (done) {
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
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {config: config});
        phantomParser.reset();

        phantomParser.url = 'http://www.example.com/?c=1&a=2';
        phantomParser.data = {GET:{ a: 1, b: 2}};
        phantomParser.onOpen = function () {};
        phantomParser.onLoadFinished = function () {};
        expect(phantomParser.parsePost()).to.be.undefined;
        expect(phantomParser.url).to.equal('http://www.example.com/?a=1&b=2&c=1');
        done();
    });
});
describe('parsePost3', function () {
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
        phantomParser;

    var done = false,
        res,
        customHeader;

    beforeEach(function(){
        done = false;

        function doStuff(){
            phantomParser = new PhantomParser(utils, {}, webpage, {config: config});
            phantomParser.reset();

            phantomParser.url = 'about:blank';
            phantomParser.data = {HEADERS:{ 'X-Test': 1}};
            phantomParser.onOpen = function () {
                setTimeout(phantomParser.onLoadFinished, 100);
            };
            phantomParser.onLoadFinished = function () {
                done = true;
            };
            res = phantomParser.parsePost();
            customHeader = phantomParser.page.customHeaders['X-Test'];
        }

        runs(doStuff);

        waitsFor(function(){
            return done;
        });
    });

    it('parsePost3', function () {
        expect(done).to.equal(true);
        expect(res).to.be.undefined;
        expect(customHeader).to.equal(1);
    });
});
describe('parsePost4', function () {
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
        phantomParser;

    var done = false;
    var res;

    beforeEach(function(){
        done = false;

        function doStuff(){
            phantomParser = new PhantomParser(utils, {}, webpage, {config: config});
            phantomParser.reset();

            phantomParser.url = 'http://www.example.com/?c=1&a=2';
            phantomParser.data = {POST:{ a: 1, b: 2, c: '@' + srcdir + '/../test/assets/test_01.html'}};
            phantomParser.onOpen = function () {
                setTimeout(phantomParser.onLoadFinished, 100);
            };
            phantomParser.onLoadFinished = function () {
                done = true;
            };
            res = phantomParser.parsePost();
        }

        runs(doStuff);

        waitsFor(function(){
            return done;
        });
    });

    it('parsePost4', function () {
        expect(done).to.equal(true);
        expect(res).to.be.undefined;
    });
});
describe('onInitialized', function () {
    it('onInitialized', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        var page = new WebPage();
        page.injectJs = function() {
            done();
        };
        expect(phantomParser.onInitialized(page)).to.be.undefined;
    });
});
describe('onNavigationRequested', function () {
    it('onNavigationRequested', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            settings      = {},
            phantomParser,
            resp;

        settings.followRedirects = false;
        phantomParser = new PhantomParser(utils, {}, webpage, settings);
        phantomParser.reset();

        phantomParser.url = 'about:blank';
        phantomParser.exit = function () { return true; };
        resp = phantomParser.onNavigationRequested('', '', '', '');
        expect(resp).to.equal(true);

        phantomParser.url = 'http://www.example.com';
        phantomParser.exit = function () { return true; };
        resp = phantomParser.onNavigationRequested('about:blank', '', '', '');
        expect(resp).to.be.undefined;

        phantomParser.url = 'http://www.example.com';
        phantomParser.exit = function () { return true; };
        resp = phantomParser.onNavigationRequested('http://www.example2.com', '', '', '');
        expect(resp).to.equal(true);

        phantomParser.url = 'http://www.example.com';
        phantomParser.exit = function () { return true; };
        resp = phantomParser.onNavigationRequested('http://www.example.com', '', '', '');
        expect(resp).to.be.undefined;

        done();
    });
});
describe('putPageInStack', function () {
    it('putPageInStack', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser,
            page;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        page = {data:{}, evaluate: function (a, b) { this.data = b; }};
        phantomParser.cloneWebPage = function() {
            return {data:{}, evaluate: function (a, b) { this.data = b; }};
        };

        page.data.event = '';
        page.data.xPath = '';
        phantomParser.putPageInStack('', '', '');
        expect(phantomParser.stackPages.length).to.equal(1);
        expect(phantomParser.stackPages[0].data).to.deep.equal(page.data);

        page = {data:{}, evaluate: function (a, b) { this.data = b; }};
        page.data.event = 'evt';
        page.data.xPath = 'xPath';
        phantomParser.stackPages = [];
        phantomParser.putPageInStack('', 'evt', 'xPath');
        expect(phantomParser.stackPages.length).to.equal(1);
        expect(phantomParser.stackPages[0].data).to.deep.equal(page.data);

        page = {data:{}, evaluate: function (a, b) { this.data = b; }};
        page.data.event = 'click';
        page.data.xPath = 'window';
        phantomParser.stackPages = [];
        phantomParser.putPageInStack('', 'click', 'window');
        expect(phantomParser.stackPages.length).to.equal(1);
        expect(phantomParser.stackPages[0].data).to.deep.equal(page.data);

        page = {data:{}, evaluate: function (a, b) { this.data = b; }};
        page.data.event = 'click';
        page.data.xPath = '/html/body';
        phantomParser.stackPages = [];
        phantomParser.putPageInStack('', 'click', '/html/body');
        expect(phantomParser.stackPages.length).to.equal(1);
        expect(phantomParser.stackPages[0].data).to.deep.equal(page.data);

        done();
    });
});
describe('cloneWebPage', function () {
    it('cloneWebPage', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser,
            settings      = {
                config: {
                    parser: {
                        timeout: 0
                    }
                }
            },
            resp;

        phantomParser = new PhantomParser(utils, {}, webpage, settings);
        phantomParser.reset();

        phantomParser.setUpPage = function(page) {
            page.onInitialized = function() {
            };
        };
        resp = phantomParser.cloneWebPage({content: '<html><head></head><body>content</body></html>', url: 'url'});
        expect(resp.content).to.equal('<html><head></head><body>content</body></html>');
        expect(resp.url).to.equal('url');
        done();
    });
});
// TODO: do it
describe('exit', function () {
    it('exit', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = {},
            phantomParser;

        phantomParser = new PhantomParser(utils, {}, webpage, {});
        phantomParser.reset();

        done();
    });
});
describe('sanitise', function () {
    it('sanitise', function (done) {
//    var phantomParser,
//        resp;
//
//    var params  = {
//        idCrawler:       undefined,
//        execId:          undefined,
//        idRequest:       undefined,
//        username:        undefined,
//        password:        undefined,
//        url:             'file://' + rootdir + '/test/assets/test_32.html',
//        type:            'GET',
//        data:            {},
//        evt:             undefined,
//        xPath:           undefined,
//        storeDetails:    false,
//        followRedirects: true,
//        proxy:           '',
//        sanitise:        true,
//        config:          {
//            redis: {
//                port: 16379,
//                hostname: '127.0.0.1'
//            },
//            logging: {
//                level: 'debug', // Possible values: debug, info, warn, error.
//                silent: false
//            },
//            parser: {
//                interface: 'phantom', // PhantomJS: 'phantom'
//                cmd: 'phantomjs',
//                timeout: 5000 // Resource timeout in milliseconds.
//            },
//            crawler: {
//                attempts: 5, // Number of tries before stop to execute the request.
//                delay: 5000 // Delay between an attempt and another one in milliseconds.
//            }
//        }
//    };
//
//    var PhantomParser = require(srcdir + '/parser/phantom'),
//        utils         = {},
//        phantomParser,
//        spawn         = function(cmd, args) {
//            var p = require('child_process').spawn(cmd, args);
//            var sanitisedHtml = '';
//
//            p.stdout.on('data', function(d) {
//                try { fs.remove(args[1]); } catch (ignore) {}
//                sanitisedHtml += d.toString();
//            });
//            p.stderr.on('data', function(d) {
//                try { fs.remove(args[1]); } catch (ignore) {}
//                console.log(d.toString());
//            });
//            p.on('exit', function(d) {
//                try { fs.remove(args[1]); } catch (ignore) {}
//
//                expect(sanitisedHtml).to.equal('\n<!DOCTYPE html>\n<html>\n<head>\n<title></title>\n</head>\n<body>\n<table>\n<tbody>\n<tr>\n<td>badly formatted html</td>\n</tr>\n</tbody>\n</table>\n</body>\n</html>\n\n');
//                done();
//            });
//
//            return {
//                stdout: { on:function(){}},
//                stderr: { on:function(){}},
//                on: function() { }
//            };
//        };
//
//    phantomParser = new PhantomParser(utils, spawn, webpage, params);
//    phantomParser.reset();
//
//    phantomParser.page.content = fs.read(rootdir + '/test/assets/test_32.html');
//    phantomParser.onLoadFinished();
        done();
    });
});
describe('test24', function () {
    it('test24', function (done) {
//    // TODO: Make sure the variable phantom is clean and doesn't contain any previous data
//    var phantomParser,
//        resp;
//
//    var params  = {
//        idCrawler:       undefined,
//        execId:          undefined,
//        idRequest:       undefined,
//        username:        undefined,
//        password:        undefined,
//        url:             'file://' + rootdir + '/test/assets/test_32.html',
//        type:            'GET',
//        data:            {},
//        evt:             undefined,
//        xPath:           undefined,
//        storeDetails:    false,
//        followRedirects: true,
//        proxy:           '',
//        sanitise:        false,
//        config:          {
//            redis: {
//                port: 16379,
//                hostname: '127.0.0.1'
//            },
//            logging: {
//                level: 'debug', // Possible values: debug, info, warn, error.
//                silent: false
//            },
//            parser: {
//                interface: 'phantom', // PhantomJS: 'phantom'
//                cmd: 'phantomjs',
//                timeout: 5000 // Resource timeout in milliseconds.
//            },
//            crawler: {
//                attempts: 5, // Number of tries before stop to execute the request.
//                delay: 5000 // Delay between an attempt and another one in milliseconds.
//            }
//        }
//    };
//
//    var PhantomParser = require(srcdir + '/parser/phantom'),
//        utils         = new (require(srcdir + '/utils'))({}),
//        phantomParser;
//
//    phantomParser = new PhantomParser(utils, {}, webpage, params);
//    phantomParser.reset();
//
//    phantomParser.page.setContent(fs.read(rootdir + '/test/assets/test_24.html'), 'file://' + rootdir + '/test/assets/test_24.html');
//    phantomParser.exit = function () {
//        expect(JSON.stringify(phantomParser.links)).to.equal('{\"a\":[\"file:///home/fabio/c9/salmonjs/test/assets/test_24.html#whatever1\",\"file:///home/fabio/c9/salmonjs/test/assets/test_24.html#whatever2\"],\"link\":[],\"script\":[\"file:///home/fabio/c9/salmonjs/test/assets/test_24.html\"],\"meta\":[],\"form\":[],\"events\":[],\"mixed\":[]}');
//        done();
//    };
//    phantomParser.evaluateAndParse();
        done();
    });
});
