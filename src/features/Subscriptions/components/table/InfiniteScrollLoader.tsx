
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";

interface InfiniteScrollLoaderProps {
  columnCount: number;
}

const InfiniteScrollLoader: React.FC<InfiniteScrollLoaderProps> = ({ columnCount = 14 }) => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={`skeleton-${index}`} className="hover:bg-transparent">
          {Array.from({ length: columnCount }).map((_, cellIndex) => (
            <TableCell key={cellIndex} className="py-2.5 px-4">
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default InfiniteScrollLoader;
