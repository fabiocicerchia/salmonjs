var SalmonJS = require('../../src/main'),
    redis    = require('redis'),
    conf     = {
        uri:      'file://' + __dirname + '/../../test/assets/complex/index.html',
        redis:    '127.0.0.1:6379',
        details:  __dirname + '/../../details/',
        workers:  2,
        sanitise: false,
        v:        'vvvv'
    };

var sJS = new SalmonJS(redis, conf);
sJS.start();
