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
 * Returns the XPath for a certain DOM element.
 *
 * @method getXPath
 * @param {DOMElement} element The DOM element to be converted as XPath
 * @return {String}
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
 * Retrieve a DOM element by XPath.
 *
 * @method getElementByXpath
 * @param {String} path The XPath expression
 * @return {DOMElement}
 */
document.getElementByXpath = function (path) {
    return document.evaluate(path, document, null, 9, null).singleNodeValue;
};

/**
 * Retrieve a list of DOM elements based on their attributes.
 *
 * @method getElementsByAttribute
 * @param {String} attr The attribute name ('*' is a wildcard).
 * @return {Array}
 */
Element.prototype.getElementsByAttribute = function (attribute) {
    // TODO: what about attributes attached at runtime?
    var arr_elms = this.getElementsByTagName('*');
    var elements = [];
    var wildcard = attribute.substr(-1, 1) === '*';
    var curr_attr;

    if (wildcard) {
        attribute = attribute.substr(0, attribute.length - 1);
    }

    for (var i = 0; i < arr_elms.length; i++) {
        for (var j = 0, attrs = arr_elms[i].attributes, l = attrs.length; j < l; j++){
            curr_attr = attrs.item(j).nodeName;
            if ((!wildcard && curr_attr === attribute) || (wildcard && curr_attr.substr(0, attribute.length) === attribute)) {
                elements.push(arr_elms[i]);
            }
        }
    }

    return elements;
};
document.getElementsByAttribute = Element.prototype.getElementsByAttribute;

/**
 * Event Container Class
 */
window.eventContainer = {
    container: {},

    /**
     * Add the element's event to the container.
     *
     * @method pushEvent
     * @param {String}     type      The event type
     * @param {String}     signature The signature of the event (sha1 of the function)
     * @param {DOMElement} element   The DOM element
     * @return Add the
     */
    pushEvent: function (type, signature, element) {
        window.eventContainer.container[type] = window.eventContainer.container[type] || {};
        window.eventContainer.container[type][signature] = window.eventContainer.container[type][signature] || [];

        var identifier = getXPath(element);
        if (identifier === '') {
            identifier = element.identifier; // TODO: FIX THIS HACK
        }

        window.eventContainer.container[type][signature].push(identifier);
    },

    /**
     * Override the native function "addEventListener".
     *
     * @method customAddEventListener
     * @return undefined
     */
    customAddEventListener: function (type, listener, useCapture, wantsUntrusted) {
        var signature = hex_sha1(listener.toString());
        window.eventContainer.pushEvent(type, signature, this);

        this._origAddEventListener(type, listener, useCapture, wantsUntrusted);
    },

    /**
     * Override the native function "removeEventListener".
     *
     * @method customRemoveEventListener
     * @param {String}   type       A string representing the event type being removed.
     * @param {Function} listener   The listener parameter indicates the EventListener function to be removed.
     * @param {Boolean}  useCapture Specifies whether the EventListener being removed was registered as a capturing listener or not. If not specified, useCapture defaults to false.
     * @return undefined
     */
    customRemoveEventListener: function (type, listener, useCapture)
    {
        var signature = hex_sha1(listener.toString());
        if (window.eventContainer.container[type][signature] !== undefined) {
            window.eventContainer.container[type][signature] = undefined;
        }

        this._origRemoveEventListener(type, listener, useCapture);
    },

    /**
     * Override the native function "setAttribute".
     *
     * @method customSetAttribute
     * @param {String} name  The name of the attribute as a string.
     * @param {String} value The desired new value of the attribute.
     * @return undefined
     */
    customSetAttribute: function (name, value) {
        var type, signature;

        if (name.indexOf('on') === 0) {
            type = name.substr(2);
            signature = hex_sha1(value.toString());
            window.eventContainer.pushEvent(type, signature, this);
        }

        this._origSetAttribute(name, value);
    },

    /**
     * Override the native function "removeAttribute".
     *
     * @method customRemoveAttribute
     * @param {String} attrName The attribute to be removed from element.
     * @return undefined
     */
    customRemoveAttribute: function (attrName) {
        var type, signature;

        if (attrName.indexOf('on') === 0) {
            type = attrName.substr(2);

            window.eventContainer.container[type] = window.eventContainer.container[type] || {};

            signature = hex_sha1(this.getAttribute(attrName).toString());
            if (window.eventContainer.container[type][signature] !== undefined) {
                window.eventContainer.container[type][signature] = undefined;
            }
        }

        this._origRemoveAttribute(name);
    },

    /**
     * Override the event listener for a certain object (e.g.: document, window,
     * element).
     *
     * @method overrideEventListener
     * @param {Object} object The object that will be changed
     * @return undefined
     */
    overrideEventListener: function (object) {
        var prototype = object.prototype === undefined ? object : object.prototype;

        prototype._origAddEventListener    = prototype.addEventListener;
        prototype.addEventListener         = window.eventContainer.customAddEventListener;
        prototype._origRemoveEventListener = prototype.removeEventListener;
        prototype.removeEventListener      = window.eventContainer.customRemoveEventListener;
    },

    /**
     * Override the attribute handler for a certain object (e.g.: document,
     * window, element).
     *
     * @method overrideAttributeHandler
     * @param {Object} object The object that will be changed
     * @return undefined
     */
    overrideAttributeHandler: function (object) {
        var prototype = object.prototype === undefined ? object : object.prototype;

        prototype._origSetAttribute    = prototype.setAttribute;
        prototype.setAttribute         = window.eventContainer.customSetAttribute;
        prototype._origRemoveAttribute = prototype.removeAttribute;
        prototype.removeAttribute      = window.eventContainer.customRemoveAttribute;
    },

    /**
     * Returns a list of DOM elements grouped by event type.
     *
     * @method getEventsGrouped
     * @param {Array} elements A list of DOM elements to be aggregated
     * @return {Array}
     */
    getEventsGrouped: function (elements) {
        var el, i, l, curr_attr, attrs, events = {};

        for (el in elements) {
            var element = elements[el];
            for (i = 0, attrs = element.attributes, l = attrs.length; i < l; i++){
                curr_attr = attrs.item(i).nodeName;
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
     * Returns a list of events bound to any element in the page.
     *
     * @method getEvents
     * @return undefined
     */
    getEvents: function () {
        var evt, el, type, signature, staticEvents;

        staticEvents = window.eventContainer.getEventsGrouped(document.getElementsByAttribute('on*'));

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
