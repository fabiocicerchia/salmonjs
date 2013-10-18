/**
 *                  __                                __
 * .--.--.--.-----.|  |--. .----.----.---.-.--.--.--.|  |.-----.----.
 * |  |  |  |  -__||  _  | |  __|   _|  _  |  |  |  ||  ||  -__|   _|
 * |________|_____||_____| |____|__| |___._|________||__||_____|__|
 *
 * WEB CRAWLER v0.1.0
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

var config  = require('./config');
var spawn   = require('child_process').spawn;
var colors  = require('colors');
var crypto  = require('crypto');
var path    = require('path');
var Test    = require('../src/test');
var redis   = require("redis");
var client  = redis.createClient(config.redis.port, config.redis.hostname);
var winston = require('winston');

/**
 * TBW
 */
client.on("error", function (err) {
    winston.error('REDIS - Error' + err);
});

var runningCrawlers = 0;
var waitingRetry    = false;

/**
 * Crawler Module
 *
 * TBW
 *
 * @module Crawler
 */
module.exports = function Crawler() {
    /**
     * Number of tries before stop to execute the same request.
     * 
     * @property tries
     * @type {Integer}
     * @default 0
     */
    this.tries = 0;

    /**
     * URL.
     * 
     * @property url
     * @type {String}
     * @default ""
     */
    this.url  = '';

    /**
     * Request type (GET or POST).
     * 
     * @property type
     * @type {String}
     * @default ""
     */
    this.type = '';

    /**
     * Data to be sent.
     * 
     * @property data
     * @type {Object}
     * @default {}
     */
    this.data = {};

    /**
     * Crawler ID.
     * 
     * @property idCrawler
     * @type {String}
     * @default ""
     */
    this.idCrawler = '';

    /**
     * Current instance.
     * 
     * @property currentCrawler
     * @type {Object}
     * @default this
     */
    var currentCrawler = this;

    /**
     * Serialise an object as questring.
     *
     * @method serialise
     * @param  {Object} obj The object to be converted.
     * @return {String} The querysting based on the input.
     */
    this.serialise = function (obj) {
        var str = [], p;

        for (p in obj) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }

        return str.join('&');
    };

    /**
     * TBW
     *
     * @method run
     * @param {String} url  The URL to crawl.
     * @param {String} type The request type: GET or POST.
     * @param {Object} data The data to send for the request.
     * @return undefined
     */
    this.run = function (url, type, data) {
        waitingRetry = false;

        this.url  = url.action || url;
        this.type = type || 'GET';
        this.data = data || {};
        winston.info('Parsing ' + this.type.blue + ' "' + this.url.green + '"...');

        runningCrawlers++;

        var sha1       = crypto.createHash('sha1');
        var plainText  = runningCrawlers.toString() + Date.now();
        this.idCrawler = sha1.update(plainText).digest('hex').substr(0, 8);

        winston.info('Launching crawler #%s  to parse "%s"...', this.idCrawler.cyan, this.url.green);

        //if (config.parser.interface === 'phantom') {
            var params  = [
                './src/parser/' + config.parser.interface + '.js',
                this.idCrawler,
                this.url,
                this.type,
                this.serialise(data)
                ];
            var phantom = spawn('phantomjs', params);
            phantom.stdout.on('data', this.onStdOut);
            phantom.stderr.on('data', this.onStdErr);
            phantom.on('exit', this.onExit);
        //} else {
        //    var ZombieParser = require('../src/parser/zombie');
        //    new ZombieParser().parse(this.url, this.type, this.data);
        //}
    };

    /**
     * TBW
     *
     * @method checkAndRun
     * @param {String} url  The URL to crawl.
     * @param {String} type The request type: GET or POST.
     * @param {Object} data The data to send for the request.
     * @return undefined
     */
    this.checkAndRun = function (url, type, data) {
        url  = url.action || url;
        data = data || [];

        //winston.info('Looping results: "' + url + '".');
        var sha1      = crypto.createHash('sha1');
        var plainText = type + url.toString().replace(/[^a-zA-Z0-9_]/g, '') + '-' + data.toString();
        var id        = sha1.update(plainText).digest('hex');

        client.hgetall(id, function (err, reply) {
            if (err) {
                throw err;
            }

            // reply is null when the key is missing
            //console.log(reply);
            if (reply === null) {
                winston.info('Match not found in Redis. Continue'.grey);
                client.hset(id, 'url', url);

                var crawler = new Crawler();
                crawler.run(url, type, data);
            } else {
                winston.info('Match found in Redis. Skip'.yellow);
            }
        });
    };

    /**
     * TBW
     *
     * @method onStdOut
     * @param {Object} data The data returned by the parser.
     * @return undefined
     */
    this.onStdOut = function (data) {
        //console.log(data.toString());
        var result = JSON.parse(data.toString()),
            links  = result.links;

        winston.info('Retrieved response for the crawler #' + result.idCrawler.cyan);

        links.anchors.plain.forEach(function (element) {
            currentCrawler.checkAndRun(element, 'GET');
            //currentCrawler.checkAndRun(element, 'GET', data);
        });

        links.links.forEach(function (element) {
            currentCrawler.checkAndRun(element, 'GET');
            //currentCrawler.checkAndRun(element, 'GET', data);
        });

        links.scripts.forEach(function (element) {
            currentCrawler.checkAndRun(element, 'GET');
            //currentCrawler.checkAndRun(element, 'GET', data);
        });

        links.forms.forEach(function (element) {
            var id        = element.action.toString().replace(/[^a-zA-Z0-9_]/g, ''),
                test      = new Test(),
                fieldData = {},
                cases,
                i,
                j;

            for (i in element.fields) {
                fieldData[element.fields[i]] = '';
            }
            test.create(id + '-' + element.type, fieldData);
            //test.create(id + '-' + 'get', fieldData);
            //test.create(id + '-' + 'post', fieldData); // TODO: REMOVE DUPLICATE

            cases = test.getCases(id + '-' + element.type);
            for (j in cases) {
                currentCrawler.checkAndRun(element, element.type.toUpperCase(), []);
                currentCrawler.checkAndRun(element, element.type.toUpperCase(), cases[j]);
            }

            /*
            var cases = test.getCases(id + '-get');
            for (var j in cases) {
              currentCrawler.checkAndRun(element, 'GET', []);
              currentCrawler.checkAndRun(element, 'GET', cases[j]);
            }

            cases = test.getCases(id + '-post');
            for (j in cases) {
              currentCrawler.checkAndRun(element, 'POST', []);
              currentCrawler.checkAndRun(element, 'POST', cases[j]);
            }
            */
        });
    };

    /**
     * TBW
     *
     * @method onStdErr
     * @param {Object} data The data returned by the parser.
     * @return undefined
     */
    this.onStdErr = function (data) {
        winston.info('Retrieved response for the crawler #' + currentCrawler.idCrawler.cyan);
        winston.error(data.toString().red);
        
        if (currentCrawler.tries < config.crawler.attempts) {
            waitingRetry = true;
            winston.info(('Trying again in %s msec').grey, config.crawler.delay);
            setTimeout((function () {
                currentCrawler.tries++;
                winston.warn(
                    'Trying again (%d) to get a response...'.yellow,
                    config.crawler.attempts - currentCrawler.tries
                );
                return currentCrawler.run(
                    currentCrawler.url,
                    currentCrawler.type,
                    currentCrawler.data
                );
            }), config.crawler.delay);
        }
    };

    /**
     * TBW
     *
     * @method onExit
     * @param {Integer} code The exit code returned by the parser.
     * @return undefined
     */
    this.onExit = function (code) {
        runningCrawlers--;

        if (!waitingRetry && runningCrawlers === 0) {
            process.exit(code);
        }
    };
};