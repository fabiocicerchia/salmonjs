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

require('colors');

var Crawler = require('./crawler');

if (process.argv.join(' ').indexOf('worker.js') !== -1) {
    var Crawler  = require('../src/crawler'),
        winston  = require('winston'),
        fs       = require('fs'),
        glob     = require('glob'),
        redis    = require('redis'),
        spawn    = require('child_process').spawn,
        crypto   = require('crypto'),
        optimist = require('optimist'),
        utils    = new (require('../src/utils'))(crypto),
        test     = new (require('../src/test'))(fs, glob, '.', utils);
    require('path');

    process.on('message', function(m) {
        var timeStart       = m.settings[0],
            username        = m.settings[1],
            password        = m.settings[2],
            storeDetails    = m.settings[3],
            followRedirects = m.settings[4],
            proxy           = m.settings[5],
            sanitise        = m.settings[6],
            url             = m.settings[7],
            type            = m.settings[8],
            container       = m.settings[9],
            evt             = m.settings[10],
            xPath           = m.settings[11],
            config          = m.settings[12],
            client          = redis.createClient(config.redis.port, config.redis.hostname);

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

        var crawler = new Crawler(config, spawn, test, client, winston, fs, optimist, utils);
        crawler.init();
        crawler.timeStart       = timeStart;
        crawler.username        = username;
        crawler.password        = password;
        crawler.storeDetails    = storeDetails;
        crawler.followRedirects = followRedirects;
        crawler.proxy           = proxy;
        crawler.sanitise        = sanitise;
        var data = ((container !== undefined && container !== 'undefined') ? JSON.parse(container) : undefined);
        crawler.run({url: url, type: type, data: data, evt: evt, xPath: xPath});
    });
}
