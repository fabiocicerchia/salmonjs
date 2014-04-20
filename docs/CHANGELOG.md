## 0.5.0 / ?

 * Added few more examples
 * Added demo website for integration/functional testing
 * Added support to retrieve relative url as well
 * Fixed problem with storing report file when the directory already exists
 * Improved url processing speed - removing duplicates
 * Added more html tags to the parser
 * Fixed issue with report + issue with serialisation of the pool's queue
 * Fixed minor bugs with processing local files + added urijs
 * Fixed #45
 * Updated project url to www.salmonjs.org
 * Disabled 2 tests because of a possible "bug" in phantomjs
 * Removed ci for node.js 0.11
 * Disabled gzip, it's not recognised properly from phantomjs
 * Added readme generation via grunt
 * Added todo file, generated via grunt
 * Linted the code
 * Added dev utilities with grunt
 * Coverage improvements
 * Improved tests
 * Removed casperjs and added jasmine & grunt
 * Improved documentation + cleanup + fixed tests
 * Fixed #38
 * Fixed #39
 * Fixed #26
 * Fixed #37
 * Fixed #40
 * Fixed #34
 * Fixed #15 #16

## 0.4.1 / 04 April 2014

 * Fixed #45

## 0.4.0 / 13 March 2014

 * Fixed proxy undefined + fix on pool mechanism
 * Fixed #9
 * Closed #33
 * Closed #20
 * Changed CDN
 * Closed #14
 * Closed #23
 * Closed #25
 * Minor improvements
 * Fixed several bugs

## 0.3.0 / 29 December 2013

 * Workaround to avoid to stop the execution when 'about:blank'
 * Fixed #30
 * Improved code
 * Fixed issue with upload
 * Fixed #12
 * Rebranding: say goodbye to spidey, say hello to salmonJS
 * Added more nodejs versions
 * Fixed #7
 * Fixed #6
 * Wrap the functional test to avoid problems with code coverage
 * Fixed #5
 * Closed #13
 * Improved docs
 * Improved tests
 * Added insight support
 * Improved to execute all the JS events in the parser
 * Removed support for casperjs as parser
 * Fixed tests to work with the new casperjs (dev) version
 * Fixed #11
 * Do not process the page if there are no links
 * Disabled the processing if it's not HTML
 * Added follow redirects option
 * Linted
 * Improved report
 * Fixed issue with top parent node (that has no parentNode)
 * Increased redis version
 * Minor improvements
 * Fixed several bugs

## 0.2.1 / 25 November 2013

 * Fixed attribute name for script tag (thanks to Ben Ellis)
 * Added custom user agent value + removed duplicate property 'tags'
 * Improved test case file to use section (e.g.: POST, GET, ...)
 * Removed glob as external dependency
 * Added report id and comments in test cases
 * Minor improvements
 * Fixed several bugs

## 0.2.0 / 23 November 2013

 * Fixed viewport size and page content
 * Improved coverage generation
 * Improved the crawler using workers
 * Improved casper & phantom parsers + more tests with casperjs + new classes to emulate fs & glob + minor changes
 * Added tests with CasperJS for DOM interaction + draft for parser with CasperJS
 * Improved url normalisation
 * Added IOC
 * Removed winston log from mocha tests
 * Added .travis.yml
 * Added tests with mocha & chai
 * Add dependecy phantomjs to npm
 * Fixed bugged behaviour which was keeping open the node.js process
 * Checked if the attributes ('on*') attached at runtime are handled correctly
 * Better redis error handling
 * Fixed bug with or condition
 * Minor changes + improved documentation
 * Added screenshot feature
 * Rebrand
 * Added html template for reports
 * Added support for report generation
 * Crated a separate file for the console
 * Added http authentication
 * Fixed existsSync using the right node.js version
 * Added help
 * Linted the code
 * Added sorting querystring parameters
 * Improved to parse url and file path
 * Retrieving events bound to elements & process them + fix signature hash
 * Added tests
 * Converted project from PHP to Node.js
 * Minor improvements
 * Fixed several bugs
