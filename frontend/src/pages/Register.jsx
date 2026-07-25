import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await api.post("/auth/register", {
        username,

        email,

        password,
      });

      console.log(response.data);

      setMessage(response.data.message);

      navigate("/login");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Server Error");
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Register</button>
      </form>

      <p>{message}</p>

      <Link to="/login">Already have an account?</Link>
    </div>
  );
}

export default Register;
