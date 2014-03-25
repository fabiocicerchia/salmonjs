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

/**
 * SalmonJS Class
 *
 * Main interface to be used in NodeJS as well.
 * It provides all the functionalities available via the CLI.
 *
 * @class SalmonJS
 */
var SalmonJS = function (redis, argv) {
    // TODO: convert to this.*
    var IOC       = require('./ioc'),
        ioc       = new IOC(),
        logLevels = [ 'error', 'warn', 'info', 'debug' ],
        logLevel  = argv.v === undefined ? 2 : (typeof argv.v === 'object' ? argv.v.length : argv.v.length + 1),
        config    = {
            redis: {
                port: argv.redis.split(':')[1],
                hostname: argv.redis.split(':')[0]
            },
            logging: {
                level: logLevels[(logLevel > logLevels.length) ? logLevels.length - 1 : logLevel], // Possible values: debug, info, warn, error.
                silent: argv.quiet
            },
            parser: {
                interface: 'phantom', // PhantomJS: 'phantom'
                cmd: 'phantomjs',
                timeout: argv.timeout // Resource timeout in milliseconds.
            },
            crawler: {
                attempts: argv.attempts, // Number of tries before stop to execute the request.
                delay: argv.interval // Delay between an attempt and another one in milliseconds.
            }
        },
        winston   = require('winston'),
        fs        = require('fs'),
        path      = require('path'),
        crypto    = require('crypto'),
        client    = redis.createClient(config.redis.port, config.redis.hostname),
        os        = require('os'),
        spawn     = require('child_process').spawn,
        zlib      = require('zlib'),
        pool      = new (require('./pool'))(spawn, os, config);

    ioc.add('client',    client);
    ioc.add('config',    config);
    ioc.add('cases_dir', argv.cases ? path.resolve(argv.cases) : undefined);
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

    /**
     * Handle the signals in order to stop gracefully the execution.
     *
     * @method handleSignals
     * @return undefined
     */
    this.handleSignals = function () {
        winston.info('Gracefully shutting down');

        var Session = require('./session'),
            session = new Session(client, fs, zlib, utils, argv, pool);

        winston.debug('Dumping the session...');
        session.dump(function (err) {
            if (err) {
                winston.error(err);
            }

            winston.debug('Exiting...');
            process.exit();
        });
    };

    /**
     * Restore the previous interrupted session.
     *
     * @method restoreSession
     * @param {Function} callback A callback to be invoked once restore the session.
     * @return undefined
     */
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

    /**
     * Resolve the URI and add the protocol.
     *
     * @method resolveURI
     * @param {String} uri The URI to be resolved.
     * @return {String}
     */
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

    /**
     * Start the execution.
     *
     * @method start
     * @return undefined
     */
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
                sanitise:        argv.sanitise,
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
