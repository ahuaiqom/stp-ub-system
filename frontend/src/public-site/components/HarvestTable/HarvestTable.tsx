import "./HarvestTable.css";

const harvestData = [
  {
    commodity: "Melon - Golden Aroma",
    area: "700",
    planting: "Setiap 3 Bulan (4x Setahun)",
    projection: "1500",
    unit: "Kg",
    note: "",
  },
  {
    commodity: "Pepaya Calina - California",
    area: "4000",
    planting: "Setiap 3 Bulan (4x Setahun)",
    projection: "16800",
    unit: "Kg",
    note: "",
  },
  {
    commodity: "Jagung Pakan",
    area: "6250",
    planting: "Setiap 3 Bulan (4x Setahun)",
    projection: "24000",
    unit: "Kg",
    note: "",
  },
  {
    commodity: "Jagung Manis",
    area: "2000",
    planting: "Setiap 3 Bulan (4x Setahun)",
    projection: "1200",
    unit: "Kg",
    note: "",
  },
  {
    commodity: "Cabai",
    area: "7500",
    planting: "Setiap 6 Bulan (2x Setahun)",
    projection: "4000",
    unit: "Kg",
    note: "",
  },
];

const HarvestTable = () => {
  return (
    <section className="harvest-section">
      <div className="harvest-container">
        <h2 className="harvest-title">Tabel Harvest</h2>

        <div className="harvest-table-wrapper">
          <table className="harvest-table">
            <thead>
              <tr>
                <th>Komoditas</th>
                <th>Luas Usaha (m2)</th>
                <th>Masa Tanam</th>
                <th>Proyeksi Panen</th>
                <th>Satuan</th>
                <th>Keterangan</th>
              </tr>
            </thead>

            <tbody>
              {harvestData.map((item, index) => (
                <tr key={index}>
                  <td>{item.commodity}</td>
                  <td>{item.area}</td>
                  <td>{item.planting}</td>
                  <td>{item.projection}</td>
                  <td>{item.unit}</td>
                  <td>{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="harvest-pagination">
          <button className="harvest-arrow">&#8249;</button>
          <button className="harvest-page active">1</button>
          <button className="harvest-arrow">&#8250;</button>
        </div>
      </div>
    </section>
  );
};

export default HarvestTable;