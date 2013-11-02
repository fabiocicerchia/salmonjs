# SPIDEY

[![Build Status](https://secure.travis-ci.org/fabiocicerchia/spidey.png)](http://travis-ci.org/fabiocicerchia/spidey)
[![Dependency Status](https://gemnasium.com/fabiocicerchia/spidey.png)](https://gemnasium.com/fabiocicerchia/spidey)

[![NPM](https://nodei.co/npm/spidey.png?downloads=true)](https://nodei.co/npm/spidey/)

Web Crawler in Node.js to spider dynamically whole websites.

It helps you to map / process entire websites, spidering them and parsing each
page in a smart way. It follows all the links and test several times the form
objects. In this way is possible to check effectively the whole website.

Few suggestion about its usage:

 * Improve the legacy code
  * Check the dead code (enabling the code coverage server-side)
  * Discover 500 Internal Server Errors
  * Discover notices and warnings
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

 * Commander Line Interface
 * Reorder query string params for get and post for uniqueness
 * HTTP authentication
 * Handle events bound with `addEventListener`, HTML attributes (`on*`)
 * Exclude external URIs in the crawling
 * Process the page using PhantomJS
 * Generate report for each page crawled
  * Screenshot
  * HTTP header
  * HTTP method
  * Data sent
  * Page output
  * Execution time
  * Console messages
  * Alerts, Confirmations & Prompts
  * Errors
  * List of requests

## Dependencies

 * [Node.js](http://nodejs.org/download/)
 * [PhantomJS](http://phantomjs.org/download.html)
 * [Redis](http://redis.io/download)

## Configuration

Change the file `src/config.js` accordingly to your needs.

## Installation

```
npm install
```

## Usage

```
              __     __
.-----.-----.|__|.--|  |.-----.--.--.
|__ --|  _  ||  ||  _  ||  -__|  |  |
|_____|   __||__||_____||_____|___  |
      |__|                    |_____|

SPIDEY v0.1.0

Copyright (C) 2013 Fabio Cicerchia <info@fabiocicerchia.it>

Web Crawler in Node.js to spider dynamically whole websites.
Usage: ./bin/spidey

Options:
  --uri              The URI to be crawled             [required]
  -u, --username     Username for HTTP authentication
  -p, --password     Password for HTTP authentication
  -d, --details      Store details for each page       [default: false]
  --help             Show the help
```

## Examples

```
[user@hostname /tmp]$ ./bin/spidey --uri "http://www.google.com"
[user@hostname /tmp]$ ./bin/spidey --uri "www.google.com"
[user@hostname /tmp]$ ./bin/spidey --uri "/tmp/file.html"
[user@hostname /tmp]$ ./bin/spidey --uri "file.html"
```

## BUGS

 * jQuery is working within PhantomJS only if the version <= 1.8.3.
 * Not processing $.on().
 * jQuery is not inserting any script at runtime.

## TODO

 * Handle `confirm` calling it twice, returning `true` and `false`.
 * Handle `prompt` using a test case file.
 * Handle Uploads
 * Create test case files for GET querystring
 * Use async (https://github.com/caolan/async)
 * Use underscorejs (http://underscorejs.org/)
 * Tests with Mocha

## Licence

Copyright (C) 2013 Fabio Cicerchia <info@fabiocicerchia.it>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
