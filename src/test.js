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

var fs   = require('fs');
var glob = require('glob');
require('path');

/**
 * Test Module
 *
 * TBW
 *
 * @module Test
 */
module.exports = function Test() {
    /**
     * Test case directory.
     *
     * @property TEST_CASE_DIRECTORY
     * @type {String}
     * @default "/../tests/cases/"
     */
    this.TEST_CASE_DIRECTORY = '/../tests/cases/';

    /**
     * Current instance.
     *
     * @property currentTest
     * @type {Object}
     * @default this
     */
    var currentTest = this;

    /**
     * Create test case file.
     *
     * @method create
     * @param  {String} The name of the test case.
     * @param  {String} The data of the test case.
     * @return undefined
     */
    this.create = function (name, data) {
        var content      = '',
            testCaseFile = __dirname + this.TEST_CASE_DIRECTORY + name + '.tst',
            k;

        for (k in data) {
            if (data.hasOwnProperty(k)) {
                content += k + '=' + data[k] + "\n";
            }
        }

        fs.mkdir(__dirname + this.TEST_CASE_DIRECTORY, '0777', function () {
            fs.writeFileSync(testCaseFile, content);
        });
    };

    /**
     * Returns a list of test cases based on the URL.
     *
     * @method getCases
     * @param  {String} The URL for the test cases.
     * @return {Object}
     */
    this.getCases = function (url) {
        var cases = [],
            files = glob.sync(__dirname + this.TEST_CASE_DIRECTORY + url + '*.tst');

        files.forEach(function (filename) {
            cases.push(currentTest.parseCase(filename));
        });

        return cases;
    };

    /**
     * Parse a test cases file to return the testing data to be used.
     *
     * @method parseCases
     * @param  {String} The test case file.
     * @return {Object}
     */
    this.parseCase = function (file) {
        var content = fs.readFileSync(file).toString(),
            lines   = content.split("\n"),
            data    = [],
            i,
            value;

        for (i in lines) {
            if (lines[i] !== '') {
                value = lines[i].split(/=/, 2);
                data[value[0]] = value[1];
            }
        }

        return data;
    };
};
