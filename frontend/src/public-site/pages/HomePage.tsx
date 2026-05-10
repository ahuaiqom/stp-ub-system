import "./HomePage.css";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Activity from "../components/Activity/Activity";
import Activity2 from "../components/Activity/Activity2";
import HarvestTable from "../components/HarvestTable/HarvestTable";

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
      <Activity2 />
      <HarvestTable />
    </div>
  );
};

export default HomePage;