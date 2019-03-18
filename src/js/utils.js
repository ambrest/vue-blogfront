function eventListener(method, elements, events, fn, options = {}) {

    // Normalize array
    if (elements instanceof HTMLCollection || elements instanceof NodeList) {
        elements = Array.from(elements);
    } else if (!Array.isArray(elements)) {
        elements = [elements];
    }

    if (!Array.isArray(events)) events = [events];

    for (const element of elements) {
        for (const event of events) {
            element[method](event, fn, {capture: false, ...options});
        }
    }

    return Array.prototype.slice.call(arguments, 1);
}

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const on = eventListener.bind(null, 'addEventListener');

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const off = eventListener.bind(null, 'removeEventListener');

/**
 * Polyfill for safari & firefox for the eventPath event property.
 * @param evt The event object.
 * @return [String] event path.
 */
export function eventPath(evt) {
    let path = evt.path || (evt.composedPath && evt.composedPath());
    if (path) return path;
    return bubbleElementsTree(evt.target);
}

export function bubbleElementsTree(baseElement) {

    if (!baseElement) {
        return [];
    }

    const path = [baseElement];

    for (let el = baseElement; (el = el.parentElement);) {
        path.push(el);
    }

    path.push(document, window);
    return path;

}

/**
 * Triggers a download of a specific filepath / blob or data URI.
 * @param path
 * @param name
 */
export function download(path, name) {
    const link = document.createElement('a');
    link.setAttribute('href', path);
    link.setAttribute('target', '_blank');
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function setMetaTags(tags) {
    const uniqueTags = ['name', 'property'];

    for (const tag of tags) {
        const {content} = tag;

        // Check if document has already a related meta tag
        uniqueTags.forEach(uniqueTag => {

            // Check if tag contains a prop which is unique
            if (uniqueTag in tag) {

                // Find existing
                let el = document.head.querySelector(`[${uniqueTag}="${tag[uniqueTag]}"]`);

                // Create a new meta-tag and append it to the header section if tag not already exists
                if (!el) {
                    el = document.createElement('meta');
                    el.setAttribute(uniqueTag, tag[uniqueTag]);
                    document.head.appendChild(el);
                }

                // Apply content
                el.setAttribute('content', content);
            }

        });
    }
}

/**
 * Opens a file selection dialog.
 * @param cb
 * @param types
 */
export function selectFile(cb, types = []) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', types.map(v => v[0] === '.' ? v : '.' + v).join(','));
    input.style.display = 'none';

    document.body.appendChild(input);

    const args = on(input, 'change', e => {
        cb(input.files[0], e);

        // Unbind listener, remove from DOM
        off(...args);
        document.body.removeChild(input);
    });

    input.click();
}
