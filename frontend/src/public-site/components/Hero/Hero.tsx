import "./Hero.css";

interface GalleryItem {
  image: string;
  className: string;
}

interface HeroProps {
  title: string;
  description: string;
  buttonText: string;
  gallery: GalleryItem[];
}

const Hero = ({
  title,
  description,
  buttonText,
  gallery,
}: HeroProps) => {
  return (
    <section className="hero-section">
      <div className="hero-left">
        <h1>{title}</h1>

        <p>{description}</p>

        <button className="explore-btn">
          {buttonText} →
        </button>
      </div>

      <div className="hero-gallery">
        {gallery.map((item, index) => (
          <img
            key={index}
            src={item.image}
            className={item.className}
            alt=""
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;