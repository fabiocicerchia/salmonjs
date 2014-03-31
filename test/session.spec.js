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

var rootdir = require('path').resolve('.'),
    srcdir  = rootdir + (process.env.SALMONJS_COV ? '/src-cov' : '/src'),
    chai    = require('chai'),
    expect  = chai.expect;

describe('dump', function() {
    it('dump', function (done) {
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
            expect(fs.readFileSync(srcdir + '/../session.dmp').toString()).to.equal('{"conf":{},"redis":{"key1":[{"sk1":"test","sk2":"test"}],"key2":[{"sk1":"test","sk2":"test"}]},"pool":{"size":10,"queue":[],"memoryThreshold":-1,"delay":1000}}');
            done();
        });
    });
});
describe('dump2', function() {
    it('dump2', function (done) {
        var fs     = new (require(srcdir + '/fs'))(require('fs')),
            client = {
                keys: function (key, callback) { callback('error', undefined); }
            },
            zlib   = {},
            utils  = {},
            conf   = {},
            spawn  = function() {},
            os     = {},
            pool   = new (require(srcdir + '/pool'))(spawn, os),
            Session = require(srcdir + '/session'),
            session = new Session(client, fs, zlib, utils, conf, pool);

        session.dump(function (err) {
            expect(err).to.equal('error'); // check if redis is failing properly
            done();
        });
    });
});
describe('dump3', function() {
    it('dump3', function (done) {
        var fs     = new (require(srcdir + '/fs'))(require('fs')),
            client = {
                keys: function (key, callback) { callback(undefined, ['key1', 'key2']); },
                hgetall: function (key, callback) { callback('error2', undefined); }
            },
            zlib   = {},
            utils  = {},
            conf   = {},
            spawn  = function() {},
            os     = {},
            pool   = new (require(srcdir + '/pool'))(spawn, os),
            Session = require(srcdir + '/session'),
            session = new Session(client, fs, zlib, utils, conf, pool);

        session.dump(function (err) {
            expect(err).to.equal('error2'); // check if redis is failing properly
            done();
        });
    });
});
describe('dump4', function() {
    it('dump4', function (done) {
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
            expect(err).to.equal('error3'); // check if gzip is failing properly
            done();
        });
    });
});
describe('restore', function() {
    it('restore', function (done) {
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
            expect(pool.size).to.equal(20);
            expect(pool.queue).to.deep.equal([]);
            expect(pool.memoryThreshold).to.equal(10);
            expect(pool.delay).to.equal(1000);
            expect(conf.workers).to.equal(20);

            done();
        });
    });
});
describe('restore2', function() {
    it('restore2', function (done) {
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
            expect(err).to.equal('error'); // check if gzip is failing properly

            done();
        });
    });
});
