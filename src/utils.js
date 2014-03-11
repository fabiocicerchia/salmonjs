/**
 *               __                         _____ _______
 * .-----.---.-.|  |.--------.-----.-----._|     |     __|
 * |__ --|  _  ||  ||        |  _  |     |       |__     |
 * |_____|___._||__||__|__|__|_____|__|__|_______|_______|
 *
 * salmonJS v0.3.0
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
 * Utils Module
 *
 * @module Utils
 */
var Utils = function (crypto) {
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
     * Sleep function.
     *
     * @method sleep
     * @param {Integer} millis The number of millisecond to wait for
     * @return undefined
     */
    this.sleep = function (millis) {
        var date    = new Date(),
            curDate = null;

        do {
            curDate = new Date();
        } while ((curDate - date) < millis);
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

        return str.join('&').replace('%23', '#');
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

        baseUrl = baseUrl.replace(/#.*$/, '');

        if (url.indexOf('/') === 0) {
            normalised = baseDomain.substr(0, baseDomain.length - 1) + url;
        } else if (url.indexOf('?') === 0) {
            normalised = baseDomain + url;
        } else if (url.indexOf('#') === 0) {
            normalised = baseUrl + url;
        } else if (url === baseUrl || url === '') {
            normalised = baseUrl;
        } else if (url.indexOf('://') !== -1 && url.indexOf(baseDomain) === 0) {
            normalised = url;
        } else if (url.indexOf('://') !== -1 && url.indexOf(baseUrl) === 0) {
            normalised = url;
        }

        if (normalised !== undefined && normalised.indexOf('?') > 0) {
            qs = normalised.replace(/.*\?(.+)(#.*)?/, '$1');
            normalised = normalised.replace('?' + qs, '?' + this.arrayToQuery(this.normaliseData(qs)));
        }

        return normalised;
    };

    /**
     * TBD
     */
    this.parseINIString = function (data) {
        var regex   = {
                section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
                param:   /^\s*([\w\.\-\_\[\]]+)\s*=\s*(.*?)\s*$/,
                comment: /^\s*;.*$/
            },
            value   = {},
            lines   = data.split(/\r\n|\r|\n/),
            section = null,
            match,
            isArray;

        lines.forEach(function (line) {
            isArray = false;
            if (regex.comment.test(line)) {
                return;
            } else if(regex.param.test(line)) {
                match = line.match(regex.param);

                if (match[1].substr(match[1].length - 2, 2) === '[]') {
                    match[1] = match[1].substr(0, match[1].length - 2);
                    isArray = true;
                }

                if (match[2][0] === '"' && match[2][match[2].length - 1] === '"') {
                    match[2] = match[2].substr(1, match[2].length - 2);
                }

                if (isArray) {
                    if (section) {
                        if (typeof value[section][match[1]] === 'undefined') {
                            value[section][match[1]] = [];
                        }
                        value[section][match[1]].push(match[2]);
                    } else {
                        if (typeof value[match[1]] === 'undefined') {
                            value[match[1]] = [];
                        }
                        value[match[1]].push(match[2]);
                    }
                } else {
                    if (section) {
                        value[section][match[1]] = match[2];
                    } else {
                        value[match[1]] = match[2];
                    }
                }
            } else if (regex.section.test(line)) {
                match = line.match(regex.section);
                value[match[1]] = {};
                section = match[1];
            }
        });

        return value;
    };

    /**
     * For each for objects.
     *
     * @method loopEach
     * @param {Object}   object   The object to loop through.
     * @param {Function} callback The callback invoked with key and value for each item.
     * @return undefined
     */
    this.loopEach = function(object, callback) {
        for (var item in object) {
            if (object.hasOwnProperty(item)) {
                callback(item, object[item]);
            }
        }
    };
};

module.exports = Utils;
