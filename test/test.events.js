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
    srcdir   = fs.absolute('.') + (casper.cli.has('coverage') ? '/src-cov' : '/src'),
    glob     = require(srcdir + '/glob'),
    basePath = fs.absolute('.') + '/test/assets/';

casper.options.onPageInitialized = function () {
    casper.page.injectJs(srcdir + '/sha1.js');
    casper.page.injectJs(srcdir + '/events.js');

    casper.page.navigationLocked = true;
};

casper.on('remote.message', function (msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

casper.on('run.complete', function () {
    casper.page.navigationLocked = false;
});

// TEST #01 --------------------------------------------------------------------
casper.test.begin("Test #01", function (test) {
    casper.start(basePath + 'test_01.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{}',
            'it should returns 0 events'
        );
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #02 --------------------------------------------------------------------
casper.test.begin("Test #02", function (test) {
    casper.start(basePath + 'test_02.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{}',
            'it should returns 0 events'
        );
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #03 --------------------------------------------------------------------
casper.test.begin("Test #03", function (test) {
    casper.start(basePath + 'test_03.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{}',
            'it should returns 0 events'
        );
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #04 --------------------------------------------------------------------
casper.test.begin("Test #04", function (test) {
    casper.start(basePath + 'test_04.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]}}',
            'it should returns 1 event'
        ); // DOMContentLoaded is an extra, empty, one (added by jQuery).
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #05 --------------------------------------------------------------------
casper.test.begin("Test #05", function (test) {
    casper.start(basePath + 'test_05.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]}}',
            'it should returns 1 event'
        ); // DOMContentLoaded is an extra, empty, one (added by jQuery).
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #06 --------------------------------------------------------------------
casper.test.begin("Test #06", function (test) {
    casper.start(basePath + 'test_06.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]}}',
            'it should returns 1 event'
        ); // DOMContentLoaded is an extra, empty, one (added by jQuery).
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #07 --------------------------------------------------------------------
casper.test.begin("Test #07", function (test) {
    casper.start(basePath + 'test_07.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]}}',
            'it should returns 1 event'
        ); // DOMContentLoaded is an extra, empty, one (added by jQuery).
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #08 --------------------------------------------------------------------
casper.test.begin("Test #08", function (test) {
    casper.start(basePath + 'test_08.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]},\"click\":{\"25f2d6df4f2a30f29f6f80da1e95011044b0b8f7\":[\"/html/body/a\"]}}',
            'it should returns 2 events'
        ); // DOMContentLoaded is an extra, empty, one (added by jQuery).
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #09 --------------------------------------------------------------------
casper.test.begin("Test #09", function (test) {
    casper.start(basePath + 'test_09.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]},\"click\":{\"0fcab3502642850390405ad8bea30977d5bf5a5d\":[\"/html/body/a\"],\"25f2d6df4f2a30f29f6f80da1e95011044b0b8f7\":[\"/html/body/a\"]}}',
            'it should returns 3 events'
        ); // DOMContentLoaded is an extra, empty, one (added by jQuery).
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #10 --------------------------------------------------------------------
casper.test.begin("Test #10", function (test) {
    casper.start(basePath + 'test_10.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]},\"click\":{\"0fcab3502642850390405ad8bea30977d5bf5a5d\":[\"/html/body/div\"]}}',
            'it should returns 2 events'
        ); // DOMContentLoaded is an extra, empty, one (added by jQuery).
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #11 --------------------------------------------------------------------
casper.test.begin("Test #11", function (test) {
    casper.start(basePath + 'test_11.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]},\"click\":{\"0fcab3502642850390405ad8bea30977d5bf5a5d\":[\"/html/body/div\"]}}',
            'it should returns 2 events'
        ); // DOMContentLoaded is an extra, empty, one (added by jQuery).
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #12 --------------------------------------------------------------------
casper.test.begin("Test #12", function (test) {
    casper.start(basePath + 'test_12.html', function () {

        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]}}',
            'it should returns 1 event'
        ); // DOMContentLoaded is an extra, empty, one (added by jQuery).
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #13 --------------------------------------------------------------------
casper.test.begin("Test #13", function (test) {
    casper.start(basePath + 'test_13.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]}}',
            'it should returns 1 event'
        ); // DOMContentLoaded is an extra, empty, one (added by jQuery).
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #14 --------------------------------------------------------------------
casper.test.begin("Test #14", function (test) {
    casper.start(basePath + 'test_14.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"load\":{\"4c36f76234482bdc076deeaa345fb56943c2462e\":[\"/html/body\"]}}',
            'it should returns 1 event'
        );
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #15 --------------------------------------------------------------------
casper.test.begin("Test #15", function (test) {
    casper.start(basePath + 'test_15.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"],\"f328793b597cd5eb24778cf51365c6865b2805cd\":[\"/html/body\"]}}',
            'it should returns 2 events'
        ); // DOMContentLoaded is an extra, empty, one (added by jQuery).
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #16 --------------------------------------------------------------------
casper.test.begin("Test #16", function (test) {
    casper.start(basePath + 'test_16.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{}',
            'it should returns 0 events'
        );
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #17 --------------------------------------------------------------------
casper.test.begin("Test #17", function (test) {
    casper.start(basePath + 'test_17.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"click\":{\"8e3eb8cb110fe7b5d828aa2efe911ba0e83491dd\":[\"/html/body/a\"]}}',
            'it should returns 1 event'
        );
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #18 --------------------------------------------------------------------
casper.test.begin("Test #18", function (test) {
    casper.start(basePath + 'test_18.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]},\"click\":{\"46263e884ea4628bd628a94c115f92d57ea23d5c\":[\"/html/body/a\"]}}',
            'it should returns 2 events'
        ); // DOMContentLoaded is an extra, empty, one (added by jQuery).
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #19 --------------------------------------------------------------------
casper.test.begin("Test #19", function (test) {
    casper.start(basePath + 'test_19.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{}',
            'it should returns 0 events'
        );
    });

    casper.run(function () {
        test.done();
    });
});

// TEST #20 --------------------------------------------------------------------
casper.test.begin("Test #20", function (test) {
    casper.start(basePath + 'test_20.html', function () {
        test.assertEvalEquals(
            function () {
                return JSON.stringify(window.eventContainer.getEvents());
            },
            '{}',
            'it should returns 0 events'
        );
    });

    casper.run(function () {
        test.done();
    });
});
