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

var assert  = require('assert'),
    fs      = require('fs'),
    libpath = process.env['SPIDEY_COV'] ? '../src-cov' : '../src',
    Test    = require(libpath + '/test');

describe('Test', function() {
    describe('#create()', function() {
        it('doesn\'t create if name is empty', function() {
            var test = new Test();

            test.create('', {a: 1}, function() {
                var content;
                try {
                    content = fs.readFileSync(libpath + test.TEST_CASE_DIRECTORY + '.tst');
                } catch (err) {}

                assert.equal(content, undefined);
            });
        });

        it('doesn\'t create if data is empty', function() {
            var test = new Test();

            test.create('test', {}, function() {
                var content;
                try {
                    content = fs.readFileSync(libpath + test.TEST_CASE_DIRECTORY + '.tst');
                } catch (err) {}

                assert.equal(content, undefined);
            });
        });
    });

    describe('#getCases()', function() {
        it('TBD', function() {
            false.should.equal(true, 'TBD');
        });
    });

    describe('#parseCase()', function() {
        it('TBD', function() {
            false.should.equal(true, 'TBD');
        });
    });
});
