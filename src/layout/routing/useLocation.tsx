/**
 * Inspired by https://github.com/molefrog/wouter's useLocation hook
 */
import { useEffect, useRef, useState } from "preact/hooks";

import navListener from './navListener'

export interface UseLocationLocation { pathname: string, search: string }

export default function useLocation(): UseLocationLocation {
    const [location, setLocation] = useState<UseLocationLocation>(currentLocation)
    const prev = useRef(location);
    useEffect(_attachListeners, []);

    return location

    function _attachListeners() {
        // it's possible that an update has occurred between render and the effect handler,
        // so we run additional check on mount to catch these updates. Based on:
        // https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189
        checkForUpdates();
        return navListener(checkForUpdates)
    }

    // this function checks if the location has been changed since the
    // last render and updates the state only when needed.
    // unfortunately, we can't rely on `path` value here, since it can be stale,
    // that's why we store the last pathname in a ref.
    function checkForUpdates() {
        const next = currentLocation();
        if (prev.current.pathname !== next.pathname || prev.current.search !== next.search) {
            prev.current = next
            setLocation(next)
        }
    }
}

function currentLocation() {
    return { pathname: window.location.pathname, search: window.location.search }
}