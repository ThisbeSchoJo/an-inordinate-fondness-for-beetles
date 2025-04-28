import { NavLink } from "react-router-dom";
import { useState } from "react";

function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                response.json().then(user => {
                    addUser(user)
                    history.pushState(`/users/${user.id}`)
                })
            }
            else {
                alert("Invalid username or password")
            }
        })
    }
    
    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" name="username"value={formData.username} onChange={handleChange}/>
                <input type="password" placeholder="Password" name="password"value={formData.password} onChange={handleChange}/>
                <button type="submit">Login</button>
                <NavLink to="/signup">Signup</NavLink>
            </form>
        </>
    )
}

export default Login;