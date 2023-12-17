/**
 *
 * @param {HTMLElement | ParentNode} node
 */
export function get_host(node) {
    while (!(node instanceof ShadowRoot)) {
        return get_host(node.parentNode);
    }

    return node.host;
}
