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

function repeat(s, n) {
    var a = [];
    while (a.length < n) {
        a.push(s);
    }
    return a.join('');
}

function count_not_undefined(arr) {
    var i = 0,
        count = 0;

    for (i = 0; i < arr.length; i++) {
        if (arr[i] !== undefined) {
            count++;
        }
    }
    return count;
}

console.log('Generating code coverage...');
var jscov = global._$jscoverage || {},
    cov = {lines: 0, executed: 0, percentage: 0, files: []},
    fs = require('fs'),
    file,
    id,
    line,
    st,
    len,
    color,
    casper = casper || undefined;

for (file in jscov) {
    if (jscov.hasOwnProperty(file)) {
        cov.files[file] = {lines: 0, executed: 0, percentage: 0, source: {}};

        for (id in jscov[file].source) {
            if (jscov[file].source.hasOwnProperty(id)) {
                line = jscov[file].source[id];
                st = jscov[file][parseInt(id, 10) + 1] === undefined ? '-' : jscov[file][parseInt(id, 10) + 1];
                if (st > 0) {
                    cov.files[file].executed++;
                }
                cov.files[file].source[id] = { status: st, line: line };
            }
        }

        cov.files[file].lines = count_not_undefined(jscov[file]);
        cov.files[file].percentage = 100 / cov.files[file].lines * cov.files[file].executed;
        cov.lines += cov.files[file].lines;
        cov.executed += cov.files[file].executed;
    }
}

var lcov = '';
for (file in cov.files) {
    if (cov.files.hasOwnProperty(file)) {
        lcov += 'SF:' + file + '\n';

        for (line in cov.files[file].source) {
            if (cov.files[file].source.hasOwnProperty(line)) {
                if (cov.files[file].source[line].status !== '-') {
                    lcov += 'DA:' + line + ',' + cov.files[file].source[line].status + '\n';
                }
            }
        }

        lcov += 'end_of_record\n';
    }
}

cov.percentage = 100 / cov.lines * cov.executed;

var html = '<html>\n';
html += '   <head>\n';
html += '       <style>\n';
html += '           body { margin: 0; padding: 18px 10px; font: 12px Verdana, sans-serif; }\n';
html += '           table { border-collapse: collapse; font-size: 12px; width: 100%; }\n';
html += '           table th { color: white; text-align: right; }\n';
html += '           table th:first-child { text-align: left; }\n';
html += '           table td.statements, table td.executed, table td.coverage { text-align: right; }\n';
html += '           table > thead td { font-weight: bold; }\n';
html += '           table > thead th, table > thead td, table > tbody > tr > td { padding: 4px 10px; }\n';
html += '           table > thead > tr:first-child th { background-color: #758691; }\n';
html += '           table > tbody > tr:nth-child(2n + 1) { background-color: #e7e8e9; cursor: pointer; }\n';
html += '           .percentage-container { padding: 2px; padding-right: 8px; width: 150px; }\n';
html += '           pre { overflow: auto; }\n';
html += '           pre span.lineno { display: inline-block; }\n';
html += '           pre span.line { display: inline-block; }\n';
html += '           pre span.line.grey { color: grey; }\n';
html += '           pre span.line.green { color: green; }\n';
html += '           pre span.line.red { color: red; }\n';
html += '           .percentage { background-color: #DDD; background-color: rgba(0, 0, 0, 0.1); border-radius: 8px 8px 8px 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) inset, 0 1px 0 rgba(255, 255, 255, 0.5); height: 7px; padding: 1px; position: relative; width: 100%; }\n';
html += '           .percentage > span { background-color: #AEDB4B; border-radius: 6px 6px 6px 6px; box-shadow: 0 -2px 2px rgba(0, 0, 0, 0.2) inset, 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 -1px 0 rgba(0, 0, 0, 0.15) inset; display: block; height: 100%; }\n';
html += '           .percentage > span:before { position: absolute; width: 25%; height: 100%; left: 0; top: 0; border-right: 1px solid rgba(0,0,0,0.1); content: \' \'; }\n';
html += '           .percentage > span:after { position: absolute; width: 25%; height: 100%; left: 50%; top: 0; border-left: 1px solid rgba(0,0,0,0.1); border-right: 1px solid rgba(0,0,0,0.1); content: \' \'; }\n';
html += '           .footer { padding-top: 5px; text-align: right; font-style: italic; opacity: 0.7; }\n';
html += '           .footer a { text-decoration: underline; }\n';
html += '       </style>\n';
html += '       <script>\n';
html += '           function onLoad() {\n';
html += '               var elements = document.getElementsByTagName(\'pre\');\n';
html += '               for (var i = 0; i < elements.length; i++) {\n';
html += '                   elements[i].style.width = (parseInt(document.getElementsByTagName(\'table\')[0].clientWidth, 10) - 50) + \'px\';\n';
html += '               }\n';
html += '           }\n';
html += '           function toggle(id) {\n';
html += '               if (document.getElementById(id).style.display === \'none\') {\n';
html += '                   document.getElementById(id).style.display = \'table-cell\';\n';
html += '               } else {\n';
html += '                   document.getElementById(id).style.display = \'none\';\n';
html += '               }\n';
html += '           }\n';
html += '       </script>\n';
html += '   </head>\n';
html += '   <body onload="onLoad()"><h1>Code Coverage</h1>\n';
html += '       <table>\n';
html += '           <thead>\n';
html += '               <tr><th>File</th><th>Statements</th><th>Executed</th><th>Coverage</th><th></th></tr>\n';

