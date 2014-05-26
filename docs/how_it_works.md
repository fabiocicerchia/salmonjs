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
