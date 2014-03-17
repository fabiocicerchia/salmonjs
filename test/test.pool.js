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
    srcdir   = fs.absolute('.') + (casper.cli.has('coverage') ? '/src-cov' : '/src');

casper.on('remote.message', function (msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

casper.test.begin('addToQueue', function (test) {
    var Pool = require(srcdir + '/pool'),
        pool,
        spawn = function() {},
        os = {};

    __dirname = '';
    pool = new Pool(spawn, os);
    pool.processQueue = function () {};

    test.assertEquals(pool.addToQueue(), undefined);
    test.assertEquals(pool.queue, []);

    pool.addToQueue({}, {});
    test.assertEquals(pool.queue, []);

    pool.addToQueue({k1: 'v1'}, {});
    test.assertEquals(pool.queue, [{data: {k1: 'v1'}, options: {}}]);

    test.done();
});


casper.test.begin('processQueue', function (test) {
    var Pool = require(srcdir + '/pool'),
        pool,
        spawn = function() {
            return {
                stdout: { on:function () {}},
                stderr: { on:function () {}},
                on: function () { }
            };
        },
        os = {freemem: function() { return 100; }};

    __dirname = '';
    pool = new Pool(spawn, os);

    test.assertEquals(pool.processQueue(), undefined);
    test.assertEquals(pool.queue, []);

    pool.queue = [{data: {}, options: {}}];
    pool.size = 0;
    pool.processQueue();
    test.assertEquals(pool.queue, [{data: {}, options: {}}], 'check the queue is the same when the size is lower than the elements in queue');

    pool.queue = [{data: {}, options: {}}];
    pool.size = 1;
    pool.memoryThreshold = 10;
    pool.processQueue();
    test.assertEquals(pool.queue, [], 'check the memory threshold is not reached');

    pool.queue = [{options: {}}];
    pool.size = 10;
    pool.memoryThreshold = 10;
    pool.processQueue();
    test.assertEquals(pool.queue, [], 'check the queue item is invalid');

    spawn = function() {
        return {
            stdout: { on:function () {}},
            stderr: { on:function () {}},
            on: function (param, callback) { if (param ==='exit') { callback(); }}
        };
    };
    pool = new Pool(spawn, os);
    pool.queue = [{data: {}, options: { exit: function () { test.done(); }}}];
    pool.size = 10;
    pool.memoryThreshold = 10;
    pool.processQueue();
    test.assertEquals(pool.queue, [], 'check the queue item is process properly');
});
