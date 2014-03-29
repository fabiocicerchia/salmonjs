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
