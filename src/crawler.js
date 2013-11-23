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

/**
 * Crawler Module
 *
 * @module Crawler
 */
var Crawler = function (config, spawn, crypto, test, client, winston, fs, optimist) {
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
     * Number of possible crawlers to be launched based on the number of links
     * and events in the current page.
     *
     * @property possibleCrawlers
     * @type {Integer}
     * @default 0
     */
    this.possibleCrawlers = 0;

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

    if (typeof optimist !== 'undefined' && typeof winston !== 'undefined') {
        if (optimist.argv.$0.indexOf('mocha') !== -1) {
            try { winston.remove(winston.transports.Console); } catch (err) {}
        }
    }
    /**
     * Initialise the crawler.
     *
     * @method init
     * @return undefined
     */
    this.init = function () {
        /**
         * Redis error handler
         */
        client.on('error', function (err) {
            winston.error('REDIS - %s'.red, err.toString());
            // TODO: Is it really good to exit?
            process.exit(1);
        });

        this.idCrawler = process.pid.toString();
        winston.info('Started new crawler: %s'.magenta, this.idCrawler);
    };

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
     * Hash a string with SHA1.
     *
     * @method hashString
     * @param {String} plainText The string to be converted to hash
     * @return {String}
     */
    this.sha1 = function  (plainText) {
        return crypto.createHash('sha1').update(plainText).digest('hex');
    };

    /**
     * Execute PhantomJS.
     *
     * @method execPhantomjs
     * @return undefined
     */
    this.execPhantomjs = function () {
        var idRequest = currentCrawler.sha1(this.url + this.type + JSON.stringify(this.data) + this.evt + this.xPath);

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
            phantom = spawn(config.parser.cmd, params);

            phantom.stdout.on('data', this.onStdOut);
            phantom.stderr.on('data', this.onStdErr);
            phantom.on('exit', this.onExit);
        } catch (err) {
            winston.error(err.message.red);
            this.handleError();
        }
    };

    /**
     * Execute CasperJS.
     *
     * @method execCasperjs
     * @return undefined
     */
    this.execCasperjs = function () {
        var idRequest = currentCrawler.sha1(this.url + this.type + JSON.stringify(this.data) + this.evt + this.xPath);

        var casper,
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
            casper = spawn(config.parser.cmd, params);

            casper.stdout.on('data', this.onStdOut);
            casper.stderr.on('data', this.onStdErr);
            casper.on('exit', this.onExit);
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
        this.url   = url;
        this.type  = type || 'GET';
        this.data  = data || {};
        this.evt   = evt || '';
        this.xPath = xPath || '';

        this.idUri = currentCrawler.sha1(this.url + this.type + JSON.stringify(this.data) + this.evt + this.xPath).substr(0, 8);

        var winstonCrawlerId = '[' + this.idUri.cyan + '-' + this.idCrawler.magenta + ']';

        winston.info(
            '%s Launching crawler to parse "%s" - %s on %s ...',
            winstonCrawlerId,
            ('' + this.url).green,
            (this.evt === '' ? 'N/A'.grey : this.evt.blue),
            (this.xPath === '' ? 'N/A'.grey : this.xPath.green)
        );

        if (config.parser.interface === 'phantom') {
            return this.execPhantomjs();
        } else if (config.parser.interface === 'casper') {
            return this.execCasperjs();
        }

        return undefined;
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

            currentCrawler.possibleCrawlers--;
            currentCrawler.checkRunningCrawlers('No items left to be processed');
            return;
        }

        newId = currentCrawler.sha1(container.url + container.type + JSON.stringify(container.data) + container.evt + container.xPath).substr(0, 8);

        winston.info(
            '%s' + ' Match not found in Redis. Continue (%s)'.grey,
            winstonCrawlerId,
            newId
        );
        client.hset(redisId, 'url', currentCrawler.url);

        var args = [
            __dirname + '/worker.js',
            currentCrawler.timeStart, currentCrawler.username, currentCrawler.password, currentCrawler.storeDetails,
            container.url, container.type, JSON.stringify(container.container), container.evt, container.xPath
        ];

        var childProcess = require('child_process').spawn('node', args, { detached: true });
        childProcess.stdout.on('data', spawnStdout);
        childProcess.stderr.on('data', spawnStderr);
        childProcess.on('exit', function () {
            currentCrawler.possibleCrawlers--;
            currentCrawler.checkRunningCrawlers('No items left to be processed');
        });
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

        redisId = currentCrawler.sha1(container.url + container.type + JSON.stringify(container.data) + container.evt + container.xPath);
        id      = redisId.substr(0, 8);

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

            if (optimist.argv.$0.indexOf('casperjs') === -1) {
                // TODO: This is called at the wrong time.
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

        currentCrawler.handleError();
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

        return currentCrawler.tries < config.crawler.attempts;
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
            '%s Execution terminated with status: %s',
            winstonCrawlerId,
            code === null ? 'null' : code
        );

        return currentCrawler.processPage(currentCrawler.processOutput);
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
        var reportName    = currentCrawler.sha1(currentCrawler.url + currentCrawler.type + JSON.stringify(currentCrawler.data) + currentCrawler.evt + currentCrawler.xPath);

        var Reporter = require('./reporter/report');
        var reporter = new Reporter();
        var reportContent = reporter.generateHTML(currentCrawler, reportName, report);

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

    // TODO: Duplicated!
    /**
     * Normalise the data, ordering the array.
     *
     * @method normaliseData
     * @param {String} data The data to be normalised.
     * @return {Object}
     */
    this.normaliseData = function (data) {
        var i, pair, vars, dataContainer = {},
            keys = [],
            sorted = {};

        if (typeof data !== 'string') {
            return {};
        }

        vars = data.replace(/.+\?/, '').split('&');

        if (vars.length === 0 || vars[0] === '') {
            return {};
        }

        for (i = 0; i < vars.length; i++) {
            pair = vars[i].split('=');
            keys.push(decodeURIComponent(pair[0]));
            dataContainer[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        keys = keys.sort();

        for (i in keys) {
            if (keys.hasOwnProperty(i)) {
                sorted[keys[i]] = dataContainer[keys[i]];
            }
        }

        return sorted;
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

                                newId = currentCrawler.sha1(currentCrawler.url + currentCrawler.type + JSON.stringify(currentCrawler.data) + event + links.events[event][signature][element]).substr(0, 8);

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

        currentCrawler.possibleCrawlers += links.a.length;
        links.a.forEach(function (element) {
            currentCrawler.checkAndRun(element, 'GET');
            //currentCrawler.checkAndRun(element, 'GET', data);
        });

        currentCrawler.possibleCrawlers += links.link.length;
        links.link.forEach(function (element) {
            currentCrawler.checkAndRun(element, 'GET');
            //currentCrawler.checkAndRun(element, 'GET', data);
        });

        currentCrawler.possibleCrawlers += links.script.length;
        links.script.forEach(function (element) {
            currentCrawler.checkAndRun(element, 'GET');
            //currentCrawler.checkAndRun(element, 'GET', data);
        });

        links.form.forEach(function (element) {
            var id        = element.action.toString().replace(/[^a-zA-Z0-9_]/g, '_'),
                fieldData = {},
                cases,
                i,
                j;

            for (i in element.fields) {
                if (element.fields.hasOwnProperty(i)) {
                    fieldData[element.fields[i]] = '';
                }
            }

            test.create(element.action, id + '-' + element.type, fieldData);
            //test.create(id + '-' + 'get', fieldData);
            //test.create(id + '-' + 'post', fieldData); // TODO: REMOVE DUPLICATE

            cases = test.getCases(element.action); // TODO: Possible duplicates
            currentCrawler.possibleCrawlers += cases.length;
            for (j in cases) {
                if (cases.hasOwnProperty(j)) {
                    currentCrawler.checkAndRun(element.action, element.type.toUpperCase(), []);

                    cases[j] = currentCrawler.normaliseData(cases[j]);
                    currentCrawler.checkAndRun(element.action, element.type.toUpperCase(), cases[j]);
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

        return currentCrawler.checkRunningCrawlers('No links in the page');
    };
};

function spawnStdout(data) { data = data.toString(); console.log(data.substr(0, data.length - 1)); };
function spawnStderr(data) { data = data.toString(); console.log(data.substr(0, data.length - 1).red); };

module.exports = Crawler;