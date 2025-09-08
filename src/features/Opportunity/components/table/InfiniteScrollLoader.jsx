
import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";
import Loader from "@/components/ui/loader";

const InfiniteScrollLoader = ({ columnCount = 14 }) => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={`skeleton-${index}`} className="hover:bg-transparent">
          {Array.from({ length: columnCount }).map((_, cellIndex) => (
            <TableCell key={cellIndex} className="py-2.5 px-4" style={{ minWidth: "120px", maxWidth: "200px" }}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
      <TableRow>
        <TableCell colSpan={columnCount} className="text-center py-4">
          <Loader size="sm" text="Loading more opportunities..." />
        </TableCell>
      </TableRow>
    </>
  );
};

export default InfiniteScrollLoader;
