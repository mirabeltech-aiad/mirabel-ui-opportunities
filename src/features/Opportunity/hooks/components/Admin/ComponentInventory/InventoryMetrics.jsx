
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Component, FileText, AlertTriangle, CheckCircle } from "lucide-react";

const InventoryMetrics = ({ componentInventory }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Component className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Components</p>
              <p className="text-lg font-bold">{componentInventory.totalComponents}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total LOC</p>
              <p className="text-lg font-bold">{componentInventory.totalLOC.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Large Components</p>
              <p className="text-lg font-bold">{componentInventory.largeComponents}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              <CheckCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Component Size</p>
              <p className="text-lg font-bold">{componentInventory.avgComponentSize} LOC</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryMetrics;
