/**
 *               __     __
 * .-----.-----.|__|.--|  |.-----.--.--.
 * |__ --|  _  ||  ||  _  ||  -__|  |  |
 * |_____|   __||__||_____||_____|___  |
 *       |__|                    |_____|
 *
 * SPIDEY v0.1.0
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
 * TBW
 */
function getXPath(element) {
    var xpath = '',
        nodeList,
        id;

    for (; element && element.nodeType == 1; element = element.parentNode) {
        nodeList = Array.prototype.slice.call(
            element.parentNode.getElementsByTagName(element.tagName)
        );
        id = nodeList.indexOf(element) + 1;

        id = id > 1 ? ('[' + id + ']') : '';
        xpath = '/' + element.tagName.toLowerCase() + id + xpath;
    }
    return xpath;
}

/**
 * TBW
 */
document.getElementByXpath = function (path) {
    return document.evaluate(path, document, null, 9, null).singleNodeValue;
};

/**
 * TBW
 */
Element.prototype.getElementsByAttribute = function (attr) {
    var i,
        elem,
        nodeArray = [],
        nodeList = this.getElementsByTagName('*');

    for (i = 0; elem = nodeList[i]; i++) {
        if (elem.getAttribute(attr)) {
            nodeArray.push(elem);
        }
    }

    return nodeArray;
};
document.getElementsByAttribute = Element.prototype.getElementsByAttribute;

/**
 * TBW
 */
window.eventContainer = {
    container: {},

    /**
     * TBW
     */
    pushEvent: function (type, signature, element) {
        if (window.eventContainer.container[type] === undefined) {
            window.eventContainer.container[type] = {};
        }

        if (window.eventContainer.container[type][signature] === undefined) {
            window.eventContainer.container[type][signature] = [];
        }

        var identifier = getXPath(element);
        if (identifier === '') {
            identifier = element.identifier; // TODO: FIX THIS HACK
        }

        window.eventContainer.container[type][signature].push(identifier);
    },

    /**
     * TBW
     */
    customAddEventListener: function (type, listener, useCapture, wantsUntrusted) {
        var signature = hex_sha1(listener.toString());
        window.eventContainer.pushEvent(type, signature, this);

        return this._origAddEventListener(type, listener, useCapture, wantsUntrusted);
    },

    /**
     * TBW
     */
    customRemoveEventListener: function (type, listener, useCapture)
    {
        var signature = hex_sha1(listener.toString());
        if (window.eventContainer.container[type][signature] !== undefined) {
            window.eventContainer.container[type][signature] = undefined;
        }

        return this._origRemoveEventListener(type, listener, useCapture);
    },

    /**
     * TBW
     */
    customSetAttribute: function (name, value) {
        var type,
            signature,
            identifier;

        if (name.indexOf('on') === 0) {
            type = name.substr(2);
            signature = hex_sha1(value.toString());
            window.eventContainer.pushEvent(type, signature, this);
        }

        return this._origSetAttribute(name, value);
    },

    /**
     * TBW
     */
    customRemoveAttribute: function (name) {
        var type,
            signature;
        if (name.indexOf('on') === 0) {
            //console.log(name);

            type = name.substr(2);
            if (window.eventContainer.container[type] === undefined) {
                window.eventContainer.container[type] = {};
            }

            signature = hex_sha1(this.getAttribute(name).toString());
            if (window.eventContainer.container[type][signature] !== undefined) {
                window.eventContainer.container[type][signature] = undefined;
            }
        }

        return this._origRemoveAttribute(name);
    },

    /**
     * TBW
     */
    overrideEventListener: function (object) {
        var prototype = object.prototype === undefined ? object : object.prototype;

        prototype._origAddEventListener    = prototype.addEventListener;
        prototype.addEventListener         = window.eventContainer.customAddEventListener;
        prototype._origRemoveEventListener = prototype.removeEventListener;
        prototype.removeEventListener      = window.eventContainer.customRemoveEventListener;
    },

    /**
     * TBW
     */
    overrideAttributeHandler: function (object) {
        var prototype = object.prototype === undefined ? object : object.prototype;

        prototype._origSetAttribute    = prototype.setAttribute;
        prototype.setAttribute         = window.eventContainer.customSetAttribute;
        prototype._origRemoveAttribute = prototype.removeAttribute;
        prototype.removeAttribute      = window.eventContainer.customRemoveAttribute;
    },

    /**
     * TBW
     */
    // TODO: what about attributes attached at runtime?
    getElementsByAttribute: function (attribute) {
        var arr_elms = document.body.getElementsByTagName('*');
        var elements = [];
        var wildcard = false;
        var curr_attr;

        if (attribute.substr(-1, 1) === '*') {
            wildcard = true;
            attribute = attribute.substr(0, attribute.length - 1);
        }

        for (var i = 0; i < arr_elms.length; i++) {
            for (var j = 0, attrs = arr_elms[i].attributes, l = attrs.length; j < l; j++){
                curr_attr = attrs.item(j).nodeName;
                if ((curr_attr === attribute && !wildcard) || (curr_attr.substr(0, attribute.length) === attribute && wildcard)) {
                    elements.push(arr_elms[i]);
                }
            }
        }
        return elements;
    },

    /**
     * TBW
     */
    getEventsGrouped: function (elements) {
        var events = {};
        for (var el in elements) {
            var element = elements[el];
            for (var i = 0, attrs = element.attributes, l = attrs.length; i < l; i++){
                var curr_attr = attrs.item(i).nodeName;
                if (curr_attr.substr(0, 2) === 'on') {
                    if (events[curr_attr] === undefined) {
                        events[curr_attr] = [];
                    }
                    events[curr_attr].push(element);
                }
            }
        }
        return events;
    },

    /**
     * TBW
     */
    getEvents: function () {
        var evt, el, type, signature, identifier,
            staticEvents = window.eventContainer.getEventsGrouped(window.eventContainer.getElementsByAttribute('on*'));

        for (evt in staticEvents) {
            type = evt.substr(2);
            for (el in staticEvents[evt]) {
                signature = hex_sha1(staticEvents[evt][el].getAttribute(evt));
                window.eventContainer.pushEvent(type, signature, staticEvents[evt][el]);
            }
        }

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
