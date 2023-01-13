import React from "react";
import ReactDOM from "react-dom";
import { createMemoryHistory, createBrowserHistory } from "history";

import App from "./App";

// Mount function to start up the app
const mount = (el, { onNavigate, defaultHistory, initialPath }) => {
    // defaultHistory set to BrowserHistory if in dev local isolation.
    const history =
        defaultHistory ||
        createMemoryHistory({
            initialEntries: [initialPath],
        });

    // listen for history changes and call the container callback to update the container router.
    if (onNavigate) {
        history.listen(onNavigate);
    }

    ReactDOM.render(<App history={history} />, el);

    // return a call back function for container to update the marketing router
    return {
        onParentNavigate({ pathname: nextPathname }) {
            // prevent callback loop
            const { pathname } = history.location;

            if (pathname !== nextPathname) {
                history.push(nextPathname); // update router with pathname from container
            }
        },
    };
};

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === "development") {
    const devRoot = document.querySelector("#_auth-dev-root");

    if (devRoot) {
        mount(devRoot, { defaultHistory: createBrowserHistory() });
    }
}

// We are running through container
// and we should export the mount function
export { mount };
