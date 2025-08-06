// src/components/DashboardHeader/DashboardHeader.tsx

import React from "react";
import "@styles/DashboardHeader.css";

// Interface สำหรับ Props ของ StatCard
interface StatCardProps {
  label: string;
  value: number;
  color: "total" | "completed" | "pending"; // กำหนดสีให้ชัดเจน
}

// Sub-component สำหรับการ์ดแสดงสถิติ
const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__border"></div>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__label">{label}</p>
    </div>
  );
};

// Interface สำหรับ Props ของ DashboardHeader
interface DashboardHeaderProps {
  total: number;
  completed: number;
  pending: number;
}

// Main Component
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  total,
  completed,
  pending,
}) => {
  return (
    <div className="dashboard-header-container">
      <div className="dashboard-header-text">
        <p className="dashboard-header-subtitle">
          Manage and view your upcoming events
        </p>
      </div>

      <div className="dashboard-header-stats">
        <StatCard label="Total Events" value={total} color="total" />
        <StatCard label="Completed" value={completed} color="completed" />
        <StatCard label="Pending" value={pending} color="pending" />
      </div>
    </div>
  );
};

export default DashboardHeader;
