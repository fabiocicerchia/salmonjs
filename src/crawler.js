/**
 *               __     __
 * .-----.-----.|__|.--|  |.-----.--.--.
 * |__ --|  _  ||  ||  _  ||  -__|  |  |
 * |_____|   __||__||_____||_____|___  |
 *       |__|                    |_____|
 *
 * SPIDEY v0.2.0
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

var config    = require('./config'),
    spawn     = require('child_process').spawn,
    crypto    = require('crypto'),
    Test      = require('../src/test'),
    redis     = require('redis'),
    client    = redis.createClient(config.redis.port, config.redis.hostname),
    winston   = require('winston'),
    fs        = require('fs'),
    phantomjs = require('phantomjs');

require('colors');
require('path');

/**
 * Redis error handler
 */
client.on('error', function (err) {
    winston.error('REDIS - %s'.red, err.toString());
    // TODO: Is it really good to exit?
    process.exit(1);
});

/**
 * Crawler Module
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
     * Flag to decide whether store the page details.
     *
     * @property storeDetails
     * @type {Boolean}
     * @default false
     */
    this.storeDetails = false;

    /**
     * The report directory.
     *
     * @property REPORT_DIRECTORY
     * @type {String}
     * @default "/../report/"
     */
    this.REPORT_DIRECTORY = '/../report/';

    /**
     * The output of the process.
     *
     * @property processOutput
     * @type {String}
     * @default ""
     */
    this.processOutput = '';

    /**
     * Timestamp of when the CLI tool has been executed.
     *
     * @property timeStart
     * @type {Integer}
     * @default 0
     */
    this.timeStart = 0;

    /**
     * Flag to identify whether the page is being processed by the method
     * processPage.
     *
     * @property processing
     * @type {Boolean}
     * @default false
     */
    this.processing = false;

    /**
     * TBW
     */
    this.possibleCrawlers = 0;

    /**
     * Current instance.
     *
     * @property currentCrawler
     * @type {Object}
     * @default this
     */
    var currentCrawler = this,
        sha1          = crypto.createHash('sha1'),
        plainText     = JSON.stringify(this) + Date.now();

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

        if (typeof obj !== 'object') {
            return '';
        }

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
        // TODO: Move to another method
        sha1          = crypto.createHash('sha1'),
        plainText     = this.url + this.type + JSON.stringify(this.data) + this.evt + this.xPath;
        var idRequest = sha1.update(plainText).digest('hex');

        var phantom,
            params  = [
                //'--debug=true',
                './src/parser/' + config.parser.interface + '.js',
                this.idUri,
                this.timeStart,
                idRequest,
                this.username,
                this.password,
                this.url,
                this.type,
                this.serialise(this.data),
                this.evt,
                this.xPath
            ];

        try {
            phantom = spawn(phantomjs.path, params);

            phantom.stdout.on('data', this.onStdOut);
            phantom.stderr.on('data', this.onStdErr);
            phantom.on('exit', this.onExit);
        } catch (err) {
            winston.error(err.message.red);
            this.handleError();
        }
    };

    /**
     * Execute the request launching a spawn'd process to the parser to get the
     * web page data back as JSON.
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
        this.url   = url.action || url;
        this.type  = type || 'GET';
        this.data  = data || {};
        this.evt   = evt || '';
        this.xPath = xPath || '';

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

        currentCrawler.possibleCrawlers--;
        // reply is null when the key is missing
        if (reply !== null) {
            winston.info(
                '%s' + ' Match found in Redis for "%s" (event: "%s" - XPath: "%s"). Skip'.yellow,
                winstonCrawlerId,
                container.url,
                container.evt,
                container.xPath
            );

            currentCrawler.checkRunningCrawlers('No items left to be processed');
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
        crawler.timeStart    = currentCrawler.timeStart;
        crawler.username     = currentCrawler.username;
        crawler.password     = currentCrawler.password;
        crawler.storeDetails = currentCrawler.storeDetails;
        crawler.run(container.url, container.type, container.container, container.evt, container.xPath);

        currentCrawler.checkRunningCrawlers('No items left to be processed');
    };

    /**
     * Check if already crawled, if not so launch a new crawler.
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
     * Check if there are crawlers is still running.
     *
     * @method checkRunningCrawlers
     * @param {String} reason The reason to terminate the execution
     * @return boolean
     */
    this.checkRunningCrawlers = function (reason) {
        if (currentCrawler.possibleCrawlers === 0) {
            var winstonCrawlerId = '[' + currentCrawler.idUri.cyan + '-' + currentCrawler.idCrawler.magenta + ']';
            winston.info('%s Exit: %s', winstonCrawlerId, reason);

            if (require('optimist').argv.$0.indexOf('mocha') === 0) {
                process.exit();
            }

            return false;
        }

        return true;
    };

    /**
     * Collect the output buffer from the spawn'd process.
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
     * Handle the error output from the
     *
     * @method onStdErr
     * @param {Object} data The data returned by the parser.
     * @return undefined
     */
    this.onStdErr = function (data) {
        var winstonCrawlerId = '[' + currentCrawler.idUri.cyan + '-' + currentCrawler.idCrawler.magenta + ']';

        winston.info('%s Retrieved response', winstonCrawlerId);
        winston.error(data.toString().red);

        this.handleError();
    };

    /**
     * Error Handler, it'll try to re-execute the request several times
     * (defined by config.crawler.attempts) after a delay defined by
     * config.crawler.delay.
     *
     * @method handleError
     * @return undefined
     */
    this.handleError = function () {
        var winstonCrawlerId = '[' + currentCrawler.idUri.cyan + '-' + this.idCrawler.magenta + ']';

        // TODO: Add the request in the report as failed if reach the threshold.
        if (currentCrawler.tries < config.crawler.attempts) {
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
     * Callback fired when the spawn'd process will finish the execution.
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
    };

    /**
     * Escape a HTML string.
     *
     * @method htmlEscape
     * @param {String} str The HTML to be escaped.
     * @return {String}
     */
    this.htmlEscape = function (str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    /**
     * Store the report details to a report file.
     *
     * @method storeDetailsToFile
     * @param {Object} report The report container.
     * @return undefined
     */
    this.storeDetailsToFile = function (report) {
        sha1          = crypto.createHash('sha1'),
        plainText     = currentCrawler.url + currentCrawler.type + JSON.stringify(currentCrawler.data) + currentCrawler.evt + currentCrawler.xPath;

        var reportName    = sha1.update(plainText).digest('hex');
        var reportContent = fs.readFileSync(__dirname + '/../src/tpl.html').toString();

        reportContent = reportContent.replace('%%URI%%',        currentCrawler.url);
        reportContent = reportContent.replace('%%IMGNAME%%',    reportName);
        reportContent = reportContent.replace('%%ERRORS%%',     JSON.stringify(report.errors, null, 4).replace(/\n/g, '<br />'));
        reportContent = reportContent.replace('%%ALERTS%%',     JSON.stringify(report.alerts, null, 4).replace(/\n/g, '<br />'));
        reportContent = reportContent.replace('%%CONFIRMS%%',   JSON.stringify(report.confirms, null, 4).replace(/\n/g, '<br />'));
        reportContent = reportContent.replace('%%CONSOLE%%',    JSON.stringify(report.console, null, 4).replace(/\n/g, '<br />'));
        reportContent = reportContent.replace('%%RESOURCES%%',  JSON.stringify(report.resources, null, 4).replace(/\n/g, '<br />'));
        reportContent = reportContent.replace('%%TIME%%',       JSON.stringify(report.time, null, 4).replace(/\n/g, '<br />'));
        reportContent = reportContent.replace('%%CONTENT%%',    currentCrawler.htmlEscape(report.content));
        reportContent = reportContent.replace('%%HTTPMETHOD%%', report.httpMethod);
        reportContent = reportContent.replace('%%EVENT%%',      report.event);
        reportContent = reportContent.replace('%%XPATH%%',      report.xPath);
        reportContent = reportContent.replace('%%DATA%%',       JSON.stringify(report.data));

        var indexContent = '<a href="' + reportName + '.html">' + currentCrawler.type + ' ' + currentCrawler.url + ' Data: ';
        indexContent    += JSON.stringify(currentCrawler.data) + ' Event: ' + (currentCrawler.evt === '' ? 'N/A' : currentCrawler.evt);
        indexContent    += ' XPath: ' + (currentCrawler.xPath === '' ? 'N/A' : currentCrawler.xPath) + '</a>\n';

        var reportFile = __dirname + currentCrawler.REPORT_DIRECTORY + currentCrawler.timeStart + '/' + reportName + '.html';
        var indexFile  = __dirname + currentCrawler.REPORT_DIRECTORY + currentCrawler.timeStart + '/index.html';
        fs.mkdir(__dirname + currentCrawler.REPORT_DIRECTORY + currentCrawler.timeStart + '/', '0777', function () {
            fs.writeFileSync(reportFile, reportContent);
            fs.appendFileSync(indexFile, indexContent, {flag: 'a+'});
        });
    };

    /**
     * Process the page, process each link and launch eventually a new crawler
     * using the method checkAndRun.
     *
     * @method processPage
     * @param {String} content The full output of the spawn'd process
     * @return undefined
     */
    this.processPage = function (content) {
        currentCrawler.processing = true;

        var result,
            links,
            event,
            signature,
            element,
            newId,
            winstonCrawlerId = '[' + currentCrawler.idUri.cyan + '-' + currentCrawler.idCrawler.magenta + ']';

        winston.info('%s Processing response...', winstonCrawlerId);

        try {
            result = JSON.parse(content.replace(/\n/g, '').replace(/.*###/m, ''));

            winston.info('%s Response ready', winstonCrawlerId);
        } catch (err) {
            winston.error('%s %s', winstonCrawlerId, err.toString().red);
            this.handleError();
            return;
        }

        links = result.links;

        if (currentCrawler.storeDetails) {
            currentCrawler.storeDetailsToFile(result.report);
        }

        // TODO: Optimise this code
        for (event in links.events) {
            if (links.events.hasOwnProperty(event)) {
                for (signature in links.events[event]) {
                    if (links.events[event].hasOwnProperty(signature)) {
                        for (element in links.events[event][signature]) {
                            if (links.events[event][signature].hasOwnProperty(element) && element !== undefined) {
                                currentCrawler.possibleCrawlers++;

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

        currentCrawler.possibleCrawlers += links.anchors.length;
        links.anchors.forEach(function (element) {
            currentCrawler.checkAndRun(element, 'GET');
            //currentCrawler.checkAndRun(element, 'GET', data);
        });

        currentCrawler.possibleCrawlers += links.links.length;
        links.links.forEach(function (element) {
            currentCrawler.checkAndRun(element, 'GET');
            //currentCrawler.checkAndRun(element, 'GET', data);
        });

        currentCrawler.possibleCrawlers += links.scripts.length;
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
            currentCrawler.possibleCrawlers += cases.length;
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

        // TODO: Potential issue if the forEach above are async.
        currentCrawler.checkRunningCrawlers('No links in the page');
    };
};
