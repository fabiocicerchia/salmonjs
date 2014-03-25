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
    rootdir  = fs.absolute('.'),
    srcdir   = rootdir + (casper.cli.has('coverage') ? '/src-cov' : '/src');

casper.options.onPageInitialized = function () {
    casper.page.injectJs(srcdir + '/sha1.js');
    casper.page.injectJs(srcdir + '/events.js');
};

casper.on('remote.message', function (msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

var lastMessage, oldLog = console.log;
console.log = function (message) {
    lastMessage = message;
    oldLog.apply(console, arguments);
};

// -----------------------------------------------------------------------------
// FUNCTIONAL TESTS ------------------------------------------------------------
// -----------------------------------------------------------------------------

if (casper.cli.options.post !== 'src/reporter/coverage.js') {
    casper.test.begin('Test #1', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, []);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #2', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_02.html#',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #3', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_03.html#',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #4', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_04.html#',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #5', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_05.html#',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #6', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_06.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_06.html#whatever2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #7', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_07.html#whatever1',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #8', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_08.html#whatever1',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #9', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_09.html#whatever1',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #10', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_10.html#whatever1',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #11', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_11.html#whatever1',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #12', function (test) {
        var phantom,
            resp;

        var params  = {
            idCrawler:       undefined,
            execId:          undefined,
            idRequest:       undefined,
            username:        undefined,
            password:        undefined,
            url:             'file://' + rootdir + '/test/assets/test_12.html',
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
                test.assertEquals(resp.links.a, []);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    // TODO: Coverage broken
if (require('system').env.TRAVIS !== 'true') {
    casper.test.begin('Test #13', function (test) {
        var phantom,
            resp;

        var params  = {
            idCrawler:       undefined,
            execId:          undefined,
            idRequest:       undefined,
            username:        undefined,
            password:        undefined,
            url:             'file://' + rootdir + '/test/assets/test_13.html',
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
                test.assertEquals(resp.links.a, []);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });
}

    casper.test.begin('Test #14', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_14.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_14.html#whatever2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #15', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_15.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_15.html#whatever2',
                    'file://' + rootdir + '/test/assets/test_15.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #16', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_16.html?a=1&b=2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #17', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_17.html#',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #18', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_18.html', // TODO: Not totally correct
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #19', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, []);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #20', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, []);
                test.assertEquals(resp.links.meta, [
                    'file://' + rootdir + '/test/assets/test_20.html#'
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #21', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a.sort(), [
                    'file://' + rootdir + '/test/assets/test_21.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_21.html#whatever2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #22', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a.sort(), [
                    'file://' + rootdir + '/test/assets/test_22.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_22.html#whatever2',
                    'file://' + rootdir + '/test/assets/test_22.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #23', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a.sort(), [
                    'file://' + rootdir + '/test/assets/test_23.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_23.html#whatever2',
                    'file://' + rootdir + '/test/assets/test_23.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    // TODO: Coverage broken
    casper.test.begin('Test #24', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a.sort(), [
                    'file://' + rootdir + '/test/assets/test_24.html#whatever1',
                    'file://' + rootdir + '/test/assets/test_24.html#whatever2',
                    'file://' + rootdir + '/test/assets/test_24.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #25', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.report.confirms, ['whatever']);
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_25.html',
                    'file://' + rootdir + '/test/assets/test_25.html#whatever2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #25', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.report.confirms, ['whatever']);
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_25.html',
                    'file://' + rootdir + '/test/assets/test_25.html#whatever2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #25 #2', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.report.confirms, ['whatever']);
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_25.html',
                    'file://' + rootdir + '/test/assets/test_25.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #26', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.report.confirms, ['whatever', 'whatever', 'whatever']);
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_26.html#whatever2'
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #26 #2', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.report.confirms, ['whatever', 'whatever', 'whatever']);
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_26.html#whatever3'
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #27', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.report.confirms, ['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_27.html#something',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #27 #2', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.report.confirms, ['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_27.html#whatever2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #27 #3', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.report.confirms, ['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_27.html#something2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #27 #4', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.report.confirms, ['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_27.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #28 #2', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.report.prompts, [{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''}]);
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_28.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #28', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.report.prompts, [{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''}]);
                test.assertEquals(resp.links.a, [
                    'file://' + rootdir + '/test/assets/test_28.html#something2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #29', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, []);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #30', function (test) {
        var phantom,
            resp;

        var params  = {
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
                test.assertEquals(resp.links.a, []);
                test.assertEquals(resp.report.console, [{'msg':'test=1'}]);
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('Test #31', function (test) {
        var PhantomParser = require(srcdir + '/parser/phantom'),
            utils         = new (require(srcdir + '/utils'))({}),
            phantom,
            resp,
            content = fs.read('test/assets/test_31.xml');

        utils.onlyUnique = function() { return true; };
        utils.normaliseUrl = function(url) { return url; };
        phantom = new PhantomParser(utils, {}, require('webpage').create(), { storeDetails: undefined});

        phantom.setUpPage = function(page) {
            page.onInitialized = function() {
            };
        };
        resp = phantom.cloneWebPage({content: content, url: 'http://www.example.com'});

        phantom.parsePage(resp);
        var json = JSON.parse(lastMessage.substr(3));
        test.assertEquals(json.links.mixed, ['http://www.w3.org/2005/Atom','http://example.org/feed/','http://example.org/','http://example.org/2003/12/13/atom03','http://example.org/2003/12/13/atom03.html','http://example.org/2003/12/13/atom03/edit',null]);
        test.done();
    });

    if (require('system').env.TRAVIS !== 'true') {
        casper.test.begin('Upload', function (test) {
            var phantom,
                resp,
                nickname = Date.now();

            var params  = {
                idCrawler:       undefined,
                execId:          undefined,
                idRequest:       undefined,
                username:        undefined,
                password:        undefined,
                url:             'http://imagebin.org/index.php?page=add',
                type:            'POST',
                data:            { POST: {image: '@' + rootdir + '/test/assets/pixel.gif', nickname: nickname, disclaimer_agree: 'Y', title: '', description: '', Submit: 'Submit', mode: 'add'} },
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
                    test.assertEquals(resp.links.a, []);
                }
            });
            phantom.stderr.on('data', function() {
                test.assertEquals(true, false);
            });
            phantom.on('exit', function() {
                casper.start('http://imagebin.org/index.php', function() {
                    test.assertTextExists(nickname);
                }).run(function() {
                    test.done();
                });
            });
        });
    }

    casper.test.begin('Keep Alive', function (test) {
        var phantom,
            resp;

        var params  = {
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
                        test.assertEquals(item.value.toLowerCase() === 'close', false, 'Connection set to keep-alive');
                    }
                });
                if (found === false) {
                    test.assertEquals(found, false, 'No Connection header was set (therefore the keep-alive is implicit)');
                }
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin('GZip', function (test) {
        var phantom,
            resp;

        var params  = {
            idCrawler:       undefined,
            execId:          undefined,
            idRequest:       undefined,
            username:        undefined,
            password:        undefined,
            url:             'http://www.fabiocicerchia.it',
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

        var output = '';
        phantom.stdout.on('data', function(data) {
            output += data.toString();
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });
        phantom.on('exit', function () {
            if (output.indexOf('###') > -1) {
                resp = JSON.parse(output.substr(output.indexOf('###') + 3));
                resp.report.resources['http://www.fabiocicerchia.it/'].headers.forEach(function (item) {
                    if (item.name.toLowerCase() === 'content-encoding') {
                        test.assertEquals(item.value.toLowerCase() === 'gzip', true, 'Content Encoding is set to gzip');
                    }
                });
                test.done();
            }
        });
    });

if (require('system').env.TRAVIS !== 'true') {
    casper.test.begin('sanitise', function (test) {
        var phantom,
            resp;

        var params  = {
            idCrawler:       undefined,
            execId:          undefined,
            idRequest:       undefined,
            username:        undefined,
            password:        undefined,
            url:             'file://' + rootdir + '/test/assets/test_32.html',
            type:            'GET',
            data:            {},
            evt:             undefined,
            xPath:           undefined,
            storeDetails:    false,
            followRedirects: true,
            proxy:           '',
            sanitise:        true,
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
                test.assertEquals(resp.report.content, '<!DOCTYPE html><html><head>\n<title></title>\n</head>\n<body>\n<table>\n<tbody>\n<tr>\n<td>badly formatted html</td>\n</tr>\n</tbody>\n</table>\n\n\n\n</body></html>');
                test.done();
            }
        });
        phantom.stderr.on('data', function() {
            test.assertEquals(true, false);
            test.done();
        });

        phantom.on('exit', function () {
            test.done();
        });
    });
}
} else if (typeof test !== 'undefined') {
    test.done();
}
