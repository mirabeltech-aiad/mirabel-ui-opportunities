import React, { useState } from "react";
import { useReportsContext } from "../context";
import { ReportCard, SearchBar, TabNavigation } from "./";
import { formatReportCount } from "../helpers/formatters.js";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import SortableReportCard from "./SortableReportCard";
import Spinner from "@/components/ui/spinner";

/**
 * Main reports directory component that displays all reports with filtering
 */
const ReportsDirectory = () => {
  const {
    reports,
    filteredReports,
    activeTab,
    searchQuery,
    tabCounts,
    setActiveTab,
    setSearchQuery,
    toggleStar,
    isLoading,
    error,
    isUpdatingStar,
    updatingReportId,
    isReordering,
    isReorderingPending,
    categories,
    reorderReports,
  } = useReportsContext();

  // print only category is sales only
  const salesReports = reports.filter((report) =>
    report.category.includes("Accounts Receivable")
  );
  console.log("salesReports", salesReports, filteredReports);

  const [activeReport, setActiveReport] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the mouse to move by 10 pixels before activating a drag
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const report = filteredReports.find((r) => r.id === active.id);
    setActiveReport(report);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderReports(active.id, over.id);
    }
    setActiveReport(null);
  };

  const handleDragCancel = () => {
    setActiveReport(null);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Sticky Header Section */}
      <div className="sticky z-40 border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95">
        <div className="px-4 py-4 mx-auto sm:py-6 max-w-11/12">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Reports Directory
            </h1>
            {/* <p className="mb-3 text-sm text-gray-600 sm:mb-4 sm:text-base">
              Select a report to view detailed analytics and insights
            </p> */}
            <div className="flex flex-col gap-3 items-start sm:flex-row sm:gap-4 sm:items-center">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <div className="text-sm text-gray-500">
                {formatReportCount(filteredReports.length, reports.length)}
              </div>
              {isReorderingPending && (
                <div className="flex gap-2 items-center text-sm text-blue-600">
                  <Spinner size="sm" color="text-blue-600" inline />
                  <span>Reordering...</span>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Tab Navigation */}
          {!isLoading && !error && (
            <TabNavigation
              categories={categories}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabCounts={tabCounts}
            />
          )}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="overflow-y-auto flex-1">
        <div className="px-4 py-4 mx-auto sm:py-6 max-w-11/12">
          {/* Loading State */}
          {isLoading && (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">⏳</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Loading reports...
              </h3>
              <p className="text-gray-500">
                Please wait while we fetch your reports.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">❌</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Error loading reports
              </h3>
              <p className="text-gray-500">{error}</p>
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && (
            <>
              {/* Reports Grid */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <SortableContext
                  items={filteredReports.map((r) => r.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredReports
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((report) => (
                        <SortableReportCard
                          key={report.id}
                          report={report}
                          onToggleStar={() => toggleStar(report)}
                          isUpdatingStar={
                            updatingReportId === report.id && isUpdatingStar
                          }
                          isReordering={isReorderingPending}
                        />
                      ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeReport ? (
                    <ReportCard
                      report={activeReport}
                      isDragging
                      onToggleStar={() => {}}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>

              {/* Empty State */}
              {filteredReports.length === 0 && (
                <div className="py-12 text-center">
                  <div className="mb-4 text-6xl">📊</div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    No reports found in {activeTab}
                  </h3>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsDirectory;
