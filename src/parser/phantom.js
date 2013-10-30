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

var Parser    = require('../../src/parser'),
    config    = require('../../src/config'),
    idCrawler = require('system').args[1],
    username  = require('system').args[2],
    password  = require('system').args[3],
    url       = require('system').args[4],
    type      = require('system').args[5],
    data      = require('system').args[6],
    evt       = require('system').args[7],
    xPath     = require('system').args[8],
    page      = require('webpage').create();

if (username !== undefined && password !== undefined) {
    page.customHeaders = {
        'Authorization': 'Basic ' + btoa(username + ':' + password)
    };
}

/**
 * PhantomParser Class.
 *
 * @class PhantomParser
 * @extends Parser
 */
var PhantomParser = function () {
    /**
     * The event to be fired.
     *
     * @property event
     * @type {String}
     * @default ""
     */
    this.event = '';

    /**
     * The XPath expression to be evaluated.
     *
     * @property xPath
     * @type {String}
     * @default ""
     */
    this.xPath = '';

    this.report = {
        errors:     [],
        alerts:     [],
        confirms:   [],
        console:    [],
        resources:  {},
        time:       { start: 0, end: 0, total: 0},
        content:    '',
        httpMethod: '',
        event:      '',
        xPath:      '',
        data:       {}
    };

    /**
     * Current instance.
     *
     * @property currentCrawler
     * @type {Object}
     * @default this
     */
    var currentParser = this;

    /**
     * Parse the URL as GET request.
     *
     * @method parseGet
     * @param {String} url   The URL to crawl.
     * @param {Object} data  The data to send for the request.
     * @param {String} evt   The event to fire (optional).
     * @param {String} xPath The XPath expression to identify the element to fire (optional).
     * @return undefined
     */
    this.parseGet = function (url, data, evt, xPath) {
        this.event = evt;
        this.xPath = xPath;
        data       = data || '';

        currentParser.report.time.start = Date.now();

        currentParser.report.httpMethod = 'GET';
        currentParser.report.event      = evt;
        currentParser.report.xPath      = xPath;
        currentParser.report.data       = data;

        page.settings.resourceTimeout = config.parser.timeout;
        page.onResourceTimeout        = this.onResourceTimeout;
        page.onError                  = this.onError;
        page.onInitialized            = this.onInitialized;
        page.onResourceReceived       = this.onResourceReceived;
        page.onAlert                  = this.onAlert;
        page.onConfirm                = this.onConfirm;
        page.onPrompt                 = this.onPrompt;
        page.onConsoleMessage         = this.onConsoleMessage;

        page.open(url + data, this.onOpen);
        page.onLoadFinished = this.onLoadFinished;
    };

    /**
     * Parse the URL as POST request.
     *
     * @method parsePost
     * @param {String} url   The URL to crawl.
     * @param {Object} data  The data to send for the request.
     * @param {String} evt   The event to fire (optional).
     * @param {String} xPath The XPath expression to identify the element to fire (optional).
     * @return undefined
     */
    this.parsePost = function (url, data, evt, xPath) {
        this.event = evt || '';
        this.xPath = xPath || '';

        currentParser.report.time.start = Date.now();

        currentParser.report.httpMethod = 'POST';
        currentParser.report.event      = evt;
        currentParser.report.xPath      = xPath;
        currentParser.report.data       = data;

        page.settings.resourceTimeout = config.parser.timeout;
        page.onResourceTimeout        = this.onResourceTimeout;
        page.onError                  = this.onError;
        page.onInitialized            = this.onInitialized;
        page.onResourceReceived       = this.onResourceReceived;
        page.onAlert                  = this.onAlert;
        page.onConfirm                = this.onConfirm;
        page.onPrompt                 = this.onPrompt;
        page.onConsoleMessage         = this.onConsoleMessage;

        page.open(url, 'post', data, this.onOpen);
        page.onLoadFinished = this.onLoadFinished;
    };

    /**
     * Fire an event to an object (document, window, ...).
     *
     * @method fireEventObject
     * @return undefined
     */
    this.fireEventObject = function () {
        var obj,
            evt;

        eval('obj = ' + arguments[0].xPath);
        if (obj !== undefined) {
            evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(arguments[0].event, false, false, null);
            obj.dispatchEvent(evt);
        }
    };

    /**
     * Fire an event to a DOM element.
     *
     * @method fireEventDOM
     * @return undefined
     */
    this.fireEventDOM = function () {
        var element = document.getElementByXpath(arguments[0].xPath),
            evt;

        if (element !== undefined) {
            evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(arguments[0].event, false, false, null);
            element.dispatchEvent(evt);
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
            page.navigationLocked = true;
        }
    };

    /**
     * TBW
     */
    this.onResourceTimeout = function () {
        phantom.exit();
    };

    /**
     * TBW
     */
    this.onError = function (msg, trace) {
        var msgStack = ['ERROR: ' + msg];

        if (trace && trace.length) {
            msgStack.push('TRACE:');
            trace.forEach(function(t) {
                msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
            });
        }

        report.errors.push(msgStack.join('\n'));
    };

    /**
     * TBW
     */
    this.onInitialized = function() {
        page.injectJs('../sha1.js');
        page.injectJs('../events.js');
    };

    /**
     * TBW
     */
    this.onResourceReceived = function(response) {
        if (response.stage === 'end') {
            currentParser.report.resources[response.url] = {
                headers: response.headers
            };
        }
    };

    /**
     * TBW
     */
    this.onAlert = function(msg) {
        currentParser.report.alerts.push(msg);
    };

    /**
     * TBW
     */
    this.onConfirm = function(msg) {
        currentParser.report.confirms.push(msg);
        // `true` === pressing the "OK" button, `false` === pressing the "Cancel" button
        return true; // TODO: Trying to hit both and parse again the page.
    };

    /**
     * TBW
     */
    this.onPrompt = function(msg, defaultVal) {
        currentParser.report.confirms.push({msg: msg, defaultVal: defaultVal});
        return defaultVal; // TODO: Generate a test case for this scenario.
    };

    /**
     * TBW
     */
    this.onConsoleMessage = function(msg, lineNum, sourceId) {
        currentParser.report.console.push({msg: msg, lineNum: lineNum, sourceId: sourceId});
    };

    /**
     * Callback fired when the page has been loaded properly.
     *
     * @method onLoadFinished
     * @return undefined
     */
    this.onLoadFinished = function () {
        if (currentParser.event.toString() !== '' && currentParser.xPath.toString() !== '') {
            if (currentParser.xPath[0] !== '/') {
                page.evaluate(currentParser.fireEventObject, currentParser);
            } else {
                page.evaluate(currentParser.fireEventDOM, currentParser);
            }
        }

        currentParser.parsePage();
    };

    /**
     * Parse the page to get the information needed.
     *
     * @method parsePage
     * @return undefined
     */
    this.parsePage = function () {
        var url, links, response;

        currentParser.report.content = page.content;

        url = page.evaluate(function () {
            return document.location.href;
        });

        links = page.evaluate(currentParser.onEvaluate);

        links.events = page.evaluate(function () {
            return window.eventContainer.getEvents();
        });

        links.anchors = [].map.call(links.anchors, function (item) {
            return currentParser.normaliseUrl(item, url);
        }).filter(currentParser.onlyUnique);

        links.links = [].map.call(links.links, function (item) {
            return currentParser.normaliseUrl(item, url);
        }).filter(currentParser.onlyUnique);

        links.scripts = [].map.call(links.scripts, function (item) {
            return currentParser.normaliseUrl(item, url);
        }).filter(currentParser.onlyUnique);

        links.forms = [].map.call(links.forms, function (item) {
            item.action = currentParser.normaliseUrl(item.action, url);

            if (item.action === undefined) {
                return undefined;
            }

            return item;
        }).filter(currentParser.onlyUnique);

        response = {
            idCrawler: idCrawler,
            links:     links,
            report:    currentParser.report
        };

        console.log('###' + JSON.stringify(response));
        phantom.exit();
    };

    /**
     * Callback fired to evaluate the page content.
     *
     * @method onEvaluate
     * @return {Object} A list of links (anchors, links, scripts and forms).
     */
    this.onEvaluate = function () {
        var urls = {
                anchors: [],
                links: [],
                scripts: [],
                forms: []
            },
            currentUrl = document.location.href;

        urls.anchors = [].map.call(document.querySelectorAll('a'), function (item) {
            return item.getAttribute('href');
        });

        urls.links = [].map.call(document.querySelectorAll('link'), function (item) {
            return item.getAttribute('href');
        });

        urls.scripts = [].map.call(document.querySelectorAll('script'), function (item) {
            return item.getAttribute('src');
        });

        urls.forms = [].map.call(document.querySelectorAll('form'), function (item) {
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
};

PhantomParser.prototype = new Parser();
new PhantomParser().parse(url, type, data, evt, xPath);