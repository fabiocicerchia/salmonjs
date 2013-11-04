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

var assert        = require('assert'),
    should        = require('chai').should(),
    libpath       = process.env['SPIDEY_COV'] ? '../../src-cov' : '../../src',
    PhantomParser = require(libpath + '/parser/phantom');

describe('PhantomParser', function() {
  describe('#setUpPage()', function() {
    it('has been set up properly', function() {
        var phantom = new PhantomParser();

        phantom.setUpPage();
        /*
        page.settings.resourceTimeout = config.parser.timeout;
        page.onResourceTimeout        = this.onResourceTimeout;
        page.onError                  = this.onError;
        page.onInitialized            = this.onInitialized;
        page.onResourceReceived       = this.onResourceReceived;
        page.onAlert                  = this.onAlert;
        page.onConfirm                = this.onConfirm;
        page.onPrompt                 = this.onPrompt;
        page.onConsoleMessage         = this.onConsoleMessage;
        */
        false.should.equal(true, 'TBD');
    });
  });

  describe('#parseGet()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  describe('#parsePost()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  describe('#fireEventObject()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  describe('#fireEventDOM()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  describe('#onOpen()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  describe('#onResourceTimeout()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  describe('#onError()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  describe('#onInitialized()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  // TODO: do it
  describe('#onResourceReceived()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  // TODO: do it
  describe('#onAlert()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  // TODO: do it
  describe('#onConfirm()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  // TODO: do it
  describe('#onPrompt()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  // TODO: do it
  describe('#onConsoleMessage()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  describe('#onLoadFinished()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  describe('#parsePage()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });

  describe('#onEvaluate()', function() {
    it('TBD', function() {
        false.should.equal(true, 'TBD');
    });
  });
});