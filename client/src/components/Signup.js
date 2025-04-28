import { useOutletContext, useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";   

function Signup() {
    const {updateUser} = useOutletContext()
    const navigate = useNavigate()
    const [signUpData, setSignUpData] = useState({
        username: "",
        password: ""
    })

    const handleChange = (e) => {
        setSignUpData({
            ...signUpData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signUpData)
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error("Registration failed. Please try again.")
            }
        })
        .then(user => {
            updateUser(user);
            navigate("/")
        })
        .catch(error => {
            alert(error.message)
        })
    }

    return (
        <>
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input type="text" name="username" value={signUpData.username} onChange={handleChange}/>
                <label>Password</label>
                <input type="password" name="password" value={signUpData.password} onChange={handleChange}/>
                <button type="submit">Signup</button>
                <NavLink to="/login">Already a member? Log in!</NavLink>
            </form>
        </>
    )
}

export default Signup;