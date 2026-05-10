import "./HomePage.css";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Activity from "../components/Activity/Activity";

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

      <Activity />

    </div>
  );
};

export default HomePage;