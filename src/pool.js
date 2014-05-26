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
 * Pool Class
 *
 * It handle a queue of workers, it provides support for max number of
 * concurrent workers (if all the slots are taken it'll wait until one will be
 * freed).
 *
 * @class Pool
 */
var Pool = function (os, config, fork) {
    /**
     * Settings queue.
     *
     * @property queue
     * @type {Array}
     * @default []
     */
    this.queue = [];

    /**
     * Maximum size of the queue.
     *
     * @property size
     * @type {Integer}
     * @default 10
     */
    this.size = 10;
    // TODO: Add timeout?
    // TODO: Execute new worker if memory threshold is not reached, if set

    /**
     * Maximum amount of used memory not to allow to run any other worker.
     * When the used memory will be under the threshold it'll continue to
     * process the queue.
     *
     * @property size
     * @type {Integer}
     * @default -1
     */
    this.memoryThreshold = -1;

    /**
     * Milliseconds before try again to process the queue.
     *
     * @property size
     * @type {Integer}
     * @default 1000
     */
    this.delay = 1000;

    this.running = 0;

    /**
     * Current instance.
     *
     * @property currentPool
     * @type {Object}
     * @default this
     */
    var currentPool = this;

    /**
     * Add settings to the queue, triggering also the queue processing.
     *
     * @method addToQueue
     * @param {Object} data The data that will be passed to the worker.
     * @return undefined
     */
    this.addToQueue = function (data) {
        if (typeof data === 'object' && Object.keys(data).length > 0) {
            this.queue.push({data: data});
            this.processQueue();
        }
    };

    /**
     * Process the queue if there are enough slots available, and the used
     * memory is not more than the allowed one.
     *
     * @method processQueue
     * @return undefined
     */
    this.processQueue = function () {
        if (currentPool.queue.length === 0) {
            return;
        }

        if (currentPool.running >= currentPool.size) {
            return;
        }

        if (this.memoryThreshold > -1 && os.freemem() < this.memoryThreshold) {
            // TODO: TO BE TESTED
            console.log('Waiting for ' + this.delay + 'ms before process again the queue.');
            setTimeout(currentPool.processQueue, this.delay);
            return;
        }

        // TODO: CHECK IF IT EXISTS IN REDIS
        var settings = currentPool.queue.shift();
        if (settings === undefined || !settings.hasOwnProperty('data')) {
            return;
        }

        var data = settings.data,
            childProcess;

        if (data === {}) {
            return;
        }

        currentPool.running++;

        childProcess = fork(__dirname + '/worker.js');
        childProcess.send({
            settings: [
                data.timeStart, data.username, data.password, data.storeDetails,
                data.followRedirects, data.proxy, data.sanitise, data.url, data.type,
                data.container, data.evt, data.xPath, config
            ]
        });

        childProcess.on('exit', function () {
            currentPool.running--;

            if (currentPool.queue.length > 0) {
                currentPool.processQueue();
            } else if (currentPool.running === 0) {
                if (process.argv.join('').indexOf('jasmine-node') !== -1 && process.argv.join('').indexOf('grunt') !== -1) {
                    process.exit();
                }
            }
        });

        childProcess.on('message', function(m) {
            if (typeof m.queue !== 'undefined') {
                currentPool.addToQueue(m.queue, m.settings);
            }
        });
    };
};

module.exports = Pool;
