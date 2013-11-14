/**
 *               __     __
 * .-----.-----.|__|.--|  |.-----.--.--.
 * |__ --|  _  ||  ||  _  ||  -__|  |  |
 * |_____|   __||__||_____||_____|___  |
 *       |__|                    |_____|
 *
 * SPIDEY v0.1.0
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

var fs       = require('fs'),
    glob     = require('../src/glob'),
    basePath = fs.absolute('.') + '/test/assets/';

casper.options.onPageInitialized = function () {
    casper.page.injectJs(basePath + '../../src/sha1.js');
    casper.page.injectJs(basePath + '../../src/events.js');
};

casper.on('remote.message', function(msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

casper.test.begin('Test', function(test) {
    var Test      = require('../src/test'),
        mainDir   = basePath + '../..',
        fsWrapper = new (require('../src/fs'))(fs),
        testObj   = new Test(fsWrapper, glob, mainDir);

    // create
    testObj.create('', 'test', {a: 1}, function() {
        var content;
        try {
            content = fs.read(mainDir + testObj.TEST_CASE_DIRECTORY + 'test.tst');
        } catch (err) {}

        test.assertEquals(content, undefined, 'doesn\'t create a file if url is empty');
    });

    testObj.create('http://www.example.com', '', {a: 1}, function() {
        var content;
        try {
            content = fs.read(mainDir + testObj.TEST_CASE_DIRECTORY + 'http___www_example_com/.tst');
        } catch (err) {}

        test.assertEquals(content, undefined, 'doesn\'t create a file if name is empty');
    });

    testObj = new Test(fsWrapper, glob, mainDir);
    testObj.create('http://www.example.com', 'test', {}, function() {
        var content;
        try {
            content = fs.read(mainDir + testObj.TEST_CASE_DIRECTORY + 'http___www_example_com/test.tst');
        } catch (err) {}

        test.assertEquals(content, undefined, 'doesn\'t create a file if data is empty');
    });

    testObj = new Test(fsWrapper, glob, mainDir);
    testObj.create('http://www.example.com', 'test', {a: 1, b: 2}, function() {
        var content;
        try {
            content = fs.read(mainDir + testObj.TEST_CASE_DIRECTORY + 'http___www_example_com/test.tst');
            fs.unlink(mainDir + testObj.TEST_CASE_DIRECTORY + 'http___www_example_com/test.tst');
        } catch (err) {}

        test.assertEquals(content, 'a=1\nb=2\n', 'creates a file if url, name and data is not empty');
    });

    // getCases
    testObj = new Test(fsWrapper, glob, mainDir);
    testObj.parseCase = function () { return {}; };

    test.assertEquals(testObj.getCases(''), [], 'doesn\'t return anything if there are no matches');
    test.assertEquals(testObj.getCases('non-existent'), [], 'doesn\'t return anything if there are no matches');

    fs.write(mainDir + testObj.TEST_CASE_DIRECTORY + 'http___www_example_com/test.tst', 'a=1\nb=2\n');
    testObj = new Test(fsWrapper, glob, mainDir);
    testObj.parseCase = function () { return {a: 1, b: 2}; };

    test.assertEquals(testObj.getCases('http___www_example_com'), [{a: 1, b: 2}], 'returns something if there are matches');
    fs.remove(mainDir + testObj.TEST_CASE_DIRECTORY + 'http___www_example_com/test.tst');

    // parseCase
    testObj = new Test(fsWrapper, glob, mainDir);
    test.assertEquals(testObj.parseCase('non-existent'), {}, 'doesn\'t parse a non existent file');

    testObj = new Test(fsWrapper, glob, mainDir);
    test.assertEquals(testObj.parseCase('empty-file'), {}, 'parses an empty file');

    testObj = new Test(fsWrapper, glob, mainDir);
    fs.write(mainDir + testObj.TEST_CASE_DIRECTORY + 'not-empty-file.tst', 'a=1\nb=2\n');
    test.assertEquals(testObj.parseCase(mainDir + testObj.TEST_CASE_DIRECTORY + 'not-empty-file.tst'), {a: '1', b: '2'}, 'parses a not empty file');
    fs.remove(mainDir + testObj.TEST_CASE_DIRECTORY + 'not-empty-file.tst');

    test.done();
});