import api from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    console.log(">>> Refresh function called");

    const response = await api.post("/auth/refresh");

    console.log(">>> Response:", response);

    setAuth((prev) => ({
      ...prev,
      accessToken: response.data.accessToken,
      user: response.data.user ?? prev.user,
    }));

    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
