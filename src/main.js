/**
 *               __     __
 * .-----.-----.|__|.--|  |.-----.--.--.
 * |__ --|  _  ||  ||  _  ||  -__|  |  |
 * |_____|   __||__||_____||_____|___  |
 *       |__|                    |_____|
 *
 * SPIDEY v0.1.0
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

var prompt  = require('prompt'),
    colors  = require('colors'),
    config  = require('../src/config'),
    Crawler = require('../src/crawler'),
    winston = require('winston'),
    fs      = require('fs'),
    path    = require('path'),
    redis   = require('redis'),
    client  = redis.createClient(config.redis.port, config.redis.hostname),
    argv;

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
console.log('SPIDEY v0.1.0'.grey);
console.log('Copyright (C) 2013 Fabio Cicerchia <info@fabiocicerchia.it>'.grey);
console.log('');

argv = require('optimist')
    .usage('Web Crawler in Node.js to spider dynamically whole websites.\nUsage: $0')
    .demand('uri')
    .alias('u', 'username')
    .alias('p', 'password')
    .alias('s', 'screenshots')
    .alias('d', 'details')
    .describe('uri', 'The URI to be crawled')
    .describe('u', 'Username for HTTP authentication')
    .describe('p', 'Password for HTTP authentication')
    .describe('s', 'Store screenshots for each page')
    .describe('d', 'Store details for each page')
    .describe('help', 'Show the help')
    .string('uri')
    .boolean('s')
    .boolean('d')
    .default('s', false)
    .default('d', false)
    .argv;

if (argv.help !== undefined || argv.uri === undefined) {
    argv.showHelp();
} else {
    var uri = path.resolve(argv.uri);
    if (fs.existsSync(uri)) {
        uri = 'file://' + encodeURI(uri);
    } else {
        uri = argv.uri;

        if (uri.indexOf('://') < 0) {
            uri = 'http://' + uri;
        }
    }

    winston.info('Start mapper.parse(' + uri + ')');

    client.send_command('FLUSHDB', []);

    var crawler = new Crawler();
    crawler.timeStart    = Date.now();
    crawler.username     = argv.username;
    crawler.password     = argv.password;
    crawler.storeDetails = argv.details;
    crawler.run(uri, 'GET');
}
