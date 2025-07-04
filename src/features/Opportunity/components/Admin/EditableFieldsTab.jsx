
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEditMode } from "@/contexts/EditModeContext";

// Comprehensive list of all fields in the application
const ALL_FIELDS = [
  // Basic Info Fields
  { name: "name", label: "Opportunity Name", category: "Basic Info" },
  { name: "company", label: "Company Name", category: "Basic Info" },
  { name: "contactName", label: "Contact Name", category: "Basic Info" },
  { name: "state", label: "State", category: "Basic Info" },
  { name: "opportunityType", label: "Opportunity Type", category: "Basic Info" },
  { name: "businessUnit", label: "Business Unit", category: "Basic Info" },
  { name: "product", label: "Product", category: "Basic Info" },
  
  // Status & Progress Fields
  { name: "status", label: "Status", category: "Status & Progress" },
  { name: "stage", label: "Stage", category: "Status & Progress" },
  { name: "priority", label: "Deal Priority", category: "Status & Progress" },
  
  // Team & Assignment Fields
  { name: "assignedRep", label: "Assigned Rep", category: "Team & Assignment" },
  { name: "territory", label: "Territory", category: "Team & Assignment" },
  { name: "salesPresentation", label: "Sales Presenter", category: "Team & Assignment" },
  { name: "createdBy", label: "Created By", category: "Team & Assignment" },
  
  // Lead & Source Fields
  { name: "source", label: "Source", category: "Lead & Source" },
  { name: "leadType", label: "Lead Type", category: "Lead & Source" },
  { name: "leadSource", label: "Lead Source", category: "Lead & Source" },
  
  // Company Details Fields
  { name: "industry", label: "Industry", category: "Company Details" },
  { name: "companySize", label: "Company Size", category: "Company Details" },
  
  // Sales Details Fields
  { name: "timeframe", label: "Timeframe", category: "Sales Details" },
  { name: "contractLength", label: "Contract Length", category: "Sales Details" },
  
  // Table Filter Fields
  { name: "filter", label: "Table Filter", category: "Table Controls" },
  { name: "probability", label: "Probability Filter", category: "Table Controls" },
  { name: "agentFilter", label: "Agent Filter", category: "Table Controls" },
];

const EditableFieldsTab = () => {
  const { editableFields, setEditableFields } = useEditMode();

  const handleFieldToggle = (fieldName) => {
    if (editableFields.includes(fieldName)) {
      setEditableFields(editableFields.filter(f => f !== fieldName));
    } else {
      setEditableFields([...editableFields, fieldName]);
    }
  };

  const groupedFields = ALL_FIELDS.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Editable Fields Configuration</h3>
        <p className="text-sm text-gray-500 mt-1">
          Configure which fields can be edited by admins in Edit Mode. When Edit Mode is enabled, 
          selected fields will show an edit icon that allows modification of dropdown options.
        </p>
      </div>

      {Object.entries(groupedFields).map(([category, fields]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-base">{category}</CardTitle>
            <CardDescription>
              Enable editing for {category.toLowerCase()} fields
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields.map((field) => (
                <div key={field.name} className="flex items-center space-x-2">
                  <Switch
                    id={field.name}
                    checked={editableFields.includes(field.name)}
                    onCheckedChange={() => handleFieldToggle(field.name)}
                  />
                  <Label htmlFor={field.name} className="text-sm">
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="text-sm text-gray-500">
        <p><strong>Selected fields:</strong> {editableFields.length} of {ALL_FIELDS.length}</p>
      </div>
    </div>
  );
};

export default EditableFieldsTab;
