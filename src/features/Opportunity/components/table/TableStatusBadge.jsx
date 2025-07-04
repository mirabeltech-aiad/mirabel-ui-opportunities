
import { Badge } from "@/components/ui/badge";

const TableStatusBadge = ({ status }) => {
  const getStatusVariant = (status) => {
    if (!status) return 'default'; // Handle undefined/null status
    
    switch (status.toLowerCase()) {
      case 'open':
        return 'open';
      case 'won':
        return 'won';
      case 'lost':
        return 'lost';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)}>
      {status || 'Unknown'}
    </Badge>
  );
};

export default TableStatusBadge;
