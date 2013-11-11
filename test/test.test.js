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
    should  = require('chai').should(),
    fs      = require('fs'),
    glob    = require('glob'),
    libpath = process.env['SPIDEY_COV'] ? '../src-cov' : '../src',
    Test    = require(libpath + '/test');

describe('Test', function() {
    describe('#create()', function() {
        it('doesn\'t create a file if name is empty', function() {
            var test = new Test(fs, glob);

            test.create('', {a: 1}, function() {
                var content;
                try {
                    content = fs.readFileSync(libpath + test.TEST_CASE_DIRECTORY + '.tst');
                } catch (err) {}

                assert.equal(content, undefined);
            });
        });

        it('doesn\'t create a file if data is empty', function() {
            var test = new Test(fs, glob);

            test.create('test', {}, function() {
                var content;
                try {
                    content = fs.readFileSync(libpath + test.TEST_CASE_DIRECTORY + 'test.tst');
                } catch (err) {}

                assert.equal(content, undefined);
            });
        });

        it('creates a file if name and data is not empty', function() {
            var test = new Test(fs, glob);

            test.create('test', {a: 1, b: 2}, function() {
                var content;
                try {
                    content = fs.readFileSync(__dirname + '/' + libpath + test.TEST_CASE_DIRECTORY + 'test.tst');
                    fs.unlinkSync(__dirname + '/' + libpath + test.TEST_CASE_DIRECTORY + 'test.tst');
                } catch (err) {}

                assert.equal(content, 'a=1\nb=2\n');
            });
        });
    });

    describe('#getCases()', function() {
        it('doesn\'t return anything if there are no matches', function() {
            var test = new Test(fs, glob);

            test.parseCase = function () { return {}; }

            test.getCases('').should.be.eql([]);
            test.getCases('non-existent').should.be.eql([]);
        });

        it('returns something if there are matches', function() {
            var test = new Test(fs, glob);

            test.parseCase = function () { return {a: 1, b: 2}; }

            fs.writeFileSync(__dirname + '/' + libpath + test.TEST_CASE_DIRECTORY + 'test.tst', 'a=1\nb=2\n');
            test.getCases('test').should.be.eql([{a: 1, b: 2}]);
            fs.unlinkSync(__dirname + '/' + libpath + test.TEST_CASE_DIRECTORY + 'test.tst');
        });
    });

    describe('#parseCase()', function() {
        it('doesn\'t parse a non existent file', function() {
            var test = new Test(fs, glob);

            test.parseCase('non-existent').should.be.eql({});
        });

        it('parses an empty file', function() {
            var test = new Test(fs, glob);

            test.parseCase('empty-file').should.be.eql({});
        });

        it('parses a not empty file', function() {
            var test = new Test(fs, glob);

            fs.writeFileSync(__dirname + '/' + libpath + test.TEST_CASE_DIRECTORY + 'not-empty-file.tst', 'a=1\nb=2\n');
            test.parseCase(__dirname + '/' + libpath + test.TEST_CASE_DIRECTORY + 'not-empty-file.tst').should.be.eql({a: '1', b: '2'});
            fs.unlinkSync(__dirname + '/' + libpath + test.TEST_CASE_DIRECTORY + 'not-empty-file.tst');
        });
    });
});
