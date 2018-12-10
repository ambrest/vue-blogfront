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

export function fetchGraphQL(url, {query, variables}) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query, variables
        })

        /* eslint-disable no-console */
    }).then(v => v.json()).catch(console.error); // TODO: Server error message?
}
