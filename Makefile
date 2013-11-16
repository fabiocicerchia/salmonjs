#               __     __
# .-----.-----.|__|.--|  |.-----.--.--.
# |__ --|  _  ||  ||  _  ||  -__|  |  |
# |_____|   __||__||_____||_____|___  |
#       |__|                    |_____|
#
# SPIDEY v0.2.0
#
# Copyright (C) 2013 Fabio Cicerchia <info@fabiocicerchia.it>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

CASPERJS=./casperjs/bin/casperjs
JSCOVERAGE=./node_modules/visionmedia-jscoverage/jscoverage

test:
	$(CASPERJS) test test/test.*.js test/*/test.*.js

coverage:
	rm -rf src-cov 2> /dev/null
	$(JSCOVERAGE) src src-cov
	$(CASPERJS) test test/test.*.js test/*/test.*.js --post=test/coverage.js --coverage --concise
	rm -rf src-cov

.PHONY: test
