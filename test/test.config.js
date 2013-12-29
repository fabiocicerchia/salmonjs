/**
 *               __                         _____ _______
 * .-----.---.-.|  |.--------.-----.-----._|     |     __|
 * |__ --|  _  ||  ||        |  _  |     |       |__     |
 * |_____|___._||__||__|__|__|_____|__|__|_______|_______|
 *
 * salmonJS v0.3.0
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
    srcdir   = fs.absolute('.') + (casper.cli.has('coverage') ? '/src-cov' : '/src');

casper.options.onPageInitialized = function () {
    casper.page.injectJs(srcdir + '/sha1.js');
    casper.page.injectJs(srcdir + '/events.js');
};

casper.on('remote.message', function (msg) {
    console.log('CONSOLE.LOG: ' + msg);
});

casper.test.begin('Redis', function (test) {
    var config = require(srcdir + '/config');
    test.assertType(config.redis, 'object', 'it should be an object');
    test.assertType(config.redis.port, 'number', 'it contains "port" element');
    test.assertType(config.redis.hostname, 'string', 'it contains "hostname" element');

    test.done();
});

casper.test.begin('Logging', function (test) {
    var config = require(srcdir + '/config');

    test.assertType(config.logging, 'object', 'it should be an object');
    test.assertType(config.logging.level, 'string', 'it contains "level" element');
    test.assertType(config.logging.silent, 'boolean', 'it contains "silent" element');

    test.done();
});

casper.test.begin('Parser', function (test) {
    var config = require(srcdir + '/config');

    test.assertType(config.parser, 'object', 'it should be an object');
    test.assertType(config.parser.interface, 'string', 'it contains "interface" element');
    test.assertType(config.parser.timeout, 'number', 'it contains "timeout" element');

    test.done();
});

casper.test.begin('Crawler', function (test) {
    var config = require(srcdir + '/config');

    test.assertType(config.crawler, 'object', 'it should be an object');
    test.assertType(config.crawler.attempts, 'number', 'it contains "attempts" element');
    test.assertType(config.crawler.delay, 'number', 'it contains "delay" element');

    test.done();
});
