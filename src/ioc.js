/**
 *               __                         _____ _______
 * .-----.---.-.|  |.--------.-----.-----._|     |     __|
 * |__ --|  _  ||  ||        |  _  |     |       |__     |
 * |_____|___._||__||__|__|__|_____|__|__|_______|_______|
 *
 * salmonJS v0.4.0
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
 * IOC Class
 *
 * Example taken from http://www.yusufaytas.com/dependency-injection-in-javascript/
 */
var IOC = function () {
    /**
     * List of dependencies (container).
     *
     * @property dependencies
     * @type {Object}
     * @default {}
     */
    this.dependencies = {};

    /**
     * Add a dependency to the container.
     *
     * @method add
     * @param {String} qualifier The ID of the dependency
     * @param {String} obj       The dependency object
     * @return undefined
     */
    this.add = function (qualifier, obj) {
        this.dependencies[qualifier] = obj;
    };

    /**
     * Return an object satisfying its dedependencies.
     *
     * @method get
     * @param {Function} func The function to instantiate
     * @return {Object}
     */
    this.get = function (func) {
        var obj          = new func(),
            dependencies = this.resolveDependencies(func);

        func.apply(obj, dependencies);

        return obj;
    };

    /**
     * Returns a list of function's dependencies.
     *
     * @method resolveDependencies
     * @param {Function} func The function to resolve
     * @return {Array}
     */
    this.resolveDependencies = function (func) {
        var args         = this.getArguments(func),
            dependencies = [],
            i;

        for (i = 0; i < args.length; i++) {
            dependencies.push(this.dependencies[args[i]]);
        }

        return dependencies;
    };

    /**
     * Returns a list of function's parameters.
     *
     * @method getArguments
     * @param {Function} func The function to inspect
     * @return {Array}
     */
    this.getArguments = function (func) {
        // This regex is from require.js
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
            args    = func.toString().match(FN_ARGS)[1].split(/\s*,\s*/);

        return args;
    };
};

module.exports = IOC;
