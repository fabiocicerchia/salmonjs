/**
 *               __     __
 * .-----.-----.|__|.--|  |.-----.--.--.
 * |__ --|  _  ||  ||  _  ||  -__|  |  |
 * |_____|   __||__||_____||_____|___  |
 *       |__|                    |_____|
 *
 * SPIDEY v0.2.1
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

require('colors');

var Crawler = require('./crawler');

if (process.argv.join(' ').indexOf('worker.js') !== -1) {
    var args            = process.argv,
        timeStart       = args[2],
        username        = args[3],
        password        = args[4],
        storeDetails    = args[5],
        followRedirects = args[6],
        url             = args[7],
        type            = args[8],
        container       = args[9],
        evt             = args[10],
        xPath           = args[11],
        config          = require('../src/config'),
        Crawler         = require('../src/crawler'),
        winston         = require('winston'),
        fs              = require('fs'),
        path            = require('path'),
        glob            = require('glob'),
        redis           = require('redis'),
        client          = redis.createClient(config.redis.port, config.redis.hostname),
        spawn           = require('child_process').spawn,
        crypto          = require('crypto'),
        optimist        = require('optimist'),
        utils           = new (require('../src/utils'))(crypto),
        test            = new (require('../src/test'))(fs, glob, '.', utils);

    winston.cli();
    winston.remove(winston.transports.Console);
    winston.add(
        winston.transports.Console,
        {
            level: config.logging.level,
            silent: config.logging.silent,
            colorize: true,
            timestamp: true
        }
    );

    var crawler = new Crawler(config, spawn, crypto, test, client, winston, fs, optimist, utils);
    crawler.init();
    crawler.timeStart       = timeStart;
    crawler.username        = username;
    crawler.password        = password;
    crawler.storeDetails    = storeDetails;
    crawler.followRedirects = followRedirects;
    var data = ((container !== undefined && container !== 'undefined') ? JSON.parse(container) : undefined);
    crawler.run(url, type, data, evt, xPath);
}
