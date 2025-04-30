// This component is used to authenticate the user
// Will handle login/signup with toggle

import { useState } from "react";

function Authentication() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    return (
        <div>
            <h1>Authentication</h1>
        </div>
    )
}

export default Authentication;