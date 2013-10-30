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

/**
 * Parser Module
 *
 * TBW
 *
 * @module Parser
 */
module.exports = function Parser() {
    /**
     * Parse the URL.
     *
     * @method parse
     * @param {String} url   The URL to crawl.
     * @param {String} type  The request type: GET or POST.
     * @param {Object} data  The data to send for the request.
     * @param {String} event The event to fire (optional).
     * @param {String} xPath The XPath expression to identify the element to fire (optional).
     * @return undefined
     */
    this.parse = function (url, type, data, event, xPath) {
        if (type === 'GET') {
            this.parseGet(url, data, event, xPath);
        } else {
            this.parsePost(url, data, event, xPath);
        }
    };

    /**
     * Parse the URL as GET request.
     *
     * @method parseGet
     * @param {String} url   The URL to crawl.
     * @param {Object} data  The data to send for the request.
     * @param {String} event The event to fire (optional).
     * @param {String} xPath The XPath expression to identify the element to fire (optional).
     * @return undefined
     */
    this.parseGet = function (url, data, event, xPath) {
    };

    /**
     * Parse the URL as POST request.
     *
     * @method parsePost
     * @param {String} url   The URL to crawl.
     * @param {Object} data  The data to send for the request.
     * @param {String} event The event to fire (optional).
     * @param {String} xPath The XPath expression to identify the element to fire (optional).
     * @return undefined
     */
    this.parsePost = function (url, data, event, xPath) {
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
     * @param {Object} data The data to be normalised.
     * @return {Object}
     */
    this.normaliseData = function (data) {
        var dataContainer = {},
            keys = [],
            vars = data.replace(/.+\?/, '').split('&'),
            i,
            pair,
            sorted = {};

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
     * @param {Object} data The data returned by the parser.
     * @return {String}
     */
    this.arrayToQuery = function (arr) {
        var k,
            string = [];

        for (k in arr) {
            if (arr.hasOwnProperty(k)) {
                string.push(k + '=' + arr[k]);
            }
        }

        return string.join('&');
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

        if ((url + '/').indexOf(baseUrl) === 0) {
            normalised = url;
        } else if (url.indexOf('?') === 0) {
            normalised = baseUrl.replace(/\?.+/, '') + url;
        } else if (url.indexOf('/') === 0) {
            normalised = baseUrl.replace(/#.*$/, '') + url.substr(1);
        } else if (url.indexOf('#') === 0) {
            normalised = baseUrl.replace(/#.*$/, '') + url;
        }

        if (normalised !== undefined && normalised.indexOf('?') > 0) {
            normalised = normalised.replace(/\?.+/, '?' + this.arrayToQuery(this.normaliseData(normalised)));
        }

        return normalised;
    };
};
