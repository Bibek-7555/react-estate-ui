import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import "./registerPage.scss"

function Register() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        setIsLoading(true)
        const formdata = new FormData(e.target)
        // const username = formdata.get("username")
        // const email = formdata.get("email")
        // const password = formdata.get("password")
        // const avatar = formdata.get("avatar")

        try {
            const res = await axios.post("http://localhost:8800/api/auth/register", 
                formdata, {
                    headers: {
                        "Content-Type": 'multipart/form-data'
                    }
                }
            )
            navigate("/login")
        } catch (error) {
            console.log(error)
            setError(error.response?.data?.message || "Fail hogaya")
        } finally {
            setIsLoading(false)
            e.target.reset();
        }
    }
    return (
        <div className="registerPage">
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <h2>Create an Accout</h2>
                    <input type="text" name="username" placeholder="Username"/>
                    <input type="text" name="email" placeholder="Email"/>
                    <input type="text" name="password" placeholder="Password"/>
                    <label htmlFor="avatar">Profile Pic</label>
                    <input type="file" name="avatar" id="avatar" placeholder="Profile Pic"/>
                    <button disabled={isLoading}>Register</button>
                    {error && <span>{error}</span>}
                    <Link to="/login" className="link">Do you have an account? <a href="" className="linking">Login</a></Link>
                </form>
            </div>
            <div className="imgContainer">
                    <img src="/bg.png" alt="" />
            </div>
        </div>
    );
}

export default Register