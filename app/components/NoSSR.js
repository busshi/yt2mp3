import { useEffect, useState } from "react";

const NoSSR = ({ children }) => {

    const [mountedState, setMountedState] = useState(false);

    useEffect(() => {
        setMountedState(true);
    }, []);

    return <>{mountedState ? children : null}</>;
}

export default NoSSR;