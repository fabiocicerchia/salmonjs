# salmonjs

[![Build Status](https://travis-ci.org/fabiocicerchia/salmonjs.png)](https://travis-ci.org/fabiocicerchia/salmonjs)
[![Dependency Status](https://gemnasium.com/fabiocicerchia/salmonjs.png)](https://gemnasium.com/fabiocicerchia/salmonjs)
[![Code Climate](https://codeclimate.com/github/fabiocicerchia/salmonjs.png)](https://codeclimate.com/github/fabiocicerchia/salmonjs)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/fabiocicerchia/salmonjs/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[![NPM](https://nodei.co/npm/salmonjs.png?downloads=true&stars=true)](https://nodei.co/npm/salmonjs/)

[![salmonJS - Web Crawler in Node.js to spider dynamically whole websites.](http://jpillora.com/github-twitter-button/img/tweet.png)](https://twitter.com/intent/tweet?text=salmonJS+-+Web+Crawler+in+Node.js+to+spider+dynamically+whole+websites.&url=https%3A%2F%2Fwww.salmonjs.org&hashtags=salmonjs&original_referer=http%3A%2F%2Fgithub.com%2F&tw_p=tweetbutton)

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
* [Contributing](#contributing)
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
salmonJS is based on [Node.js](http://nodejs.org/download/) and [PhantomJS](http://phantomjs.org/download.html) and uses [Redis](http://redis.io/download) as queue manager.

salmonJS is tested using **TravisCI** on the following versions:
 * Node.js: v0.8.26 and v0.10.25
 * PhantomJS: v1.9.7
 * Redis: v2.9.6

This is the list of main dependencies:
 * optimist v0.6.1
 * path v0.4.9
 * colors v0.6.2
 * redis v0.10.1
 * glob v3.2.9
 * winston v0.7.3
 * insight v0.3.1
 * request v2.34.0
 * htmltidy v0.0.6
 * URIjs v1.12.1
 * jsonfn v0.31.0

This is the list of development dependencies:
 * jshint v2.4.4
 * yuidocjs v0.3.49
 * jasmine-node v1.14.2
 * phapper v0.1.9
 * grunt-cli v0.1.13
 * grunt-jasmine-node-coverage v0.1.8
 * grunt-contrib-jshint v0.9.2
 * grunt-release v0.7.0
 * grunt-contrib-yuidoc v0.5.2
 * grunt-todo v0.2.0
 * chai v1.9.1
 * grunt-verb v0.0.5


## Installation
At the moments salmonjs is available only a NPM package.

So, you can install it directly from NPM using the following command:

```
[user@hostname ~]$ npm install salmonjs -g
```

Eventually you can get the source code from GitHub and then run this command:

```
[user@hostname ~/salmonjs]$ npm install
```


## Configuration
#### Test Cases

Here an example of a test case file:

```
; Test Case File
; generated by salmonJS v0.4.0 (http://www.salmonjs.org) at Sat, 01 Jan 1970 00:00:00 GMT
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

The file is using the INI format.

There are different section you can use and customise to your needs:
 * **GET**, used for the GET variables in the query string  
   The key is the variable name, the value is the variable's value.
 * **POST**, used for the POST variables  
   The key is the variable name, the value is the variable's value.  
   It's possible to send also files using `@` in front of the value to upload (the file MUST exists).
 * **COOKIE**, used to set the cookies  
   The key is the cookie name, the value is the content.  
   It's not possible to configure the domain, the path and the expiration date of the cookie. It'll be configured automatically salmonJS
 * **HTTP_HEADERS**, used to set HTTP headers  
   The key is the HTTP header name, the value is the header's value.
 * **CONFIRM**, used to change the JS confirm message behaviour  
   The key is the message text, the value is the button to be clicked.  
   Possible values: `true` = OK, `false` = Cancel
 * **PROMPT**, used to change the JS prompt message behaviour  
   The key is the question text, the value is the answer.


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
  --redis            Redis configuration (format "ip:port")                                      [default: "127.0.0.1:6379"]
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
These are just few examples how to use salmonjs:

```
[user@hostname ~]$ salmonjs --uri "http://www.google.com"
[user@hostname ~]$ salmonjs --uri "www.google.com"
[user@hostname ~]$ salmonjs --uri "/tmp/file.html"
[user@hostname ~]$ salmonjs --uri "file.html"
```

You can find more detailed examples in the folder [docs/examples](https://github.com/fabiocicerchia/salmonjs/tree/develop/docs/examples).


## Tests
```
[user@hostname ~/salmonjs]$ npm test
```


## How it works
 1. Start processing an URL
 2. Open a system process to PhantomJS
  1. Open the URL
  2. If there is a JS event, put it into a dedicate stack
  3. Inject custom event listener
    1. Override existent event listener
  4. Collect all the relevant info from the page for the report
  5. On load complete, execute the events in the stack
  6. Start to process the web page
  7. Get all the links from the page content
  8. Normalise and filter by uniqueness all the URLs collected
  9. Get all the JS events bound to DOM elements
  10. Clone the web page for each new combination in the page (confirm)
  11. Put the web page instance in a dedicate stack for each JS event
  12. Process the all the web pages in the stack
  13. Get all the links from the page content
  14. Reiterate until there are no more JS events
 3. If there is an error retry up to 5 times
 4. Collect all the data sent by the parser
 5. Create test cases for POST data with normalised fields
 6. Get POST test cases for current URL
 7. Launch a new crawler for each test case
 8. Store details in report file
 9. Increase the counter for possible crawlers to be launched based on the links
 10. Check the links if are already been processed
  1. If not, launch a new process for each link
 11. If there are no more links to be processed, check if there are still sub-crawlers running
  1. If not so, terminate the process


## Bugs
For a list of bugs please go to the [GitHub Issue Page](https://github.com/fabiocicerchia/salmonjs/issues?labels=Bug&page=1&state=open).


## Changelog
### 0.5.0 / ?

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

### 0.4.1 / 04 April 2014

 * Fixed #45

### 0.4.0 / 13 March 2014

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

### 0.3.0 / 29 December 2013

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

### 0.2.1 / 25 November 2013

 * Fixed attribute name for script tag (thanks to Ben Ellis)
 * Added custom user agent value + removed duplicate property 'tags'
 * Improved test case file to use section (e.g.: POST, GET, ...)
 * Removed glob as external dependency
 * Added report id and comments in test cases
 * Minor improvements
 * Fixed several bugs

### 0.2.0 / 23 November 2013

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


## Contributing
Please take a moment to review this document in order to make the contribution
process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of
the developers managing and developing this open source project. In return,
they should reciprocate that respect in addressing your issue, assessing
changes, and helping you finalize your pull requests.


### Using the issue tracker

The issue tracker is the preferred channel for [bug reports](#bugs),
[features requests](#features) and [submitting pull
requests](#pull-requests), but please respect the following restrictions:

* Please **do not** derail or troll issues. Keep the discussion on topic and
  respect the opinions of others.


<a name="bugs"></a>
### Bug reports

A bug is a _demonstrable problem_ that is caused by the code in the repository.
Good bug reports are extremely helpful - thank you!

Guidelines for bug reports:

1. **Use the GitHub issue search** &mdash; check if the issue has already been
   reported.

2. **Check if the issue has been fixed** &mdash; try to reproduce it using the
   latest `master` or development branch in the repository.

3. **Isolate the problem** &mdash; ideally create a [reduced test
   case](http://css-tricks.com/6263-reduced-test-cases/).

A good bug report shouldn't leave others needing to chase you up for more
information. Please try to be as detailed as possible in your report. What is
your environment? What steps will reproduce the issue? What OS experiences the
problem? What would you expect to be the outcome? All these details will help
people to fix any potential bugs.

Example:

> Short and descriptive example bug report title
>
> A summary of the issue and the browser/OS environment in which it occurs. If
> suitable, include the steps required to reproduce the bug.
>
> 1. This is the first step
> 2. This is the second step
> 3. Further steps, etc.
>
> `<url>` - a link to the reduced test case
>
> Any other information you want to share that is relevant to the issue being
> reported. This might include the lines of code that you have identified as
> causing the bug, and potential solutions (and your opinions on their
> merits).


<a name="features"></a>
### Feature requests

Feature requests are welcome. But take a moment to find out whether your idea
fits with the scope and aims of the project. It's up to *you* to make a strong
case to convince the project's developers of the merits of this feature. Please
provide as much detail and context as possible.


<a name="pull-requests"></a>
### Pull requests

Good pull requests - patches, improvements, new features - are a fantastic
help. They should remain focused in scope and avoid containing unrelated
commits.

**Please ask first** before embarking on any significant pull request (e.g.
implementing features, refactoring code), otherwise you risk spending a lot of
time working on something that the project's developers might not want to merge
into the project.

Please adhere to the coding conventions used throughout a project (indentation,
accurate comments, etc.) and any other requirements (such as test coverage).

Adhering to the following this process is the best way to get your work
included in the project:

1. [Fork](http://help.github.com/fork-a-repo/) the project, clone your fork,
   and configure the remotes:

   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/<your-username>/salmonjs
   # Navigate to the newly cloned directory
   cd salmonjs
   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/salmonjs/salmonjs
   ```

2. If you cloned a while ago, get the latest changes from upstream:

   ```bash
   git checkout master
   git pull upstream master
   ```

3. Create a new topic branch (off the main project development branch) to
   contain your feature, change, or fix:

   ```bash
   git checkout -b <topic-branch-name>
   ```

4. Make sure to update, or add to the tests when appropriate. Patches and
   features will not be accepted without tests. Run `npm test` to check that
   all tests pass after you've made changes.

5. Commit your changes in logical chunks. Please adhere to these [git commit
   message guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
   or your code is unlikely be merged into the main project. Use Git's
   [interactive rebase](https://help.github.com/articles/interactive-rebase)
   feature to tidy up your commits before making them public.

6. Locally merge (or rebase) the upstream development branch into your topic branch:

   ```bash
   git pull [--rebase] upstream master
   ```

7. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

8. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/)
    with a clear title and description.

9. If you are asked to amend your changes before they can be merged in, please
   use `git commit --amend` (or rebasing for multi-commit Pull Requests) and
   force push to your remote feature branch. You may also be asked to squash
   commits.

**IMPORTANT**: By submitting a patch, you agree to license your work under the
same license as that used by the project.


<a name="maintainers"></a>
### Maintainers

If you have commit access, please follow this process for merging patches and cutting new releases.

#### Reviewing changes

1. Check that a change is within the scope and philosophy of the project.
2. Check that a change has any necessary tests and a proper, descriptive commit message.
3. Checkout the change and test it locally.
4. If the change is good, and authored by someone who cannot commit to
   `master`, please try to avoid using GitHub's merge button. Apply the change
   to `master` locally (feel free to amend any minor problems in the author's
   original commit if necessary).
5. If the change is good, and authored by another maintainer/collaborator, give
   them a "Ship it!" comment and let them handle the merge.

#### Submitting changes

1. All non-trivial changes should be put up for review using GitHub Pull
   Requests.
2. Your change should not be merged into `master` (or another feature branch),
   without at least one "Ship it!" comment from another maintainer/collaborator
   on the project. "Looks good to me" is not the same as "Ship it!".
3. Try to avoid using GitHub's merge button. Locally rebase your change onto
   `master` and then push to GitHub.
4. Once a feature branch has been merged into its target branch, please delete
   the feature branch from the remote repository.

#### Releasing a new version

1. Include all new functional changes in the CHANGELOG.
2. Use a dedicated commit to increment the version. The version needs to be
   added to the `CHANGELOG.md` (inc. date) and the `package.json`.
3. The commit message must be of `v0.0.0` format.
4. Create an annotated tag for the version: `git tag -m "v0.0.0" v0.0.0`.
5. Push the changes and tags to GitHub: `git push --tags origin master`.
6. Publish the new version to npm: `npm publish`.


## Licence
salmonJS's license follows:

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

This license applies to all parts of salmonJS that are not externally
maintained libraries. The externally maintained libraries used by salmonJS are:

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

