import { useRef, useState } from "react";
import "./Activity2.css";

import jagungImg from "../../../assets/images/JAGUNG.png";
import cabaiImg from "../../../assets/images/cabai.png";
import tanamanImg from "../../../assets/images/tanaman.png";

const slides = [
  {
    id: 1,
    title: "Tanaman",
    description:
      "Budidaya tanaman unggulan dengan metode modern dan hasil berkualitas.",
    image: tanamanImg,
  },
  {
    id: 2,
    title: "Jagung (Corn)",
    description:
      "Jagung berkualitas tinggi kami dikenal dengan rasa manis alami dan cita rasanya yang kaya!",
    image: jagungImg,
    featured: true,
  },
  {
    id: 3,
    title: "Cabai (Chili pepper)",
    description:
      "Cabai segar berkualitas tinggi dibudidayakan dengan teknik modern untuk hasil panen terbaik.",
    image: cabaiImg,
  },
];

const Activity2 = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);

  const scrollToSlide = (index: number) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.children[index] as HTMLElement;

    card.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    setActiveIndex(index);
  };

  const nextSlide = () => {
    if (activeIndex < slides.length - 1) {
      scrollToSlide(activeIndex + 1);
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      scrollToSlide(activeIndex - 1);
    }
  };

  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const center = slider.scrollLeft + slider.offsetWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    Array.from(slider.children).forEach((child, index) => {
      const element = child as HTMLElement;
      const childCenter = element.offsetLeft + element.offsetWidth / 2;
      const distance = Math.abs(center - childCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  return (
  <section className="activity2-section">
    <div className="activity2-slider-wrapper">
      <div
        className="activity2-slider"
        ref={sliderRef}
        onScroll={handleScroll}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`activity2-card ${
              slide.featured ? "featured" : "side"
            }`}
          >
            <img src={slide.image} alt={slide.title} />
            <div className="activity2-overlay" />

            <div className="activity2-content">
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="activity2-navigation">
      <button className="activity2-arrow-bottom" onClick={prevSlide}>
        &#8249;
      </button>

      <div className="activity2-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${activeIndex === index ? "active" : ""}`}
            onClick={() => scrollToSlide(index)}
          />
        ))}
      </div>

      <button className="activity2-arrow-bottom" onClick={nextSlide}>
        &#8250;
      </button>
    </div>
  </section>
);
};

export default Activity2;