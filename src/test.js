/*jslint node: true, continue: true, nomen: true, plusplus: true, regexp: true, sloppy: true, todo: true */
var path = require('path');
var fs   = require('fs');
var glob = require('glob');

/**
 * 
 */
module.exports = function Test() {
    /**
     * 
     */
    this.TEST_CASE_DIRECTORY = '/../tests/cases/';

    /**
     * 
     */
    var currentTest = this;

    /**
     * 
     */
    this.create = function (name, data) {
        var content      = '',
            testCaseFile = __dirname + this.TEST_CASE_DIRECTORY + name + '.tst',
            k;

        for (k in data) {
            content += k + '=' + data[k] + "\n";
        }

        fs.mkdir(__dirname + this.TEST_CASE_DIRECTORY, '0777', function () {
            fs.writeFileSync(testCaseFile, content);
        });
    };

    /**
     *
     */
    this.getCases = function (url) {
        var cases = [],
            files = glob.sync(__dirname + this.TEST_CASE_DIRECTORY + url + '*.tst');

        files.forEach(function (filename) {
            cases.push(currentTest.parseCase(filename));
        });

        return cases;
    };

    /**
     *
     */
    this.parseCase = function (file) {
        var content = fs.readFileSync(file).toString(),
            lines   = content.split("\n"),
            data    = [],
            i,
            value;

        for (i in lines) {
            if (lines[i] !== '') {
                value = lines[i].split(/=/, 2);
                data[value[0]] = value[1];
            }
        }

        return data;
    };
};