import "./Activity.css";
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

const Activity = () => {
  return (
    <section className="activity-section">
      <div className="activity-side left">
        <div className="activity-row">
          <img src={tree1} alt="" />
          <img src={tree2} alt="" />
        </div>
        <div className="activity-row">
          <img src={tree3} alt="" />
          <img src={tree4} alt="" />
          <img src={tree5} alt="" />
        </div>
      </div>

      <div className="activity-content">
        <h2>Aktivitas Pertanian di Jatikerto</h2>
        <p>
          Kami membudidayakan beragam tanaman di berbagai zona pertanian,
          memanfaatkan metode pertanian modern untuk menghasilkan panen
          yang konsisten dan berkualitas tinggi
        </p>
      </div>

      <div className="activity-side right">
        <div className="activity-row">
          <img src={tree6} alt="" />
          <img src={tree7} alt="" />
        </div>
        <div className="activity-row">
          <img src={tree8} alt="" />
          <img src={tree9} alt="" />
          <img src={tree10} alt="" />
        </div>
      </div>
    </section>
  );
};

export default Activity;