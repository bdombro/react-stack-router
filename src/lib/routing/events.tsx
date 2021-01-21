const events = ["popstate", "pushState", "replaceState"];

export function attachHistoryChangeListener(callback: () => any) {
    events.map((e) => addEventListener(e, callback));
    // callback()
    return function detachListener() { events.map((e) => removeEventListener(e, callback)) }
}

export function detachHistoryChangeListener(callback: () => any) {
    events.map((e) => removeEventListener(e, callback))
}

export function navigate(to: string, { replace = false } = {}) {
    history[replace ? "replaceState" : "pushState"](Date.now(), "", to)
}
if (!history.state) navigate(location.pathname + location.search, { replace: true})

// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031
;(function monkeyPatchHistory() {
    if (typeof history !== "undefined") {
        for (const type of ["pushState", "replaceState"]) {
            const original = (history as any)[type];

            (history as any)[type] = function () {
                const result = original.apply(this, arguments);
                const event = new Event(type);
                (event as any).arguments = arguments;

                dispatchEvent(event);
                return result;
            }
        }
    }
})()

;(function attachLinkHandler() {
    document.body.addEventListener('click', linkHandler);
    return () => { document.body.removeEventListener('click', linkHandler) }
    function linkHandler(event: any) {
        const linkNode = findLinkTagInParents(event.target)
        if (
            linkNode 
            && linkNode.host === window.location.host
            && (
                linkNode.pathname !== window.location.pathname
                || linkNode.search !== window.location.search
            )
        ) {
            event.preventDefault()
            const search = new URLSearchParams(linkNode.search)
            const replace = search.get('replace')
            if (replace) {
                search.delete('replace')
                const searchStr = search.toString() ? '?' + search.toString() : ''
                navigate(linkNode.pathname + searchStr, {replace: true})
            }
            else 
                navigate(linkNode.pathname + linkNode.search)
        }
    }
    function findLinkTagInParents(node: HTMLElement): any {
        if (node?.nodeName === 'A') return node
        if (node?.parentNode) return findLinkTagInParents(node.parentElement!)
    }
})()