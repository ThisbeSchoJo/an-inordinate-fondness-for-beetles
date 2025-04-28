import { NavLink } from "react-router-dom";

function Login() {
    return (
        <>
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
                <NavLink to="/signup">Signup</NavLink>
            </form>
        </>
    )
}

export default Login;