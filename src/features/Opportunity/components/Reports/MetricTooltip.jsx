import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from "lucide-react";

const MetricTooltip = ({ children, title, description, calculation, period, benchmarks }) => {
  return (
    <div className="relative">
      {children}
      <HoverCard>
        <HoverCardTrigger asChild>
          <button className="absolute top-2 right-2 z-30 p-1 opacity-60 hover:opacity-100 transition-opacity duration-200 cursor-help">
            <Info className="h-3.5 w-3.5 text-gray-400 hover:text-ocean-500 transition-colors" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            
            {calculation && (
              <div>
                <h5 className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Calculation
                </h5>
                <p className="text-sm">{calculation}</p>
              </div>
            )}
            
            <div>
              <h5 className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Time Period
              </h5>
              <p className="text-sm">{period}</p>
            </div>
            
            {benchmarks && (
              <div>
                <h5 className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Benchmarks
                </h5>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-green-600">Good:</span>
                    <span>{benchmarks.good}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Average:</span>
                    <span>{benchmarks.average}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Concerning:</span>
                    <span>{benchmarks.concerning}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default MetricTooltip;
