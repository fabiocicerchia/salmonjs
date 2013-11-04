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

var assert  = require('assert'),
    should  = require('chai').should(),
    libpath = process.env['SPIDEY_COV'] ? '../src-cov' : '../src',
    Parser  = require(libpath + '/parser');

describe('Parser', function() {
    describe('#parse()', function() {
        it('parses a GET request', function() {
            var parser = new Parser();
            false.should.equal(true, 'TBD');
        });

        it('parses a POST request', function() {
            var parser = new Parser();
            false.should.equal(true, 'TBD');
        });

        it('doesn\'t parse anything else', function() {
            var parser = new Parser();
            false.should.equal(true, 'TBD');
        });
    });

    describe('#initReport()', function() {
        it('sets up the report container', function() {
            var parser = new Parser();

            parser.type  = 'type';
            parser.event = 'event';
            parser.xPath = 'xPath';
            parser.data  = 'data';
            parser.initReport();

            parser.report.time.start.should.be.a('number');
            parser.report.httpMethod.should.be.equal('type');
            parser.report.event.should.be.equal('event');
            parser.report.xPath.should.be.equal('xPath');
            parser.report.data.should.be.equal('data');
        });
    });

    describe('#parseGet()', function() {
        it('doesn\'t do anything', function() {
            var parser = new Parser();
            var resp   = parser.parseGet();

            assert.equal(resp, undefined);
        });
    });

    describe('#parsePost()', function() {
        it('doesn\'t do anything', function() {
            var parser = new Parser();
            var resp   = parser.parsePost();

            assert.equal(resp, undefined);
        });
    });

    describe('#onlyUnique()', function() {
        it('returns true when the element is unique', function() {
            var parser = new Parser();

            parser.onlyUnique('unique', 0, ['unique']).should.be.equal(true);
            parser.onlyUnique('unique', 0, ['unique', 'test']).should.be.equal(true);
            parser.onlyUnique('test', 1, ['unique', 'test']).should.be.equal(true);
            parser.onlyUnique('unique', 0, ['unique', 'unique']).should.be.equal(true);
        });

        it('returns false when the element is not unique', function() {
            var parser = new Parser();

            parser.onlyUnique('unique', 1, ['unique', 'unique']).should.be.equal(false);
            parser.onlyUnique(undefined, 0, [undefined, 'unique', 'unique']).should.be.equal(false);
        });
    });

    describe('#normaliseData()', function() {
        it('encodes correctly', function() {
            var parser = new Parser();

            parser.normaliseData('http://www.example.com/?%C3%A0=1').should.be.eql({'à': '1'});
            parser.normaliseData('http://www.example.com/?a=%3D').should.be.eql({a: '='});
        });

        it('removes duplicates', function() {
            var parser = new Parser();

            parser.normaliseData('http://www.example.com/?a=1&a=2').should.be.eql({a: '2'});
        });

        it('orders alphabetically', function() {
            var parser = new Parser();

            parser.normaliseData('http://www.example.com/?b=1&a=2').should.be.eql({a: '2', b: '1'});
        });

        it('returns empty array when input is not array', function() {
            var parser = new Parser();

            parser.normaliseData('http://www.example.com/?').should.be.eql({});
            parser.normaliseData([]).should.be.eql({});
            parser.normaliseData({}).should.be.eql({});
            parser.normaliseData(1).should.be.eql({});
        });
    });

    describe('#arrayToQuery()', function() {
        it('works correctly', function() {
            var parser = new Parser();

            parser.arrayToQuery({}).should.be.equal('');
            parser.arrayToQuery({a: 1}).should.be.equal('a=1');
            parser.arrayToQuery({a: 1, b: 2}).should.be.equal('a=1&b=2');
            parser.arrayToQuery({'&agrave;': 1}).should.be.equal('%26agrave%3B=1');
            parser.arrayToQuery({'à': 1}).should.be.equal('%C3%A0=1');
        });

        it('handles matrixes correctly', function() {
            var parser = new Parser();

            parser.arrayToQuery({a: [1, 2]}).should.be.equal('a%5B0%5D=1&a%5B1%5D=2');
        });

        it('returns empty string when input is not array', function() {
            var parser = new Parser();

            parser.arrayToQuery(1).should.be.equal('');
            parser.arrayToQuery('').should.be.equal('');
            parser.arrayToQuery('test').should.be.equal('');
        });
    });

    describe('#normaliseUrl()', function() {
        it('strips querystring when baseUrl contains a querystring', function() {
            var parser = new Parser();
            false.should.equal(true, 'TBD');
        });

        it('strips hash when baseUrl contains an hash', function() {
            var parser = new Parser();
            false.should.equal(true, 'TBD');
        });

        // TODO: Write more cases
        // baseUrl: http://www.example.com url: /
        // baseUrl: http://www.example.com url: /#
        // baseUrl: http://www.example.com url: /?param=value
        // baseUrl: http://www.example.com url: /#?param=value
        // baseUrl: http://www.example.com/# url: /
        // baseUrl: http://www.example.com/# url: /#
        // baseUrl: http://www.example.com/# url: /?param=value
        // baseUrl: http://www.example.com/# url: /#?param=value
        // baseUrl: http://www.example.com/?param=value url: /
        // baseUrl: http://www.example.com/?param=value url: /#
        // baseUrl: http://www.example.com/?param=value url: /?param=value
        // baseUrl: http://www.example.com/?param=value url: /#?param=value
    });
});
