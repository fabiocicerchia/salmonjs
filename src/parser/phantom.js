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
var page      = require('webpage').create();
var t;

page.settings.resourceTimeout = config.parser.timeout;
page.onResourceTimeout = function (e) {
    phantom.exit();
};
page.onError = function () {
    // Ignore the JS errors
    // TODO: It might be useful as report metric
};

/**
 * PhantomParser Class.
 *
 * @class PhantomParser
 * @extends Parser
 */
var PhantomParser = function () {
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
     * @param {String} url  The URL to crawl.
     * @param {Object} data The data to send for the request.
     * @return undefined
     */
    this.parseGet = function (url, data) {
        t = Date.now();

        if (data === 'undefined' || typeof data === 'undefined') {
            data = '';
        }

        page.open(url + data, this.onOpen);
        page.onLoadFinished = this.onLoadFinished;
    };
    
    /**
     * Parse the URL as POST request.
     *
     * @method parsePost
     * @param {String} url  The URL to crawl.
     * @param {Object} data The data to send for the request.
     * @return undefined
     */
    this.parsePost = function (url, data) {
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
    };

    /**
     * Callback fired when the page has been loaded properly.
     *
     * @method onLoadFinished
     * @return undefined
     */
    this.onLoadFinished = function () {
        var url, links, response;

        url = page.evaluate(function () {
            return document.location.href;
        });

        links = page.evaluate(currentParser.onEvaluate);

        links.anchors.plain = [].map.call(links.anchors.plain, function (item) {
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
                anchors: {
                    plain: []
                },
                links: [],
                scripts: [],
                forms: []
            },
            currentUrl = document.location.href;

        urls.anchors.plain = [].map.call(document.querySelectorAll('a'), function (item) {
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
new PhantomParser().parse(url, type, data);