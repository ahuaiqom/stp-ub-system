import type { ReactNode } from "react";
import "./DashboardCard.css";

interface Props {
  title: string;
  description: string;
  onAdd?: () => void;
  addLabel?: string;
  rightSlot?: ReactNode;
}

const DashboardCard = ({
  title,
  description,
  onAdd,
  addLabel = "Tambah data",
  rightSlot,
}: Props) => (
  <div className="dashboard-card">
    <div className="dashboard-card-text">
      <h2 className="dashboard-card-title">{title}</h2>
      <p className="dashboard-card-desc">{description}</p>
    </div>

    <div className="dashboard-card-right">
      {rightSlot}
      {onAdd && (
        <button type="button" className="dashboard-card-add" onClick={onAdd}>
          <span className="dashboard-card-add-icon" aria-hidden>📄</span>
          {addLabel}
        </button>
      )}
    </div>
  </div>
);

export default DashboardCard;
