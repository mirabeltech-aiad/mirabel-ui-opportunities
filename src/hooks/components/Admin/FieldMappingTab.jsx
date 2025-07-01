
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import MappingStatus from "./FieldMapping/MappingStatus";
import MappingTable from "./FieldMapping/MappingTable";
import EmptyState from "./FieldMapping/EmptyState";

// WARNING: Consider adding unit tests to ensure refactoring doesn't break functionality

// Refactored for maintainability - split into focused components
const FieldMappingTab = () => {
  const [platformFields, setPlatformFields] = useState([]);
  const [localFields] = useState([
    { name: "id", type: "string", description: "Unique identifier" },
    { name: "company", type: "string", description: "Company name" },
    { name: "contact", type: "string", description: "Contact person" },
    { name: "email", type: "string", description: "Email address" },
    { name: "phone", type: "string", description: "Phone number" },
    { name: "stage", type: "string", description: "Pipeline stage" },
    { name: "amount", type: "number", description: "Deal amount" },
    { name: "probability", type: "number", description: "Win probability" },
    { name: "closeDate", type: "date", description: "Expected close date" }
  ]);
  const [mappings, setMappings] = useState({});
  const [isLoadingFields, setIsLoadingFields] = useState(false);

  useEffect(() => {
    // Load saved mappings
    const savedMappings = localStorage.getItem("field_mappings");
    if (savedMappings) {
      setMappings(JSON.parse(savedMappings));
    }
  }, []);

  // Extracted for clarity - handles platform field loading logic
  const loadPlatformFields = async () => {
    setIsLoadingFields(true);
    
    try {
      // Simulate loading fields from platform API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock platform fields
      const mockFields = [
        { name: "account_id", type: "string", description: "Account identifier" },
        { name: "account_name", type: "string", description: "Account name" },
        { name: "primary_contact", type: "string", description: "Primary contact" },
        { name: "contact_email", type: "string", description: "Contact email" },
        { name: "contact_phone", type: "string", description: "Contact phone" },
        { name: "opportunity_stage", type: "string", description: "Current stage" },
        { name: "deal_value", type: "number", description: "Deal value" },
        { name: "win_probability", type: "number", description: "Probability to win" },
        { name: "expected_close", type: "date", description: "Expected close date" },
        { name: "created_date", type: "date", description: "Creation date" },
        { name: "last_modified", type: "date", description: "Last modified" }
      ];
      
      setPlatformFields(mockFields);
      
      toast({
        title: "Success",
        description: "Platform fields loaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load platform fields",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFields(false);
    }
  };

  // Extracted for clarity - handles mapping changes and persistence
  const handleMappingChange = (localField, platformField) => {
    const newMappings = {
      ...mappings,
      [localField]: platformField
    };
    setMappings(newMappings);
    localStorage.setItem("field_mappings", JSON.stringify(newMappings));
  };

  // Extracted for clarity - handles saving mappings
  const saveMappings = () => {
    localStorage.setItem("field_mappings", JSON.stringify(mappings));
    toast({
      title: "Success",
      description: "Field mappings saved successfully",
    });
  };

  // Extracted for clarity - calculates mapped fields count
  const getMappedFieldsCount = () => {
    return Object.keys(mappings).filter(key => mappings[key]).length;
  };

  return (
    <div className="p-4 space-y-3">
      <div className="text-center mb-3">
        <h2 className="text-lg font-semibold">Field Mapping</h2>
        <p className="text-sm text-gray-500">Map fields between your local data and platform data</p>
      </div>

      <MappingStatus 
        mappedCount={getMappedFieldsCount()}
        totalFields={localFields.length}
        platformFieldsCount={platformFields.length}
        isLoadingFields={isLoadingFields}
        onLoadPlatformFields={loadPlatformFields}
      />

      {platformFields.length > 0 ? (
        <MappingTable 
          localFields={localFields}
          platformFields={platformFields}
          mappings={mappings}
          onMappingChange={handleMappingChange}
          onSaveMappings={saveMappings}
        />
      ) : (
        <EmptyState 
          onLoadPlatformFields={loadPlatformFields}
          isLoadingFields={isLoadingFields}
        />
      )}
    </div>
  );
};

export default FieldMappingTab;
