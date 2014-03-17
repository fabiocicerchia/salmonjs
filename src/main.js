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

// TODO: Convert this to be an interface, so ut'll be possible to call is with some params and launch the crawler.
// In this way the people can embed it in their project and not just use it as a standalone tool.

var SalmonJS = function (redis, argv) {
    var IOC     = require('./ioc'),
        ioc     = new IOC(),
        config  = require('../src/config'),
        winston = require('winston'),
        fs      = require('fs'),
        path    = require('path'),
        crypto  = require('crypto'),
        client  = redis.createClient(config.redis.port, config.redis.hostname),
        os      = require('os'),
        spawn   = require('child_process').spawn,
        zlib    = require('zlib'),
        pool    = new (require('./pool'))(spawn, os);

    ioc.add('client',    client);
    ioc.add('config',    config);
    ioc.add('crypto',    crypto);
    ioc.add('dirName',   __dirname);
    ioc.add('fs',        fs);
    ioc.add('fsWrapper', ioc.get(require('../src/fs')));
    ioc.add('glob',      require('./glob'));
    ioc.add('mainDir',   __dirname + '/..');
    ioc.add('optimist',  require('optimist'));
    ioc.add('pool',      pool);
    ioc.add('spawn',     spawn);
    ioc.add('test',      ioc.get(require('../src/test')));
    var utils = ioc.get(require('../src/utils'));
    ioc.add('utils',     utils);
    ioc.add('winston',   winston);

    /**
     * Redis error handler
     */
    client.on('error', function (err) {
        winston.error('REDIS - %s'.red, err.toString());
        process.exit(1);
    });

    this.handleSignals = function () {
        winston.info('Gracefully shutting down');

        var Session = require('./session'),
            session = new Session(client, fs, zlib, utils, argv, pool);

        winston.debug('Dumping the session...');
        session.dump(function () {
            winston.debug('Exiting...');
            process.exit();
        });
    };

    this.restoreSession = function (callback) {
        var Session = require('./session'),
            session = new Session(client, fs, zlib, utils, argv, pool);

        session.restore(function (conf) {
            utils.loopEach(conf, function (key, value) {
                argv[key] = value;
            });

            callback();
        });
    };

    /**
     * The spawn's stdout callback.
     *
     * @method spawnStdout
     * @param {Object} data The data sent back from the worker.
     * @return undefined
     */
    this.spawnStdout = function(data) {
        data = data.toString();
        console.log(data.substr(0, data.length - 1));
    };

    /**
     * The spawn's stderr callback.
     *
     * @method spawnStderr
     * @param {Object} data The data sent back from the worker.
     * @return undefined
     */
    this.spawnStderr = function(data) {
        data = data.toString();
        console.log(data.substr(0, data.length - 1).red);
    };

    this.resolveURI = function (uri) {
        uri = path.resolve(uri);
        if (fs.existsSync(uri)) {
            uri = 'file://' + encodeURI(uri);
        } else {
            uri = argv.uri;

            if (uri.indexOf('://') < 0) {
                uri = 'http://' + uri;
            }
        }

        return uri;
    };

    this.start = function() {
        var uri = this.resolveURI(argv.uri);

        winston.info('Start processing "' + uri.green + '"...');

        client.send_command('FLUSHDB', []);

        var username, password;
        username = argv.credentials !== undefined ? argv.credentials.replace(/^([^:]+):.+/, '$1') : '';
        password = argv.credentials !== undefined ? argv.credentials.replace(/^[^:]+:(.+)/, '$1') : '';

        pool.size = argv.workers;
        // TODO: Pass all the argv to pool and to parser. way easier and shorter!
        pool.addToQueue(
            {
                timeStart:       Date.now(),
                idRequest:       Date.now(),
                username:        username,
                password:        password,
                url:             uri,
                type:            'GET',
                data:            {},
                evt:             '',
                xPath:           '',
                storeDetails:    argv.details,
                followRedirects: argv.follow,
                proxy:           argv.proxy,
                sanitise:        argv.sanitise
            },
            {
                stdout: this.spawnStdout,
                stderr: this.spawnStderr,
                exit:   function () {
                    process.exit();
                }
            }
        );
    };
};

module.exports = SalmonJS;
