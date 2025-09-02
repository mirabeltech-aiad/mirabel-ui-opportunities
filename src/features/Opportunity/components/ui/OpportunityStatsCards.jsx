import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
const StatCard = ({
  value,
  label,
  colorType = "primary",
  bgColorType = "white",
}) => {
  const [colors, setColors] = useState({
    primary: "#1a4d80",
    secondary: "#4fb3ff",
    success: "#06d6a0",
    warning: "#ffbe0b",
    danger: "#fb5607",
  });
  useEffect(() => {
    // Load saved colors from localStorage
    const savedColors = localStorage.getItem("dashboard_colors");
    if (savedColors) {
      setColors(JSON.parse(savedColors));
    }
  }, []);
  const getTextColor = () => {
    switch (colorType) {
      case "success":
        return {
          color: colors.success,
        };
      case "secondary":
        return {
          color: colors.secondary,
        };
      case "danger":
        return {
          color: colors.danger,
        };
      case "warning":
        return {
          color: colors.warning,
        };
      default:
        return {
          color: colors.primary,
        };
    }
  };
  return (
    <Card className="border border-gray-200 shadow-sm bg-white h-full mx-[3px] rounded">
      <CardContent className="p-3 text-center bg-white px-[12px] rounded mx-[5px]">
        <div className="text-xl font-bold mb-0.5" style={getTextColor()}>
          {value}
        </div>
        <p className="text-black text-xs font-medium uppercase tracking-tight">
          {label}
        </p>
      </CardContent>
    </Card>
  );
};
const OpportunityStatsCards = ({ stats }) => {
  return (
    <div className="flex flex-nowrap gap-4 mb-4 mt-1 rounded-none bg-gray-50 py-[7px] px-[7px]">
      <div className="flex-1">
        <StatCard
          value={stats.total.toLocaleString()}
          label="# Of Opportunities"
          colorType="primary"
        />
      </div>
      <div className="flex-1">
        <StatCard
          value={`$${stats.amount.toLocaleString()}`}
          label="Opportunity Amount"
          colorType="primary"
        />
      </div>
      <div className="flex-1">
        <StatCard
          value={stats.won.toLocaleString()}
          label="Total Opportunity Won"
          colorType="success"
        />
      </div>
      <div className="flex-1">
        <StatCard
          value={stats.open.toLocaleString()}
          label="Total Opportunity Open"
          colorType="secondary"
        />
      </div>
      <div className="flex-1">
        <StatCard
          value={stats.lost.toLocaleString()}
          label="Total Opportunity Lost"
          colorType="danger"
        />
      </div>
      <div className="flex-1">
        <StatCard
          value={`$${stats.winTotal.toLocaleString()}`}
          label="Opportunity Win Total"
          colorType="success"
        />
      </div>
      <div className="flex-1">
        <StatCard
          value={`${stats.winPercentage}%`}
          label="Opportunity Win %"
          colorType="warning"
        />
      </div>
    </div>
  );
};
export default OpportunityStatsCards;
