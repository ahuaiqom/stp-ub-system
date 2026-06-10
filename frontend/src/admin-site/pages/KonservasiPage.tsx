import { useState } from "react";
import DashboardCard from "../components/DashboardCard";
import KonservasiHewanTab from "./KonservasiHewanTab";
import KonservasiTanamanTab from "./KonservasiTanamanTab";
import "./KonservasiPage.css";

type TabId = "hewan" | "tanaman";

const KonservasiPage = () => {
  const [tab, setTab] = useState<TabId>("hewan");
  // Each tab manages its own modal-open state through a "openAdd" trigger.
  // We bump a counter when the dashboard "+ Tambah data" button is clicked,
  // and each tab subscribes to the counter.
  const [addTrigger, setAddTrigger] = useState(0);

  const description =
    tab === "hewan"
      ? "Detail Konservasi Hewan KST Jatikerto"
      : "Detail Konservasi Tanaman KST Jatikerto";

  return (
    <>
      <DashboardCard
        title="Dashboard Konservasi"
        description={description}
        onAdd={() => setAddTrigger((c) => c + 1)}
      />

      <div className="konservasi-tabs">
        <button
          type="button"
          className={`tab ${tab === "hewan" ? "active" : ""}`}
          onClick={() => setTab("hewan")}
        >
          Konservasi Hewan
        </button>
        <button
          type="button"
          className={`tab ${tab === "tanaman" ? "active" : ""}`}
          onClick={() => setTab("tanaman")}
        >
          Konservasi Tanaman
        </button>
      </div>

      {tab === "hewan" ? (
        <KonservasiHewanTab addTrigger={addTrigger} />
      ) : (
        <KonservasiTanamanTab addTrigger={addTrigger} />
      )}
    </>
  );
};

export default KonservasiPage;
