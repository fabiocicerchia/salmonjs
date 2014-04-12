var SalmonJS = require('./src/main'),
    redis    = require('redis'),
    conf     = {
        uri:    'http://www.salmonjs.org',
        follow: true
    };

var sJS = new SalmonJS(redis, conf);
sJS.start();
