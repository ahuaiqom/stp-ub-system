import "./Navbar.css";
import logo from "../../../assets/logo/stpub.png";

interface NavbarProps {
  items: string[];
}

const Navbar = ({ items }: NavbarProps) => {
  return (
    <nav className="navbar">
      <img src={logo} alt="logo" className="logo-img" />

      <ul className="nav-links">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <button className="login-btn">Masuk ↗</button>
    </nav>
  );
};

export default Navbar;