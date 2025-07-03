
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { Button } from "@OpportunityComponents/ui/button";
import { Input } from "@OpportunityComponents/ui/input";
import { Filter, Search } from "lucide-react";

const InventorySearch = ({ searchTerm, setSearchTerm, filterType, setFilterType }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters & Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              All
            </Button>
            <Button
              variant={filterType === "large" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("large")}
            >
              Large
            </Button>
            <Button
              variant={filterType === "needs-attention" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("needs-attention")}
            >
              Needs Attention
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventorySearch;
