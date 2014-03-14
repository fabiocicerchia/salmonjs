#               __                         _____ _______
# .-----.---.-.|  |.--------.-----.-----._|     |     __|
# |__ --|  _  ||  ||        |  _  |     |       |__     |
# |_____|___._||__||__|__|__|_____|__|__|_______|_______|
#
# salmonJS v0.4.0
#
# Copyright (C) 2014 Fabio Cicerchia <info@fabiocicerchia.it>
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

ECHO=echo
RM=rm -rf
GIT=git
FIND=find
PHANTOMJS=phantomjs
NODE=node
NPM=npm
JSHINT=./node_modules/jshint/bin/jshint
CASPERJS=./casperjs/bin/casperjs
JSCOVERAGE=./node_modules/visionmedia-jscoverage/jscoverage
FILES=test/test.*.js test/*/test.*.js

install-casper:
	$(GIT) clone git://github.com/n1k0/casperjs.git

versions:
	$(CASPERJS) --version
	$(JSCOVERAGE) --version
	$(PHANTOMJS) --version
	$(NODE) --version
	$(NPM) version

test:
	$(CASPERJS) test $(FILES)

coverage:
	$(RM) src-cov 2> /dev/null
	$(JSCOVERAGE) src src-cov
	$(CASPERJS) test $(FILES) --post=src/reporter/coverage.js --coverage --concise
	$(RM) src-cov

show-report:
	cd /tmp && chmod 777 *.dmp && tar -pzcf phantomjs.tar.gz *.dmp
	cat /tmp/phantomjs.tar.gz | base64

lint:
	$(FIND) bin src test -type f -name "*.js" | xargs $(JSHINT)

.PHONY: test
