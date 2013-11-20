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

function repeat(s, n){
    var a = [];
    while(a.length < n){
        a.push(s);
    }
    return a.join('');
}

console.log('Generating code coverage...');
var cov = global._$jscoverage || {},
    ncov = {},
    fs = require('fs'),
    file, id, line, status, len, clines;

for (file in cov) {
    clines = 0;
    ncov[file] = {lines: 0, percentage: 0, source: {}};
    for (id in cov[file].source) {
        line = cov[file].source[id];
        status = cov[file][parseInt(id) + 1] === undefined ? '-' : cov[file][parseInt(id) + 1];
        if (status !== '-') clines++;
        if (status > 0) ncov[file].lines++;
        ncov[file].source[id] = { status: status, line: line};
    }
    ncov[file].percentage = 100 / clines * ncov[file].lines;
}

var html = '<html>\n';
html += '<head><style>pre span.lineno { display: inline-block; } pre span.line { display: inline-block; } pre span.line.grey { color: grey; } pre span.line.green { color: green; } pre span.line.red { color: red; }</style></head>\n';
html += '<body><h1>Code Coverage</h1>\n';
html += '<ul>\n';
var coverage = 0;
for (file in ncov) {
    coverage += ncov[file].percentage;
    html += '<li><a href="#' + file.replace(/[^a-zA-Z0-9]/g, '_') + '">' + file + ' (' + ncov[file].percentage.toFixed(2) + '%)</a></li>\n';
}
html += '</ul>\n';
html += '<strong>Coverage: ' + (coverage / Object.keys(ncov).length).toFixed(2) + '%</strong>\n';
for (file in ncov) {
    html += '<h2 id="' + file.replace(/[^a-zA-Z0-9]/g, '_') + '">' + file + ' (' + ncov[file].percentage.toFixed(2) + '%)</h2>\n';
    html += '<pre>';
    for (line in ncov[file].source) {
        len = Object.keys(ncov[file].source).length.toString().length;
        html += '<span class="lineno" title="' + ncov[file].source[line].status + ' times">' + (repeat('0', len) + line).slice(-len) + '</span> ';
        if (ncov[file].source[line].status === '-') {
            html += '<span class="line grey">';
        } else if (ncov[file].source[line].status.toString() === '0') {
            html += '<span class="line red">';
        } else {
            html += '<span class="line green">';
        }
        html += ncov[file].source[line].line;
        html += '</span><br />\n';
    }
    html += '</pre>\n';
}
html += '</body></html>';

fs.write('report/coverage.json', JSON.stringify(ncov));
fs.write('report/coverage.html', html);
console.log('JSON code coverage saved in: ' + fs.absolute('report/coverage.json'));
console.log('HTML code coverage saved in: ' + fs.absolute('report/coverage.html'));
casper.test.done();