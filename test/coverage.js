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
    file, id, line, status, len;

for (file in cov) {
    ncov[file] = {lines: 0, percentage: 0, source: {}};
    for (id in cov[file].source) {
        line = cov[file].source[id];
        status = cov[file][parseInt(id) + 1] === undefined ? '-' : cov[file][parseInt(id) + 1];
        if (status === '-' || status > 0) ncov[file].lines++;
        ncov[file].source[id] = { status: status, line: line};
    }
    ncov[file].percentage = 100 / cov[file].source.length * ncov[file].lines;
}

var html = '<html><style>pre span.lineno { display: inline-block; } pre span.line { display: inline-block; } pre span.line.grey { color: grey; } pre span.line.green { color: green; } pre span.line.red { color: red; }</style><body><h1>Code Coverage</h1>';
for (file in ncov) {
    html += '<h2>' + file + ' (' + ncov[file].percentage.toFixed(2) + '%)</h2>';
    html += '<pre>';
    for (line in ncov[file].source) {
        len = ncov[file].lines.toString().length;
        html += '<span class="lineno">' + (repeat('0', len) + line).slice(-len) + '</span> ';
        if (ncov[file].source[line].status === '-') {
            html += '<span class="line grey">';
        } else if (ncov[file].source[line].status === 0) {
            html += '<span class="line red">';
        } else {
            html += '<span class="line green">';
        }
        html += ncov[file].source[line].line;
        html += '</span><br />';
    }
    html += '</pre>';
}
html += '</body></html>';

fs.write('report/coverage.json', JSON.stringify(ncov));
fs.write('report/coverage.html', html);
console.log('JSON code coverage saved in: ' + fs.absolute('report/coverage.json'));
console.log('HTML code coverage saved in: ' + fs.absolute('report/coverage.html'));
casper.test.done();