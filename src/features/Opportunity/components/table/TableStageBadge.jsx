
import { Badge } from "@/components/ui/badge";

const TableStageBadge = ({ stage }) => {
  if (stage.includes("1st Demo")) {
    return <Badge variant="orange">{stage}</Badge>;
  } else if (stage.includes("Closed Won")) {
    return <Badge variant="green">{stage}</Badge>;
  } else if (stage.includes("Closed Lost")) {
    return <Badge variant="red">{stage}</Badge>;
  } else if (stage.includes("Proposal")) {
    return <Badge variant="purple">{stage}</Badge>;
  } else if (stage.includes("Discovery")) {
    return <Badge variant="blue">{stage}</Badge>;
  } else if (stage.includes("Negotiation")) {
    return <Badge variant="yellow">{stage}</Badge>;
  } else {
    return <Badge variant="gray">{stage}</Badge>;
  }
};

export default TableStageBadge;
