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

require('colors');

var Crawler = require('./crawler');

if (process.argv.join(' ').indexOf('worker.js') !== -1) {
    var args            = process.argv,
        timeStart       = args[2],
        username        = args[3],
        password        = args[4],
        storeDetails    = args[5],
        followRedirects = args[6],
        proxy           = args[7],
        sanitise        = args[8],
        url             = args[9],
        type            = args[10],
        container       = args[11],
        evt             = args[12],
        xPath           = args[13],
        poolSettings    = JSON.parse(args[14]),
        config          = require('../src/config'),
        Crawler         = require('../src/crawler'),
        Pool            = require('../src/pool'),
        winston         = require('winston'),
        fs              = require('fs'),
        os              = require('os'),
        glob            = require('glob'),
        redis           = require('redis'),
        client          = redis.createClient(config.redis.port, config.redis.hostname),
        spawn           = require('child_process').spawn,
        crypto          = require('crypto'),
        optimist        = require('optimist'),
        utils           = new (require('../src/utils'))(crypto),
        test            = new (require('../src/test'))(fs, glob, '.', utils);
    require('path');

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
    
    var pool = new Pool(spawn, os);
    // TODO: add method to set this stuff
    pool.size            = poolSettings.size;
    pool.queue           = poolSettings.queue;
    pool.memoryThreshold = poolSettings.memoryThreshold;
    pool.delay           = poolSettings.delay;

    var crawler = new Crawler(config, spawn, crypto, test, client, winston, fs, optimist, utils, pool);
    crawler.init();
    crawler.timeStart       = timeStart;
    crawler.username        = username;
    crawler.password        = password;
    crawler.storeDetails    = storeDetails;
    crawler.followRedirects = followRedirects;
    crawler.proxy           = proxy;
    crawler.sanitise        = sanitise;
    var data = ((container !== undefined && container !== 'undefined') ? JSON.parse(container) : undefined);
    crawler.run(url, type, data, evt, xPath);
}
