/**
 *               __                         _____ _______
 * .-----.---.-.|  |.--------.-----.-----._|     |     __|
 * |__ --|  _  ||  ||        |  _  |     |       |__     |
 * |_____|___._||__||__|__|__|_____|__|__|_______|_______|
 *
 * salmonJS v0.2.1
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

var Parser          = require('../parser'),
    config          = require('../config'),
    fs              = require('fs'),
    system          = require('system'),
    args            = system.args,
    testing         = args.join(' ').indexOf('casperjs --cli test') !== -1,
    input           = !testing ? JSON.parse(args[1]) : [],
    idCrawler       = input[0],
    execId          = input[1],
    idRequest       = input[2],
    username        = input[3],
    password        = input[4],
    url             = input[5],
    type            = input[6],
    data            = input[7],
    evt             = input[8],
    xPath           = input[9],
    storeDetails    = input[10] === 'true',
    followRedirects = input[11] === 'true',
    page            = require('webpage').create(),
    utils           = new (require('../utils'));

if (username !== undefined && password !== undefined) {
    page.customHeaders = {
        'Authorization': 'Basic ' + btoa(username + ':' + password)
    }
}

/**
 * PhantomParser Class.
 *
 * @class PhantomParser
 * @extends Parser
 */
var PhantomParser = function (utils, page) {
    /**
     * The WebPage element.
     *
     * @property page
     * @type {Object}
     * @default {Object}
     */
    this.page = page;

    /**
     * Current instance.
     *
     * @property currentCrawler
     * @type {Object}
     * @default this
     */
    var currentParser = this;

    /**
     * Configure all the callbacks for PhantomJS.
     *
     * @method setUpPage
     * @return undefined
     */
    this.setUpPage = function (page) {
        page.settings.resourceTimeout = config.parser.timeout;
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
        page.settings.userAgent       = 'salmonJS/0.2.1 (+http://fabiocicerchia.github.io/salmonjs)';
    };

    /**
     * Parse the URL as GET request.
     *
     * @method parseGet
     * @return undefined
     */
    this.parseGet = function () {
        var getParams = this.data.GET || '';

        // InitPhantomJs
        this.setUpPage(this.page);

        // RestoreFreezedInstance: set all the variables need for ReExecuteJsEvents

        // Open
        this.page.open(this.url + getParams, this.onOpen);
        this.page.onLoadFinished = this.onLoadFinished;
    };

    /**
     * Parse the URL as POST request.
     *
     * @method parsePost
     * @return undefined
     */
    this.parsePost = function () {
        this.setUpPage(this.page);

        var doNotContinue = false;
        for (var i in this.data.POST) {
            if (this.data.POST.hasOwnProperty(i)) {
                if (this.data.POST[i].substr(0, 1) === '@' && fs.exists(this.data.POST[i].substr(1))) {
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
     * TBD
     */
    this.spawnAndUseNodeJs = function (url, data) {
        var spawn   = require('child_process').spawn,
            args    = [ fs.workingDirectory + '/src/upload.js', url, JSON.stringify(data) ],
            process = spawn('node', args);

        process.stdout.on('data', function(data) {
            currentParser.page.setContent(data, currentParser.url);
            currentParser.page.onInitialized(currentParser.page);
            currentParser.onLoadFinished();
        });

        process.stderr.on('data', function(data) {
            return currentParser.exit();
        });
    };

    /**
     * Handle the request to change the current URL.
     *
     * @method onNavigationRequested
     * @param {String}  url          The target URL of this navigation event
     * @param {String}  type         Type of navigation: 'Undefined', 'LinkClicked', 'FormSubmitted', 'BackOrForward', 'Reload', 'FormResubmitted', 'Other'
     * @param {Boolean} willNavigate Flag to determine whether the navigation will happen
     * @param {Boolean} main         Flag to determine whether this event comes from the main frame
     * @return undefined
     */
    this.onNavigationRequested = function (url, type, willNavigate, main) {
        // TODO: What to do with reloads?
        if (!followRedirects && url.indexOf(currentParser.url) === -1) {
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
     * Stop the execution of the current parser and return the data scraped.
     *
     * @method exit
     * @return undefined
     */
    this.exit = function () {
        var response;

        response = {
            idCrawler: idCrawler,
            links:     currentParser.links,
            report:    currentParser.report
        };

        console.log('###' + JSON.stringify(response));
        if (args.join(' ').indexOf('casperjs --cli test') === -1) {
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
        if (data !== undefined && data.CONFIRM !== undefined && data.CONFIRM[msg] !== undefined) {
            retVal = data.CONFIRM[msg];
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
        if (data !== undefined && data.PROMPT !== undefined && data.PROMPT[msg] !== undefined) {
            return data.PROMPT[msg];
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
     * Callback fired when the page has been loaded properly.
     *
     * @method onLoadFinished
     * @return undefined
     */
    this.onLoadFinished = function () {
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
        var newPage = require('webpage').create();

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

        if (page.content.indexOf('<html') !== -1) {

            url = page.evaluate(function () {
                return document.location.href;
            });

            if (storeDetails) {
                fs.makeDirectory(fs.workingDirectory + '/report/' + execId + '/');
                page.render(fs.workingDirectory + '/report/' + execId + '/' + idRequest + '.png');
            }

            links = page.evaluate(currentParser.onEvaluate, currentParser.tags);

            // TODO: What if an event will change url? will it be processed in here or just returned back to the crawler?
            events = page.evaluate(function () {
                return window.eventContainer.getEvents();
            });

            for (var type in events) {
                for (var act in events[type]) {
                    for (var evt in events[type][act]) {
                        currentParser.putPageInStack(page, type, events[type][act][evt]);
                    }
                }
            }

            currentParser.links.a = [].map.call(links.a, function (item) {
                return utils.normaliseUrl(item, url);
            }).concat(currentParser.links.a).filter(utils.onlyUnique);

            currentParser.links.link = [].map.call(links.link, function (item) {
                return utils.normaliseUrl(item, url);
            }).concat(currentParser.links.link).filter(utils.onlyUnique);

            currentParser.links.script = [].map.call(links.script, function (item) {
                return utils.normaliseUrl(item, url);
            }).concat(currentParser.links.script).filter(utils.onlyUnique);

            currentParser.links.meta = [].map.call(links.meta, function (item) {
                return utils.normaliseUrl(item, url);
            }).concat(currentParser.links.meta).filter(utils.onlyUnique);

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

        currentParser.exit();
    };

    /**
     * Callback fired to evaluate the page content.
     *
     * @method onEvaluate
     * @return {Object} A list of links (anchors, links, scripts and forms).
     */
    this.onEvaluate = function () {
        var urls = {
                a:      [],
                link:   [],
                script: [],
                meta:   [],
                form:   [],
                events: []
            },
            currentUrl = document.location.href,
            attribute,
            tag,
            tags = arguments[0];

        for (tag in tags) {
            if (tags.hasOwnProperty(tag)) {
                attribute = tags[tag];
                urls[tag] = [].map.call(document.querySelectorAll(tag), function (item) {
                    return item[attribute];
                });
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
};

PhantomParser.prototype = new Parser(utils);
if (args.join(' ').indexOf('casperjs --cli test') === -1) {
    new PhantomParser(utils, page).parse(url, type, data, evt, xPath);
} else {
    module.exports = PhantomParser;
}
