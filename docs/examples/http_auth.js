var SalmonJS = require('./src/main'),
    redis    = require('redis'),
    conf     = {
        uri:         'http://www.salmonjs.org',
        credentials: 'username:password'
    };

var sJS = new SalmonJS(redis, conf);
sJS.start();
