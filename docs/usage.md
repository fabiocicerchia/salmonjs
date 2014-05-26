```
              __                         _____ _______
.-----.---.-.|  |.--------.-----.-----._|     |     __|
|__ --|  _  ||  ||        |  _  |     |       |__     |
|_____|___._||__||__|__|__|_____|__|__|_______|_______|

salmonJS v0.5.0
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
