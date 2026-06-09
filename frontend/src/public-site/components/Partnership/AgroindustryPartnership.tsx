import { useEffect, useState } from "react";
import {
  fetchKemitraanStats,
  type KemitraanStats,
} from "../../../services/public.api";
import "./Partnership.css";

import imgL from "../../../assets/images/tanaman.png";
import imgR from "../../../assets/images/hero/farm.png";

const PALETTE = [
  "#9aa39a", "#5a52d3", "#e23b3b", "#7a6dd6",
  "#e87928", "#1f6f8f", "#3aa847",
];

const AgroindustryPartnership = () => {
  const [stats, setStats] = useState<KemitraanStats | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchKemitraanStats()
      .then((s) => setStats(s))
      .catch(() => setStats(null))
      .finally(() => setLoaded(true));
  }, []);

  // Sembunyikan section seluruhnya kalau sudah selesai fetching
  // tapi tidak ada satu pun mitra aktif.
  if (loaded && stats && stats.totalKolaborasi === 0) {
    return null;
  }

  const totalMitra = stats?.totalMitra ?? 0;
  const totalKolaborasi = stats?.totalKolaborasi ?? 0;
  const partners = stats?.activeMitra ?? [];

  return (
    <section className="partnership-section" id="kemitraan">
      <div className="partnership-row">
        <div className="partnership-photo">
          <img src={imgL} alt="" />
        </div>

        <div className="partnership-content">
          <h2>Agroindustry Partnership</h2>
          <p>
            Kami telah membangun jaringan yang terdiri dari{" "}
            <strong>{totalMitra}</strong>{" "}
            {totalMitra === 1 ? "mitra" : "mitra"}, dengan{" "}
            <strong>{totalKolaborasi}</strong> kolaborasi aktif yang menciptakan
            dampak berkelanjutan di Agro Technopark kami.
          </p>
        </div>

        <div className="partnership-photo">
          <img src={imgR} alt="" />
        </div>
      </div>

      {partners.length > 0 && (
        <div className="partnership-trusted">
          <div className="partnership-trusted-label">
            Dipercaya dan didukung oleh mitra kami
          </div>
          <div className="partnership-logos">
            {partners.map((p, i) => (
              <span
                key={p.nama}
                className="partnership-logo"
                style={{
                  ["--logo-color" as string]: PALETTE[i % PALETTE.length],
                } as React.CSSProperties}
                title={`${p.nama} — ${p.bidang}`}
              >
                <span className="dot" />
                {p.nama}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default AgroindustryPartnership;
