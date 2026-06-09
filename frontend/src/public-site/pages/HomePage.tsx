import "./HomePage.css";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Activity from "../components/Activity/Activity";
import Activity2 from "../components/Activity/Activity2";
import PertanianTable from "../components/PublicTable/PertanianTable";
import AktivitasPeternakan from "../components/Peternakan/AktivitasPeternakan";
import PeternakanTable from "../components/PublicTable/PeternakanTable";
import AktivitasKonservasi from "../components/Konservasi/AktivitasKonservasi";
import AktivitasAkademik from "../components/Akademik/AktivitasAkademik";
import AkademikTable from "../components/PublicTable/AkademikTable";
import AgroindustryPartnership from "../components/Partnership/AgroindustryPartnership";
import PublicFooter from "../components/Footer/PublicFooter";

import { heroData, navItems } from "../data/homeData";

const HomePage = () => (
  <div className="homepage">
    <Navbar items={navItems} />

    {/* HERO */}
    <Hero
      title={heroData.title}
      description={heroData.description}
      buttonText={heroData.buttonText}
      gallery={heroData.gallery}
    />

    {/* PERTANIAN */}
    <section id="pertanian">
      <Activity />
      <Activity2 />
      <PertanianTable />
    </section>

    {/* PETERNAKAN */}
    <section id="peternakan">
      <AktivitasPeternakan />
      <PeternakanTable />
    </section>

    {/* KONSERVASI */}
    <AktivitasKonservasi />

    {/* AKADEMIK */}
    <section id="akademik">
      <AktivitasAkademik />
      <AkademikTable />
    </section>

    {/* AGROINDUSTRY PARTNERSHIP */}
    <AgroindustryPartnership />

    {/* FOOTER */}
    <PublicFooter />
  </div>
);

export default HomePage;
