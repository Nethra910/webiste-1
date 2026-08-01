import React from "react";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Route, Routes } from "react-router-dom";
import List from "./pages/List.jsx";
import Add from "./pages/Add.jsx";
import Categories from "./pages/Categories.jsx";
import Login from "./components/Login.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { accessToken, loading } = useAuth();
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!accessToken ? (
        <Login />
      ) : (
        <>
          <ToastContainer />
          <Navbar />

          <hr className="border-gray-200" />

          <div className="flex">
            <Sidebar />
            <div>
              <Routes>
                <Route path="/list" element={<List />} />
                <Route path="/add" element={<Add />} />
                <Route path="/categories" element={<Categories />} />
              </Routes>
            </div>

            <main className="flex-1 p-6">
              {/* Your pages will be rendered here */}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
