/**
 *               __                         _____ _______
 * .-----.---.-.|  |.--------.-----.-----._|     |     __|
 * |__ --|  _  ||  ||        |  _  |     |       |__     |
 * |_____|___._||__||__|__|__|_____|__|__|_______|_______|
 *
 * salmonJS v0.5.0
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

var rootdir  = require('path').resolve('.'),
    basePath = rootdir + '/test/assets/',
    Phapper  = require('phapper'),
    chai     = require('chai'),
    expect   = chai.expect;

// TEST #01 --------------------------------------------------------------------
describe('test01', function() {
    it('test01', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_01.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output)).to.deep.equal(JSON.parse('{}')); // it should returns 0 events
        done();
    });
});

// TEST #02 --------------------------------------------------------------------
describe('test02', function() {
    it('test02', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_02.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output)).to.deep.equal(JSON.parse('{}')); // it should returns 0 events
        done();
    });
});

// TEST #03 --------------------------------------------------------------------
describe('test03', function() {
    it('test03', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_03.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output)).to.deep.equal(JSON.parse('{}')); // it should returns 0 events
        done();
    });
});

// TEST #04 --------------------------------------------------------------------
describe('test04', function() {
    it('test04', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_04.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(
            JSON.parse(output),
            JSON.parse('{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]}}'),
            'it should returns 1 event'
        ); // DOMContentLoaded is an extra, empty, one (added by jQuery).
        done();
    });
});

// TEST #05 --------------------------------------------------------------------
describe('test05', function() {
    it('test05', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_05.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output))
            .to.deep.equal(JSON.parse('{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]}}'));
            // it should returns 1 event
            // DOMContentLoaded is an extra, empty, one (added by jQuery).
        done();
    });
});

// TEST #06 --------------------------------------------------------------------
describe('test06', function() {
    it('test06', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_06.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output))
            .to.deep.equal(JSON.parse('{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]}}'));
            // it should returns 1 event
            // DOMContentLoaded is an extra, empty, one (added by jQuery).
        done();
    });
});

// TEST #07 --------------------------------------------------------------------
describe('test07', function() {
    it('test07', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_07.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output))
            .to.deep.equal(JSON.parse('{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]}}'));
            // it should returns 1 event
            // DOMContentLoaded is an extra, empty, one (added by jQuery).
        done();
    });
});

// TEST #08 --------------------------------------------------------------------
describe('test08', function() {
    it('test08', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_08.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output))
            .to.deep.equal(JSON.parse('{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]},\"click\":{\"25f2d6df4f2a30f29f6f80da1e95011044b0b8f7\":[\"/html/body/a\"]}}'));
            // it should returns 2 events
            // DOMContentLoaded is an extra, empty, one (added by jQuery).
        done();
    });
});

// TEST #09 --------------------------------------------------------------------
describe('test09', function() {
    it('test09', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_09.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output))
            .to.deep.equal(JSON.parse('{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]},\"click\":{\"0fcab3502642850390405ad8bea30977d5bf5a5d\":[\"/html/body/a\"],\"25f2d6df4f2a30f29f6f80da1e95011044b0b8f7\":[\"/html/body/a\"]}}'));
            // it should returns 3 events
            // DOMContentLoaded is an extra, empty, one (added by jQuery).
        done();
    });
});

// TEST #10 --------------------------------------------------------------------
describe('test10', function() {
    it('test10', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_10.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output))
            .to.deep.equal(JSON.parse('{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]},\"click\":{\"0fcab3502642850390405ad8bea30977d5bf5a5d\":[\"/html/body/div\"]}}'));
            // it should returns 2 events
            // DOMContentLoaded is an extra, empty, one (added by jQuery).
        done();
    });
});

// TEST #11 --------------------------------------------------------------------
describe('test11', function() {
    it('test11', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_11.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output))
            .to.deep.equal(JSON.parse('{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]},\"click\":{\"0fcab3502642850390405ad8bea30977d5bf5a5d\":[\"/html/body/div\"]}}'));
            // it should returns 2 events
            // DOMContentLoaded is an extra, empty, one (added by jQuery).
        done();
    });
});

// TEST #12 --------------------------------------------------------------------
describe('test12', function() {
    it('test12', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_12.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output))
            .to.deep.equal(JSON.parse('{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]}}'));
            // it should returns 1 event
            // DOMContentLoaded is an extra, empty, one (added by jQuery).
        done();
    });
});

// TEST #13 --------------------------------------------------------------------
describe('test13', function() {
    it('test13', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_13.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output))
            .to.deep.equal(JSON.parse('{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]}}'));
            // it should returns 1 event
            // DOMContentLoaded is an extra, empty, one (added by jQuery).
        done();
    });
});

// TEST #14 --------------------------------------------------------------------
describe('test14', function() {
    it('test14', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_14.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output))
            .to.deep.equal(JSON.parse('{\"load\":{\"4c36f76234482bdc076deeaa345fb56943c2462e\":[\"/html/body\"]}}'));
            // it should returns 1 event
        done();
    });
});

// TEST #15 --------------------------------------------------------------------
describe('test15', function() {
    it('test15', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_15.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output))
            .to.deep.equal(JSON.parse('{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"],\"f328793b597cd5eb24778cf51365c6865b2805cd\":[\"/html/body\"]}}'));
            // it should returns 2 events
            // DOMContentLoaded is an extra, empty, one (added by jQuery).
        done();
    });
});

// TEST #16 --------------------------------------------------------------------
describe('test16', function() {
    it('test16', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_16.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output)).to.deep.equal(JSON.parse('{}')); // it should returns 0 events
        done();
    });
});

// TEST #17 --------------------------------------------------------------------
describe('test17', function() {
    it('test17', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_17.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output))
            .to.deep.equal(JSON.parse('{\"click\":{\"8e3eb8cb110fe7b5d828aa2efe911ba0e83491dd\":[\"/html/body/a\"]}}'));
            // it should returns 1 event
        done();
    });
});

// TEST #18 --------------------------------------------------------------------
describe('test18', function() {
    it('test18', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_18.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output))
            .to.deep.equal(JSON.parse('{\"DOMContentLoaded\":{},\"load\":{\"01522c0ac7a8ba1b2b35c63d93a1e0da8cff4262\":[\"window\"]},\"click\":{\"46263e884ea4628bd628a94c115f92d57ea23d5c\":[\"/html/body/a\"]}}'));
            // it should returns 2 events
            // DOMContentLoaded is an extra, empty, one (added by jQuery).
        done();
    });
});

// TEST #19 --------------------------------------------------------------------
describe('test19', function() {
    it('test19', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_19.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output)).to.deep.equal(JSON.parse('{}')); // it should returns 0 events
        done();
    });
});

// TEST #20 --------------------------------------------------------------------
describe('test20', function() {
    it('test20', function (done) {
        var phap    = new Phapper(rootdir + '/test/parser/events.js', [ basePath + 'test_20.html' ]),
            results = phap.runSync(),
            output  = results.stdout.substr(0, results.stdout.length - 1);

        expect(JSON.parse(output)).to.deep.equal(JSON.parse('{}')); // it should returns 0 events
        done();
    });
});
