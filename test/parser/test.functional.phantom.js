/**
 *               __                         _____ _______
 * .-----.---.-.|  |.--------.-----.-----._|     |     __|
 * |__ --|  _  ||  ||        |  _  |     |       |__     |
 * |_____|___._||__||__|__|__|_____|__|__|_______|_______|
 *
 * salmonJS v0.2.1
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
    rootdir  = fs.absolute('.'),
    srcdir   = rootdir + (casper.cli.has('coverage') ? '/src-cov' : '/src'),
    glob     = require(srcdir + '/glob'),
    basePath = fs.absolute('.') + '/../test/assets/';

casper.options.onPageInitialized = function () {
    casper.page.injectJs(srcdir + '/sha1.js');
    casper.page.injectJs(srcdir + '/events.js');
};

casper.on('remote.message', function (msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

// -----------------------------------------------------------------------------
// FUNCTIONAL TESTS ------------------------------------------------------------
// -----------------------------------------------------------------------------

if (casper.cli.options.post !== 'src/reporter/coverage.js') {
    casper.test.begin("Test #1", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_01.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, []);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #2", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_02.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_02.html#',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #3", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_03.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_03.html#',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #4", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_04.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_04.html#',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #5", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_05.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_05.html#',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #6", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_06.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_06.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_06.html#whatever2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #7", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_07.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_07.html#whatever1',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #8", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_08.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_08.html#whatever1',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #9", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_09.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_09.html#whatever1',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #10", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_10.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_10.html#whatever1',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #11", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_11.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_11.html#whatever1',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

//    casper.test.begin("Test #12", function (test) {
//        var phantom,
//            resp;
//
//        var params  = [
//            undefined,
//            undefined,
//            undefined,
//            undefined,
//            undefined,
//            'file://' + rootdir + '/test/assets/test_12.html',
//            'GET',
//            { POST: {}, CONFIRM: {} },
//            undefined,
//            undefined,
//            false,
//            false
//        ];
//        phantom = require('child_process').spawn('phantomjs', [
//            //'--debug=true',
//            srcdir + '/parser/phantom.js',
//            JSON.stringify(params)
//        ]);
//
//        phantom.stdout.on('data', function(data) {
//            if (data.toString().substr(0, 3) === '###') {
//                resp = JSON.parse(data.toString().substr(3));
//                test.assertEquals(resp.links.a, []);
//                test.done();
//            }
//        });
//        phantom.stderr.on('data', function(data) {
//            test.assertEquals(true, false);
//            test.done();
//        });
//    });

//    casper.test.begin("Test #13", function (test) {
//        var phantom,
//            resp;
//
//        var params  = [
//            undefined,
//            undefined,
//            undefined,
//            undefined,
//            undefined,
//            'file://' + rootdir + '/test/assets/test_13.html',
//            'GET',
//            { POST: {}, CONFIRM: {} },
//            undefined,
//            undefined,
//            false,
//            false
//        ];
//        phantom = require('child_process').spawn('phantomjs', [
//            //'--debug=true',
//            srcdir + '/parser/phantom.js',
//            JSON.stringify(params)
//        ]);
//
//        phantom.stdout.on('data', function(data) {
//            if (data.toString().substr(0, 3) === '###') {
//                resp = JSON.parse(data.toString().substr(3));
//                test.assertEquals(resp.links.a, []);
//                test.done();
//            }
//        });
//        phantom.stderr.on('data', function(data) {
//            test.assertEquals(true, false);
//            test.done();
//        });
//    });

    casper.test.begin("Test #14", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_14.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_14.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_14.html#whatever2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #15", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_15.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_15.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_15.html#whatever2',
                   'file://' + rootdir + '/test/assets/test_15.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #16", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_16.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_16.html?a=1&b=2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #17", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_17.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_17.html#',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #18", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_18.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_18.html', // TODO: Not totally correct
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #19", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_19.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, []);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #20", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_20.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, []);
                test.assertEquals(resp.links.meta, [
                   'file://' + rootdir + '/test/assets/test_20.html#'
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #21", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_21.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a.sort(), [
                   'file://' + rootdir + '/test/assets/test_21.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_21.html#whatever2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #22", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_22.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a.sort(), [
                   'file://' + rootdir + '/test/assets/test_22.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_22.html#whatever2',
                   'file://' + rootdir + '/test/assets/test_22.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #23", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_23.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a.sort(), [
                   'file://' + rootdir + '/test/assets/test_23.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_23.html#whatever2',
                   'file://' + rootdir + '/test/assets/test_23.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #24", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_24.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a.sort(), [
                   'file://' + rootdir + '/test/assets/test_24.html#whatever1',
                   'file://' + rootdir + '/test/assets/test_24.html#whatever2',
                   'file://' + rootdir + '/test/assets/test_24.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #25", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_25.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_25.html',
                   'file://' + rootdir + '/test/assets/test_25.html#whatever2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #25", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_25.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_25.html',
                   'file://' + rootdir + '/test/assets/test_25.html#whatever2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #25 #2", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_25.html',
            'GET',
            { POST: {}, CONFIRM: {"whatever": false} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_25.html',
                   'file://' + rootdir + '/test/assets/test_25.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #26", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_26.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever', 'whatever', 'whatever']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_26.html#whatever2'
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #26 #2", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_26.html',
            'GET',
            { POST: {}, CONFIRM: { "whatever": false } },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever', 'whatever', 'whatever']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_26.html#whatever3'
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #27", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_27.html',
            'GET',
            { POST: {}, CONFIRM: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_27.html#something',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #27 #2", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_27.html',
            'GET',
            { POST: {}, CONFIRM: { "whatever": true, "something": false} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_27.html#whatever2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #27 #3", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_27.html',
            'GET',
            { POST: {}, CONFIRM: { "whatever": false, "something": true} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_27.html#something2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #27 #4", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_27.html',
            'GET',
            { POST: {}, CONFIRM: { "whatever": false, "something": false} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.confirms, ['whatever', 'something','whatever', 'something', 'whatever', 'something']);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_27.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #28 #2", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_28.html',
            'GET',
            { POST: {}, CONFIRM: {}, PROMPT: { "whatever": 'aaa'} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.prompts, [{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''}]);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_28.html#whatever3',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #28", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_28.html',
            'GET',
            { POST: {}, CONFIRM: {}, PROMPT: { "whatever": ''} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.report.prompts, [{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''},{'msg':'whatever','defaultVal':''}]);
                test.assertEquals(resp.links.a, [
                   'file://' + rootdir + '/test/assets/test_28.html#something2',
                ]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #29", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_29.html',
            'GET',
            { POST: {}, HEADERS: {}, CONFIRM: {}, PROMPT: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, []);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    casper.test.begin("Test #30", function (test) {
        var phantom,
            resp;

        var params  = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'file://' + rootdir + '/test/assets/test_30.html',
            'GET',
            { POST: {}, COOKIE: { test: 1}, HEADERS: {}, CONFIRM: {}, PROMPT: {} },
            undefined,
            undefined,
            false,
            false
        ];
        phantom = require('child_process').spawn('phantomjs', [
            //'--debug=true',
            srcdir + '/parser/phantom.js',
            JSON.stringify(params)
        ]);

        phantom.stdout.on('data', function(data) {
            if (data.toString().substr(0, 3) === '###') {
                resp = JSON.parse(data.toString().substr(3));
                test.assertEquals(resp.links.a, []);
                test.assertEquals(resp.report.console, [{"msg":"test=1"}]);
                test.done();
            }
        });
        phantom.stderr.on('data', function(data) {
            test.assertEquals(true, false);
            test.done();
        });
    });

    if (require('system').env.TRAVIS !== 'true') {
        casper.test.begin("Upload", function (test) {
            var phantom,
                resp,
                nickname = 'salmonJS_' + Date.now();

            var params  = [
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                'http://imagebin.org/index.php?page=add',
                'POST',
                { POST: {image: '@' + rootdir + '/test/assets/pixel.gif', nickname: nickname, disclaimer_agree: 'Y', title: '', description: '', Submit: 'Submit', mode: 'add'} },
                undefined,
                undefined,
                false,
                true
            ];
            phantom = require('child_process').spawn('phantomjs', [
                //'--debug=true',
                srcdir + '/parser/phantom.js',
                JSON.stringify(params)
            ]);

            phantom.stdout.on('data', function(data) {
                if (data.toString().substr(0, 3) === '###') {
                    resp = JSON.parse(data.toString().substr(3));
                    test.assertEquals(resp.links.a, []);
                }
            });
            phantom.stderr.on('data', function(data) {
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
} else {
    test.done();
}
