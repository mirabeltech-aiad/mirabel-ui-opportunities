
import React from "react";
import { List, RotateCcw, User, FileText, Building2, Pin } from "lucide-react";
import { Button } from "@OpportunityComponents/ui/button";

const ActivityIconBar = ({ refreshTabData, loadingStates }) => {
  return (
    <div className="flex items-center justify-center">
      {/* Icon Bar - matching filter bar height and styling */}
      <div className="flex items-center gap-1 overflow-x-auto">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
          onClick={() => refreshTabData("all")}
          disabled={loadingStates.all}
          title="All Notes & Activities"
        >
          <List className="h-3 w-3 text-blue-600 mr-1" />
          ALL
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 text-xs border-green-200 text-green-700 hover:bg-green-50"
          onClick={() => refreshTabData("all")}
          disabled={loadingStates.all}
          title="Reload Activities"
        >
          <RotateCcw className={`h-3 w-3 text-green-600 ${loadingStates.all ? 'animate-spin' : ''}`} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
          title="View Logged in User"
        >
          <User className="h-3 w-3 text-purple-600" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
          title="View All Notes"
        >
          <FileText className="h-3 w-3 text-orange-600" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          title="View Company Notes & Activities"
        >
          <Building2 className="h-3 w-3 text-indigo-600" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 text-xs border-yellow-200 text-yellow-700 hover:bg-yellow-50"
          title="Pinned Notes"
        >
          <Pin className="h-3 w-3 text-yellow-600" />
        </Button>
      </div>
    </div>
  );
};

export default ActivityIconBar;
