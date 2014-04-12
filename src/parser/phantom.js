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

var Parser     = require('../parser'),
    fs         = require('fs'),
    spawn      = require('child_process').spawn,
    utils      = new (require('../utils'))(),
    system     = typeof GLOBAL !== 'undefined' && typeof GLOBAL.system !== 'undefined' ? GLOBAL.system : require('system'),
    args       = system.args || system.argv,
    testing    = args.join(' ').indexOf('jasmine-node') !== -1 || args.join(' ').indexOf('grunt') !== -1,
    settings   = !testing ? JSON.parse(args[1]) : {},
    webpageObj = typeof webpage !== 'undefined' ? webpage : require('webpage'),
    page       = webpageObj.create();

/**
 * PhantomParser Class.
 *
 * Use PhantomJS in order to process the page and get all the links and
 * relevant information for the crawler.
 *
 * @class PhantomParser
 * @extends Parser
 */
var PhantomParser = function (utils, spawn, page, settings) {
    /**
     * The WebPage element.
     *
     * @property page
     * @type {Object}
     * @default {Object}
     */
    this.page = page;

    /**
     * Sanitised HTML content.
     *
     * @property sanitisedHtml
     * @type {String}
     * @default ""
     */
    this.sanitisedHtml = '';

    /**
     * Current instance.
     *
     * @property currentCrawler
     * @type {Object}
     * @default this
     */
    var currentParser = this;

    /**
     * Reset all the containers.
     *
     * @method reset
     * @return undefined
     */
    this.reset = function () {
        this.resetHttpHeaders(this.page);
        this.resetCookie(this.page);
        this.resetStack();
        this.resetReport();
    };

    /**
     * Configure all the callbacks for PhantomJS.
     *
     * @method setUpPage
     * @return undefined
     */
    this.setUpPage = function (page) {
        page.settings.resourceTimeout = settings.config.parser.timeout;
        page.onResourceTimeout        = this.onResourceTimeout;
        page.onError                  = this.onError;
        page.onInitialized            = this.onInitialized;
        page.onResourceReceived       = this.onResourceReceived;
        page.onAlert                  = this.onAlert;
        page.onConfirm                = this.onConfirm;
        page.onPrompt                 = this.onPrompt;
        page.onConsoleMessage         = this.onConsoleMessage;
        page.onNavigationRequested    = this.onNavigationRequested;
        page.viewportSize             = { width: 1024, height: 800 };
        page.settings.userAgent       = 'salmonJS/0.4.0 (+http://www.salmonjs.org)';

        this.setHttpHeaders(page);
    };

    /**
     * Set some HTTP headers for the request.
     *
     * @method setHttpHeaders
     * @param {Object} page The WebPage object.
     * @return undefined
     */
    this.setHttpHeaders = function (page) {
        var customHeaders = {};

        //customHeaders['Accept-Encoding'] = 'gzip,deflate';
        customHeaders.Connection = 'keep-alive';

        if (settings.username !== null && settings.password !== null) {
            customHeaders.Authorization = 'Basic ' + btoa(settings.username + ':' + settings.password);
        }

        page.customHeaders = customHeaders;
    };

    /**
     * Reset the HTTP header container.
     *
     * @method resetHttpHeaders
     * @param {Object} page The WebPage object.
     * @return undefined
     */
    this.resetHttpHeaders = function (page) {
        page.customHeaders = {};
    };

    /**
     * Handle the querysting for the URL request.
     *
     * @method handleQueryString
     * @return undefined
     */
    this.handleQueryString = function () {
        var currentQS = this.url.replace(/.*\?(.+)(#.*)?/, '$1');
        currentQS = currentQS === this.url ? '' : currentQS;
        currentQS = utils.normaliseData(currentQS);
        var get = this.data.GET || {};
        for (var p in get) {
            if (get.hasOwnProperty(p)) {
                currentQS[p] = get[p];
            }
        }

        var getParams = utils.arrayToQuery(utils.normaliseData(utils.arrayToQuery(currentQS)));
        this.url = this.url.replace(/\?(.+)(#.*)?/, '') + (getParams !== '' ? ('?' + getParams) : '');
    };

    /**
     * Add a cookie for the current request.
     *
     * @method addCookie
     * @param {Object} data The cookie settings.
     * @return {Boolean}
     */
    this.addCookie = function(data) {
        var res = this.page.addCookie(data);
        if (!res) {
            res = phantom.addCookie(data);
        }

        return res;
    };

    /**
     * Reset the cookie container.
     *
     * @method resetCookie
     * @param {Object} page The WebPage object.
     * @return undefined
     */
    this.resetCookie = function (page) {
        phantom.clearCookies();
        page.clearCookies();
    };

    /**
     * Parse the URL as GET request.
     *
     * @method parseGet
     * @return undefined
     */
    this.parseGet = function () {
        this.handleQueryString();

        // InitPhantomJs
        this.setUpPage(this.page);

        for (var cookie in this.data.COOKIE) {
            if (this.data.COOKIE.hasOwnProperty(cookie)) {
                var domain = '';
                if (this.url.substr(0, 7) !== 'file://') {
                    domain = this.url.replace(/^http(s)?:\/\/([^\/]+)\/?.*$/, '$2');
                }

                this.addCookie({
                    'name'   : cookie,
                    'value'  : this.data.COOKIE[cookie],
                    'domain' : domain
                });
            }
        }

        var headers = {};
        // TODO: Add a method
        for (var header in this.page.customHeaders) {
            if (this.page.customHeaders.hasOwnProperty(header)) {
                headers[header] = this.page.customHeaders[header];
            }
        }

        for (header in this.data.HEADERS) {
            if (this.data.HEADERS.hasOwnProperty(header)) {
                headers[header] = this.data.HEADERS[header];
            }
        }
        this.page.customHeaders = headers;

        // RestoreFreezedInstance: set all the variables need for ReExecuteJsEvents

        // Open
        this.page.open(this.url, this.onOpen);
        this.page.onLoadFinished = this.onLoadFinished;
    };

    /**
     * Parse the URL as POST request.
     *
     * @method parsePost
     * @return undefined
     */
    this.parsePost = function () {
        this.handleQueryString();

        this.setUpPage(this.page);

        for (var cookie in this.data.COOKIE) {
            if (this.data.COOKIE.hasOwnProperty(cookie)) {
                var domain = '';
                if (this.url.substr(0, 7) !== 'file://') {
                    domain = this.url.replace(/^http(s)?:\/\/([^\/]+)\/?.*$/, '$2');
                }

                this.addCookie({
                    'name'   : cookie,
                    'value'  : this.data.COOKIE[cookie],
                    'domain' : domain
                });
            }
        }

        var headers = {};
        for (var header in this.page.customHeaders) {
            if (this.page.customHeaders.hasOwnProperty(header)) {
                headers[header] = this.page.customHeaders[header];
            }
        }

        for (header in this.data.HEADERS) {
            if (this.data.HEADERS.hasOwnProperty(header)) {
                headers[header] = this.data.HEADERS[header];
            }
        }
        this.page.customHeaders = headers;

        var doNotContinue = false;
        for (var i in this.data.POST) {
            if (this.data.POST.hasOwnProperty(i)) {
                if (this.data.POST[i].toString().substr(0, 1) === '@' && fs.exists(this.data.POST[i].toString().substr(1))) {
                    doNotContinue = true;
                    this.spawnAndUseNodeJs(this.url, this.data.POST);
                }
            }
        }

        if (!doNotContinue) {
            this.page.open(this.url, 'post', this.data.POST, this.onOpen);
            this.page.onLoadFinished = this.onLoadFinished;
        }
    };

    /**
     * In case an upload is required, open another process (upload.js) in order
     * to upload the file(s) defined in the data object.
     * Then set the output as page content for the current request and trigger
     * the onLoadFinished to process it.
     *
     * @method spawnAndUseNodeJs
     * @param {String} url  The URL where upload the data
     * @param {Object} data The data to be uploaded
     * @return undefined
     */
    this.spawnAndUseNodeJs = function (url, data) {
        var args    = [ fs.workingDirectory + '/src/upload.js', url, JSON.stringify(data) ],
            process = spawn('node', args);

        process.stdout.on('data', function(data) {
            currentParser.page.setContent(data, currentParser.url);
            //currentParser.page.onInitialized(); // TODO: It crashes phantomjs
            currentParser.onLoadFinished();
        });

        process.stderr.on('data', function() {
            return currentParser.exit();
        });
    };

    /**
     * Handle the request to change the current URL.
     *
     * @method onNavigationRequested
     * @param {String} url The target URL of this navigation event
     * @return undefined
     */
    this.onNavigationRequested = function (url) {
        // TODO: What to do with reloads?
        // TODO: There is a random bug here.
        if (url !== 'about:blank' && !settings.followRedirects && url.indexOf(currentParser.url) === -1) {
            return currentParser.exit();
        }

        return undefined;
    };

    /**
     * Push the WebPage in the stack of the unprocessed ones after firing the
     * requested JS event.
     *
     * @method putPageInStack
     * @param {Object} page  The WebPage instance to be cloned.
     * @param {String} evt   The event to fire.
     * @param {String} xPath The XPath expression to identify the element to fire.
     * @return undefined
     */
    this.putPageInStack = function (page, evt, xPath) {
        var id, pageFork = currentParser.cloneWebPage(page);

        // TODO: Do I want to get a "snapshot" freezing the current instance? (page, url, content, type, event & xPath)
        id = evt + xPath;

        if (currentParser.stepHashes.indexOf(id) === -1) {
            currentParser.stepHashes.push(id);
            console.log('FIRE(' + evt + ', ' + xPath + ')');

            if (xPath.substr(0, 1) !== '/') {
                pageFork.evaluate(utils.fireEventObject, {event: evt, xPath: xPath});
            } else {
                pageFork.evaluate(utils.fireEventDOM, {event: evt, xPath: xPath});
            }

            currentParser.stackPages.push(pageFork);
        }
    };

    /**
     * Reset the stackPages container.
     *
     * @method resetStack
     * @return undefined
     */
    this.resetStack = function () {
        currentParser.stackPages = [];
    };

    /**
     * Stop the execution of the current parser and return the data scraped.
     *
     * @method exit
     * @return undefined
     */
    this.exit = function () {
        var response;

        response = {
            idCrawler: settings.idCrawler,
            links:     currentParser.links,
            report:    currentParser.report
        };

        console.log('###' + JSON.stringify(response));
        if (args.join(' ').indexOf('jasmine-node') === -1) {
            phantom.exit(); // TODO: This will crash PhantomJS
        }
    };

    /**
     * Callback fired when the page has been opened.
     *
     * @method onOpen
     * @param {String} status The page return status
     * @return undefined
     */
    this.onOpen = function (status) {
        currentParser.report.time.end = Date.now();
        currentParser.report.time.total = currentParser.report.time.end - currentParser.report.time.start;

        if (status === 'success') {
            //currentParser.page.navigationLocked = true;
        }
    };

    /**
     * Callback fired when the page goes on timeout.
     *
     * @method onResourceTimeout
     * @return undefined
     */
    this.onResourceTimeout = function () {
        currentParser.exit();

        return true;
    };

    /**
     * Callback fired when the page has thrown an error.
     *
     * @method onError
     * @param {String} msg   The error message
     * @param {Array}  trace The stack trace
     * @return undefined
     */
    this.onError = function (msg, trace) {
        var msgStack = ['ERROR: ' + msg];

        if (trace && trace.length) {
            msgStack.push('TRACE:');
            trace.forEach(function (t) {
                msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
            });
        }

        currentParser.report.errors.push(msgStack.join('\n'));
    };

    /**
     * Callback invoked after the web page is created but before a URL is
     * loaded.
     *
     * @method onInitialized
     * @param {Object} page The WebPage instance
     * @return undefined
     */
    this.onInitialized = function (page) {
        var currPage = page || currentParser.page;

        currPage.injectJs('../sha1.js');
        currPage.injectJs('../events.js');
    };

    /**
     * Callback invoked when the a resource requested by the page is received.
     *
     * @method onResourceReceived
     * @param {Object} response The response metadata object
     * @return undefined
     */
    this.onResourceReceived = function (response) {
        if (response.stage === 'end') {
            currentParser.report.resources[response.url] = {
                headers: response.headers
            };
        }
    };

    /**
     * Callback invoked when there is a JavaScript alert on the web page.
     *
     * @method onAlert
     * @param {String} msg The string for the message
     * @return undefined
     */
    this.onAlert = function (msg) {
        currentParser.report.alerts.push(msg);
    };

    /**
     * Callback invoked when there is a JavaScript confirm on the web page.
     *
     * @method onConfirm
     * @param {String} msg The string for the message
     * @return undefined
     */
    this.onConfirm = function (msg) {
        var retVal = true;

        // possible entrypoints: parseGet, putPageInStack.
        currentParser.report.confirms.push(msg);
        if (settings.data !== undefined && settings.data.CONFIRM !== undefined && settings.data.CONFIRM[msg] !== undefined) {
            retVal = settings.data.CONFIRM[msg];
        }

        // `true` === pressing the "OK" button, `false` === pressing the "Cancel" button
        return retVal;
    };

    /**
     * Callback invoked when there is a JavaScript prompt on the web page.
     *
     * @method onPrompt
     * @param {String} msg        The string for the message
     * @param {String} defaultVal The default value for the prompt answer
     * @return undefined
     */
    this.onPrompt = function (msg, defaultVal) {
        currentParser.report.prompts.push({msg: msg, defaultVal: defaultVal});

        // possible entrypoints: parseGet, putPageInStack.
        if (settings.data !== undefined && settings.data.PROMPT !== undefined && settings.data.PROMPT[msg] !== undefined) {
            return settings.data.PROMPT[msg];
        }

        return defaultVal;
    };

    /**
     * Callback invoked when there is a JavaScript console message on the web
     * page.
     *
     * @method onConsoleMessage
     * @param {String}  msg      The string for the message
     * @param {Integer} lineNum  The line number
     * @param {String}  sourceId The source identifier
     * @return undefined
     */
    this.onConsoleMessage = function (msg, lineNum, sourceId) {
        currentParser.report.console.push({msg: msg, lineNum: lineNum, sourceId: sourceId});
    };

    /**
     * Reset the report and links containers.
     *
     * @method resetReport
     * @return undefined
     */
    this.resetReport = function () {
        this.report = {
            errors:     [],
            alerts:     [],
            confirms:   [],
            prompts:    [],
            console:    [],
            failure:    false,
            resources:  {},
            time:       { start: 0, end: 0, total: 0 },
            content:    '',
            httpMethod: '',
            event:      '',
            xPath:      '',
            data:       {}
        };

        this.links = {
            a:      [],
            link:   [],
            script: [],
            meta:   [],
            form:   [],
            events: []
        };
    };

    /**
     * Callback fired when the page has been loaded properly.
     *
     * @method onLoadFinished
     * @return undefined
     */
    this.onLoadFinished = function () {
        if (settings.sanitise) {
            var tmp_fn  = fs.workingDirectory + '/file_' + ((new Date()).getTime()) + '.html',
                args    = [ fs.workingDirectory + '/src/tidy.js', tmp_fn ],
                process;

            fs.write(tmp_fn, page.content, 0777);
            process = spawn('node', args);

            process.stdout.on('data', function(data) {
                try { fs.remove(tmp_fn); } catch (ignore) {}
                currentParser.sanitisedHtml += data.toString();
            });

            process.stderr.on('data', function(data) {
                try { fs.remove(tmp_fn); } catch (ignore) {}
                console.log(data.toString());
                return currentParser.exit();
            });

            process.on('exit', function() {
                try { fs.remove(tmp_fn); } catch (ignore) {}

                if (page.content !== currentParser.sanitisedHtml) {
                    console.log('HTML sanitised');
                }

                //TODO: What to do if it exits before receive data?
                currentParser.page.setContent(currentParser.sanitisedHtml, currentParser.url);
                currentParser.evaluateAndParse();
            });
        } else {
            currentParser.evaluateAndParse();
        }
    };

    /**
     * Evaluate and parse the current page request.
     *
     * @method evaluateAndParse
     * @return undefined
     */
    this.evaluateAndParse = function () {
        var step;

        // ReExecuteJsEvents
        // Execute all the events to be sure to follow the right path to the
        // right page to be processed.
        for (step in currentParser.stepStack) {
            if (currentParser.stepStack[step].event !== '' && currentParser.stepStack[step].xPath !== '') {
                if (currentParser.stepStack[step].xPath[0] !== '/') {
                    currentParser.page.evaluate(utils.fireEventObject, currentParser.stepStack[step]);
                } else {
                    currentParser.page.evaluate(utils.fireEventDOM, currentParser.stepStack[step]);
                }
            }
        }

        // Process
        currentParser.parsePage(currentParser.page);
    };

    /**
     * Clone the specified WebPage.
     *
     * @method cloneWebPage
     * @param  {Object} page The WebPage instance to be cloned.
     * @return {Object}
     */
    this.cloneWebPage = function (page) {
        var newPage = webpageObj.create();

        currentParser.setUpPage(newPage);
        newPage.setContent(page.content, page.url);
        newPage.onInitialized(newPage);

        return newPage;
    };

    /**
     * Parse the page to get the information needed.
     *
     * @method parsePage
     * @param {Object} page The WebPage instance
     * @return undefined
     */
    this.parsePage = function (page) {
        var url, links = {}, events;

        currentParser.report.content = page.content;

        url = page.evaluate(function () {
            return document.location.href;
        });

        if (page.content.indexOf('<html') !== -1) {
            if (settings.storeDetails && settings.storeDetails !== 'undefined') {
                fs.makeDirectory(fs.absolute(settings.storeDetails) + '/' + settings.execId + '/');
                page.render(fs.absolute(settings.storeDetails) + '/' + settings.execId + '/' + settings.idRequest + '.png');
            }

            links = page.evaluate(currentParser.onEvaluate, currentParser.tags);

            // TODO: What if an event will change url? will it be processed in here or just returned back to the crawler?
            events = page.evaluate(function () {
                return window.eventContainer !== undefined ? window.eventContainer.getEvents() : [];
            });

            utils.loopEach(events, function(type, type_value) {
                utils.loopEach(type_value, function(act, act_value) {
                    utils.loopEach(act_value, function(evt, evt_value) {
                        currentParser.putPageInStack(page, type, evt_value);
                    });
                });
            });

            for (var tag in links) {
                if (links.hasOwnProperty(tag) && tag !== 'form') {
                    currentParser.links[tag] = [].map.call(links[tag], function (item) {
                        return utils.normaliseUrl(item, url);
                    }).concat(currentParser.links[tag]).filter(utils.onlyUnique);
                }
            }

            currentParser.links.form = [].map.call(links.form, function (item) {
                item.action = item.action || url;
                item.action = utils.normaliseUrl(item.action, url);

                if (item.action === undefined) {
                    return undefined;
                }

                return item;
            }).concat(currentParser.links.form).filter(utils.onlyUnique);

            while (Object.keys(currentParser.stackPages).length !== 0) {
                currentParser.parsePage(currentParser.stackPages.pop());
            }
        }

        links = page.evaluate(currentParser.onEvaluateNonHtml, page.content);

        if (links.hasOwnProperty('mixed_full')) {
            currentParser.links.mixed_full = [].map.call(links.mixed_full, function (item) {
                return utils.normaliseUrl(item, url);
            }).concat(currentParser.links.mixed).filter(utils.onlyUnique);
        }
        if (links.hasOwnProperty('mixed_rel')) {
            currentParser.links.mixed_rel = [].map.call(links.mixed_rel, function (item) {
                item = item.replace(/^['"](.+)['"]$/, '$1');
                return utils.normaliseUrl(item, url);
            }).concat(currentParser.links.mixed).filter(utils.onlyUnique);
        }

        currentParser.exit();
    };

    /**
     * Callback fired to evaluate the page content.
     *
     * @method onEvaluate
     * @return {Object} A list of links (anchors, links, scripts and forms).
     */
    this.onEvaluate = function () {
        var urls = {},
            currentUrl = document.location.href,
            attribute,
            tag,
            links,
            tags = arguments[0];

        for (tag in tags) {
            if (tags.hasOwnProperty(tag)) {
                urls[tag] = [];
                attribute = tags[tag];
                if (typeof attribute === 'object') {
                    for (var attr in attribute) {
                        if (attribute.hasOwnProperty(attr)) {
                            links = [].map.call(document.querySelectorAll(tag), function (item) {
                                return item[attr];
                            });
                            if (links.length > 0) {
                                urls[tag] = urls[tag].concat(links);
                            }
                        }
                    }
                } else {
                    urls[tag] = [].map.call(document.querySelectorAll(tag), function (item) {
                        return item[attribute];
                    });
                }
            }
        }

        urls.meta = [].map.call(document.querySelectorAll('meta'), function (item) {
            if (item.getAttribute('http-equiv') === 'refresh') {
                return item.getAttribute('content').split(/=/, 2)[1];
            }

            return undefined;
        });

        urls.form = [].map.call(document.querySelectorAll('form'), function (item) {
            var input, select, textarea;

            input = [].map.call(item.getElementsByTagName('input'), function (item) {
                return item.getAttribute('name');
            });

            select = [].map.call(item.getElementsByTagName('select'), function (item) {
                return item.getAttribute('name');
            });

            textarea = [].map.call(item.getElementsByTagName('textarea'), function (item) {
                return item.getAttribute('name');
            });

            return {
                action: item.getAttribute('action') || currentUrl,
                type:   item.getAttribute('method') || 'get',
                fields: input.concat(select).concat(textarea)
            };
        });

        return urls;
    };

    /**
     * Retrieve all the links in the page.
     * Generally used when the page is not HTML.
     *
     * @method onEvaluateNonHtml
     * @return {Object}
     */
    this.onEvaluateNonHtml = function () {
        var urls          = {
                mixed: [],
            },
            content       = arguments[0],
            protocol      = '((https?|ftp):)?',
            credentials   = '([\\w]+:\\w+@)?',
            hostname      = '(([a-z0-9]|[a-z0-9][a-z0-9\\-]*[a-z0-9])\\.)*([a-z0-9]|[a-z0-9][a-z0-9\\-]*[a-z0-9])',
            ip            = '(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])',
            port          = '(:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?',
            path_char     = '(([a-z0-9\\-_.!~*\'\\(\\):@&=+$,])|(%[0-9a-f][0-9a-f]))',
            path          = path_char + '*(?:;' + path_char + '*)*(?:/' + path_char + '*(?:;' + path_char + '*)*)*',
            querystring   = '(\\?' + path_char + '*)?',
            hash          = '(#' + path_char + '*)?',
            regex_fullurl = new RegExp(
                '(' + protocol + '//' + credentials + '(' + hostname + '|' + ip + ')' + port + '/' + path + querystring + hash + ')',
                'igm'
            ),
            regex_relurl = new RegExp(
                '\'('+path+')\'|"('+path+')"',
                'igm'
            );

        urls.mixed_full = content.match(regex_fullurl);
        urls.mixed_rel  = content.match(regex_relurl);

        return urls;
    };
};

PhantomParser.prototype = new Parser();
if (args.join(' ').indexOf('jasmine-node') === -1 && args.join(' ').indexOf('grunt') === -1) {
    new PhantomParser(utils, spawn, page, settings).parse(settings.url, settings.type, settings.data, settings.evt, settings.xPath);
} else {
    module.exports = PhantomParser;
}
