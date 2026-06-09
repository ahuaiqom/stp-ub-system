import "./Akademik.css";

import imgL from "../../../assets/images/hero/greenhouse.png";
import imgR from "../../../assets/images/hero/farm.png";

const AktivitasAkademik = () => (
  <section className="akademik-section">
    <div className="akademik-photo akademik-photo-left">
      <img src={imgL} alt="" />
    </div>

    <div className="akademik-content">
      <h2>
        Pelayanan
        <br />
        Akademik
      </h2>
      <p>
        KST UB Jatikerto memberikan kesempatan bagi mahasiswa tingkat akhir
        untuk menjadikan lahan kami sebagai pusat penelitian skripsi. Kami
        menyediakan ekosistem yang terkendali dan fasilitas pendukung untuk
        memastikan data penelitian Anda akurat dan berkualitas.
      </p>
    </div>

    <div className="akademik-photo akademik-photo-right">
      <img src={imgR} alt="" />
    </div>
  </section>
);

export default AktivitasAkademik;
