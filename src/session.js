/**
 *               __                         _____ _______
 * .-----.---.-.|  |.--------.-----.-----._|     |     __|
 * |__ --|  _  ||  ||        |  _  |     |       |__     |
 * |_____|___._||__||__|__|__|_____|__|__|_______|_______|
 *
 * salmonJS v0.4.0
 *
 * Copyright (C) 2014 Fabio Cicerchia <info@fabiocicerchia.it>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Session Module
 *
 * @module Session
 */
var Session = function (client, fs, zlib, utils, conf, pool) {
    /**
     * Dump the Redis DB.
     *
     * @method dump
     * @param  {Function} callback The callback to be invoked once the data is ready.
     */
    this.dump = function (callback) {
        var dump = {conf: conf, redis: {}, pool: {}};

        dump.pool.size            = pool.size;
        dump.pool.queue           = pool.queue;
        dump.pool.memoryThreshold = pool.memoryThreshold;
        dump.pool.delay           = pool.delay;

        client.keys('*', function (err, replies) {
            replies.forEach(function (key) {
                dump.redis[key] = new Array();
                client.hgetall(key, function (err, obj) {
                    dump.redis[key].push(obj);
                });
            });
            
            dump = JSON.stringify(dump);
            zlib.gzip(dump, function(err, result) {
                var filename = __dirname + '/../session.dmp';
                fs.writeFile(filename, result, function() {
                    callback();
                });
            });
        });
    };
    
    /**
     * Restore a dump into Redis DB.
     *
     * @method restore
     * @param  {Object} dump The data to restore into Redis.
     */
    this.restore = function (callback) {
        var filename = __dirname + '/../session.dmp',
            data     = fs.readFileSync(filename);

        zlib.gunzip(data, function (err, result) {
            if (err) throw err;
            
            var dump = JSON.parse(result.toString());
            
            pool.size            = dump.pool.size;
            pool.queue           = dump.pool.queue;
            pool.memoryThreshold = dump.pool.memoryThreshold;
            pool.delay           = dump.pool.delay;
            
            utils.loopEach(dump.redis, function (key, value) {
                utils.loopEach(value, function (subkey, v) {
                    client.hset(key, subkey, v);
                });
            });
            
            callback(dump.conf);
        });
    };
};

module.exports = Session;