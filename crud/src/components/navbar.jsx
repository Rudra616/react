import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Home from "../screen/Home";
import Login from "../screen/Login";
import Register from "../screen/Register";
import Dashboard from "../screen/Dashboard";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
<nav
  className="navbar navbar-expand-lg navbar-dark shadow-sm"
  style={{ background: "linear-gradient(90deg,#0d6efd,#6610f2)" }}
>        <div className="container">
          <Link className="navbar-brand fw-bold fs-4" to="/dasborderd" onClick={() => setIsOpen(false)}>MyApp</Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
              </li>


            </ul>

            <ul className="navbar-nav ms-auto">
              {user ? (
                <li className="nav-item">
                  <button
                    className="btn btn-light text-primary fw-semibold mt-2 mt-lg-0"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register" onClick={() => setIsOpen(false)}>
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dasborderd" element={<Dashboard />} />

      </Routes>
    </>
  );
};

export default Navbar;
