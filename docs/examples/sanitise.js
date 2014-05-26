var SalmonJS = require('./src/main'),
    redis    = require('redis'),
    conf     = {
        uri:      'http://www.salmonjs.org',
        sanitise: true
    };

var sJS = new SalmonJS(redis, conf);
sJS.start();
