console.log('Generating code coverage...');
var cov = global._$jscoverage || {},
    ncov = {},
    fs = require('fs'),
    file, id, line, status;

for (file in cov) {
    ncov[file] = {lines: 0, percentage: 0, source: {}};
    for (id in cov[file].source) {
        line = cov[file].source[id];
        status = cov[file][id] === undefined ? '-' : cov[file][id];
        if (status === '-' || status > 0) ncov[file].lines++;
        ncov[file].source[id] = { status: status, line: line};
    }
    ncov[file].percentage = 100 / cov[file].source.length * ncov[file].lines;
}

var html = '<h1>Code Coverage</h1>';
for (file in ncov) {
    html += '<h2>' + file + ' (' + ncov[file].percentage + '%)</h2>';
    for (line in ncov[file].source) {
        if (ncov[file].source[line].status === '-') {
            html += '<pre style="color: grey;">';
        } else if (ncov[file].source[line].status === 0) {
            html += '<pre style="color: red;">';
        } else {
            html += '<pre style="color: green;">';
        }
        html += ncov[file].source[line].line;
        html += '</pre>';
    }
}

fs.write('coverage.json', JSON.stringify(ncov));
fs.write('coverage.html', html);
console.log('JSON code coverage saved in: ' + fs.absolute('coverage.json'));
console.log('HTML code coverage saved in: ' + fs.absolute('coverage.html'));
casper.test.done();