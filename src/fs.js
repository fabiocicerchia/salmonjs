/**
 *               __                         _____ _______
 * .-----.---.-.|  |.--------.-----.-----._|     |     __|
 * |__ --|  _  ||  ||        |  _  |     |       |__     |
 * |_____|___._||__||__|__|__|_____|__|__|_______|_______|
 *
 * salmonJS v0.5.0
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
 * FS Wrapper Class
 *
 * It handles the differences between the Node.js module FS and the PhantomJS
 * module FS.
 *
 * @class FSWrapper
 */
var FSWrapper = function (fs) {
    if (fs === undefined) {
        fs = require('fs');
    }

    var currentFs = this;

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
        var nodeVer = parseFloat(('0' + process.version.node).replace(/^([0-9]+\.[0-9]+)\.?.*$/, '$1'));
        if (nodeVer < 0.10) {
            options = options !== undefined ? (options.encoding || 'utf8') : 'utf8';
        }

        if (fs.writeFileSync !== undefined) {
            return fs.writeFileSync(filename, data, options);
        }

        return fs.write(filename, data, options);
    };

    /**
     * Method to handle the differences between Node.js FS.writeFile and
     * PhantomJS FS.write.
     *
     * @method writeFile
     * @param {String}   filename The filename
     * @param {String}   data     The data
     * @param {Function} callback The callback
     * @return {String}
     */
    this.writeFile = function (filename, data, callback) {
        this.writeFileSync(filename, data);
        callback();
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
        if (fs.mkdirSync !== undefined) {
            return fs.mkdirSync(path, mode);
        }

        return fs.makeDirectory(path);
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
        var method = (fs.readdirSync !== undefined) ? 'readdirSync' : 'list';
        return fs[method].call(fs, path);
    };

    /**
     * Method to handle the differences between Node.js FS.unlinkSync and
     * PhantomJS FS.remove.
     *
     * @method unlinkSync
     * @param {String} path The path
     * @return {Array}
     */
    this.unlinkSync = function (path) {
        var method = (fs.unlinkSync !== undefined) ? 'unlinkSync' : 'remove';
        return fs[method].call(fs, path);
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

    /**
     * Remove recursively all the files inside a folder.
     *
     * @method deleteTree
     * @param {String} path The folder to be removed.
     * @return undefined
     */
    this.deleteTree = function(path) {
        var files = [];
        if (this.existsSync(path)) {
            files = this.readdirSync(path);
            files.forEach(function(file) {
                var curPath = path + '/' + file;
                if (currentFs.isDirectory(curPath)) {
                    currentFs.deleteTree(curPath);
                } else {
                    currentFs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };
};

module.exports = FSWrapper;
