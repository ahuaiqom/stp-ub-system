import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../../assets/logo/stpub.png";

interface NavbarProps {
  items: string[];
}

const SECTION_MAP: Record<string, string> = {
  Pertanian:  "#pertanian",
  Peternakan: "#peternakan",
  Konservasi: "#konservasi",
  Akademik:   "#akademik",
  Kemitraan:  "#kemitraan",
};

const Navbar = ({ items }: NavbarProps) => {
  return (
    <nav className="navbar">
      <img src={logo} alt="logo" className="logo-img" />

      <ul className="nav-links">
        {items.map((item) => (
          <li key={item}>
            <a href={SECTION_MAP[item] ?? "#"}>{item}</a>
          </li>
        ))}
      </ul>

      <Link to="/admin/login" className="login-btn">
        Masuk ↗
      </Link>
    </nav>
  );
};

export default Navbar;
