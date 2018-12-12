/**
 * Polyfill for safari & firefox for the eventPath event property.
 * @param evt The event object.
 * @return [String] event path.
 */
export function eventPath(evt) {
    let path = evt.path || (evt.composedPath && evt.composedPath());
    if (path) return path;

    let el = evt.target.parentElement;
    path = [evt.target, el];
    while (el = el.parentElement) path.push(el);

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
