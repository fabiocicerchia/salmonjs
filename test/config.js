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
    config  = require(libpath + '/config');

describe('Config', function() {
    describe('#redis', function() {
        it('should be an object', function() {
            should.exist(config.redis);
            config.redis.should.be.a('object');
        });

        it('contains "port" element', function() {
            should.exist(config.redis.port);
            config.redis.port.should.be.an('number');
        });

        it('contains "hostname" element', function() {
            should.exist(config.redis.hostname);
            config.redis.hostname.should.be.a('string');
        });
    });

    describe('#logging', function() {
        it('should be an object', function() {
            should.exist(config.logging);
            config.logging.should.be.a('object');
        });

        it('contains "level" element', function() {
            should.exist(config.logging.level);
            config.logging.level.should.be.a('string');
        });

        it('contains "silent" element', function() {
            should.exist(config.logging.silent);
            config.logging.silent.should.be.a('boolean');
        });
    });

    describe('#parser', function() {
        it('should be an object', function() {
            should.exist(config.parser);
            config.parser.should.be.a('object');
        });

        it('contains "interface" element', function() {
            should.exist(config.parser.interface);
            config.parser.interface.should.be.a('string');
        });

        it('contains "timeout" element', function() {
            should.exist(config.parser.timeout);
            config.parser.timeout.should.be.an('number');
        });
    });

    describe('#crawler', function() {
        it('should be an object', function() {
            should.exist(config.crawler);
            config.crawler.should.be.a('object');
        });

        it('contains "attempts" element', function() {
            should.exist(config.crawler.attempts);
            config.crawler.attempts.should.be.an('number');
        });

        it('contains "delay" element', function() {
            should.exist(config.crawler.delay);
            config.crawler.delay.should.be.an('number');
        });
    });
});
