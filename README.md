# Web Crawler

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

## Dependencies

 * [Node.js](http://nodejs.org/download/)
 * [PhantomJS](http://phantomjs.org/download.html)
 * [Redis](http://redis.io/download)

## Configuration

Change the file `src/config.js` accordingly with your needs.

## Installation

```
npm install
```

## Examples

```
[user@hostname /tmp]$ ./bin/crawler --uri "http://www.google.com"
[user@hostname /tmp]$ ./bin/crawler --uri "www.google.com"
[user@hostname /tmp]$ ./bin/crawler --uri "/tmp/file.html"
[user@hostname /tmp]$ ./bin/crawler --uri "file.html"
```

## BUGS

 * jQuery is working within PhantomJS only if the version <= 1.8.3.
 * Not processing $.on().

## TODO

 * Add authentication (http://stackoverflow.com/questions/10114925/http-authentication-in-phantomjs)
 * Add screenshot creation, with an option to be enabled
 * Store the page details is a report directory, with an option to be enabled
 * Create test files for GET (???)
 * Store execution time for each URL
 * Store the params for each scrape
 * Aggregate everything in reports (URLs parsed, execution time, http headers
   and page size)
 * Implement zombie.js as interface to substitute phantom.js
 * Tests

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
