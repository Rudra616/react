import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import Sidebar from "./Sidebar";

import Home from "../screen/Home";
import Login from "../screen/Login";
import Register from "../screen/Register";
import Dashboard from "../screen/Dashboard";

const NAVBAR_HEIGHT = "60px";
const MAX_WIDTH = "1200px";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* ========== NAVBAR ========== */}
      <nav
        className="navbar navbar-dark fixed-top"
        style={{
          height: NAVBAR_HEIGHT,
          background: "linear-gradient(90deg,#0d6efd,#6610f2)",
          zIndex: 1200,
        }}
      >
        <div
          style={{
            maxWidth: MAX_WIDTH,
            margin: "0 auto",
            padding: "0 20px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LEFT */}
          <div className="d-flex align-items-center gap-3">
            {user && (
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => setSidebarOpen(true)}
              >
                ☰
              </button>
            )}
            <span className="navbar-brand fw-bold">MyApp</span>
          </div>

          {/* RIGHT */}
          <div>
            {user ? (
              <button className="btn btn-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm me-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-light btn-sm" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ========== SIDEBAR ========== */}
      <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

      {/* ========== PAGE CONTENT ========== */}
      <div
        style={{
          paddingTop: "80px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: MAX_WIDTH, width: "100%", padding: "0 20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Navbar;
