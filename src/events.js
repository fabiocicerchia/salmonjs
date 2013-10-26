/**
 *                  __                                __
 * .--.--.--.-----.|  |--. .----.----.---.-.--.--.--.|  |.-----.----.
 * |  |  |  |  -__||  _  | |  __|   _|  _  |  |  |  ||  ||  -__|   _|
 * |________|_____||_____| |____|__| |___._|________||__||_____|__|
 *
 * WEB CRAWLER v0.1.0
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

function getXPath(element) {
    var xpath = '',
        nodeList,
        id;

    for (; element && element.nodeType == 1; element = element.parentNode) {
        nodeList = Array.prototype.slice.call(element.parentNode.getElementsByTagName(element.tagName));
        id = nodeList.indexOf(element) + 1;

        id = id > 1 ? ('[' + id + ']') : '';
        xpath = '/' + element.tagName.toLowerCase() + id + xpath;
    }
    return xpath;
}

document.getElementByXpath = function(path) {
    return document.evaluate(path, document, null, 9, null).singleNodeValue;
};

document.getElementsByAttribute = Element.prototype.getElementsByAttribute = function(attr) {
    var i,
        elem,
        nodeArray = [],
        nodeList = this.getElementsByTagName('*');

    for (i = 0, elem; elem = nodeList[i]; i++) {
        if (elem.getAttribute(attr)) nodeArray.push(elem);
    }

    return nodeArray;
};

window.eventContainer = {
    container: {},

    customAddEventListener: function (type, listener, useCapture, wantsUntrusted)
    {
        if (typeof window.eventContainer.container[type] === 'undefined') {
            window.eventContainer.container[type] = {};
        }

        var signature = hex_sha1(listener.toString());
        if (typeof window.eventContainer.container[type][signature] === 'undefined') {
            window.eventContainer.container[type][signature] = [];
        }

        var identifier = getXPath(this);
        if (identifier === '') {
            identifier = this.identifier; // TODO: FIX THIS HACK
        }

        window.eventContainer.container[type][signature].push(identifier);

        return this._origAddEventListener(type, listener, useCapture, wantsUntrusted);
    },

    customRemoveEventListener: function (type, listener, useCapture)
    {
        var signature = hex_sha1(listener.toString());
        if (typeof window.eventContainer.container[type][signature] !== 'undefined') {
            window.eventContainer.container[type][signature] = undefined;
        }

        return this._origRemoveEventListener(type, listener, useCapture);
    },

    customSetAttribute: function (name, value) {
        if (name.indexOf('on') === 0) {
            var type = name.substr(2);
            if (typeof window.eventContainer.container[type] === 'undefined') {
                window.eventContainer.container[type] = {};
            }

            var signature = hex_sha1(value.toString());
            if (typeof window.eventContainer.container[type][signature] === 'undefined') {
                window.eventContainer.container[type][signature] = [];
            }

            var identifier = getXPath(this);
            if (identifier === '') {
                identifier = this.identifier; // TODO: FIX THIS HACK
            }

            window.eventContainer.container[type][signature].push(identifier);
        }

        return this._origSetAttribute(name, value);
    },

    customRemoveAttribute: function (name) {
        if (name.indexOf('on') === 0) {
            //console.log(name);

            var type = name.substr(2);
            if (typeof window.eventContainer.container[type] === 'undefined') {
                window.eventContainer.container[type] = {};
            }

            var signature = hex_sha1(this.getAttribute(name).toString());
            if (typeof window.eventContainer.container[type][signature] !== 'undefined') {
                window.eventContainer.container[type][signature] = undefined;
            }
        }

        return this._origRemoveAttribute(name);
    },

    overrideEventListener: function (object) {
        var prototype = typeof object.prototype === 'undefined' ? object : object.prototype;

        prototype._origAddEventListener    = prototype.addEventListener;
        prototype.addEventListener         = window.eventContainer.customAddEventListener;
        prototype._origRemoveEventListener = prototype.removeEventListener;
        prototype.removeEventListener      = window.eventContainer.customRemoveEventListener;
    },

    overrideAttributeHandler: function (object) {
        var prototype = typeof object.prototype === 'undefined' ? object : object.prototype;

        prototype._origSetAttribute    = prototype.setAttribute;
        prototype.setAttribute         = window.eventContainer.customSetAttribute;
        prototype._origRemoveAttribute = prototype.removeAttribute;
        prototype.removeAttribute      = window.eventContainer.customRemoveAttribute;
    },

    getEvents: function () {
        return window.eventContainer.container;
    }
};

window.eventContainer.overrideEventListener(Element);
window.eventContainer.overrideAttributeHandler(Element);

document.identifier = 'document';
window.eventContainer.overrideEventListener(document);
window.eventContainer.overrideAttributeHandler(document);

window.identifier = 'window';
window.eventContainer.overrideEventListener(window);
window.eventContainer.overrideAttributeHandler(window);