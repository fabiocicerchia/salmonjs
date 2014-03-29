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
