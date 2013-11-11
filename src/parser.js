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
        console:    [],
        resources:  {},
        time:       { start: 0, end: 0, total: 0 },
        content:    '',
        httpMethod: '',
        event:      '',
        xPath:      '',
        data:       {}
    };

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
            k = prefix ? prefix + '[' + p + ']' : p
            v = obj[p];
            str.push(
                typeof v == 'object' ?
                this.arrayToQuery(v, k) :
                encodeURIComponent(k) + '=' + encodeURIComponent(v)
            );
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
        var normalised;

        if (url.substr(0, 2) === '//') {
            url = baseUrl.split(':')[0] + ':' + url;
        }

        if (baseUrl.substr(0, 7) !== 'file://' && baseUrl.substr(baseUrl.length - 1, 1) !== '/' && baseUrl.indexOf('?') === -1 && baseUrl.indexOf('#') === -1) {
            baseUrl += '/';
        }

        if (url.indexOf('/') === 0) {
            normalised = baseUrl.replace(/^http(s)?:\/\/([^\/]+)\/.*$/, 'http$1://$2') + url;
        } else if (url.indexOf('?') === 0) {
            normalised = baseUrl.replace(/^http(s)?:\/\/([^\/]+)\/.*$/, 'http$1://$2/') + url;
        } else if (url.indexOf('#') === 0) {
            normalised = baseUrl.replace(/#.*$/, '') + url;
        } else if (url === baseUrl || url === '') {
            normalised = baseUrl;
        } else if (url.indexOf('://') !== -1) {
            normalised = url;
        }

        if (normalised !== undefined && normalised.indexOf('?') > 0) {
            var qs = normalised.replace(/\?(.+)(#.*)?/, '$1');
            normalised = normalised.replace(qs, '?' + this.arrayToQuery(this.normaliseData(qs)));
        }

        return normalised;
    };
};
