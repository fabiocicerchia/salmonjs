/**
 *               __     __
 * .-----.-----.|__|.--|  |.-----.--.--.
 * |__ --|  _  ||  ||  _  ||  -__|  |  |
 * |_____|   __||__||_____||_____|___  |
 *       |__|                    |_____|
 *
 * SPIDEY v0.2.1
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
 * Parser Module
 *
 * Base class for any kind of page parser. It provides a basic interface in
 * order to process the web page.
 *
 * @module Parser
 */
module.exports = function Parser() {
    /**
     * URL.
     *
     * @property url
     * @type {String}
     * @default ""
     */
    this.url = '';

    /**
     * Request type (GET or POST).
     *
     * @property type
     * @type {String}
     * @default "GET"
     */
    this.type = 'GET';

    /**
     * Data to be sent.
     *
     * @property data
     * @type {String}
     * @default """
     */
    this.data = '';

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
     * Report container.
     *
     * @property report
     * @type {Object}
     * @default {Object}
     */
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

    /**
     * Mapping between HTML tag name and attributes that may contain URIs.
     *
     * @property tags
     * @type {Object}
     * @default {Object}
     */
    this.tags = {
        // HTML 4
        a: 'href',
        area: 'href',
        //applet: 'archive',
        //applet: 'codebase',
        base: 'href',
        //blockquote: 'cite',
        // frame.longdesc',
        frame: 'src',
        // iframe.longdesc',
        iframe: 'src',
        // img.longdesc',
        img: 'src',
        input: 'src', // Possible exception: only when type="image"
        link: 'href',
        // object.archive',
        // object.classid',
        // object.codebase',
        // q.cite',
        script: 'src'
        // HTML 5
        // audio: 'src',
        // button: 'formaction',
        // del: 'cite',
        // embed: 'src',
        // html: 'manifest',
        // input: 'formaction',
        // ins: 'cite',
        // object: 'data',
        // source: 'src',
        // track: 'src',
        // video: 'poster',
        // video: 'src'
    };

    /**
     * Contains a stack of steps (JS events and XPath) to be reproduced in order
     * to reach a certain point during the navigation path.
     *
     * @property stepStack
     * @type {Array}
     * @default []
     */
    this.stepStack = [];

    /**
     * Contains a list of hashes of steps (JS events and XPath) already executed.
     *
     * @property stepHashes
     * @type {Array}
     * @default []
     */
    this.stepHashes = [];

    /**
     * Contains a stack of pages to be re-processed because a JS event has been
     * fired.
     *
     * @property stackPages
     * @type {Array}
     * @default []
     */
    this.stackPages = [];

    /**
     * Links container.
     *
     * @property links
     * @type {Object}
     * @default {}
     */
    this.links = {};

    /**
     * Parse the URL.
     *
     * @method parse
     * @param {String} url   The URL to crawl.
     * @param {String} type  The request type: GET or POST.
     * @param {Object} data  The data to send for the request.
     * @param {String} evt    The event to fire (optional).
     * @param {String} xPath The XPath expression to identify the element to fire (optional).
     * @return undefined
     */
    this.parse = function (url, type, data, evt, xPath) {
        this.url   = url || '';
        this.type  = type || 'GET';
        this.data  = data || '';
        this.event = evt || '';
        this.xPath = xPath || '';

        if (this.event !== '' && this.xPath !== '') {
            this.stepStack.push({event: this.event, xPath: this.xPath});
        }

        this.initReport();

        if (this.type === 'POST') {
            return this.parsePost();
        } else if (this.type === 'GET') {
            return this.parseGet();
        }

        return undefined;
    };

    /**
     * Initialise the report container.
     *
     * @method initReport
     * @return undefined
     */
    this.initReport = function () {
        this.report.time.start = Date.now();

        this.report.httpMethod = this.type;
        this.report.event      = this.event;
        this.report.xPath      = this.xPath;
        this.report.data       = this.data;
    };

    /**
     * Parse the URL as GET request.
     *
     * @method parseGet
     * @return undefined
     */
    this.parseGet = function () {
    };

    /**
     * Parse the URL as POST request.
     *
     * @method parsePost
     * @return undefined
     */
    this.parsePost = function () {
    };

    /**
     * Fire an event to an object (document, window, ...).
     *
     * @method fireEventObject
     * @return {Object}|undefined
     */
    this.fireEventObject = function () {
        var obj,
            evt,
            xPath = arguments[0].xPath,
            event = arguments[0].event;

        eval('obj = ' + xPath);
        if (obj !== undefined) {
            evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, false, false, null);
            obj.dispatchEvent(evt);

            return evt;
        }

        return undefined;
    };

    /**
     * Fire an event to a DOM element.
     *
     * @method fireEventDOM
     * @return {Object}|undefined
     */
    this.fireEventDOM = function () {
        var xPath = arguments[0].xPath,
            event = arguments[0].event,
            element = window.eventContainer.getElementByXpath(xPath),
            evt;

        if (element !== undefined) {
            evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, false, false, null);
            element.dispatchEvent(evt);

            return evt;
        }

        return undefined;
    };

    /**
     * Utility function to be used with .filter() to get back only the unique
     * elements.
     *
     * @method onlyUnique
     * @param {Mixed} value The value of the current element.
     * @param {Integer|String} index The index of the current element.
     * @param {Object} self The object itself.
     * @return {Boolean}
     */
    this.onlyUnique = function (value, index, self) {
        return self.indexOf(value) === index && value !== undefined;
    };

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
     * Convert an array to a querystring.
     *
     * @method arrayToQuery
     * @param {Object} obj    The obj to be converted.
     * @param {String} prefix The eventual prefix to be concatenated if array.
     * @return {String}
     */
    this.arrayToQuery = function (obj, prefix) {
        var p, k, v, str = [];

        if (typeof obj !== 'object') {
            return '';
        }

        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                k = prefix ? prefix + '[' + p + ']' : p;
                v = obj[p];
                str.push(
                    typeof v === 'object' ?
                        this.arrayToQuery(v, k) :
                        encodeURIComponent(k) + '=' + encodeURIComponent(v)
                );
            }
        }

        return str.join('&');
    };

    /**
     * Utility function to normalise an absolute / relative URL.
     *
     * @method normaliseUrl
     * @param {String} url The URL to be normalised.
     * @param {String} baseUrl The base URL used to normalise.
     * @return {String} The normalised URL.
     */
    this.normaliseUrl = function (url, baseUrl) {
        var normalised,
            baseDomain = baseUrl.replace(/^http(s)?:\/\/([^\/]+)\/?.*$/, 'http$1://$2/'),
            qs;

        if (url.substr(0, 2) === '//') {
            url = baseUrl.split(':')[0] + ':' + url;
        }

        if (baseUrl.substr(0, 7) !== 'file://' && baseUrl.substr(baseUrl.length - 1, 1) !== '/' && baseUrl.indexOf('?') === -1 && baseUrl.indexOf('#') === -1) {
            baseUrl += '/';
        }

        if (url.indexOf('/') === 0) {
            normalised = baseDomain.substr(0, baseDomain.length - 1) + url;
        } else if (url.indexOf('?') === 0) {
            normalised = baseDomain + url;
        } else if (url.indexOf('#') === 0) {
            normalised = baseUrl.replace(/#.*$/, '') + url;
        } else if (url === baseUrl || url === '') {
            normalised = baseUrl;
        } else if (url.indexOf('://') !== -1 && url.indexOf(baseDomain) === 0) {
            normalised = url;
        }

        if (normalised !== undefined && normalised.indexOf('?') > 0) {
            qs = normalised.replace(/\?(.+)(#.*)?/, '$1');
            normalised = normalised.replace(qs, '?' + this.arrayToQuery(this.normaliseData(qs)));
        }

        return normalised;
    };
};
