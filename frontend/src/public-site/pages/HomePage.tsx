import "./HomePage.css";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";

import {
  heroData,
  navItems,
} from "../data/homeData";

const HomePage = () => {
  return (
    <div className="homepage">
      <Navbar items={navItems} />

      <Hero
        title={heroData.title}
        description={heroData.description}
        buttonText={heroData.buttonText}
        gallery={heroData.gallery}
      />

      {/* NEW SECTION */}
      <section className="activity-section">
        <div className="activity-images left">
          {heroData.gallery.map((item, index) => (
            <img
              key={index}
              src={item.image}
              alt=""
            />
          ))}
        </div>

        <div className="activity-content">
          <h2>Aktivitas Pertanian di Jatikerto</h2>

          <p>
            Kami membudidayakan beragam tanaman di
            berbagai zona pertanian, memanfaatkan
            metode pertanian modern untuk menghasilkan
            panen yang konsisten dan berkualitas tinggi.
          </p>
        </div>

        <div className="activity-images right">
          {heroData.gallery.map((item, index) => (
            <img
              key={index}
              src={item.image}
              alt=""
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;