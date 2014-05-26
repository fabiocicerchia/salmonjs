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
    fs      = require('fs'),
    WebPage = function () {
        this.content = '';
        this.url = '';
        this.settings = {};
        this.setContent = function(content, url) {
            this.content = content;
            this.url = url;
        };
        this.create = function () {
            return this;
        };
        this.evaluate = function (callback, args) {
            GLOBAL.document = {location: {}};
            return callback(args);
        };
    },
//    Phapper = require('phapper'),
    webpage = new WebPage(),
    chai    = require('chai'),
    expect  = chai.expect,
    oldLog  = console.log,
    lastMessage;

GLOBAL.webpage = webpage;
GLOBAL.system  = process;
console.log = function (message) {
    lastMessage = message;
    oldLog.apply(console, arguments);
};

jasmine.getEnv().defaultTimeoutInterval = 10000;

// -----------------------------------------------------------------------------
// FUNCTIONAL TESTS ------------------------------------------------------------
// -----------------------------------------------------------------------------
describe('test1', function () {
    it('test1', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_01.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test2', function () {
    it('test2', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_02.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    //'file://' + rootdir + '/test/assets/test_02.html#',
                    'file://' + rootdir + '/test/assets/test_02.html',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test3', function () {
    it('test3', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_03.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    //'file://' + rootdir + '/test/assets/test_03.html#',
                    'file://' + rootdir + '/test/assets/test_03.html',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test4', function () {
    it('test4', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_04.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    //'file://' + rootdir + '/test/assets/test_04.html#',
                    'file://' + rootdir + '/test/assets/test_04.html',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test5', function () {
    it('test5', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_05.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_05.html',
                    //'file://' + rootdir + '/test/assets/test_05.html#',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test6', function () {
    it('test6', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_06.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_06.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_06.html#whatever2',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test7', function () {
    it('test7', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_07.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_07.html#whatever1',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test8', function () {
    it('test8', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_08.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_08.html#whatever1',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test9', function () {
    it('test9', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_09.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_09.html#whatever1',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test10', function () {
    it('test10', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_10.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_10.html#whatever1',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test11', function () {
    it('test11', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_11.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_11.html#whatever1',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
//describe('test12', function () {
//    it('test12', function (done) {
//        var phantom,
//            resp,
//            params  = {
//                idCrawler:       undefined,
//                execId:          undefined,
//                idRequest:       undefined,
//                username:        undefined,
//                password:        undefined,
//                url:             'file://' + rootdir + '/test/assets/test_12.html',
//                type:            'GET',
//                data:            { POST: {}, CONFIRM: {} },
//                evt:             undefined,
//                xPath:           undefined,
//                storeDetails:    false,
//                followRedirects: false,
//                proxy:           '',
//                sanitise:        false,
//                config:          {
//                    redis: {
//                        port: 16379,
//                        hostname: '127.0.0.1'
//                    },
//                    logging: {
//                        level: 'debug', // Possible values: debug, info, warn, error.
//                        silent: false
//                    },
//                    parser: {
//                        interface: 'phantom', // PhantomJS: 'phantom'
//                        cmd: 'phantomjs',
//                        timeout: 5000 // Resource timeout in milliseconds.
//                    },
//                    crawler: {
//                        attempts: 5, // Number of tries before stop to execute the request.
//                        delay: 5000 // Delay between an attempt and another one in milliseconds.
//                    }
//                }
//            };
//        phantom = require('child_process').spawn('phantomjs', [
//            //'--debug=true',
//            srcdir + '/parser/phantom.js',
//            JSON.stringify(params)
//        ]);
//
//        phantom.stdout.on('data', function(data) {
//            if (data.toString().indexOf('###') > -1) {
//                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
//                expect(resp.links.a).to.deep.equal([]);
//                done();
//            }
//        });
//        phantom.stderr.on('data', function() {
//            expect(true).to.equal(false);
//            done();
//        });
//    });
//});
// TODO: Coverage broken
//describe('test13', function () {
//    it('test13', function (done) {
//        var phantom,
//            resp,
//            params  = {
//                idCrawler:       undefined,
//                execId:          undefined,
//                idRequest:       undefined,
//                username:        undefined,
//                password:        undefined,
//                url:             'file://' + rootdir + '/test/assets/test_13.html',
//                type:            'GET',
//                data:            { POST: {}, CONFIRM: {} },
//                evt:             undefined,
//                xPath:           undefined,
//                storeDetails:    false,
//                followRedirects: false,
//                proxy:           '',
//                sanitise:        false,
//                config:          {
//                    redis: {
//                        port: 16379,
//                        hostname: '127.0.0.1'
//                    },
//                    logging: {
//                        level: 'debug', // Possible values: debug, info, warn, error.
//                        silent: false
//                    },
//                    parser: {
//                        interface: 'phantom', // PhantomJS: 'phantom'
//                        cmd: 'phantomjs',
//                        timeout: 5000 // Resource timeout in milliseconds.
//                    },
//                    crawler: {
//                        attempts: 5, // Number of tries before stop to execute the request.
//                        delay: 5000 // Delay between an attempt and another one in milliseconds.
//                    }
//                }
//            };
//        phantom = require('child_process').spawn('phantomjs', [
//            //'--debug=true',
//            srcdir + '/parser/phantom.js',
//            JSON.stringify(params)
//        ]);
//
//        phantom.stdout.on('data', function(data) {
//            if (data.toString().indexOf('###') > -1) {
//                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
//                expect(resp.links.a).to.deep.equal([]);
//                done();
//            }
//        });
//        phantom.stderr.on('data', function() {
//            expect(true).to.equal(false);
//            done();
//        });
//    });
//});
describe('test14', function () {
    it('test14', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_14.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_14.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_14.html#whatever2',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test15', function () {
    it('test15', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_15.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_15.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_15.html#whatever2',
                    'file://' + rootdir + '/test/assets/test_15.html#whatever3',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test16', function () {
    it('test16', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_16.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_16.html?a=1&b=2',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test17', function () {
    it('test17', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_17.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_17.html',
                    //'file://' + rootdir + '/test/assets/test_17.html#',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test18', function () {
    it('test18', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_18.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_18.html', // TODO: Not totally correct
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test19', function () {
    it('test19', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_19.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test20', function () {
    it('test20', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_20.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([]);
                expect(resp.links.meta).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_20.html'
                    //'file://' + rootdir + '/test/assets/test_20.html#'
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test21', function () {
    it('test21', function (done) {
        var phantom,
        resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_21.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a.sort()).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_21.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_21.html#whatever2',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test22', function () {
    it('test22', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_22.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a.sort()).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_22.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_22.html#whatever2',
                    'file://' + rootdir + '/test/assets/test_22.html#whatever3',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test23', function () {
    it('test23', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_23.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a.sort()).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_23.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_23.html#whatever2',
                    'file://' + rootdir + '/test/assets/test_23.html#whatever3',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
// TODO: Coverage broken
describe('test24', function () {
    it('test24', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_24.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a.sort()).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_24.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_24.html#whatever2',
                    'file://' + rootdir + '/test/assets/test_24.html#whatever3',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test25', function () {
    it('test25', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_25.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.report.confirms).to.deep.equal(['whatever']);
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_25.html',
                    'file://' + rootdir + '/test/assets/test_25.html#whatever2',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test25_2', function () {
    it('test25_2', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_25.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.report.confirms).to.deep.equal(['whatever']);
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_25.html',
                    'file://' + rootdir + '/test/assets/test_25.html#whatever2',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test25_3', function () {
    it('test25_3', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_25.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {'whatever': false} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.report.confirms).to.deep.equal(['whatever']);
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_25.html',
                    'file://' + rootdir + '/test/assets/test_25.html#whatever3',
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test26', function () {
    it('test26', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_26.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.report.confirms).to.deep.equal(['whatever', 'whatever', 'whatever']);
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_26.html#whatever2'
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test26_2', function () {
    it('test26_2', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_26.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: { 'whatever': false } },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.report.confirms).to.deep.equal(['whatever', 'whatever', 'whatever']);
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_26.html#whatever3'
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test27', function () {
    it('test27', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_27.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.report.confirms).to.deep.equal(['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_27.html#something'
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test27_2', function () {
    it('test27_2', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_27.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: { 'whatever': true, 'something': false} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.report.confirms).to.deep.equal(['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_27.html#whatever2'
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test27_3', function () {
    it('test27_3', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_27.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: { 'whatever': false, 'something': true} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.report.confirms).to.deep.equal(['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_27.html#something2'
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test27_4', function () {
    it('test27_4', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_27.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: { 'whatever': false, 'something': false} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.report.confirms).to.deep.equal(['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_27.html#whatever3'
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test28_2', function () {
    it('test28_2', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_28.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {}, PROMPT: { 'whatever': 'aaa'} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.report.prompts).to.deep.equal([{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''}]);
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_28.html#whatever3'
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test28', function () {
    it('test28', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_28.html',
                type:            'GET',
                data:            { POST: {}, CONFIRM: {}, PROMPT: { 'whatever': ''} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.report.prompts).to.deep.equal([{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''}]);
                expect(resp.links.a).to.deep.equal([
                    'file://' + rootdir + '/test/assets/test_28.html#something2'
                ]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test29', function () {
    it('test29', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_29.html',
                type:            'GET',
                data:            { POST: {}, HEADERS: {}, CONFIRM: {}, PROMPT: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
describe('test30', function () {
    it('test30', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'file://' + rootdir + '/test/assets/test_30.html',
                type:            'GET',
                data:            { POST: {}, COOKIE: { test: 1}, HEADERS: {}, CONFIRM: {}, PROMPT: {} },
                evt:             undefined,
                xPath:           undefined,
                storeDetails:    false,
                followRedirects: false,
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                expect(resp.links.a).to.deep.equal([]);
                expect(resp.report.console).to.deep.equal([{'msg':'test=1'}]);
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});

describe('test31', function () {
    it('test31', function (done) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = new (require(srcdir + '/utils'))({}),
            content       = fs.readFileSync('test/assets/test_31.xml').toString(),
            phantom,
            resp;

        utils.onlyUnique = function() { return true; };
        utils.normaliseUrl = function(url) { return url; };
        phantom = new PhantomParser(utils, {}, webpage, { storeDetails: undefined});

        phantom.setUpPage = function(page) {
            page.onInitialized = function() {
            };
        };
        resp = phantom.cloneWebPage({content: content, url: 'http://www.example.com'});

        phantom.parsePage(resp);
        var json = JSON.parse(lastMessage.substr(3));
        expect(json.links.mixed_full).to.deep.equal(['http://www.w3.org/2005/Atom','http://example.org/feed/','http://example.org/','http://example.org/2003/12/13/atom03','http://example.org/2003/12/13/atom03.html','http://example.org/2003/12/13/atom03/edit',null]);
        done();
    });
});
// TODO: Something changed
//describe('upload', function () {
//    it('upload', function (done) {
//        var phantom,
//            resp,
//            nickname = Date.now(),
//            params  = {
//                idCrawler:       undefined,
//                execId:          undefined,
//                idRequest:       undefined,
//                username:        undefined,
//                password:        undefined,
//                url:             'http://imagebin.org/index.php?page=add',
//                type:            'POST',
//                data:            { POST: {image: '@' + rootdir + '/test/assets/pixel.gif', nickname: nickname, disclaimer_agree: 'Y', title: '', description: '', Submit: 'Submit', mode: 'add'} },
//                evt:             undefined,
//                xPath:           undefined,
//                storeDetails:    false,
//                followRedirects: true,
//                proxy:           '',
//                sanitise:        false,
//                config:          {
//                    redis: {
//                        port: 16379,
//                        hostname: '127.0.0.1'
//                    },
//                    logging: {
//                        level: 'debug', // Possible values: debug, info, warn, error.
//                        silent: false
//                    },
//                    parser: {
//                        interface: 'phantom', // PhantomJS: 'phantom'
//                        cmd: 'phantomjs',
//                        timeout: 5000 // Resource timeout in milliseconds.
//                    },
//                    crawler: {
//                        attempts: 5, // Number of tries before stop to execute the request.
//                        delay: 5000 // Delay between an attempt and another one in milliseconds.
//                    }
//                }
//            };
//        phantom = require('child_process').spawn('phantomjs', [
//            //'--debug=true',
//            srcdir + '/parser/phantom.js',
//            JSON.stringify(params)
//        ]);
//
//        phantom.stdout.on('data', function(data) {
//            if (data.toString().indexOf('###') > -1) {
//                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
//                expect(resp.links.a).to.deep.equal([]);
//            }
//        });
//        phantom.stderr.on('data', function() {
//            expect(true).to.equal(false);
//        });
//        phantom.on('exit', function() {
//            var phap    = new Phapper(rootdir + '/test/parser/body.js', [ 'http://imagebin.org/index.php' ]),
//                results = phap.runSync(),
//                output  = results.stdout.substr(0, results.stdout.length - 1);
//
//            expect(output.indexOf(nickname) > -1).to.equal(true);
//            done();
//        });
//    });
//});
describe('keepAlive', function () {
    it('keepAlive', function (done) {
        var phantom,
            resp,
            params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'http://www.example.com',
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
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().indexOf('###') > -1) {
                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
                var found = false;
                resp.report.resources['http://www.example.com/'].headers.forEach(function (item) {
                    if (item.name.toLowerCase() === 'connection') {
                        found = true;
                        expect(item.value.toLowerCase() === 'close').to.equal(false); // Connection set to keep-alive
                    }
                });
                if (found === false) {
                    expect(found).to.equal(false); // No Connection header was set (therefore the keep-alive is implicit)
                }
                done();
            }
        });
        phantom.stderr.on('data', function() {
            expect(true).to.equal(false);
            done();
        });
    });
});
//describe('gZip', function () {
//    it('gZip', function (done) {
//        var phantom,
//            resp,
//            params  = {
//                idCrawler:       undefined,
//                execId:          undefined,
//                idRequest:       undefined,
//                username:        undefined,
//                password:        undefined,
//                url:             'http://www.fabiocicerchia.it',
//                type:            'GET',
//                data:            {},
//                evt:             undefined,
//                xPath:           undefined,
//                storeDetails:    false,
//                followRedirects: true,
//                proxy:           '',
//                sanitise:        false,
//                config:          {
//                    redis: {
//                        port: 16379,
//                        hostname: '127.0.0.1'
//                    },
//                    logging: {
//                        level: 'debug', // Possible values: debug, info, warn, error.
//                        silent: false
//                    },
//                    parser: {
//                        interface: 'phantom', // PhantomJS: 'phantom'
//                        cmd: 'phantomjs',
//                        timeout: 5000 // Resource timeout in milliseconds.
//                    },
//                    crawler: {
//                        attempts: 5, // Number of tries before stop to execute the request.
//                        delay: 5000 // Delay between an attempt and another one in milliseconds.
//                    }
//                }
//            };
//        phantom = require('child_process').spawn('phantomjs', [
//            //'--debug=true',
//            srcdir + '/parser/phantom.js',
//            JSON.stringify(params)
//        ]);
//
//        var output = '';
//        phantom.stdout.on('data', function(data) {
//            output += data.toString();
//        });
//        phantom.stderr.on('data', function() {
//            expect(true).to.equal(false);
//            done();
//        });
//        phantom.on('exit', function () {
//            if (output.indexOf('###') > -1) {
//                resp = JSON.parse(output.substr(output.indexOf('###') + 3));
//                resp.report.resources['http://www.fabiocicerchia.it/'].headers.forEach(function (item) {
//                    if (item.name.toLowerCase() === 'content-encoding') {
//                        expect(item.value.toLowerCase() === 'gzip').to.equal(true); // Content Encoding is set to gzip
//                    }
//                });
//                done();
//            }
//        });
//    });
//});
//describe('sanitise', function () {
//    it('sanitise', function (done) {
//        var phantom,
//            resp,
//            params  = {
//                idCrawler:       undefined,
//                execId:          undefined,
//                idRequest:       undefined,
//                username:        undefined,
//                password:        undefined,
//                url:             'file://' + rootdir + '/test/assets/test_32.html',
//                type:            'GET',
//                data:            {},
//                evt:             undefined,
//                xPath:           undefined,
//                storeDetails:    false,
//                followRedirects: true,
//                proxy:           '',
//                sanitise:        true,
//                config:          {
//                    redis: {
//                        port: 16379,
//                        hostname: '127.0.0.1'
//                    },
//                    logging: {
//                        level: 'debug', // Possible values: debug, info, warn, error.
//                        silent: false
//                    },
//                    parser: {
//                        interface: 'phantom', // PhantomJS: 'phantom'
//                        cmd: 'phantomjs',
//                        timeout: 5000 // Resource timeout in milliseconds.
//                    },
//                    crawler: {
//                        attempts: 5, // Number of tries before stop to execute the request.
//                        delay: 5000 // Delay between an attempt and another one in milliseconds.
//                    }
//                }
//            };
//        phantom = require('child_process').spawn('phantomjs', [
//            //'--debug=true',
//            srcdir + '/parser/phantom.js',
//            JSON.stringify(params)
//        ]);
//
//        phantom.stdout.on('data', function(data) {
//            if (data.toString().indexOf('###') > -1) {
//                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
//                console.log(JSON.stringify(resp.report));
//                expect(resp.report.content).to.equal('<!DOCTYPE html><html><head>\n    <title></title>\n  </head>\n  <body>\n    <table>\n      <tbody>\n        <tr>\n          <td>\n            badly formatted html\n          </td>\n        </tr>\n      </tbody>\n    </table>\n  \n\n\n</body></html>');
//                done();
//            }
//        });
//        phantom.stderr.on('data', function() {
//            expect(true).to.equal(false);
//            done();
//        });
//
//        phantom.on('exit', function () {
//            done();
//        });
//    });
//});
// TODO: Broken because of htmltidy
//describe('cookie', function () {
//    it('get', function (done) {
//        var phantom,
//            resp,
//            params  = {
//                idCrawler:       undefined,
//                execId:          undefined,
//                idRequest:       undefined,
//                username:        undefined,
//                password:        undefined,
//                url:             'http://paxal.net/devel/cookies/get.php',
//                type:            'GET',
//                data:            {COOKIE:{ 'test': 1}},
//                evt:             undefined,
//                xPath:           undefined,
//                storeDetails:    false,
//                followRedirects: true,
//                proxy:           '',
//                sanitise:        true,
//                config:          {
//                    redis: {
//                        port: 16379,
//                        hostname: '127.0.0.1'
//                    },
//                    logging: {
//                        level: 'debug', // Possible values: debug, info, warn, error.
//                        silent: false
//                    },
//                    parser: {
//                        interface: 'phantom', // PhantomJS: 'phantom'
//                        cmd: 'phantomjs',
//                        timeout: 5000 // Resource timeout in milliseconds.
//                    },
//                    crawler: {
//                        attempts: 5, // Number of tries before stop to execute the request.
//                        delay: 5000 // Delay between an attempt and another one in milliseconds.
//                    }
//                }
//            };
//        phantom = require('child_process').spawn('phantomjs', [
//            //'--debug=true',
//            srcdir + '/parser/phantom.js',
//            JSON.stringify(params)
//        ]);
//
//        phantom.stdout.on('data', function(data) {
//            if (data.toString().indexOf('###') > -1) {
//                resp = JSON.parse(data.toString().substr(data.toString().indexOf('###') + 3));
//                expect(phantomParser.page.content.indexOf('This page did not receive any cookies')).to.equal(-1);
//                expect(phantomParser.page.content.indexOf('Number of cookies received: 0')).to.equal(-1);
//                test.notEqual(phantomParser.page.content.indexOf('Number of cookies received: 1'), -1);
//                done();
//            }
//        });
//        phantom.stderr.on('data', function() {
//            expect(true).to.equal(false);
//            done();
//        });
//
//        phantom.on('exit', function () {
//            done();
//        });
//    });
//    it('post', function (done) {
//        var PhantomParser = require(srcdir + '/parser/phantom'),
//            utils         = new (require(srcdir + '/utils'))(),
//            config        = {
//                redis: {
//                    port: 16379,
//                    hostname: '127.0.0.1'
//                },
//                logging: {
//                    level: 'debug', // Possible values: debug, info, warn, error.
//                    silent: false
//                },
//                parser: {
//                    interface: 'phantom', // PhantomJS: 'phantom'
//                    cmd: 'phantomjs',
//                    timeout: 5000 // Resource timeout in milliseconds.
//                },
//                crawler: {
//                    attempts: 5, // Number of tries before stop to execute the request.
//                    delay: 5000 // Delay between an attempt and another one in milliseconds.
//                }
//            },
//            phantomParser;
//
//        phantomParser = new PhantomParser(utils, {}, webpage, {config: config});
//        phantomParser.reset();
//
//        phantomParser.url = 'http://www.html-kit.com/tools/cookietester/';
//        phantomParser.type = 'POST';
//        phantomParser.setUpPage = function() { };
//        phantomParser.data = {COOKIE:{ 'test': 1}};
//        phantomParser.onLoadFinished = function () {
//            expect(phantomParser.page.content.indexOf('This page did not receive any cookies')).to.equal(-1);
//            expect(phantomParser.page.content.indexOf('Number of cookies received: 0')).to.equal(-1);
//            test.notEqual(phantomParser.page.content.indexOf('Number of cookies received: 1'), -1);
//            done();
//        };
//        expect(phantomParser.parsePost()).to.equal(undefined);
//    });
//});
