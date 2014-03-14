# CHANGELOG

## 0.4.0 / 13 March 2014

 * Fixed proxy undefined + fix on pool mechanism
 * Fixed #9
 * Updated version numbers
 * Closed #33
 * Minor improvements
 * Closed #20
 * Changed CDN
 * Closed #14
 * Closed #23
 * Closed #25

## 0.3.0 / 29 December 2013

 * Fixed travis tests
 * Updated redis version
 * Workaround to avoid to stop the execution when 'about:blank'
 * Fixed #30
 * Improved code
 * Fixed issue with upload
 * Fixed #12
 * Fixed broken tests
 * Excluded upload from TravisCI - perhaps the CI servers have been banned by ImageBin
 * Fixed test for normaliseUrl
 * Testing the assets with casperjs
 * Lowercase package name
 * Rebranding: say goodbye to spidey, say hello to salmonJS
 * Added timeout for upload - perhaps the CI servers have been banned by ImageBin
 * Exclude the upload test from travis ci - because every time is taking ages
 * Added timeout for upload - perhaps the CI servers have been banned by ImageBin
 * Added more nodejs versions
 * Fixed #7
 * Fixed broken test
 * Fixed #6
 * Refactored the test case structure
 * Wrap the functional test to avoid problems with code coverage
 * Fixed #5
 * Closed #13
 * Fixed winston messages in crawler.js
 * Re-added glob for bug in worker.js
 * Improved docs
 * Improved tests
 * Improved tests
 * Improved tests for crawler, parser and test
 * Fixed overall code coverage percentage
 * Improved makefile to run single test file
 * Refactoring
 * Added unique id
 * Splitted tests
 * Merge var declaration
 * Fix percentage colours
 * Fixed code coverage issue
 * Removed unused method
 * Updated
 * Improved to run coverage on single files
 * Added info for insight
 * Fixed problem with unknown variable
 * Removed test for casperjs
 * Added insight support
 * Removed all the references to casperjs
 * Improved to execute all the JS events in the parser
 * Removed support for casperjs as parser
 * Display messages from parser process
 * Updated
 * Fixed typo
 * Updated
 * Fixed problem with testing variable which has broken the parsers
 * Fixed redirection problem
 * Locking navigation for one test (needs to be debugged why)
 * Fixed tests to work with the new casperjs (dev) version
 * Fixed #11
 * Fixed missing param
 * Do not process the page if there are no links
 * Fix travis ci
 * Disabled the processing if it's not HTML
 * Added follow redirects option
 * Updated
 * Specify only for the branches to build.
 * Linted
 * Fixed text match after test case structure change
 * Fixed parameter for casperjs test
 * Updated changelog
 * Improved report
 * Fixed issue with top parent node (that has no parentNode)
 * Increased redis version

## 0.2.1 / 25 November 2013

 * Updated url
 * Fixed attribute name for script tag (thanks to Ben Ellis)
 * Added custom user agent value + removed duplicate property 'tags'
 * Removed useless file
 * Improved test case file to use section (e.g.: POST, GET, ...)
 * Removed glob as external dependency
 * Increased minor version
 * Added report id and comments in test cases

## 0.2.0 / 23 November 2013

 * Minor changes
 * Improved tests, minor changes to the code
 * Improvement on the coverage report and page report
 * Fixed viewport size and page content
 * Improved coverage generation
 * Improved tests for parsers (and relative source code)
 * Fixed problem with unknown variable
 * Updated
 * Improved coverage report
 * Fixed parser to remove duplicate slashes
 * Fixed bug with external urls
 * Improved the crawler using workers
 * Temporary disabled the process.exit
 * Partial test for phantom
 * Changed location for coverage reports
 * Fixed broken parsers
 * Added missing dependency for crawler
 * Fixed broken json
 * Code coverage
 * Fixed code coverage for test.test.js
 * Improved tests adding cove coverage
 * Improved tests with casperjs + remove some todo
 * Removed some todo + added documentation
 * Improved casper & phantom parsers + more tests with casperjs + new classes to emulate fs & glob + minor changes
 * Partially working
 * Fixed interface name
 * Fixed cmd
 * Fixed wrong values
 * Added tests with CasperJS for DOM interaction + draft for parser with CasperJS (broken at the moment)
 * Improved url normalisation
 * Added IOC
 * Minor changes
 * Updated package.json
 * Fixed form processing
 * Fixed fallback value when undefined for event and xPath properties
 * Fixed wrong comparison value for indexOf
 * Minor change
 * Minor improvement to test structure
 * Removed winston log from mocha tests
 * Improved tests for crawler and parser
 * Improved (a bit) the tests
 * Added .travis.yml
 * Update .travis.yml
 * Added tests with mocha & chai
 * Add dependecy phantomjs to npm
 * Changed version to 0.1.1
 * Updated package.json
 * Minor changes
 * Fixed bugged behaviour which was keeping open the node.js process
 * Checked if the attributes ('on*') attached at runtime are handled correctly
 * Removed duplicated element
 * Fixed the issue when the 'Crawler.onStdOut' is executed after 'Crawler.onExit'
 * Better redis error handling
 * Updated
 * Removed duplicated code
 * Fixed bug with or condition
 * Minor changes + improved documentation
 * Added index file for report
 * Added screenshot feature
 * Fixed name after rebranding
 * Rebrand
 * Updated
 * Group reports by execution time
 * Dos2unix
 * Added html template for reports
 * Added support for report generation
 * Fix to get the whole output string rather than get a partial one each time
 * Fixed problem with output
 * Minor improvements
 * Crated a separate file for the console
 * Updated
 * Updated
 * Added http authentication
 * Updated
 * Fixed existsSync using the right node.js version
 * Fixed tests
 * Changed tests
 * Fixed to retrieve also the events attached as attribute
 * Fixed param in tests
 * Updated
 * Added and fixed tests
 * Added help
 * Fixed bug with empty url
 * Fixed winston logging
 * Updated
 * Fixed winston logging
 * Fixed bug about querystring parsing
 * Linted the code
 * Added sorting querystring parameters
 * Fixed indentation
 * Fixed file path uri
 * Added identifier to log messages + fixed problem launching and parsing properly the url
 * Improved to parse url and file path
 * Retrieving events bound to elements & process them + fix signature hash
 * Added title (ascii art)
 * Updated
 * Added tests
 * Converted project from PHP to Node.js
 * First draft (needs to be refactored and tested)
 * Initial commit
