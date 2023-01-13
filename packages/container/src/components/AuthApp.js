import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { mount } from "auth/AuthApp";

const AuthApp = ({ onSignIn }) => {
    const ref = useRef(null);
    const history = useHistory();

    useEffect(() => {
        const { onParentNavigate } = mount(ref.current, {
            // provide a callback so the micro app can update the container router
            onNavigate: ({ pathname: nextPathname }) => {
                // prevent callback loop
                const { pathname } = history.location;

                if (pathname !== nextPathname) {
                    history.push(nextPathname); // update router with pathname value from microfrontend
                }
            },
            initialPath: history.location.pathname, // send in on mount what the path is (used for projects that have routed endpoints by default)
            onSignIn,
        });

        // listen for changes in router and update microfrontend router
        history.listen(onParentNavigate);
    }, []);

    return <div ref={ref} />;
};

export default AuthApp;
