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
