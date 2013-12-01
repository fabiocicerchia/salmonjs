/**
 *               __     __
 * .-----.-----.|__|.--|  |.-----.--.--.
 * |__ --|  _  ||  ||  _  ||  -__|  |  |
 * |_____|   __||__||_____||_____|___  |
 *       |__|                    |_____|
 *
 * SPIDEY v0.2.1
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
 * FS Wrapper Module
 * It handles the differences between the Node.js module FS and the PhantomJS
 * module FS.
 *
 * @module FSWrapper
 */
var FSWrapper = function (fs) {
    if (fs === undefined) {
        fs = require('fs');
    }

    /**
     * Method to handle the differences between Node.js FS.readFileSync and
     * PhantomJS FS.read.
     *
     * @method readFileSync
     * @param {String} filename The filename
     * @return {String}
     */
    this.readFileSync = function (filename) {
        var method = (fs.readFileSync !== undefined) ? 'readFileSync' : 'read';
        return fs[method].call(fs, filename);
    };

    /**
     * Method to handle the differences between Node.js FS.writeFileSync and
     * PhantomJS FS.write.
     *
     * @method writeFileSync
     * @param {String} filename The filename
     * @param {String} data     The data
     * @param {Object} options  The options
     * @return {String}
     */
    this.writeFileSync = function (filename, data, options) {
        var method = (fs.writeFileSync !== undefined) ? 'writeFileSync' : 'write';
        return fs[method].call(fs, filename, data, options);
    };

    /**
     * Method to handle the differences between Node.js FS.existsSync and
     * PhantomJS FS.exists.
     *
     * @method existsSync
     * @param {String} filename The filename
     * @return {Boolean}
     */
    this.existsSync = function (filename) {
        var method = (fs.existsSync !== undefined) ? 'existsSync' : 'exists';
        return fs[method].call(fs, filename);
    };

    /**
     * Method to handle the differences between Node.js FS.mkdirSync and
     * PhantomJS FS.makeDirectory.
     *
     * @method mkdirSync
     * @param {String} path The path
     * @param {String} mode The mode
     * @return undefined
     */
    this.mkdirSync = function (path, mode) {
        var method = (fs.mkdirSync !== undefined) ? 'mkdirSync' : 'makeDirectory';
        return fs[method].call(fs, path, mode);
    };

    /**
     * Method to handle the differences between Node.js FS.readdirSync and
     * PhantomJS FS.list.
     *
     * @method readdirSync
     * @param {String} path The path
     * @return {Array}
     */
    this.readdirSync = function (path) {
        if (fs.readdirSync !== undefined) {
            return fs.readdirSync.call(fs, path);
        }

        return fs.list.call(fs, path);
    };

    /**
     * Method to handle the differences between Node.js FS.statSync.isDirectory
     * and PhantomJS FS.isDirectory.
     *
     * @method isDirectory
     * @param {String} path The path
     * @return {Boolean}
     */
    this.isDirectory = function (path) {
        if (fs.statSync !== undefined) {
            return fs.statSync.call(fs, path).isDirectory();
        }

        return fs.isDirectory.call(fs, path);
    };
};

module.exports = FSWrapper;