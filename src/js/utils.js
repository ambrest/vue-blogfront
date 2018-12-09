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
    }).then(v => v.json()).catch(v => v.json());
}
