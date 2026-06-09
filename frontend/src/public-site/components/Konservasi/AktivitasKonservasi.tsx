import { useEffect, useState } from "react";
import { fetchKonservasiHewan } from "../../../services/public.api";
import "./Konservasi.css";

import deer from "../../../assets/images/hero/deer.png";
import peacock from "../../../assets/images/hero/peacock.png";
import farm from "../../../assets/images/hero/farm.png";
import greenhouse from "../../../assets/images/hero/greenhouse.png";

interface Bar {
  label: string;
  value: number;
}

const FALLBACK_BARS: Bar[] = [
  { label: "Merak Hijau", value: 2 },
  { label: "Kijang", value: 3 },
  { label: "Rusa Totol", value: 4 },
];

const currentYear = new Date().getFullYear();

const AktivitasKonservasi = () => {
  const [bars, setBars] = useState<Bar[]>(FALLBACK_BARS);

  useEffect(() => {
    fetchKonservasiHewan({ limit: 50 })
      .then((res) => {
        const items = res.items
          .map((r) => ({ label: r.jenisSatwa, value: r.jumlah }))
          .filter((b) => b.value > 0)
          .sort((a, b) => a.value - b.value)
          .slice(-7);
        if (items.length > 0) setBars(items);
      })
      .catch(() => {
        // keep fallback
      });
  }, []);

  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <section className="konservasi-section" id="konservasi">
      <div className="konservasi-left">
        <div className="konservasi-text">
          <h2>Aktivitas Konservasi</h2>
          <p>
            Sebagai bentuk tanggung jawab terhadap kelestarian fauna Indonesia,
            Agro Technopark menyediakan area konservasi eks-situ bagi beberapa
            satwa dilindungi. Area ini berfungsi sebagai sarana edukasi mengenai
            pentingnya menjaga keseimbangan ekosistem.
          </p>
        </div>

        <div className="konservasi-grid">
          <img className="g1" src={deer} alt="" />
          <img className="g2" src={peacock} alt="" />
          <img className="g3" src={greenhouse} alt="" />
          <img className="g4" src={farm} alt="" />
        </div>
      </div>

      <div className="konservasi-chart">
        <header className="konservasi-chart-title">
          Eksisting Binatang Konservasi {currentYear}
        </header>

        <div className="konservasi-chart-body">
          <div className="konservasi-chart-bars">
            {bars.map((b) => (
              <div className="konservasi-bar" key={b.label}>
                <span className="konservasi-bar-value">{b.value}</span>
                <div
                  className="konservasi-bar-fill"
                  style={{ height: `${(b.value / max) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="konservasi-bar-labels">
            {bars.map((b) => (
              <span key={b.label}>{b.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AktivitasKonservasi;
