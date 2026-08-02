import React from "react";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import List from "./pages/List.jsx";
import Add from "./pages/Add.jsx";
import Categories from "./pages/Categories.jsx";
import Edit from "./pages/Edit.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { accessToken, loading, user } = useAuth();
  const isAdmin = user?.role === "admin";

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <>
        <ToastContainer />
        <Navbar />

        <hr className="border-gray-200" />

        <div className="flex">
          {isAdmin && <Sidebar isAdmin={isAdmin} />}
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/list" replace />} />
              <Route path="/list" element={<List />} />
              <Route path="/categories" element={<Categories />} />
              <Route
                path="/login"
                element={!accessToken ? <Login /> : <Navigate to="/list" replace />}
              />
              <Route
                path="/register"
                element={
                  !accessToken ? <Register /> : <Navigate to="/list" replace />
                }
              />
              <Route
                path="/add"
                element={isAdmin ? <Add /> : <Navigate to="/list" replace />}
              />
              <Route
                path="/edit/:id"
                element={isAdmin ? <Edit /> : <Navigate to="/list" replace />}
              />
              <Route path="*" element={<Navigate to="/list" replace />} />
            </Routes>
          </main>
        </div>
      </>
    </div>
  );
};

export default App;
