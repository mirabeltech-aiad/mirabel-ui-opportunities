
import { useState } from "react";
import MainNavbar from "@OpportunityComponents/MainNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomFieldsTable from "../components/CustomFields/CustomFieldsTable";
import NewFieldForm from "../components/CustomFields/NewFieldForm";

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "url", label: "URL" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "datetime", label: "Date & Time" },
  { value: "daterange", label: "Date Range" },
  { value: "dropdown", label: "Dropdown" },
  { value: "multiselect", label: "Multi-select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio Group" },
  { value: "currency", label: "Currency" },
  { value: "percent", label: "Percent" },
  { value: "file", label: "File Upload" },
  { value: "address", label: "Address" },
  { value: "richtext", label: "Rich Text" },
  { value: "lookup", label: "User/Contact Lookup" },
  { value: "autonumber", label: "Auto-number" },
  { value: "formula", label: "Formula" },
  { value: "rating", label: "Rating" },
  { value: "tags", label: "Tags/Multivalue" },
  { value: "geolocation", label: "Geolocation" },
];

const CustomFields = () => {
  const [fields, setFields] = useState([
    { id: 1, name: "Customer Type", type: "dropdown", required: true, active: true },
    { id: 2, name: "Contract Number", type: "text", required: false, active: true },
    { id: 3, name: "Expected Close Date", type: "date", required: true, active: true },
  ]);
  
  const [newField, setNewField] = useState({
    name: "",
    type: "text",
    required: false
  });

  const handleAddField = () => {
    if (newField.name) {
      setFields([
        ...fields,
        {
          id: fields.length + 1,
          name: newField.name,
          type: newField.type,
          required: newField.required,
          active: true
        }
      ]);
      setNewField({
        name: "",
        type: "text",
        required: false
      });
    }
  };

  const getTypeLabel = (typeValue) => {
    const fieldType = FIELD_TYPES.find(type => type.value === typeValue);
    return fieldType ? fieldType.label : typeValue;
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <MainNavbar />
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ocean-800 mb-2">Custom Fields Management</h1>
          <p className="text-gray-600">Create and manage custom fields for your opportunities and proposals</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-ocean-800 text-lg font-semibold">Custom Fields</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CustomFieldsTable 
                fields={fields} 
                getTypeLabel={getTypeLabel} 
              />
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-ocean-800 text-lg font-semibold">Add New Field</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <NewFieldForm
                newField={newField}
                setNewField={setNewField}
                handleAddField={handleAddField}
                fieldTypes={FIELD_TYPES}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomFields;
