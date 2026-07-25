import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../api/axios";
import useAuth from "../hooks/useAuth";

function Login() {

    const navigate = useNavigate();

    const { setAuth } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });

            console.log(response.data);

            setAuth({

                accessToken: response.data.accessToken,

                user: response.data.user

            });

            navigate("/dashboard");

        }

        catch (error) {

            if (error.response) {

                setMessage(error.response.data.message);

            }

            else {

                setMessage("Server Error");

            }

        }

    };

    return (

        <div>

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <br/><br/>

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <br/><br/>

                <button type="submit">

                    Login

                </button>

            </form>

            <p>{message}</p>

            <Link to="/register">

                Create Account

            </Link>

        </div>

    );

}

export default Login;