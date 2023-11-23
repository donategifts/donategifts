function extend(ns_string) {
    window.DG = window.DG || {};

    let parts = ns_string.split('.');
    let parent = window.DG;

    if (parts[0] == 'DG') {
        parts = parts.slice(1);
    }

    for (let i = 0; i < parts.length; i++) {
        // create a property if it doesnt exist
        if (typeof parent[parts[i]] == 'undefined') {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }

    return parent;
}
