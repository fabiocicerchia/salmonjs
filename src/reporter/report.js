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

var reporter = function() {
    this.generateHTML = function (currentCrawler, reportName, report) {
        var html = '<!DOCTYPE html>\n';
        html += '<html lang="en">\n';
        html += '    <head>\n';
        html += '        <script src="https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js"></script>\n';
        html += '        <style>\n';
        html += '            body { margin: 0; padding: 18px 10px; font: 12px Verdana, sans-serif; }\n';
        html += '            pre { border: 1px solid #888; padding: 1em !important; background-color: #F7F7F9; }\n';
        html += '            .container { width: 80%; margin: 0 auto; }\n';
        html += '            .container img { text-align: center; }\n';
        html += '            .container pre.prettyprint, pre.scroll { overflow: auto; }\n';
        html += '            h1:before { content: "URL: "; }\n';
        html += '            h1 { background-color: #758691; padding: 0.5em; color: #FFF; }\n';
        html += '            h2 { background-color: #e7e8e9; padding: 0.2em; }\n';
        html += '            ol { -webkit-padding-start: 0px !important; counter-reset: section; }\n';
        html += '            ol { float: left; display: block; }\n';
        html += '            ol li { float: left; clear: left; width: 100%; counter-increment: section; content: counters(section, ".") " "; }\n';
        html += '            .footer { padding-top: 5px; text-align: right; font-style: italic; opacity: 0.7; }\n';
        html += '            .footer a { text-decoration: underline; }\n';
        html += '        </style>\n';
        html += '    </head>\n';
        html += '    <body>\n';
        html += '        <div class="container">\n';
        html += '            <h1>' + currentCrawler.url + '</h1>\n';
        html += '            <h2>ID: ' + reportName + '</h2>\n';
        html += '            <img src="./' + reportName + '.png" />\n';
        html += '\n';
        html += '            <h2>Request Information</h2>\n';
        html += '            <ul>\n';
        html += '                <li><strong>HTTP Method:</strong> <code>' + report.httpMethod + '</code></li>\n';
        html += '                <li><strong>Event:</strong> <code>' + report.event + '</code></li>\n';
        html += '                <li><strong>XPath:</strong> <code>' + report.xPath + '</code></li>\n';
        html += '                <li><strong>Data:</strong> <code>' + JSON.stringify(report.data) + '</code></li>\n';
        html += '            </ul>\n';
        html += '\n';
        html += '            <h2>Time</h2>\n';
        html += '            <ul>\n';
        html += '                <li><strong>Start:</strong> ' + new Date(report.time.start).toUTCString() + '</li>\n';
        html += '                <li><strong>End:</strong> ' + new Date(report.time.end).toUTCString() + '</li>\n';
        html += '                <li><strong>Total:</strong> ' + report.time.total + '</li>\n';
        html += '            </ul>\n';
        html += '\n';
        html += '            <h2>Errors</h2>\n';
        html += '            <ul>\n';
        if (report.errors.length > 0) {
            for (var i in report.errors) {
                html += '                <li>\n';
                html += '                    <pre>' + report.errors[i] + '</pre>\n';
                html += '                </li>\n';
            }
        } else {
            html += '                <li>N/A</li>\n';
        }
        html += '            </ul>\n';
        html += '\n';
        html += '            <h2>Alerts</h2>\n';
        html += '            <ul>\n';
        if (report.alerts.length > 0) {
            for (var i in report.alerts) {
                html += '                <li>\n';
                html += '                    <code>' + report.alerts[i] + '</code>\n';
                html += '                </li>\n';
            }
        } else {
            html += '                <li>N/A</li>\n';
        }
        html += '            </ul>\n';
        html += '\n';
        html += '            <h2>Confirms</h2>\n';
        if (report.confirms.length > 0) {
            for (var i in report.confirms) {
                html += '                <li>\n';
                html += '                    <code>' + report.confirms[i] + '</code>\n';
                html += '                </li>\n';
            }
        } else {
            html += '                <li>N/A</li>\n';
        }
        html += '            </ul>\n';
        html += '\n';
        html += '            <h2>Prompts</h2>\n'
        if (report.prompts.length > 0) {
            for (var i in report.prompts) {
                html += '                <li>\n';
                html += '                    <code>' + report.prompts[i].msg + ' (default value: "' + report.prompts[i].defaultVal + '")</code>\n';
                html += '                </li>\n';
            }
        } else {
            html += '                <li>N/A</li>\n';
        }
        html += '            </ul>\n';
        html += '\n';
        html += '            <h2>Console</h2>\n';
        html += '            <ul>\n';
        if (report.console.length > 0) {
            for (var i in report.console) {
                html += '                <li>\n';
                html += '                    <code>' + report.console[i].msg + ' (line: ' + report.console[i].lineNum + ' - source: ' + report.console[i].sourceId + ')</code>\n';
                html += '               </li>\n';
            }
        } else {
            html += '                <li>N/A</li>\n';
        }
        html += '            </ul>\n';
        html += '\n';
        html += '            <h2>Resources</h2>\n';
        html += '            <ul>\n';
        if (report.resources.length > 0) {
            for (var i in report.resources) {
                html += '                <li>\n';
                html += '                    <pre class="scroll">URL: ' + i + '/\n';
                html += 'HEADERS:\n';
                for (var j in report.resources[i].headers) {
                    html += report.resources[i].headers[j].name + ': ' + report.resources[i].headers[j].value + '\n';
                }
                html += '</pre>\n';
                html += '                </li>\n';
            }
        } else {
            html += '                <li>N/A</li>\n';
        }
        html += '            </ul>\n';
        html += '\n';
        html += '            <h2>Content</h2>\n';
        html += '            <pre class="prettyprint linenums">\n';
        html += currentCrawler.htmlEscape(report.content);
        html += '</pre>\n';
        html += '        </div>\n';
        html += '        <div class="footer">Generated using <a href="https://github.com/fabiocicerchia/spidey">Spidey</a> version 0.2.0</div>\n';
        html += '    </body>\n';
        html += '</html>\n';

        return html;
    };
};

module.exports = reporter;