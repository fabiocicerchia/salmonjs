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
 * Parser Class
 *
 * Base class for any kind of page parser. It provides a basic interface in
 * order to process the web page.
 *
 * @class Parser
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
     * @default ""
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
        // TODO: Use the following
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
};
