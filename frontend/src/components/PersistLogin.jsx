import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

function PersistLogin() {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyRefresh = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error("Refresh failed:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!auth.accessToken) {
      verifyRefresh();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <Outlet />;
}

export default PersistLogin;
