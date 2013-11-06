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
    Crawler = require(libpath + '/crawler');

describe('Crawler', function() {
    describe('#serialise()', function() {
        it('encode entities properly', function() {
            var crawler = new Crawler();

            crawler.serialise({}).should.equal('');
            crawler.serialise({a: 1, b: 2}).should.equal('a=1&b=2');
            crawler.serialise([]).should.equal('');
            crawler.serialise(['a', 'b']).should.equal('0=a&1=b');
        });

        it('doesn\'t process a string', function() {
            var crawler = new Crawler();

            crawler.serialise('').should.equal('');
            crawler.serialise('test').should.equal('');
        });

        it('doesn\'t process an integer', function() {
            var crawler = new Crawler();

            crawler.serialise(1).should.equal('');
            crawler.serialise(-1).should.equal('');
            crawler.serialise(0).should.equal('');
        });
    });

    describe('#execPhantomjs()', function() {
        it('runs', function(done) {
            var crawler = new Crawler();

            crawler.onStdOut = function() {};
            crawler.onStdErr = function() {};
            crawler.onExit = function() {
                done();
            };

            crawler.execPhantomjs();
        });
    });

    describe('#run()', function() {
        it('runs', function() {
            var crawler = new Crawler();

            crawler.execPhantomjs = function () { return 'OK' };

            crawler.run('', '', '', '', '').should.be.equal('OK');
        });
    });

    describe('#analiseRedisResponse()', function() {
        it('runs', function() {
            var crawler = new Crawler();
            false.should.equal(true, 'TBD');
        });
    });

    describe('#checkAndRun()', function() {
        it('runs', function() {
            var crawler = new Crawler();
            false.should.equal(true, 'TBD');
        });
    });

    describe('#checkRunningCrawlers()', function() {
        it('doesn\'t exit when there are running crawlers', function() {
            var crawler = new Crawler();

            crawler.possibleCrawlers = 1;
            crawler.checkRunningCrawlers().should.be.equal(true);
        });

        it('exits when there are no running crawlers', function() {
            var crawler = new Crawler();

            crawler.possibleCrawlers = 0;
            crawler.checkRunningCrawlers().should.be.equal(false);
        });
    });

    describe('#onStdOut()', function() {
        it('collect the data from response', function() {
            var crawler = new Crawler();

            crawler.processOutput = '';
            crawler.onStdOut('test\n');
            crawler.processOutput.should.equal('test\n');

            crawler.onStdOut('test2\n');
            crawler.processOutput.should.equal('test\ntest2\n');
        });
    });

    describe('#onStdErr()', function() {
        it('runs', function() {
            var crawler = new Crawler();

            crawler.handleError = function() {};

            var resp = crawler.onStdErr('');
            assert.equal(undefined, resp);
        });
    });

    describe('#handleError()', function() {
        it('tries to run another crawler if max attempts is not reached', function(done) {
            var crawler = new Crawler();

            crawler.run = function () {
                done();
            };

            crawler.tries = 0;
            crawler.handleError().should.be.equal(true);
        });

        it('doesn\'t try to run another crawler if max attempts is reached', function() {
            var crawler = new Crawler();

            crawler.tries = 10;
            crawler.handleError().should.be.equal(false);
        });
    });

    describe('#onExit()', function() {
        it('runs', function() {
            var crawler = new Crawler();

            crawler.processPage = function () { return true; };

            crawler.onExit().should.be.equal(true);
        });
    });

    describe('#htmlEscape()', function() {
        it('escape "ampersand" correctly', function() {
            var crawler = new Crawler();

            crawler.htmlEscape('&').should.be.equal('&amp;');
        });

        it('escape "double quote" correctly', function() {
            var crawler = new Crawler();

            crawler.htmlEscape('"').should.be.equal('&quot;');
        });

        it('escape "single quote" correctly', function() {
            var crawler = new Crawler();

            crawler.htmlEscape('\'').should.be.equal('&#39;');
        });

        it('escape "less than" correctly', function() {
            var crawler = new Crawler();

            crawler.htmlEscape('<').should.be.equal('&lt;');
        });

        it('escape "greater than" correctly', function() {
            var crawler = new Crawler();

            crawler.htmlEscape('>').should.be.equal('&gt;');
        });

        it('doesn\'t escape anything else', function() {
            var crawler = new Crawler();

            var unescaped = 'abcdefghijklmnopqrstuvwxyz0123456789\\|!£$%/()=?^[]{}@#;,:.-_+';
            crawler.htmlEscape(unescaped).should.be.equal(unescaped);
        });
    });

    describe('#storeDetailsToFile()', function() {
        it('save properly a report file', function() {
            var crawler = new Crawler();
            false.should.equal(true, 'TBD');
        });
    });

    describe('#processPage()', function() {
        it('process an empty page', function() {
            var crawler = new Crawler();

            var data = {
                idCrawler: '',
                links:     {
                    anchors: [],
                    links:   [],
                    scripts: [],
                    forms:   [],
                    events:  []
                },
                report:    {
                    errors:     [],
                    alerts:     [],
                    confirms:   [],
                    console:    [],
                    resources:  {},
                    time:       { start: 0, end: 0, total: 0 },
                    content:    '',
                    httpMethod: '',
                    event:      '',
                    xPath:      '',
                    data:       {}
                }
            };
            var content = '###' + JSON.stringify(data);

            crawler.checkRunningCrawlers = function () { return 'OK'; };
            crawler.checkAndRun          = function () {};

            crawler.processPage(content).should.be.equal('OK');
            crawler.possibleCrawlers.should.be.equal(0);
        });

        it('process a page with 1 link', function() {
            var crawler = new Crawler();

            var data = {
                idCrawler: '',
                links:     {
                    anchors: ['#'],
                    links:   [],
                    scripts: [],
                    forms:   [],
                    events:  []
                },
                report:    {
                    errors:     [],
                    alerts:     [],
                    confirms:   [],
                    console:    [],
                    resources:  {},
                    time:       { start: 0, end: 0, total: 0 },
                    content:    '',
                    httpMethod: '',
                    event:      '',
                    xPath:      '',
                    data:       {}
                }
            };
            var content = '###' + JSON.stringify(data);

            crawler.checkRunningCrawlers = function () { return 'OK'; };
            crawler.checkAndRun          = function () {};

            crawler.processPage(content).should.be.equal('OK');
            crawler.possibleCrawlers.should.be.equal(1);
        });

        it('process a page with 2 links', function() {
            var crawler = new Crawler();

            var data = {
                idCrawler: '',
                links:     {
                    anchors: ['#', '/'],
                    links:   [],
                    scripts: [],
                    forms:   [],
                    events:  []
                },
                report:    {
                    errors:     [],
                    alerts:     [],
                    confirms:   [],
                    console:    [],
                    resources:  {},
                    time:       { start: 0, end: 0, total: 0 },
                    content:    '',
                    httpMethod: '',
                    event:      '',
                    xPath:      '',
                    data:       {}
                }
            };
            var content = '###' + JSON.stringify(data);

            crawler.checkRunningCrawlers = function () { return 'OK'; };
            crawler.checkAndRun          = function () {};

            crawler.processPage(content).should.be.equal('OK');
            crawler.possibleCrawlers.should.be.equal(2);
        });

        it('process a page with 1 event', function() {
            var crawler = new Crawler();

            var data = {
                idCrawler: '',
                links:     {
                    anchors: [],
                    links:   [],
                    scripts: [],
                    forms:   [],
                    events:  {
                        click: {
                            da39a3ee5e6b4b0d3255bfef95601890afd80709: [
                                '//whatever'
                            ]
                        }
                    }
                },
                report:    {
                    errors:     [],
                    alerts:     [],
                    confirms:   [],
                    console:    [],
                    resources:  {},
                    time:       { start: 0, end: 0, total: 0 },
                    content:    '',
                    httpMethod: '',
                    event:      '',
                    xPath:      '',
                    data:       {}
                }
            };
            var content = '###' + JSON.stringify(data);

            crawler.checkRunningCrawlers = function () { return 'OK'; };
            crawler.checkAndRun          = function () {};

            crawler.processPage(content).should.be.equal('OK');
            crawler.possibleCrawlers.should.be.equal(1);
        });

        it('process a page with 2 events', function() {
            var crawler = new Crawler();

            var data = {
                idCrawler: '',
                links:     {
                    anchors: [],
                    links:   [],
                    scripts: [],
                    forms:   [],
                    events:  {
                        click: {
                            da39a3ee5e6b4b0d3255bfef95601890afd80709: [
                                '//whatever',
                                '//whatever2'
                            ]
                        }
                    }
                },
                report:    {
                    errors:     [],
                    alerts:     [],
                    confirms:   [],
                    console:    [],
                    resources:  {},
                    time:       { start: 0, end: 0, total: 0 },
                    content:    '',
                    httpMethod: '',
                    event:      '',
                    xPath:      '',
                    data:       {}
                }
            };
            var content = '###' + JSON.stringify(data);

            crawler.checkRunningCrawlers = function () { return 'OK'; };
            crawler.checkAndRun          = function () {};

            crawler.processPage(content).should.be.equal('OK');
            crawler.possibleCrawlers.should.be.equal(2);
        });

        it('process a page with 1 link and 1 event', function() {
            var crawler = new Crawler();

            var data = {
                idCrawler: '',
                links:     {
                    anchors: ['#'],
                    links:   [],
                    scripts: [],
                    forms:   [],
                    events:  {
                        click: {
                            da39a3ee5e6b4b0d3255bfef95601890afd80709: [
                                '//whatever'
                            ]
                        }
                    }
                },
                report:    {
                    errors:     [],
                    alerts:     [],
                    confirms:   [],
                    console:    [],
                    resources:  {},
                    time:       { start: 0, end: 0, total: 0 },
                    content:    '',
                    httpMethod: '',
                    event:      '',
                    xPath:      '',
                    data:       {}
                }
            };
            var content = '###' + JSON.stringify(data);

            crawler.checkRunningCrawlers = function () { return 'OK'; };
            crawler.checkAndRun          = function () {};

            crawler.processPage(content).should.be.equal('OK');
            crawler.possibleCrawlers.should.be.equal(2);
        });

        it('process a page with 2 links and 2 events', function() {
            var crawler = new Crawler();

            var data = {
                idCrawler: '',
                links:     {
                    anchors: ['#', '/'],
                    links:   [],
                    scripts: [],
                    forms:   [],
                    events:  {
                        click: {
                            da39a3ee5e6b4b0d3255bfef95601890afd80709: [
                                '//whatever',
                                '//whatever2'
                            ]
                        }
                    }
                },
                report:    {
                    errors:     [],
                    alerts:     [],
                    confirms:   [],
                    console:    [],
                    resources:  {},
                    time:       { start: 0, end: 0, total: 0 },
                    content:    '',
                    httpMethod: '',
                    event:      '',
                    xPath:      '',
                    data:       {}
                }
            };
            var content = '###' + JSON.stringify(data);

            crawler.checkRunningCrawlers = function () { return 'OK'; };
            crawler.checkAndRun          = function () {};

            crawler.processPage(content).should.be.equal('OK');
            crawler.possibleCrawlers.should.be.equal(4);
        });
    });
});
