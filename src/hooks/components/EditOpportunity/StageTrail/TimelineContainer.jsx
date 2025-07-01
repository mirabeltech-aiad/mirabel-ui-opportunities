
import React from "react";
import TimelinePoint from "./TimelinePoint";

const TimelineContainer = ({ stageChanges }) => {
  return (
    <div className="bg-white border rounded-lg flex flex-col h-[500px]">
      {/* Timeline content container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
        <div className="relative min-w-max py-12">
          {/* Timeline line */}
          <div className="absolute top-20 left-0 right-0 h-0.5 bg-gray-300"></div>
          
          {/* Stage points */}
          <div className="flex relative min-w-max">
            {stageChanges.map((change, index) => (
              <TimelinePoint 
                key={change.id}
                change={change}
                index={index}
                stageChanges={stageChanges}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineContainer;
