import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SIDEBAR_WIDTH = "240px";
const NAVBAR_HEIGHT = "60px";

const Sidebar = ({ isOpen, close }) => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 999,
          }}
        />
      )}

      {/* SIDEBAR */}
      <div
        style={{
          position: "fixed",
          top: NAVBAR_HEIGHT,
          left: 0,
          width: SIDEBAR_WIDTH,
          height: `calc(100vh - ${NAVBAR_HEIGHT})`,
          backgroundColor: "#212529",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "0.3s ease",
          zIndex: 1000,
          paddingTop: "20px",
        }}
      >
        <ul className="nav flex-column px-3">
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/" onClick={close}>
              🏠 Home
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/dashboard" onClick={close}>
              📊 Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
