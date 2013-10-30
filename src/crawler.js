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

var config  = require('./config'),
    spawn   = require('child_process').spawn,
    crypto  = require('crypto'),
    Test    = require('../src/test'),
    redis   = require("redis"),
    client  = redis.createClient(config.redis.port, config.redis.hostname),
    winston = require('winston'),
    fs      = require('fs');

require('colors');
require('path');

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
     * URI ID.
     *
     * @property idUri
     * @type {String}
     * @default ""
     */
    this.idUri = '';

    /**
     * The username for HTTP Authentication.
     *
     * @property username
     * @type {String}
     * @default ""
     */
    this.username;

    /**
     * The password for HTTP Authentication.
     *
     * @property password
     * @type {String}
     * @default ""
     */
    this.password;

    /**
     * TBW
     */
    this.storeDetails = false;

    /**
     * TBW
     */
    this.REPORT_DIRECTORY = '/../report/';

    /**
     * TBW
     */
    this.processOutput = '';

    /**
     * Current instance.
     *
     * @property currentCrawler
     * @type {Object}
     * @default this
     */
    var currentCrawler = this,
        sha1          = crypto.createHash('sha1'),
        plainText     = JSON.stringify(this) + Date.now() + runningCrawlers;

    this.idCrawler    = sha1.update(plainText).digest('hex').substr(0, 4);
    console.log(('Started new crawler: ' + this.idCrawler).magenta);

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
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }

        return str.join('&');
    };

    /**
     * Execute PhantomJS.
     *
     * @method execPhantomjs
     * @return undefined
     */
    this.execPhantomjs = function () {
        var phantom,
            params  = [
                //'--debug=true',
                './src/parser/' + config.parser.interface + '.js',
                this.idUri,
                this.username,
                this.password,
                this.url,
                this.type,
                this.serialise(this.data),
                this.evt,
                this.xPath
            ];

        try {
            phantom = spawn(config.parser.cmd, params);

            phantom.stdout.on('data', this.onStdOut);
            phantom.stderr.on('data', this.onStdErr);
            phantom.on('exit', this.onExit);
        } catch (err) {
            winston.error(err.message.red);
            currentCrawler.handleError(); // TODO: CONVERT TO THIS?
        }
    };

    /**
     * TBW
     *
     * @method run
     * @param {String} url   The URL to crawl.
     * @param {String} type  The request type: GET or POST.
     * @param {Object} data  The data to send for the request.
     * @param {String} evt   The event to fire (optional).
     * @param {String} xPath The XPath expression to identify the element to fire (optional).
     * @return undefined
     */
    this.run = function (url, type, data, evt, xPath) {
        waitingRetry = false;

        this.url   = url.action || url;
        this.type  = type || 'GET';
        this.data  = data || {};
        this.evt   = evt || '';
        this.xPath = xPath || '';

        runningCrawlers++;

        sha1       = crypto.createHash('sha1');
        plainText  = this.url + this.type + JSON.stringify(this.data) + this.evt + this.xPath;
        this.idUri = sha1.update(plainText).digest('hex').substr(0, 8);

        var winstonCrawlerId = '[' + this.idUri.cyan + '-' + this.idCrawler.magenta + ']';

        winston.info(
            '%s Launching crawler to parse "%s" - %s on %s ...',
            winstonCrawlerId,
            this.url.green,
            (this.evt === '' ? 'N/A'.grey : this.evt.blue),
            (this.xPath === '' ? 'N/A'.grey : this.xPath.green)
        );

        if (config.parser.interface === 'phantom') {
            this.execPhantomjs();
        }
    };

    /**
     * Analise the Redis response and eventually launch a new crawler.
     *
     * @method analiseRedisResponse
     * @param {} err
     * @param {} reply
     * @param {} redisId
     * @param {} container
     * @return undefined
     */
    this.analiseRedisResponse = function (err, reply, redisId, container) {
        var id               = redisId.substr(0, 8),
            winstonCrawlerId = '[' + id.cyan + '-' + currentCrawler.idCrawler.magenta + ']',
            newId,
            crawler;

        if (err) {
            throw err;
        }

        // reply is null when the key is missing
        if (reply !== null) {
            winston.info(
                '%s' + ' Match found in Redis for "%s" (event: "%s" - XPath: "%s"). Skip'.yellow,
                winstonCrawlerId,
                container.url,
                container.evt,
                container.xPath
            );
            return;
        }

        sha1      = crypto.createHash('sha1');
        plainText = container.url + container.type + JSON.stringify(container.data) + container.evt + container.xPath;
        newId     = sha1.update(plainText).digest('hex').substr(0, 8);

        winston.info(
            '%s' + ' Match not found in Redis. Continue. Continue (%s)'.grey,
            winstonCrawlerId,
            newId
        );
        client.hset(redisId, 'url', currentCrawler.url);

        crawler = new Crawler();
        crawler.username     = currentCrawler.username;
        crawler.password     = currentCrawler.password;
        crawler.storeDetails = currentCrawler.storeDetails;
        crawler.run(container.url, container.type, container.container, container.evt, container.xPath);
    };

    /**
     * TBW
     *
     * @method checkAndRun
     * @param {String} url   The URL to crawl.
     * @param {String} type  The request type: GET or POST.
     * @param {Object} data  The data to send for the request.
     * @param {String} evt   The event to fire (optional).
     * @param {String} xPath The XPath expression to identify the element to fire (optional).
     * @return undefined
     */
    this.checkAndRun = function (url, type, data, evt, xPath) {
        var container   = {},
            redisId,
            id,
            winstonCrawlerId;

        container.url   = url.action || url;
        container.type  = type || 'GET';
        container.data  = data || {};
        container.evt   = evt || '';
        container.xPath = xPath || '';

        sha1      = crypto.createHash('sha1');
        plainText = container.url + container.type + JSON.stringify(container.data) + container.evt + container.xPath;
        redisId   = sha1.update(plainText).digest('hex');
        id        = redisId.substr(0, 8);

        winstonCrawlerId = '[' + id.cyan + '-' + currentCrawler.idCrawler.magenta + ']';
        winston.info(
            '%s Checking %s "%s" - %s on %s',
            winstonCrawlerId,
            container.type.blue,
            container.url.green,
            (container.evt === '' ? 'N/A'.grey : container.evt.blue),
            (container.xPath === '' ? 'N/A'.grey : container.xPath.green)
        );

        client.hgetall(redisId, function (err, reply) {
            return currentCrawler.analiseRedisResponse(err, reply, redisId, container);
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
        var winstonCrawlerId = '[' + currentCrawler.idUri.cyan + '-' + currentCrawler.idCrawler.magenta + ']';

        winston.info(
            '%s Retrieved %d bytes.',
            winstonCrawlerId,
            data.toString().length
        );
        currentCrawler.processOutput += data.toString();
    };

    /**
     * TBW
     *
     * @method onStdErr
     * @param {Object} data The data returned by the parser.
     * @return undefined
     */
    this.onStdErr = function (data) {
        var winstonCrawlerId = '[' + currentCrawler.idUri.cyan + '-' + currentCrawler.idCrawler.magenta + ']';

        winston.info('%s Retrieved response', winstonCrawlerId);
        winston.error(data.toString().red);

        currentCrawler.handleError(); // TODO: CONVERT TO THIS?
    };

    /**
     * TBW
     *
     * @method handleError
     * @return undefined
     */
    this.handleError = function () {
        var winstonCrawlerId = '[' + currentCrawler.idUri.cyan + '-' + this.idCrawler.magenta + ']';

        if (currentCrawler.tries < config.crawler.attempts) {
            waitingRetry = true;
            winston.info('%s' + ' Trying again in %s msec'.grey, winstonCrawlerId, config.crawler.delay);

            setTimeout((function () {
                currentCrawler.tries++;
                winston.warn(
                    '%s' + ' Trying again (%d) to get a response...'.yellow,
                    winstonCrawlerId,
                    config.crawler.attempts - currentCrawler.tries
                );

                return currentCrawler.run(
                    currentCrawler.url,
                    currentCrawler.type,
                    currentCrawler.data,
                    currentCrawler.event,
                    currentCrawler.xPath
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
        var winstonCrawlerId = '[' + currentCrawler.idUri.cyan + '-' + currentCrawler.idCrawler.magenta + ']';

        winston.info(
            '%s Execution terminated with status: %d',
            winstonCrawlerId,
            code
        );

        currentCrawler.processPage(currentCrawler.processOutput);

        runningCrawlers--;
        console.log(runningCrawlers);
        console.log(waitingRetry);
        /*


        if (!waitingRetry && runningCrawlers === 0) {
            process.exit(code);
        }*/
    };

    /**
     * TBW
     */
    this.processPage = function (content) {
        var result,
            links,
            event,
            signature,
            element,
            newId,
            winstonCrawlerId = '[' + currentCrawler.idUri.cyan + '-' + currentCrawler.idCrawler.magenta + ']';

        winston.info('%s Processing response...', winstonCrawlerId);

        result = JSON.parse(content.replace(/^.*###/m, ''));

        winston.info('%s Response ready', winstonCrawlerId);

        links  = result.links;

        if (currentCrawler.storeDetails) {
            sha1          = crypto.createHash('sha1'),
            plainText     = JSON.stringify(currentCrawler);

            var reportName    = currentCrawler.url.toString().replace(/[^a-zA-Z0-9_]/g, '_');
            reportName       += '_' + sha1.update(plainText).digest('hex').substr(0, 4);
            var reportContent = JSON.stringify(result.report);
            var reportFile    = __dirname + currentCrawler.REPORT_DIRECTORY + reportName + '.report';
            fs.mkdir(__dirname + currentCrawler.REPORT_DIRECTORY, '0777', function () {
                fs.writeFileSync(reportFile, reportContent);
            });
        }

        // TODO: Optimise this code
        for (event in links.events) {
            if (links.events.hasOwnProperty(event)) {
                for (signature in links.events[event]) {
                    if (links.events[event].hasOwnProperty(signature)) {
                        for (element in links.events[event][signature]) {
                            if (links.events[event][signature].hasOwnProperty(element) && element !== undefined) {
                                sha1      = crypto.createHash('sha1');
                                plainText = currentCrawler.url + currentCrawler.type + JSON.stringify(currentCrawler.data) + event + links.events[event][signature][element];
                                newId     = sha1.update(plainText).digest('hex').substr(0, 8);

                                winston.info(
                                    '%s Firing %s on "%s" (%s)...',
                                    winstonCrawlerId,
                                    event.toUpperCase().blue,
                                    links.events[event][signature][element].green,
                                    newId.cyan
                                );
                                currentCrawler.checkAndRun(currentCrawler.url, currentCrawler.type, currentCrawler.data, event, links.events[event][signature][element]);
                            }
                        }
                    }
                }
            }
            //currentCrawler.checkAndRun(element, 'GET');
            //currentCrawler.checkAndRun(element, 'GET', data);
        }

        links.anchors.forEach(function (element) {
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
            var id        = element.action.toString().replace(/[^a-zA-Z0-9_]/g, '_'),
                test      = new Test(),
                fieldData = {},
                cases,
                i,
                j;

            // TODO: Sort this fields?
            for (i in element.fields) {
                if (element.fields.hasOwnProperty(i)) {
                    fieldData[element.fields[i]] = '';
                }
            }
            test.create(id + '-' + element.type, fieldData);
            //test.create(id + '-' + 'get', fieldData);
            //test.create(id + '-' + 'post', fieldData); // TODO: REMOVE DUPLICATE

            cases = test.getCases(id + '-' + element.type);
            for (j in cases) {
                if (cases.hasOwnProperty(j)) {
                    currentCrawler.checkAndRun(element, element.type.toUpperCase(), []);
                    currentCrawler.checkAndRun(element, element.type.toUpperCase(), cases[j]);
                }
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

};
