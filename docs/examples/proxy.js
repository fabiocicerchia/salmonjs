var SalmonJS = require('./src/main'),
    redis    = require('redis'),
    conf     = {
        uri:   'http://www.salmonjs.org',
        proxy: 'username:password@ip:port'
    };

var sJS = new SalmonJS(redis, conf);
sJS.start();
