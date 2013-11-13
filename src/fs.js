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

 var FSWrapper = function(fs) {
    if (typeof fs === 'undefined') {
        fs = require('fs');
    }

    this.read = function(filename) {
        var method = (typeof fs.readFileSync !== 'undefined') ? 'readFileSync' : 'read';
        return fs[method].call(fs, filename);
    };

    this.write = function(filename, data, options) {
        var method = (typeof fs.writeFileSync !== 'undefined') ? 'writeFileSync' : 'write';
        return fs[method].call(fs, filename, data, options);
    };

    this.exists = function(filename) {
        var method = (typeof fs.existsSync !== 'undefined') ? 'existsSync' : 'exists';
        return fs[method].call(fs, filename);
    };

    this.mkdir = function(path, mode) {
        var method = (typeof fs.mkdirSync !== 'undefined') ? 'mkdirSync' : 'makeDirectory';
        return fs[method].call(fs, path, mode);
    };

    this.unlink = function(path) {
        var method = (typeof fs.unlinkSync !== 'undefined') ? 'unlinkSync' : 'remove';
        return fs[method].call(fs, path);
    };

    this.readdir = function(path) {
        if (typeof fs.readdirSync !== 'undefined') {
            return fs.readdirSync.call(fs, path);
        } else {
            return fs.list.call(fs, path);
        }
    };

    this.isDir = function(path) {
        if (typeof fs.statSync !== 'undefined') {
            return fs.statSync.call(fs, path).isDirectory();
        } else {
            return fs.isDirectory.call(fs, path);
        }
    };
};

module.exports = FSWrapper;