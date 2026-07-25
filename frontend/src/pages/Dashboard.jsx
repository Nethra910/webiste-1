import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function Dashboard() {
  const axiosPrivate = useAxiosPrivate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axiosPrivate.get("/auth/profile");

        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    getProfile();
  }, []);

  return (
    <>
      <Navbar />

      <h1>Dashboard</h1>

      <h2>{user?.username}</h2>

      <p>{user?.email}</p>
    </>
  );
}

export default Dashboard;
