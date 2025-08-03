
import React from "react";
import { Badge } from "@/components/ui/badge";

interface TableStageBadgeProps {
  stage: string;
}

const TableStageBadge: React.FC<TableStageBadgeProps> = ({ stage }) => {
  const getStageVariant = (stage: string) => {
    if (stage?.includes("Closed Won")) return 'default';
    if (stage?.includes("Closed Lost")) return 'destructive';
    if (stage?.includes("Proposal")) return 'secondary';
    if (stage?.includes("Negotiation")) return 'outline';
    return 'secondary';
  };

  return <Badge variant={getStageVariant(stage)}>{stage}</Badge>;
};

export default TableStageBadge;
