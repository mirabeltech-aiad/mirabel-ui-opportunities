import React, { useState } from "react";
import InventoryMetrics from "./ComponentInventory/InventoryMetrics";
import InventorySearch from "./ComponentInventory/InventorySearch";
import CategoryCard from "./ComponentInventory/CategoryCard";
import QuickActions from "./ComponentInventory/QuickActions";

const ComponentInventoryTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // Component inventory data
  const componentInventory = {
    totalComponents: 83,
    totalLOC: 14500,
    avgComponentSize: 175,
    largeComponents: 3,
    mediumComponents: 35,
    smallComponents: 45
  };

  const componentCategories = [
    {
      name: "Pages",
      count: 6,
      avgSize: 220,
      health: "good",
      components: [
        { name: "Pipeline.jsx", size: 180, complexity: "medium", status: "healthy" },
        { name: "Admin.jsx", size: 150, complexity: "low", status: "healthy" },
        { name: "EditOpportunity.jsx", size: 280, complexity: "high", status: "needs-attention" },
        { name: "AdvancedSearch.jsx", size: 250, complexity: "high", status: "needs-attention" },
        { name: "CustomFields.jsx", size: 120, complexity: "low", status: "healthy" },
        { name: "LinkedProposals.jsx", size: 90, complexity: "low", status: "healthy" }
      ]
    },
    {
      name: "Admin Components",
      count: 12,
      avgSize: 180,
      health: "excellent",
      components: [
        { name: "ApiKeysTab.jsx", size: 150, complexity: "medium", status: "healthy" },
        { name: "FieldMappingTab.jsx", size: 200, complexity: "medium", status: "healthy" },
        { name: "ColorSettingsTab.jsx", size: 160, complexity: "medium", status: "healthy" },
        { name: "ArchitectureTab.jsx", size: 170, complexity: "medium", status: "healthy" },
        { name: "RefactoringTab.jsx", size: 297, complexity: "high", status: "needs-refactor" },
        { name: "ImprovementsTab.jsx", size: 180, complexity: "medium", status: "healthy" }
      ]
    },
    {
      name: "Table Components",
      count: 15,
      avgSize: 95,
      health: "excellent",
      components: [
        { name: "OpportunitiesTable.tsx", size: 320, complexity: "high", status: "needs-refactor" },
        { name: "OpportunityTableRow.jsx", size: 80, complexity: "low", status: "healthy" },
        { name: "TableColumnManager.jsx", size: 120, complexity: "medium", status: "healthy" },
        { name: "TableFilterControls.jsx", size: 90, complexity: "low", status: "healthy" },
        { name: "TableSortManager.jsx", size: 85, complexity: "low", status: "healthy" }
      ]
    },
    {
      name: "EditOpportunity Sections",
      count: 12,
      avgSize: 110,
      health: "good",
      components: [
        { name: "BasicInfoSection.jsx", size: 120, complexity: "medium", status: "healthy" },
        { name: "CompanyDetailsSection.jsx", size: 100, complexity: "low", status: "healthy" },
        { name: "FinancialSection.jsx", size: 130, complexity: "medium", status: "healthy" },
        { name: "AuditTrailSection.jsx", size: 95, complexity: "low", status: "healthy" }
      ]
    },
    {
      name: "UI Components",
      count: 25,
      avgSize: 45,
      health: "excellent",
      components: [
        { name: "Button.tsx", size: 60, complexity: "low", status: "healthy" },
        { name: "Card.tsx", size: 40, complexity: "low", status: "healthy" },
        { name: "Progress.tsx", size: 35, complexity: "low", status: "healthy" },
        { name: "Badge.tsx", size: 30, complexity: "low", status: "healthy" }
      ]
    },
    {
      name: "Custom Components",
      count: 13,
      avgSize: 125,
      health: "good",
      components: [
        { name: "EditableField.jsx", size: 140, complexity: "medium", status: "healthy" },
        { name: "OpportunityCard.jsx", size: 110, complexity: "medium", status: "healthy" },
        { name: "KanbanView.jsx", size: 160, complexity: "medium", status: "healthy" },
        { name: "ViewToggle.jsx", size: 80, complexity: "low", status: "healthy" }
      ]
    }
  ];

  const filteredCategories = componentCategories.filter(category => {
    if (filterType === "all") return true;
    if (filterType === "large") return category.avgSize > 200;
    if (filterType === "needs-attention") return category.health === "needs-attention" || category.health === "poor";
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Component Inventory</h3>
        <p className="text-sm text-gray-500">
          Comprehensive overview of all components, their sizes, and health status
        </p>
      </div>

      <InventoryMetrics componentInventory={componentInventory} />

      <InventorySearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <div className="grid gap-6">
        {filteredCategories.map((category) => (
          <CategoryCard 
            key={category.name} 
            category={category} 
            searchTerm={searchTerm}
          />
        ))}
      </div>

      <QuickActions />
    </div>
  );
};

export default ComponentInventoryTab;
