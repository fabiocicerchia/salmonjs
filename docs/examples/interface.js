var SalmonJS = require('./src/main'),
    redis    = require('redis'),
    conf     = {
        uri:         'http://fabiocicerchia.github.io/salmonjs',
        credentials: 'username:password',
        details:     true,
        follow:      true,
        proxy:       'username:password@ip:port',
        workers:     10,
        sanitise:    false
    };

var sJS = new SalmonJS(redis, conf);
sJS.start();
