import React from "react";
import "./DashboardHeader.css";

interface StatCardProps {
  label: string;
  value: number;
  color: "total" | "completed" | "pending";
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__border" aria-hidden="true"></div>
      <p className="stat-card__value" aria-label={`${label} count`}>
        {value}
      </p>
      <p className="stat-card__label">{label}</p>
    </div>
  );
};

interface DashboardHeaderProps {
  total: number;
  completed: number;
  pending: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  total,
  completed,
  pending,
}) => {
  return (
    <header className="dashboard-header-container" role="banner">
      <div className="dashboard-header-text">
        <h1 className="dashboard-header-title">Events Dashboard</h1>
        <p className="dashboard-header-subtitle">
          Manage and view your upcoming events
        </p>
      </div>

      <section
        className="dashboard-header-stats"
        aria-label="Event statistics summary"
      >
        <StatCard label="Total Events" value={total} color="total" />
        <StatCard label="Completed" value={completed} color="completed" />
        <StatCard label="Pending" value={pending} color="pending" />
      </section>
    </header>
  );
};

export default DashboardHeader;
