import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Home from "../screen/Home";
import About from "../screen/About";
import Login from "../screen/Login";
import Register from "../screen/register";

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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand">MyApp</Link>

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

              <li className="nav-item">
                <Link className="nav-link" to="/about" onClick={() => setIsOpen(false)}>
                  About
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav ms-auto">
              {user ? (
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light mt-2 mt-lg-0"
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
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default Navbar;
