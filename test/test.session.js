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

__dirname = fs.workingDirectory + '/test';

casper.on('remote.message', function (msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

casper.test.begin('dump', function (test) {
    var fs     = new (require(srcdir + '/fs'))(require('fs')),
        client = {
            keys: function (key, callback) { callback(undefined, ['key1', 'key2']); },
            hgetall: function (key, callback) { callback(undefined, {sk1: 'test', sk2: 'test'}); }
        },
        zlib   = {gzip : function (data, callback) { callback(undefined, data); }},
        utils  = {},
        conf   = {},
        spawn  = function() {},
        os     = {},
        pool   = new (require(srcdir + '/pool'))(spawn, os),
        Session = require(srcdir + '/session'),
        session = new Session(client, fs, zlib, utils, conf, pool);

    session.dump(function () {
        test.assertEquals(fs.readFileSync(srcdir + '/../session.dmp'), '{"conf":{},"redis":{"key1":[{"sk1":"test","sk2":"test"}],"key2":[{"sk1":"test","sk2":"test"}]},"pool":{"size":10,"queue":[],"memoryThreshold":-1,"delay":1000}}');
        test.done();
    });
});

casper.test.begin('dump #2', function (test) {
    var fs     = new (require(srcdir + '/fs'))(require('fs')),
        client = {
            keys: function (key, callback) { callback('error', undefined); },
            hgetall: function (key, callback) { callback(undefined, {sk1: 'test', sk2: 'test'}); }
        },
        zlib   = {gzip : function (data, callback) { callback(undefined, data); }},
        utils  = {},
        conf   = {},
        spawn  = function() {},
        os     = {},
        pool   = new (require(srcdir + '/pool'))(spawn, os),
        Session = require(srcdir + '/session'),
        session = new Session(client, fs, zlib, utils, conf, pool);

    session.dump(function (err) {
        test.assertEquals(err, 'error', 'check if redis is failing properly');
        test.done();
    });
});

casper.test.begin('dump #3', function (test) {
    var fs     = new (require(srcdir + '/fs'))(require('fs')),
        client = {
            keys: function (key, callback) { callback(undefined, ['key1', 'key2']); },
            hgetall: function (key, callback) { callback('error2', undefined); }
        },
        zlib   = {gzip : function (data, callback) { callback(undefined, data); }},
        utils  = {},
        conf   = {},
        spawn  = function() {},
        os     = {},
        pool   = new (require(srcdir + '/pool'))(spawn, os),
        Session = require(srcdir + '/session'),
        session = new Session(client, fs, zlib, utils, conf, pool);

    session.dump(function (err) {
        test.assertEquals(err, 'error2', 'check if redis is failing properly');
        test.done();
    });
});

casper.test.begin('dump #4', function (test) {
    var fs     = new (require(srcdir + '/fs'))(require('fs')),
        client = {
            keys: function (key, callback) { callback(undefined, ['key1', 'key2']); },
            hgetall: function (key, callback) { callback(undefined, {sk1: 'test', sk2: 'test'}); }
        },
        zlib   = {gzip : function (data, callback) { callback('error3', undefined); }},
        utils  = {},
        conf   = {},
        spawn  = function() {},
        os     = {},
        pool   = new (require(srcdir + '/pool'))(spawn, os),
        Session = require(srcdir + '/session'),
        session = new Session(client, fs, zlib, utils, conf, pool);

    session.dump(function (err) {
        test.assertEquals(err, 'error3', 'check if gzip is failing properly');
        test.done();
    });
});

casper.test.begin('restore', function (test) {
    var fs     = new (require(srcdir + '/fs'))(require('fs')),
        client = {
            hset: function() {}
        },
        zlib   = {gunzip : function (data, callback) { callback(null, data); }},
        utils  = new (require(srcdir + '/utils'))({}),
        conf   = {},
        spawn  = function() {},
        os     = {},
        pool   = new (require(srcdir + '/pool'))(spawn, os),
        Session = require(srcdir + '/session'),
        session = new Session(client, fs, zlib, utils, conf, pool);

    fs.writeFileSync(srcdir + '/../session.dmp', '{"conf":{"w":20,"workers":20},"redis":{"key1":[{"sk1":"test","sk2":"test"}],"key2":[{"sk1":"test","sk2":"test"}]},"pool":{"size":20,"queue":[],"memoryThreshold":10,"delay":1000}}');

    session.restore(function (err, conf) {
        test.assertEquals(pool.size, 20);
        test.assertEquals(pool.queue, []);
        test.assertEquals(pool.memoryThreshold, 10);
        test.assertEquals(pool.delay, 1000);
        test.assertEquals(conf.workers, 20);

        test.done();
    });
});

casper.test.begin('restore #2', function (test) {
    var fs     = new (require(srcdir + '/fs'))(require('fs')),
        client = {
            hset: function() {}
        },
        zlib   = {gunzip : function (data, callback) { callback('error', undefined); }},
        utils  = new (require(srcdir + '/utils'))({}),
        conf   = {},
        spawn  = function() {},
        os     = {},
        pool   = new (require(srcdir + '/pool'))(spawn, os),
        Session = require(srcdir + '/session'),
        session = new Session(client, fs, zlib, utils, conf, pool);

    fs.writeFileSync(srcdir + '/../session.dmp', '{"conf":{"w":20,"workers":20},"redis":{"key1":[{"sk1":"test","sk2":"test"}],"key2":[{"sk1":"test","sk2":"test"}]},"pool":{"size":20,"queue":[],"memoryThreshold":10,"delay":1000}}');

    session.restore(function (err) {
        test.assertEquals(err, 'error', 'check if gzip is failing properly');

        test.done();
    });
});
