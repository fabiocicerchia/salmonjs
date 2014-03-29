# salmonjs

[![Build Status](https://travis-ci.org/fabiocicerchia/salmonjs.png)](https://travis-ci.org/fabiocicerchia/salmonjs)
[![Dependency Status](https://gemnasium.com/fabiocicerchia/salmonjs.png)](https://gemnasium.com/fabiocicerchia/salmonjs)
[![Code Climate](https://codeclimate.com/github/fabiocicerchia/salmonjs.png)](https://codeclimate.com/github/fabiocicerchia/salmonjs)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/fabiocicerchia/salmonjs/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[![NPM](https://nodei.co/npm/salmonjs.png?downloads=true&stars=true)](https://nodei.co/npm/salmonjs/)

[![salmonJS - Web Crawler in Node.js to spider dynamically whole websites.](http://jpillora.com/github-twitter-button/img/tweet.png)](https://twitter.com/intent/tweet?text=salmonJS+-+Web+Crawler+in+Node.js+to+spider+dynamically+whole+websites.&url=https%3A%2F%2Ffabiocicerchia.github.io%2Fsalmonjs&hashtags=salmonjs&original_referer=http%3A%2F%2Fgithub.com%2F&tw_p=tweetbutton)

Web Crawler in Node.js to spider dynamically whole websites.

**IMPORTANT: This is a DEVELOPMENT tool, therefore SHOULD NOT be used against a
website you DO NOT OWN!**

It helps you to map / process entire websites, spidering them and parsing each page in a smart way. It follows all the links and test several times the form objects. In this way is possible to check effectively the whole website.

## Table Of Contents
* [Table Of Contents](#table-of-contents)
* [What's this for?](#whats-this-for)
* [Features](#features)
* [Dependencies](#dependencies)
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [Examples](#examples)
* [Tests](#tests)
* [How it works](#how-it-works)
* [Bugs](#bugs)
* [Changelog](#changelog)
* [Licence](#licence)


## What's this for?
This project was born with the aim of improve the legacy code, but it's not
strictly restricted only to that.

salmonJS will crawl every page from an entry-point URL, retrieving all the links
in the page and firing all the events bound to any DOM element in the page in
order to process all the possible combination automatically.
The only "limitation" of an automatic robot is the user input, so for that cases
has been implemented the test case files where it's possible to define custom
input values (e.g.: POST variables for forms, input values for javascript
prompts, etc).

With this in mind the usage of salmonJS could be different based on your own
needs, like checking legacy code for dead code or profiling the web app
performance.

Here below few suggestions about its usage:

 * Improve the legacy code
  * Check the dead code (enabling the code coverage server-side)
  * Discover 500 Internal Server Errors
  * Discover notices and warnings
  * SQL profiling
 * Testing
  * Process forms (it'll create easy test cases to be manually compiled)
  * Process automatically JS events attached to DOM nodes
 * Scraping
  * Get the page content for each URL
  * Get the screenshot for each URL
 * Enumeration
  * URLs list
  * Execution times
  * Page output
  * Page load
 * ...


## Features
 * Command Line Interface
 * Catch and handle all the events bound to DOM elements (regardless how they have been set)
 * Follows any 3xx redirect, JS document.location and meta redirect (can be disabled)
 * Ignore duplicated URLs / requests and external URLs
 * Test case files, with support of:
  * COOKIEs
  * FILES upload
  * GET parameters
  * HTTP headers
  * POST parameters
 * HTTP authentication
 * Proxy settings
 * Politeness Policy
 * Generate report for each page crawled, with: 6
  * Screenshot
  * HTTP headers
  * HTTP method
  * Data sent (GET and POST)
  * Page output
  * Execution time
  * Console messages
  * Alerts, Confirmations & Prompts
  * Errors
  * List of successful and failed requests
 * Pool system to limit the number of workers in the same time, then queue them
 * Multiple crawlers working asynchronously one URL each one
 * Support for the following HTML tags:
   a, area, base, form, frame, iframe, img, input, link, script
 * URL normalisation
 * Process the web page using PhantomJS
 * Process all the output content types
 * Keep the connection alive for lower CPU and memory load on the server


## Dependencies
Here the list of main dependencies:

 * [Node.js](http://nodejs.org/download/)
    * Tested with v0.8.26, v0.10.25 and v0.11.11
 * [PhantomJS](http://phantomjs.org/download.html)
    * Tested with v1.9.7
 * [Grunt](http://gruntjs.com/) (optional, only for tests)
    * Tested with v0.4.4
 * [Redis](http://redis.io/download)
    * Tested with v2.9.6


## Installation
You can install it directly from npm:

```
[user@hostname ~]$ npm install salmonjs -g
```

or you can download the source code from GitHub and run these commands:

```
[user@hostname ~/salmonjs]$ npm install
```


## Configuration
Change the file `src/config.js` accordingly to your needs.

### Test Cases

Here an example of a test case file:

```
; Test Case File
; generated by salmonJS v0.4.0 (http://fabiocicerchia.github.io/salmonjs) at Sat, 01 Jan 1970 00:00:00 GMT
; url = http://www.example.com
; id = http___www_example_com

[GET]
variable1=value1

[POST]
variable1=value1
variable2=value2
variable3=@/path/to/file.ext ; use @ in front to use the upload feature (the file MUST exists)

[COOKIE]
name=value

[HTTP_HEADERS]
header=value

[CONFIRM]
Message=true ; true = OK, false = Cancel

[PROMPT]
Question="Answer"
```


## Usage
```
              __                         _____ _______
.-----.---.-.|  |.--------.-----.-----._|     |     __|
|__ --|  _  ||  ||        |  _  |     |       |__     |
|_____|___._||__||__|__|__|_____|__|__|_______|_______|

salmonJS v0.4.0
Copyright (C) 2014 Fabio Cicerchia <info@fabiocicerchia.it>

Web Crawler in Node.js to spider dynamically whole websites.
Usage: node ./bin/salmonjs

Options:
  --uri              The URI to be crawled                                                       [required]
  -c, --credentials  Username and password for HTTP authentication (format "username:password")
  -d, --details      Store details for each page (in the specified folder)
  -f, --follow       Follows redirects                                                           [default: false]
  -p, --proxy        Proxy settings (format: "ip:port" or "username:password@ip:port")
  -w, --workers      Maximum number of asynchronous workers                                      [default: 10]
  -r, --restore      Restore the previous interrupted session                                    [default: false]
  -s, --sanitise     Sanitise any malformed HTML page                                            [default: false]
  --cases            Test cases folder
  --redis            Redis configuration (format "ip:port")                                      [default: "127.0.0.1:16379"]
  --timeout          Resource timeout                                                            [default: 5000]
  --attempts         Number of attempts before stop to request the URL                           [default: 5]
  --interval         Number of millisecond before try to fetch an URL after a failure            [default: 5000]
  --disable-stats    Disable anonymous report usage stats                                        [default: false]
  -q, --quiet        Disable all the output messages
  -v                 Verbose
  --version          Display the current version
  --help             Show the help
```


## Examples
```
[user@hostname ~]$ salmonjs --uri "http://www.google.com"
[user@hostname ~]$ salmonjs --uri "www.google.com"
[user@hostname ~]$ salmonjs --uri "/tmp/file.html"
[user@hostname ~]$ salmonjs --uri "file.html"
```


## Tests
```
[user@hostname ~/salmonjs]$ npm test
```


## How it works
 * Start processing an URL
 * Open a system process to PhantomJS
  * Open the URL
  * If there is a JS event, put it into a dedicate stack
  * Inject custom event listener
    * Override existent event listener
  * Collect all the relevant info from the page for the report
  * On load complete, execute the events in the stack
  * Start to process the web page
  * Get all the links from the page content
  * Normalise and filter by uniqueness all the URLs collected
  * Get all the JS events bound to DOM elements
  * Clone the web page for each new combination in the page (confirm)
  * Put the web page instance in a dedicate stack for each JS event
  * Process the all the web pages in the stack
  * Get all the links from the page content
  * Reiterate until there are no more JS events
 * If there is an error retry up to 5 times
 * Collect all the data sent by the parser
 * Create test cases for POST data with normalised fields
 * Get POST test cases for current URL
 * Launch a new crawler for each test case
 * Store details in report file
 * Increase the counter for possible crawlers to be launched based on the links
 * Check the links if are already been processed
  * If not, launch a new process for each link
 * If there are no more links to be processed, check if there are still sub-crawlers running
  * If not so, terminate the process


## Bugs
For a list of bugs please go to the [GitHub Issue Page](https://github.com/fabiocicerchia/salmonjs/issues?labels=Bug&page=1&state=open).


## Changelog
### 0.4.0 / 13 March 2014

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

### 0.3.0 / 29 December 2013

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
 * Improved to run coverage on single files
 * Added info for insight
 * Fixed problem with unknown variable
 * Removed test for casperjs
 * Added insight support
 * Removed all the references to casperjs
 * Improved to execute all the JS events in the parser
 * Removed support for casperjs as parser
 * Display messages from parser process
 * Fixed typo
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
 * Specify only for the branches to build.
 * Linted
 * Fixed text match after test case structure change
 * Fixed parameter for casperjs test
 * Updated changelog
 * Improved report
 * Fixed issue with top parent node (that has no parentNode)
 * Increased redis version

### 0.2.1 / 25 November 2013

 * Updated url
 * Fixed attribute name for script tag (thanks to Ben Ellis)
 * Added custom user agent value + removed duplicate property 'tags'
 * Removed useless file
 * Improved test case file to use section (e.g.: POST, GET, ...)
 * Removed glob as external dependency
 * Increased minor version
 * Added report id and comments in test cases

### 0.2.0 / 23 November 2013

 * Improved tests, minor changes to the code
 * Improvement on the coverage report and page report
 * Fixed viewport size and page content
 * Improved coverage generation
 * Improved tests for parsers (and relative source code)
 * Fixed problem with unknown variable
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
 * Removed duplicated code
 * Fixed bug with or condition
 * Minor changes + improved documentation
 * Added index file for report
 * Added screenshot feature
 * Fixed name after rebranding
 * Rebrand
 * Group reports by execution time
 * Dos2unix
 * Added html template for reports
 * Added support for report generation
 * Fix to get the whole output string rather than get a partial one each time
 * Fixed problem with output
 * Minor improvements
 * Crated a separate file for the console
 * Added http authentication
 * Fixed existsSync using the right node.js version
 * Fixed tests
 * Changed tests
 * Fixed to retrieve also the events attached as attribute
 * Fixed param in tests
 * Added and fixed tests
 * Added help
 * Fixed bug with empty url
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
 * Added tests
 * Converted project from PHP to Node.js
 * First draft (needs to be refactored and tested)
 * Initial commit


## Licence
SalmonJS's license follows:

====

Copyright (C) 2014 Fabio Cicerchia <info@fabiocicerchia.it>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

====

This license applies to all parts of SalmonJS that are not externally
maintained libraries. The externally maintained libraries used by SalmonJS are:

- tiny-sha1, located at src/sha1. tiny-sha1's license follows:
  """
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
  """

