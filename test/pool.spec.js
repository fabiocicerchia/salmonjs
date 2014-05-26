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

describe('addToQueue', function() {
    it('addToQueue', function (done) {
        var Pool = require(srcdir + '/pool'),
            pool,
            spawn = function() {},
            os = {};

        __dirname = '';
        pool = new Pool(spawn, os);
        pool.processQueue = function () {};

        expect(pool.addToQueue()).to.equal(undefined);
        expect(pool.queue).to.deep.equal([]);

        pool.addToQueue({}, {});
        expect(pool.queue).to.deep.equal([]);

        pool.addToQueue({k1: 'v1'}, {});
        expect(pool.queue).to.deep.equal([{data: {k1: 'v1'}}]);

        done();
    });
});
describe('processQueue', function() {
    it('processQueue', function (done) {
        var Pool = require(srcdir + '/pool'),
            pool,
            fork = function() {
                return {
                    send: function () { },
                    stdout: { on:function () {}},
                    stderr: { on:function () {}},
                    on: function (param, callback) { if (param ==='exit') { callback(); }}
                };
            },
            os = {freemem: function() { return 100; }};

        __dirname = '';
        pool = new Pool(os, {}, fork);

        expect(pool.processQueue()).to.equal(undefined);
        expect(pool.queue).to.deep.equal([]);

        pool.queue = [{data: {}}];
        pool.size = 0;
        pool.processQueue();
        expect(pool.queue).to.deep.equal([{data: {}}]); // check the queue is the same when the size is lower than the elements in queue

        pool.queue = [{data: {}}];
        pool.size = 1;
        pool.memoryThreshold = 10;
        pool.processQueue();
        expect(pool.queue).to.deep.equal([]); // check the memory threshold is not reached

        pool.queue = [{data: {}}];
        pool.size = 10;
        pool.memoryThreshold = 10;
        pool.processQueue();
        expect(pool.queue).to.deep.equal([]); // check the queue item is invalid

        pool = new Pool(os, {}, fork);
        pool.queue = [{data: {}}];
        pool.size = 10;
        pool.memoryThreshold = 10;
        pool.processQueue();
        expect(pool.queue).to.deep.equal([]); // check the queue item is process properly

        done();
    });
});
