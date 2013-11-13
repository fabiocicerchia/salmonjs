/**
 *               __     __
 * .-----.-----.|__|.--|  |.-----.--.--.
 * |__ --|  _  ||  ||  _  ||  -__|  |  |
 * |_____|   __||__||_____||_____|___  |
 *       |__|                    |_____|
 *
 * SPIDEY v0.2.0
 *
 * Copyright (C) 2013 Fabio Cicerchia <info@fabiocicerchia.it>
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
 * Glob Emulation Module
 * It emulates the behaviour of glob.
 *
 * @module glob
 */
var glob = {
    /**
     * Sleep function.
     *
     * @method sleep
     * @param {Integer} millis The number of millisecond to wait for
     * @return undefined
     */
    sleep: function(millis) {
        var date = new Date(),
          curDate = null;

        do {
            curDate = new Date();
        } while(curDate-date < millis);
    },

    /**
     * Sync version of glob.
     *
     * @method sync
     * @param {String} dir The directory to be processed
     * @return {Array}
     */
    sync: function(dir) {
        var results;

        glob.glob(dir, function(err, res) {
            results = res;
        });

        while (results === undefined) {
            this.sleep(5);
        }

        return results;
    },

    /**
     * Async version of glob.
     *
     * @method glob
     * @param {String}   dir  The directory to be processed
     * @param {Function} done The callback called when it finish the processing
     * @return undefined
     */
    glob: function (dir, done) {
        var firstOccurrence = dir.indexOf('*');
        var dirToProcess = dir.substr(0, (firstOccurrence === -1) ? dir.length : firstOccurrence);

        var lastOccurrence = dir.lastIndexOf('/');
        dirToProcess = dirToProcess.substr(0, (lastOccurrence === -1) ? dirToProcess.length : lastOccurrence);

        var regEx = '^' + dir.replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/\*\*/g, '.+?').replace(/\*/g, '[^\/]+');

        glob.list(dirToProcess, function(err, results) {
            var filtered = [];
            results.forEach(function (item) {
                if (item.match(new RegExp(regEx))) {
                    filtered.push(item);
                }
            });

           done(err, filtered);
        });
    },

    /**
     * Return a list of all the files contained in a certain directory.
     *
     * @method list
     * @param {String}   dir  The directory to be processed
     * @param {Function} done The callback called when it finish the processing
     * @return undefined
     */
    list: function (dir, done) {
        var fsWrapper = new (require('../src/fs'));
        var results = [];

        var list = fsWrapper.readdirSync(dir);
        var pending = list.length - 2;
        if (!pending) return done(null, results);

        list.forEach(function(file) {
            if (file !== '.' && file !== '..') {
                file = dir + '/' + file;
                if (fsWrapper.isDirectory(file)) {
                    glob.list(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            }
        });
    }
};

module.exports = glob;