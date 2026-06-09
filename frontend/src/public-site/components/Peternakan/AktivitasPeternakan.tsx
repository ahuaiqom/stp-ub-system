import "./Peternakan.css";

// Reuse existing tree assets as livestock photos for now.
// Replace with proper sapi/kambing photos when client provides them.
//import img1 from "../../../assets/images/sapi1.png";
import img2 from "../../../assets/images/kambing.png";
import img3 from "../../../assets/images/sapi2.png";

const AktivitasPeternakan = () => (
  <section className="peternakan-section">
    <div className="peternakan-photo peternakan-photo-left">
      <img src={img2} alt="" />
    </div>

    <div className="peternakan-content">
      <h2>
        Aktivitas
        <br />
        Peternakan
      </h2>
      <p>
        Agro Technopark mengelola unit peternakan yang berfokus pada pemeliharaan
        sapi dan kambing secara berkelanjutan. Unit ini tidak hanya berfungsi
        sebagai sarana produksi, tetapi juga sebagai laboratorium hidup untuk
        mempelajari siklus pertanian terpadu.
      </p>
    </div>

    <div className="peternakan-photo peternakan-photo-right">
      <img src={img3} alt="" />
    </div>
  </section>
);

export default AktivitasPeternakan;
