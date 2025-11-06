import React from "react";
import Login from "./Components/Login";
import { Authprovider } from "./context/Authcontext";
import { ThemeProvider } from "./context/ThemeContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Home from "./pages/dashboard/Home";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import Products from "./pages/dashboard/Products";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Authprovider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="products" element={<Products />} />
              </Route>
            </Route>
          </Routes>
        </Authprovider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