if (cov.percentage >= 75) {
    color = 'green';
} else if (cov.percentage >= 50) {
    color = 'orange';
} else if (cov.percentage >= 25) {
    color = 'red';
} else {
    color = 'grey';
}

html += '               <tr><td>Total</td><td class="statements">' + cov.lines + '</td><td class="executed">' + cov.executed + '</td><td class="coverage">' + cov.percentage.toFixed(2) + '%</td>\n';
html += '                   <td class="percentage-container"><div class="percentage"><span style="width: ' + cov.percentage + '%; background-color: ' + color + ';"></span></div></td>\n';
html += '               </tr>\n';
html += '           </thead>\n';
html += '           <tbody>\n';
for (file in cov.files) {
    if (cov.files.hasOwnProperty(file)) {
        if (cov.files[file].percentage >= 75) {
            color = 'green';
        } else if (cov.files[file].percentage >= 50) {
            color = 'orange';
        } else if (cov.files[file].percentage >= 25) {
            color = 'red';
        } else {
            color = 'grey';
        }

        html += '           <tr onclick="toggle(\'' + file.replace(/[^0-9a-zA-Z]/g, '_') + '\');">\n';
        html += '               <td>' + file + '</td><td class="statements">' + cov.files[file].lines + '</td><td class="executed">' + cov.files[file].executed + '</td><td class="coverage">' + cov.files[file].percentage.toFixed(2) + '%</td>\n';
        html += '               <td class="percentage-container"><div class="percentage"><span style="width: ' + cov.files[file].percentage.toFixed(2) + '%; background-color: ' + color + ';"></span></div></td>\n';
        html += '           </tr>\n';
        html += '           <tr>\n';
        html += '               <td id="' + file.replace(/[^0-9a-zA-Z]/g, '_') + '" style="display: none;" colspan="5">\n';
        html += '                   <pre>\n';

        for (line in cov.files[file].source) {
            if (cov.files[file].source.hasOwnProperty(line)) {
                len = Object.keys(cov.files[file].source).length.toString().length;
                html += '                   <span class="lineno" title="' + cov.files[file].source[line].status + ' times">' + (repeat('0', len) + line).slice(-len) + '</span> ';
                if (cov.files[file].source[line].status === '-') {
                    html += '<span class="line grey">';
                } else if (cov.files[file].source[line].status.toString() === '0') {
                    html += '<span class="line red">';
                } else {
                    html += '<span class="line green">';
                }
                html += cov.files[file].source[line].line;
                html += '</span>\n';
            }
        }
        html += '                   </pre>\n';
        html += '               </td>\n';
        html += '           </tr>\n';
    }
}
html += '           </tbody>\n';
html += '       </table>\n';
html += '       <div class="footer">Generated using <a href="http://fabiocicerchia.github.io/salmonjs">salmonJS</a> version 0.4.0</div>\n';
html += '   </body>\n';
html += '</html>';

fs.write('report/coverage.json', JSON.stringify(cov));
fs.write('report/coverage.lcov', lcov);
fs.write('report/coverage.html', html);
console.log('JSON code coverage saved in: ' + fs.absolute('report/coverage.json'));
console.log('LCOV code coverage saved in: ' + fs.absolute('report/coverage.lcov'));
console.log('HTML code coverage saved in: ' + fs.absolute('report/coverage.html'));
if (casper !== undefined) {
    casper.test.done();
}
