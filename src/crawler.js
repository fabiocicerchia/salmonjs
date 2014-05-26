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
 * Crawler Class
 *
 * It call the parser (PhantomJS) to retrieve all the information from the URL,
 * then process each URL found to check if it's already been processed, if not
 * queue it in the pool.
 *
 * @class Crawler
 */
var Crawler = function (config, spawn, test, client, winston, fs, optimist, utils) {
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
     * Sanitisation flag (in order to fix broken/invalid HTML).
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
        if (optimist.argv.$0.indexOf('jasmine-node') !== -1 && optimist.argv.$0.indexOf('grunt') !== -1) {
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
            if (optimist.argv.$0.indexOf('jasmine-node') === -1 && optimist.argv.$0.indexOf('grunt') === -1) {
                process.exit(1);
            }
        });

        this.idCrawler = process.pid.toString();
        winston.info('Started new crawler: %s'.magenta, this.idCrawler);
    };

    /**
     * Execute sub-process
     *
     * @method execSubProcess
     * @return undefined
     */
    this.execSubProcess = function () {
        var idRequest = utils.sha1(this.url + this.type + JSON.stringify(this.data) + this.evt + this.xPath),
            subprocess,
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

        if (this.proxy !== null) {
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
            subprocess = spawn(config.parser.cmd, settings);

            subprocess.stdout.on('data', this.onStdOut);
            subprocess.stderr.on('data', this.onStdErr);
            subprocess.on('error', function (err) {
                winston.error(err.red);
                this.handleError();
            });
            subprocess.on('exit', this.onExit);
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
     * @param {Object} settings The information about url, request type, data to send, event and XPath.
     * @return undefined
     */
    this.run = function (settings) {
        this.url   = settings.url;
        this.type  = settings.type || 'GET';
        this.data  = settings.data || {
            GET:     {},
            POST:    {},
            COOKIE:  {},
            HEADERS: {},
            CONFIRM: {},
            PROMPT:  {}
        };
        this.evt   = settings.evt || '';
        this.xPath = settings.xPath || '';

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
            return this.execSubProcess();
        }

        return undefined;
    };

    /**
     * Analise the Redis response and eventually launch a new crawler.
     *
     * @method analiseRedisResponse
     * @param {} err
     * @param {} reply
     * @param {String} redisId
     * @param {Object} container
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

        if (optimist.argv.$0.indexOf('jasmine-node') === -1 && optimist.argv.$0.indexOf('grunt') === -1) {
            process.send({
                queue: {
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
                }
            });
        }
        currentCrawler.possibleCrawlers--;
        currentCrawler.checkRunningCrawlers('No items left to be processed');
    };

    /**
     * Check if already crawled, if not so launch a new crawler.
     *
     * @method checkAndRun
     * @param {Object} settings The information about url, request type, data to send, event and XPath.
     * @return undefined
     */
    this.checkAndRun = function (settings) {
        var container   = {},
            redisId,
            id,
            winstonCrawlerId;

        container.url   = settings.url.action || settings.url;
        container.type  = settings.type || 'GET';
        container.data  = settings.data || {
            GET:     {},
            POST:    {},
            COOKIE:  {},
            HEADERS: {},
            CONFIRM: {},
            PROMPT:  {}
        };
        container.evt   = settings.evt || '';
        container.xPath = settings.xPath || '';

        redisId = utils.sha1(container.url + container.type + JSON.stringify(container.data) + container.evt + container.xPath);
        id      = redisId.substr(0, 8);

        winstonCrawlerId = '[' + id.cyan + '-' + currentCrawler.idCrawler.magenta + ']';

        var protocol = container.url.split(/:/)[0].toLowerCase();
        if (protocol !== 'http' && protocol !== 'https' && protocol !== 'file') {
            winston.warn('%s ' + 'Skipping not supported URL: %s'.yellow, winstonCrawlerId, container.url);

            currentCrawler.possibleCrawlers--;
            currentCrawler.checkRunningCrawlers('No items left to be processed');
            return;
        }

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

            if (optimist.argv.$0.indexOf('jasmine-node') === -1 && optimist.argv.$0.indexOf('grunt') === -1) {
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
                    {
                        url:   currentCrawler.url,
                        type:  currentCrawler.type,
                        data:  currentCrawler.data,
                        evt:   currentCrawler.event,
                        xPath: currentCrawler.xPath
                    }
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

            if (currentCrawler.storeDetails && currentCrawler.storeDetails !== 'undefined') {
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

        indexContent  = '<a href="' + reportName + '.html">' + currentCrawler.type + ' ' + currentCrawler.url + ' Data: ';
        indexContent += JSON.stringify(currentCrawler.data) + ' Event: ' + (currentCrawler.evt === '' ? 'N/A' : currentCrawler.evt);
        indexContent += ' XPath: ' + (currentCrawler.xPath === '' ? 'N/A' : currentCrawler.xPath) + '</a>\n';

        reportFile = currentCrawler.storeDetails + '/' + currentCrawler.timeStart + '/' + reportName + '.html';
        indexFile  = currentCrawler.storeDetails + '/' + currentCrawler.timeStart + '/index.html';
        if (!fs.existsSync(currentCrawler.storeDetails + '/' + currentCrawler.timeStart + '/')) {
            fs.mkdirSync(currentCrawler.storeDetails + '/' + currentCrawler.timeStart + '/', '0777');
        }
        fs.writeFileSync(reportFile, reportContent);
        fs.appendFileSync(indexFile, indexContent, {flag: 'a+'});
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

        if (currentCrawler.storeDetails && currentCrawler.storeDetails !== 'undefined') {
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
                            currentCrawler.checkAndRun(
                                {
                                    url:   currentCrawler.url,
                                    type:  currentCrawler.type,
                                    data:  currentCrawler.data,
                                    evt:   event,
                                    xPath: elementValue
                                }
                            );
                        }
                    });
                });
            });

            var unique_links = [];
            utils.loopEach(links, function (tag, links_tag) {
                if (tag !== 'form' && tag !== 'events') {
                    utils.loopEach(links_tag, function (id, element) {
                        unique_links.push(element);
                    });
                }
            });

            unique_links = unique_links.filter(utils.onlyUnique);
            utils.loopEach(unique_links, function (id, element) {
                if (element !== currentCrawler.url) {
                    currentCrawler.possibleCrawlers++;
                    currentCrawler.checkAndRun({ url: element, type: 'GET'});
                }
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
                    PROMPT:  result.report.prompts.filter(utils.onlyUnique)
                };
                test.createNewCaseFile(element.action, element.type, data);

                cases = test.getCases(element.action); // TODO: Possible duplicates?
                currentCrawler.possibleCrawlers += cases.length;
                for (j in cases) {
                    if (cases.hasOwnProperty(j)) {
                        currentCrawler.checkAndRun({ url: element.action, type: element.type.toUpperCase(), data: []});

                        cases[j].POST = utils.normaliseData(cases[j].POST);
                        currentCrawler.checkAndRun({ url: element.action, type: element.type.toUpperCase(), data: cases[j]});
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
                    currentCrawler.checkAndRun({ url: currentCrawler.url, type: currentCrawler.type, data: cases[j]});
                }
            }
        }

        return currentCrawler.checkRunningCrawlers('No links in the page');
    };
};

module.exports = Crawler;
