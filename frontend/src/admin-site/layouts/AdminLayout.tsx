import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoSrc from "../../assets/logo/stpub.png";
import "./AdminLayout.css";

const MENU = [
  { label: "Pertanian",          to: "/admin/pertanian" },
  { label: "Peternakan",         to: "/admin/peternakan" },
  { label: "Konservasi",         to: "/admin/konservasi" },
  { label: "Pelayanan Akademik", to: "/admin/akademik" },
  { label: "Kemitraan",          to: "/admin/kemitraan" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src={logoSrc} alt="STP UB Jatikerto" />
        </div>

        <div className="admin-sidebar-heading">ADMIN MENU</div>
        <ul className="admin-menu">
          {MENU.map((m) => (
            <li key={m.to}>
              <NavLink
                to={m.to}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {m.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-logout-btn"
            onClick={() => void logout()}
          >
            Keluar
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <span className="admin-topbar-title">Dashboard KST Jatikerto</span>
          <span className="admin-topbar-user">
            Admin KST: {user?.name ?? "User"}
          </span>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
