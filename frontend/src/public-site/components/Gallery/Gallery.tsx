import "./Gallery.css";

interface GalleryItem {
  image: string;
  className: string;
}

interface GalleryProps {
  images: GalleryItem[];
}

const Gallery = ({ images }: GalleryProps) => {
  return (
    <div className="hero-gallery">
      {images.map((item, index) => (
        <img
          key={index}
          src={item.image}
          className={item.className}
          alt=""
        />
      ))}
    </div>
  );
};

export default Gallery;