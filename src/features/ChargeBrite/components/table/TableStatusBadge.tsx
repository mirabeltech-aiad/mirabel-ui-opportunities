
import React from "react";
import { Badge } from "@/components/ui/badge";

interface TableStatusBadgeProps {
  status: string;
}

const TableStatusBadge: React.FC<TableStatusBadgeProps> = ({ status }) => {
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'accepted':
      case 'completed':
      case 'active':
      case 'won':
      case 'closed won':
        return 'green'; // Success states
      case 'under review':
      case 'submitted':
      case 'running':
      case 'in progress':
      case 'open':
      case 'discovery':
        return 'blue'; // Active/in-progress states
      case 'rejected':
      case 'failed':
      case 'lost':
      case 'closed lost':
        return 'red'; // Error/negative states
      case 'paused':
      case 'pending':
      case 'negotiation':
      case '1st demo':
        return 'yellow'; // Warning/attention states
      case 'draft':
      case 'inactive':
        return 'outline'; // Neutral states
      case 'proposal':
        return 'purple'; // Key milestones
      default:
        return 'blue'; // Default to blue for unknown states
    }
  };

  return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
};

export default TableStatusBadge;
