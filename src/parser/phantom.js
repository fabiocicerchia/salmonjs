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

var Parser    = require('../../src/parser');
var config    = require('../../src/config');
var idCrawler = require('system').args[1];
var url       = require('system').args[2];
var type      = require('system').args[3];
var data      = require('system').args[4];
var evt       = require('system').args[5];
var xPath     = require('system').args[6];
var page      = require('webpage').create();
var t;

page.settings.resourceTimeout = config.parser.timeout;
page.onResourceTimeout = function () {
    phantom.exit();
};
page.onError = function () {
    // Ignore the JS errors
    // TODO: It might be useful as report metric
};

page.onInitialized = function() {
    page.injectJs('../sha1.js');
    page.injectJs('../events.js');
};

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

        t = Date.now();

        if (data === 'undefined' || typeof data === 'undefined') {
            data = '';
        }

        page.open(url + data, this.onOpen);
        page.onLoadFinished = currentParser.onLoadFinished;
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

        t = Date.now();

        page.open(url, 'post', data, this.onOpen);
    };

    /**
     * Callback fired when the page has been opened.
     *
     * @method onOpen
     * @param {String} status The page return status
     * @return undefined
     */
    this.onOpen = function (status) {
        t = Date.now() - t;

        if (status === 'success') {
            page.navigationLocked = true;
        }
    };

    /**
     * Fire an event to an object (document, window, ...).
     *
     * @method fireEventObject
     * @return undefined
     */
    this.fireEventObject = function () {
        var obj;
        eval('obj = ' + arguments[0].xPath);
        if (typeof obj !== 'undefined') {
            var evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
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
        // 1 - Identify the element in the page
        // 2 - Retrieve the element
        var element = document.getElementByXpath(arguments[0].xPath);
        if (typeof element !== 'undefined') {
            // 3 - Fire the event
            var evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
            evt.initCustomEvent(arguments[0].event, false, false, null);
            element.dispatchEvent(evt);

            return document.body.outerHTML;
        }

    };

    /**
     * Callback fired when the page has been loaded properly.
     *
     * @method onLoadFinished
     * @return undefined
     */
    this.onLoadFinished = function () {
        var url, links, response;

        if (currentParser.event.toString() !== '' && currentParser.xPath.toString() !== '') {
            if (currentParser.xPath[0] !== '/') {
                page.evaluate(currentParser.fireEventObject, currentParser);
            } else {
                page.evaluate(currentParser.fireEventDOM, currentParser)
            }
        }

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
            links:     links
        };

        console.log(JSON.stringify(response));
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