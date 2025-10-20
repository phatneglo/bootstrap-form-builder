/**
 * DOM Manipulation Utilities
 */

export function createElement(tag, classes = '', attributes = {}) {
    const element = document.createElement(tag);
    if (classes) {
        element.className = classes;
    }
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
    return element;
}

export function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export function getElementIndex(element) {
    return Array.from(element.parentElement.children).indexOf(element);
}

export function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export function closest(element, selector) {
    return element.closest(selector);
}

export function delegate(parent, selector, eventType, handler) {
    parent.addEventListener(eventType, (e) => {
        const target = e.target.closest(selector);
        if (target) {
            handler.call(target, e);
        }
    });
}
