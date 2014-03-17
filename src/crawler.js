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
 * The spawn's stdout callback.
 *
 * @method spawnStdout
 * @param {Object} data The data sent back from the worker.
 * @return undefined
 */
function spawnStdout(data) {
    data = data.toString();
    console.log(data.substr(0, data.length - 1));
}

/**
 * The spawn's stderr callback.
 *
 * @method spawnStderr
 * @param {Object} data The data sent back from the worker.
 * @return undefined
 */
function spawnStderr(data) {
    data = data.toString();
    console.log(data.substr(0, data.length - 1).red);
}

/**
 * Crawler Module
 *
 * @module Crawler
 */
var Crawler = function (config, spawn, crypto, test, client, winston, fs, optimist, utils, pool) {
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
    this.data = {
        GET:     {},
        POST:    {},
        COOKIE:  {},
        HEADERS: {},
        CONFIRM: {},
        PROMPT:  {}
    };

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
    this.username = '';

    /**
     * The password for HTTP Authentication.
     *
     * @property password
     * @type {String}
     * @default ""
     */
    this.password = '';

    /**
     * Flag to decide whether store the page details.
     *
     * @property storeDetails
     * @type {Boolean}
     * @default false
     */
    this.storeDetails = false;

    /**
     * Flag to decide whether follow redirects.
     *
     * @property followRedirects
     * @type {Boolean}
     * @default false
     */
    this.followRedirects = false;

    /**
     * Proxy settings.
     *
     * @property proxy
     * @type {String}
     * @default ""
     */
    this.proxy = '';

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
     * Politeness policy interval (millisec).
     *
     * @property politeInterval
     * @type {Integer}
     * @default 1000
     */
    this.politeInterval = 1000;

    /**
     * TBD
     *
     * @property sanitise
     * @type {Boolean}
     * @default false
     */
    this.sanitise = false;

    /**
     * Current instance.
     *
     * @property currentCrawler
     * @type {Object}
     * @default this
     */
    var currentCrawler = this;

    if (optimist !== undefined && winston !== undefined) {
        if (optimist.argv.$0.indexOf('casperjs --cli test') !== -1) {
            try { winston.remove(winston.transports.Console); } catch (ignore) {}
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
            if (optimist.argv.$0.indexOf('casperjs --cli test') === -1) {
                process.exit(1);
            }
        });

        this.idCrawler = process.pid.toString();
        winston.info('Started new crawler: %s'.magenta, this.idCrawler);
    };

    /**
     * Execute PhantomJS.
     *
     * @method execPhantomjs
     * @return undefined
     */
    this.execPhantomjs = function () {
        var idRequest = utils.sha1(this.url + this.type + JSON.stringify(this.data) + this.evt + this.xPath),
            phantom,
            params  = {
                idCrawler:       this.idUri,
                execId:          this.timeStart,
                idRequest:       idRequest,
                username:        this.username,
                password:        this.password,
                url:             this.url,
                type:            this.type,
                data:            this.data,
                evt:             this.evt,
                xPath:           this.xPath,
                storeDetails:    this.storeDetails,
                followRedirects: this.followRedirects,
                proxy:           this.proxy,
                sanitise:        this.sanitise,
                config:          config
            },
            auth,
            host,
            settings = [];

        if (this.proxy !== 'undefined') {
            auth = this.proxy.replace(/^(.+):(.+)@(.+):(.+)$/, '$1:$2');
            host = this.proxy.replace(/^(.+):(.+)@(.+):(.+)$/, '$3:$4');
            if (auth !== this.proxy) {
                settings.push('--proxy-auth=' + auth);
            }
            settings.push('--proxy=' + host);
        }
        settings.push('./src/parser/' + config.parser.interface + '.js');
        settings.push(JSON.stringify(params));

        try {
            phantom = spawn(config.parser.cmd, settings);

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
        this.url   = url;
        this.type  = type || 'GET';
        this.data  = data || {
            GET:     {},
            POST:    {},
            COOKIE:  {},
            HEADERS: {},
            CONFIRM: {},
            PROMPT:  {}
        };
        this.evt   = evt || '';
        this.xPath = xPath || '';

        this.idUri = utils.sha1(this.url + this.type + JSON.stringify(this.data) + this.evt + this.xPath).substr(0, 8);

        var winstonCrawlerId = '[' + this.idUri.cyan + '-' + this.idCrawler.magenta + ']';

        winston.debug('Waiting %s seconds to be polite', this.politeInterval);
        utils.sleep(this.politeInterval);

        winston.info(
            '%s Launching crawler to parse "%s" - %s on %s ...',
            winstonCrawlerId,
            String(this.url).green,
            (this.evt === '' ? 'N/A'.grey : this.evt.blue),
            (this.xPath === '' ? 'N/A'.grey : this.xPath.green)
        );

        if (config.parser.interface === 'phantom') {
            return this.execPhantomjs();
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
            newId;

        if (err) {
            throw err;
        }

        // reply is null when the key is missing
        if (reply !== null) {
            winston.debug(
                '%s' + ' Match found in Redis for "%s" (event: "%s" - XPath: "%s"). Skip'.yellow,
                winstonCrawlerId,
                container.url,
                container.evt,
                container.xPath
            );

            currentCrawler.possibleCrawlers--;
            return currentCrawler.checkRunningCrawlers('No items left to be processed');
        }

        newId = utils.sha1(container.url + container.type + JSON.stringify(container.data) + container.evt + container.xPath).substr(0, 8);

        winston.debug(
            '%s' + ' Match not found in Redis. Continue (%s)'.grey,
            winstonCrawlerId,
            newId
        );
        client.hset(redisId, 'url', currentCrawler.url);

        pool.addToQueue(
            {
                idUri:           1,
                timeStart:       currentCrawler.timeStart,
                idRequest:       Date.now(),
                username:        currentCrawler.username,
                password:        currentCrawler.password,
                url:             container.url,
                type:            container.type,
                data:            container.container,
                evt:             container.evt,
                xPath:           container.xPath,
                storeDetails:    currentCrawler.storeDetails,
                followRedirects: currentCrawler.followRedirects,
                proxy:           currentCrawler.proxy
            },
            {
                stdout: spawnStdout,
                stderr: spawnStderr,
                exit:   function () {
                    currentCrawler.possibleCrawlers--;
                    currentCrawler.checkRunningCrawlers('No items left to be processed');
                }
            }
        );
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
        container.data  = data || {
            GET:     {},
            POST:    {},
            COOKIE:  {},
            HEADERS: {},
            CONFIRM: {},
            PROMPT:  {}
        };
        container.evt   = evt || '';
        container.xPath = xPath || '';

        redisId = utils.sha1(container.url + container.type + JSON.stringify(container.data) + container.evt + container.xPath);
        id      = redisId.substr(0, 8);

        winstonCrawlerId = '[' + id.cyan + '-' + currentCrawler.idCrawler.magenta + ']';
        winston.debug(
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

            if (optimist.argv.$0.indexOf('casperjs cli --test') === -1) {
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
        var strPrint, winstonCrawlerId = '[' + currentCrawler.idUri.cyan + '-' + currentCrawler.idCrawler.magenta + ']';

        winston.debug(
            '%s Retrieved %d bytes.',
            winstonCrawlerId,
            data.toString().length
        );
        currentCrawler.processOutput += data.toString();

        strPrint = data.toString().replace(/###.+/, '').replace(/[\r\n]/g, '');
        if (strPrint !== '') {
            winston.debug(
                'Output from %s: %s'.grey,
                config.parser.interface.toUpperCase(),
                strPrint
            );
        }
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

        winston.debug('%s Retrieved response', winstonCrawlerId);
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

        if (currentCrawler.tries < config.crawler.attempts) {
            winston.info('%s' + ' Trying again in %s msec'.grey, winstonCrawlerId, config.crawler.delay);

            setTimeout(function () {
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
            }, config.crawler.delay);
        } else {
            var report = {
                errors:     [],
                alerts:     [],
                confirms:   [],
                prompts:    [],
                console:    [],
                failure:    true,
                resources:  {},
                time:       { start: 0, end: 0, total: 0 },
                content:    '',
                httpMethod: currentCrawler.type,
                event:      currentCrawler.evt,
                xPath:      currentCrawler.xPath,
                data:       currentCrawler.data
            };

            if (currentCrawler.storeDetails) {
                currentCrawler.storeDetailsToFile(report);
            }
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

        winston.debug(
            '%s Execution terminated with status: %s',
            winstonCrawlerId,
            code === null ? 'null' : code
        );

        return currentCrawler.processPage(currentCrawler.processOutput);
    };

    /**
     * Store the report details to a report file.
     *
     * @method storeDetailsToFile
     * @param {Object} report The report container.
     * @return undefined
     */
    this.storeDetailsToFile = function (report) {
        var Reporter      = require('./reporter/report'),
            reporter      = new Reporter(utils),
            reportName    = utils.sha1(currentCrawler.url + currentCrawler.type + JSON.stringify(currentCrawler.data) + currentCrawler.evt + currentCrawler.xPath),
            reportContent = reporter.generateHTML(currentCrawler, reportName, report),
            indexContent,
            reportFile,
            indexFile;

        indexContent = '<a href="' + reportName + '.html">' + currentCrawler.type + ' ' + currentCrawler.url + ' Data: ';
        indexContent    += JSON.stringify(currentCrawler.data) + ' Event: ' + (currentCrawler.evt === '' ? 'N/A' : currentCrawler.evt);
        indexContent    += ' XPath: ' + (currentCrawler.xPath === '' ? 'N/A' : currentCrawler.xPath) + '</a>\n';

        reportFile = __dirname + currentCrawler.REPORT_DIRECTORY + currentCrawler.timeStart + '/' + reportName + '.html';
        indexFile  = __dirname + currentCrawler.REPORT_DIRECTORY + currentCrawler.timeStart + '/index.html';
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
            newId,
            winstonCrawlerId = '[' + currentCrawler.idUri.cyan + '-' + currentCrawler.idCrawler.magenta + ']';

        winston.info('%s Processing response...', winstonCrawlerId);

        try {
            result = JSON.parse(content.replace(/\n/g, '').replace(/.*###/m, ''));

            winston.debug('%s Response ready', winstonCrawlerId);
        } catch (err) {
            winston.error('%s %s', winstonCrawlerId, err.toString().red);
            this.handleError();
            return;
        }

        links = result.links;

        if (currentCrawler.storeDetails) {
            currentCrawler.storeDetailsToFile(result.report);
        }

        if (Object.keys(links).length !== 0) {
            utils.loopEach(links.events, function (event, eventValue) {
                utils.loopEach(eventValue, function (signature, signatureValue) {
                    utils.loopEach(signatureValue, function (element, elementValue) {
                        if (element !== undefined) {
                            currentCrawler.possibleCrawlers++;

                            newId = utils.sha1(currentCrawler.url + currentCrawler.type + JSON.stringify(currentCrawler.data) + event + elementValue).substr(0, 8);

                            winston.debug(
                                '%s Firing %s on "%s" (%s)...',
                                winstonCrawlerId,
                                event.toUpperCase().blue,
                                elementValue.green,
                                newId.cyan
                            );
                            currentCrawler.checkAndRun(currentCrawler.url, currentCrawler.type, currentCrawler.data, event, elementValue);
                        }
                    });
                });
            });

            currentCrawler.possibleCrawlers += links.a.length;
            links.a.forEach(function (element) {
                currentCrawler.checkAndRun(element, 'GET');
            });

            currentCrawler.possibleCrawlers += links.link.length;
            links.link.forEach(function (element) {
                currentCrawler.checkAndRun(element, 'GET');
            });

            currentCrawler.possibleCrawlers += links.script.length;
            links.script.forEach(function (element) {
                currentCrawler.checkAndRun(element, 'GET');
            });

            currentCrawler.possibleCrawlers += links.meta.length;
            links.meta.forEach(function (element) {
                currentCrawler.checkAndRun(element, 'GET');
            });

            links.form.forEach(function (element) {
                var fieldData = {},
                    cases,
                    i,
                    j;

                for (i in element.fields) {
                    if (element.fields.hasOwnProperty(i)) {
                        fieldData[element.fields[i]] = '';
                    }
                }

                var data = {
                    GET:     {},
                    POST:    fieldData,
                    COOKIE:  {},
                    HEADERS: {},
                    CONFIRM: result.report.confirms.filter(utils.onlyUnique),
                    PROMPT:  result.result.prompts.filter(utils.onlyUnique)
                };
                test.createNewCaseFile(element.action, element.type, data);

                cases = test.getCases(element.action); // TODO: Possible duplicates?
                currentCrawler.possibleCrawlers += cases.length;
                for (j in cases) {
                    if (cases.hasOwnProperty(j)) {
                        currentCrawler.checkAndRun(element.action, element.type.toUpperCase(), []);

                        cases[j].POST = utils.normaliseData(cases[j].POST);
                        currentCrawler.checkAndRun(element.action, element.type.toUpperCase(), cases[j]);
                    }
                }
            });

            // TODO: Add default values for GET, COOKIE and HEADERS from the current page.
            var confirms = result.report.confirms || [],
                data = {
                    GET:     [],
                    POST:    [],
                    COOKIE:  [],
                    HEADERS: [],
                    CONFIRM: confirms.filter(utils.onlyUnique),
                    PROMPT:  confirms.filter(utils.onlyUnique),
                },
                cases;
            test.createNewCaseFile(currentCrawler.url, currentCrawler.type, data);
            cases = test.getCases(currentCrawler.url); // TODO: Possible duplicates?
            currentCrawler.possibleCrawlers += cases.length;
            for (var j in cases) {
                if (cases.hasOwnProperty(j)) {
                    cases[j].GET    = utils.normaliseData(cases[j].GET);
                    cases[j].POST   = utils.normaliseData(cases[j].POST);
                    cases[j].COOKIE = utils.normaliseData(cases[j].COOKIE);
                    currentCrawler.checkAndRun(currentCrawler.url, currentCrawler.type, cases[j]);
                }
            }
        }

        return currentCrawler.checkRunningCrawlers('No links in the page');
    };
};

module.exports = Crawler;
