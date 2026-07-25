import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";

function Navbar() {

    const navigate = useNavigate();

    const { auth, setAuth } = useAuth();

    const handleLogout = async () => {

        try {

            await api.post("/auth/logout");

            setAuth({

                accessToken: "",

                user: null

            });

            navigate("/login");

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <nav>

            <h3>{auth.user?.username}</h3>

            <button onClick={handleLogout}>

                Logout

            </button>

        </nav>

    );

}

export default Navbar;