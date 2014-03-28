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
JASMINE=./node_modules/jasmine-node/bin/jasmine-node
GRUNT=grunt
JSCOVERAGE=./node_modules/visionmedia-jscoverage/jscoverage
YUIDOC=node ./node_modules/yuidocjs/lib/cli.js
YUIDOC=yuidoc
FILES=test
FILES_COV=test/parser/test.phantom.js test/test.crawler.js test/test.events.js test/test.main.js test/test.parser.js test/test.pool.js test/test.session.js test/test.test.js test/test.utils.js

install: install-yuidoc-theme npm

install-yuidoc-theme:
	$(GIT) clone https://github.com/Krxtopher/yuidoc-themes docs/theme

npm:
	$(NPM) install grunt-cli -g
	$(NPM) install coveralls -g

versions:
	$(GRUNT) --version
	$(JASMINE) --version
	$(NODE) --version
	$(NPM) version
	$(PHANTOMJS) --version
	$(YUIDOC) --version || true

test:
	$(JASMINE) $(FILES)

coverage:
	$(GRUNT) jasmine_node
	cat build/reports/coverage/lcov.info | sed -r "s/SF:.+\/(src|test)/SF:\1/" | coveralls

documentation:
	$(YUIDOC) -o docs/api -t docs/theme/friendly-theme bin src test

show-report:
	cd /tmp && chmod 777 *.dmp && tar -pzcf phantomjs.tar.gz *.dmp
	cat /tmp/phantomjs.tar.gz | base64

lint:
	$(FIND) bin src test -type f -name "*.js" | xargs $(JSHINT)

.PHONY: test
