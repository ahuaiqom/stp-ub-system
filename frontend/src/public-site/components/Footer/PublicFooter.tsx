import { useEffect, useState } from "react";
import logo from "../../../assets/logo/stpub.png";
import "./Footer.css";

const COLUMNS = [
  {
    title: "Column one",
    items: ["Twenty", "Twenty one", "Twenty two", "Twenty three"],
  },
  {
    title: "Column two",
    items: ["Twenty four", "Twenty five", "Twenty six", "Twenty seven"],
  },
  {
    title: "Column three",
    items: ["Twenty eight", "Twenty nine", "Thirty", "Thirty one"],
  },
  {
    title: "Column four",
    items: ["Thirty two", "Thirty three", "Thirty four", "Thirty five"],
  },
];

const scrollTop = () =>
  window.scrollTo({ top: 0, behavior: "smooth" });

const PublicFooter = () => {
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="public-footer">
      {showBackTop && (
        <div className="back-top-wrap">
          <button
            type="button"
            className="back-top-btn"
            onClick={scrollTop}
          >
            Kembali ke atas ↑
          </button>
        </div>
      )}

      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={logo} alt="STP UB Jatikerto" className="footer-logo" />
            <h4>Lokasi Kami</h4>
            <p>
              VGFJ+M24, Selobekiti, Jatikerto, Kec. Kromengan,
              Kabupaten Malang, Jawa Timur 65164
            </p>
          </div>

          {COLUMNS.map((c) => (
            <div className="footer-col" key={c.title}>
              <h4>{c.title}</h4>
              <ul>
                {c.items.map((it) => (
                  <li key={it}><a href="#!">{it}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-social">
          <h4>Media Sosial Kami</h4>
          <div className="footer-social-icons">
            <a href="#!" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 16 24 12 24 12s0-4-.5-5.8zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z"/>
              </svg>
            </a>
            <a href="#!" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
            </a>
            <a href="#!" aria-label="TikTok">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M19.6 6.2c-1.4-.3-2.6-1.2-3.3-2.5h-3v12.4a3.3 3.3 0 1 1-3.3-3.3v-3a6.3 6.3 0 1 0 6.3 6.3V9.5c1.2.8 2.6 1.3 4 1.3v-3c-.2 0-.5 0-.7-.1z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-copy">
          © {new Date().getFullYear()} Agrotech KST Jatikerto · All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
