/* eslint-disable no-restricted-globals */
/**
 * Adapted from https://github.com/molefrog/wouter's useLocation hook
 */
import { useEffect, useRef, useState, useCallback } from "react";

const eventPopstate = "popstate";
const eventPushState = "pushState";
const eventReplaceState = "replaceState";
export const events = [eventPopstate, eventPushState, eventReplaceState];

export type UseLocationResponse = [path: string, navigate: (to: string, options?: { replace?: boolean }) => void]

export default function useLocation({ base = "" } = {}): UseLocationResponse {
    const [path, update] = useState<string>(() => currentPathname(base)); // @see https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
    const prevPath = useRef(path);

    useEffect(() => {
        // this function checks if the location has been changed since the
        // last render and updates the state only when needed.
        // unfortunately, we can't rely on `path` value here, since it can be stale,
        // that's why we store the last pathname in a ref.
        const checkForUpdates = () => {
            const pathname = currentPathname(base);
            prevPath.current !== pathname && update((prevPath.current = pathname));
        };

        events.map((e) => addEventListener(e, checkForUpdates));

        // it's possible that an update has occurred between render and the effect handler,
        // so we run additional check on mount to catch these updates. Based on:
        // https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189
        checkForUpdates();

        return () => {events.map((e) => removeEventListener(e, checkForUpdates));}
    }, [base]);

    // the 2nd argument of the `useLocation` return value is a function
    // that allows to perform a navigation.
    //
    // the function reference should stay the same between re-renders, so that
    // it can be passed down as an element prop without any performance concerns.
    const navigate = useCallback(
        (to: string, { replace = false } = {}) =>
            history[replace ? eventReplaceState : eventPushState](
                null,
                "",
                // handle nested routers and absolute paths
                to[0] === "~" ? to.slice(1) : base + to
            ),
        [base]
    );

    return [path, navigate];
};

// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031
if (typeof history !== "undefined") {
    for (const type of [eventPushState, eventReplaceState]) {
        const original = (history as any)[type];

        (history as any)[type] = function () {
            const result = original.apply(this, arguments);
            const event = new Event(type);
            (event as any).arguments = arguments;

            dispatchEvent(event);
            return result;
        };
    }
}

const currentPathname = (base: string, path = location.pathname) =>
    !path.toLowerCase().indexOf(base.toLowerCase())
        ? path.slice(base.length) || "/"
        // ? "/"
        : "~" + path;
