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

var IOC     = require('./ioc'),
    config  = require('../src/config'),
    winston = require('winston'),
    fs      = require('fs'),
    path    = require('path'),
    Insight = require('insight'),
    os      = require('os'),
    pkg     = require('../package.json'),
    redis   = require('redis'),
    client  = redis.createClient(config.redis.port, config.redis.hostname),
    argv;

require('path');
require('colors');

var insight = new Insight({
    trackingCode:   'UA-439670-13',
    packageName:    pkg.name,
    packageVersion: pkg.version
});

var ioc = new IOC();
ioc.add('config',    config);
ioc.add('insight',   insight);
ioc.add('spawn',     require('child_process').spawn);
ioc.add('crypto',    require('crypto'));
ioc.add('redis',     redis);
ioc.add('client',    client);
ioc.add('winston',   winston);
ioc.add('optimist',  require('optimist'));
ioc.add('fs',        fs);
ioc.add('glob',      require('./glob'));
ioc.add('dirName',   __dirname);
ioc.add('mainDir',   __dirname + '/..');
ioc.add('fsWrapper', ioc.get(require('../src/fs')));
ioc.add('test',      ioc.get(require('../src/test')));

/**
 * Redis error handler
 */
client.on('error', function (err) {
    winston.error('REDIS - %s'.red, err.toString());
    process.exit(1);
});

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

console.log('              __     __'.yellow);
console.log('.-----.-----.|__|.--|  |.-----.--.--.'.yellow);
console.log('|__ --|  _  ||  ||  _  ||  -__|  |  |'.yellow);
console.log('|_____|   __||__||_____||_____|___  |'.yellow);
console.log('      |__|                    |_____|'.yellow);
console.log('');
console.log('SPIDEY v0.2.1'.grey);
console.log('Copyright (C) 2013 Fabio Cicerchia <info@fabiocicerchia.it>'.grey);
console.log('');

argv = require('optimist')
    .usage('Web Crawler in Node.js to spider dynamically whole websites.\nUsage: $0')
    .demand('uri')
    .alias('u', 'username')
    .alias('p', 'password')
    .alias('d', 'details')
    .alias('f', 'follow')
    .describe('uri', 'The URI to be crawled')
    .describe('u', 'Username for HTTP authentication')
    .describe('p', 'Password for HTTP authentication')
    .describe('d', 'Store details for each page')
    .describe('f', 'Follows redirects')
    .describe('disable-stats', 'Disable anonymous report usage stats')
    .describe('help', 'Show the help')
    .string('uri')
    .boolean('d')
    .boolean('f')
    .boolean('disable-stats')
    .default('d', false)
    .default('f', false)
    .default('disable-stats', false)
    .argv;

function spawnStdout(data) {
    data = data.toString();
    console.log(data.substr(0, data.length - 1));
}

function spawnStderr(data) {
    data = data.toString();
    console.log(data.substr(0, data.length - 1).red);
}

function start() {
    var uri = path.resolve(argv.uri);
    if (fs.existsSync(uri)) {
        uri = 'file://' + encodeURI(uri);
    } else {
        uri = argv.uri;

        if (uri.indexOf('://') < 0) {
            uri = 'http://' + uri;
        }
    }

    winston.info('Report anonymous statistics: %s', insight.optOut ? 'No'.red : 'Yes'.green);
    insight.track('cli', 'os', os.type());
    insight.track('cli', 'platform', os.platform());
    insight.track('cli', 'arch', os.arch());
    insight.track('cli', 'release', os.release());
    insight.track('cli', 'node', process.versions.node);
    insight.track('cli', 'engine', process.versions.v8);

    winston.info('Start processing "' + uri.green + '"...');

    client.send_command('FLUSHDB', []);

    var args = [
        __dirname + '/worker.js',
        Date.now(), argv.username, argv.password, argv.details, argv.follow,
        uri, 'GET'
    ];

    var childProcess = require('child_process').spawn('node', args);
    childProcess.stdout.on('data', spawnStdout);
    childProcess.stderr.on('data', spawnStderr);
    childProcess.on('exit', function () {
        process.exit();
    });
}

if (argv.help !== undefined || argv.uri === undefined) {
    argv.showHelp();
} else {
    if (insight.optOut === undefined) {
        return insight.askPermission(undefined, start);
    }

    insight.optOut = argv['disable-stats'];
    start();
}