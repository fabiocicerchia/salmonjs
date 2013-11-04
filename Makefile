install-coverage:
	git clone https://github.com/visionmedia/node-jscoverage.git

test:
	./node_modules/.bin/mocha

coverage:
	./node-jscoverage/jscoverage src src-cov
	SPIDEY_COV=1 ./node_modules/.bin/mocha -R html-cov > coverage.html
	rm -rf src-cov

.PHONY: test