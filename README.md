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
 * Enumeration
   * URLs list
   * Execution times
   * Page load
 * ...

## Dependencies

 * Node.js
 * PhantomJS
 * Redis

## Example

```
./bin/crawler "http://www.google.com"
```

## TODO

 * Create test files for GET (???)
 * Add authentication
 * Retrieve events bound to DOM elements, fire them and parse the page again
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