import "./Activity.css";

// IMPORT 10 FOTO
import tree1 from "../../../assets/images/tree1.png";
import tree2 from "../../../assets/images/tree2.png";
import tree3 from "../../../assets/images/tree3.png";
import tree4 from "../../../assets/images/tree4.png";
import tree5 from "../../../assets/images/tree5.png";
import tree6 from "../../../assets/images/tree6.png";
import tree7 from "../../../assets/images/tree7.png";
import tree8 from "../../../assets/images/tree8.png";
import tree9 from "../../../assets/images/tree9.png";
import tree10 from "../../../assets/images/tree10.png";

// KIRI 5 FOTO
const leftImages = [
  tree1,
  tree2,
  tree3,
  tree4,
  tree5,
];

// KANAN 5 FOTO
const rightImages = [
  tree6,
  tree7,
  tree8,
  tree9,
  tree10,
];

const Activity = () => {
  return (
    <section className="activity-section">

      {/* LEFT IMAGES */}
      <div className="activity-images left">
        {leftImages.map((image, index) => (
          <img key={index} src={image} alt="" />
        ))}
      </div>

      {/* CONTENT */}
      <div className="activity-content">
        <h2>
          Aktivitas Pertanian di
          <br />
          Jatikerto
        </h2>

        <p>
          Kami membudidayakan beragam tanaman di berbagai zona
          pertanian, memanfaatkan metode pertanian modern untuk
          menghasilkan panen yang konsisten dan berkualitas tinggi
        </p>
      </div>

      {/* RIGHT IMAGES */}
      <div className="activity-images right">
        {rightImages.map((image, index) => (
          <img key={index} src={image} alt="" />
        ))}
      </div>

    </section>
  );
};

export default Activity;