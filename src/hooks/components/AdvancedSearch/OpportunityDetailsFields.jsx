import React, { useState, useEffect } from "react";
import FloatingLabelInput from "../EditOpportunity/FloatingLabelInput";
import FloatingLabelSelect from "@OpportunityComponents/ui/FloatingLabelSelect";
import StageSelector from "./StageSelector";
import { Textarea } from "@OpportunityComponents/ui/textarea";
import { Label } from "@OpportunityComponents/ui/label";
import Loader from "@/features/Opportunity/components/ui/loader";
import { OPPORTUNITY_OPTIONS } from "@/constants/opportunityOptions";
import { userService } from "../../services/userService";

const OpportunityDetailsFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const [stages, setStages] = useState([]);
  const [isLoadingStages, setIsLoadingStages] = useState(true);
  const [assignedReps, setAssignedReps] = useState([]);
  const [isLoadingAssignedReps, setIsLoadingAssignedReps] = useState(true);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        setIsLoadingStages(true);
        const stagesData = await userService.getStages();
        console.log('Stages data received:', stagesData);
        
        // Ensure we have a valid array with proper structure
        if (Array.isArray(stagesData) && stagesData.length > 0) {
          // Validate that each stage has the required properties and convert to strings
          const validStages = stagesData.filter(stage => 
            stage && typeof stage === 'object' && stage.value && stage.label
          ).map(stage => ({
            value: String(stage.value || ''),
            label: String(stage.label || '')
          }));
          setStages(validStages);
        } else {
          console.warn('Invalid stages data format:', stagesData);
          setStages([]);
        }
      } catch (error) {
        console.error('Failed to fetch stages:', error);
        setStages([]);
      } finally {
        setIsLoadingStages(false);
      }
    };

    const fetchAssignedReps = async () => {
      try {
        setIsLoadingAssignedReps(true);
        const reps = await userService.getOpportunityCreators();
        console.log('Assigned reps data received:', reps);
        
        // Ensure we have a valid array with proper structure
        if (Array.isArray(reps) && reps.length > 0) {
          // Validate that each rep has the required properties and convert to strings
          const validReps = reps.filter(rep => 
            rep && typeof rep === 'object' && rep.value && rep.label
          ).map(rep => ({
            value: String(rep.value || ''),
            label: String(rep.label || '')
          }));
          setAssignedReps(validReps);
        } else {
          console.warn('Invalid assigned reps data format:', reps);
          setAssignedReps([]);
        }
      } catch (error) {
        console.error('Failed to fetch assigned reps:', error);
        setAssignedReps([]);
      } finally {
        setIsLoadingAssignedReps(false);
      }
    };

    fetchStages();
    fetchAssignedReps();
  }, []);

  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  const opportunityNameOptions = [
    { value: "IN=Is Empty~", label: "Is Empty" },
    { value: "INN=Is Not Empty~", label: "Not Empty" }
  ];

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 - Core Opportunity Fields */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="opportunity-name"
            label="Opportunity Name"
            value={String(searchParams.opportunityName || "")}
            onChange={handleSelectFieldChange("opportunityName")}
            options={opportunityNameOptions}
            placeholder="Select option"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="stage"
            label="Stage"
            value={String(searchParams.stage || "")}
            onChange={handleSelectFieldChange("stage")}
            options={stages.length > 0 ? stages : []}
            placeholder={isLoadingStages ? <Loader size="sm" /> : "Select stage"}
            disabled={isLoadingStages || stages.length === 0}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="assigned-rep"
            label="Assigned Rep"
            value={String(searchParams.assignedRep || "")}
            onChange={handleSelectFieldChange("assignedRep")}
            options={assignedReps.length > 0 ? assignedReps : []}
            placeholder={isLoadingAssignedReps ? <Loader size="sm" /> : "Select rep"}
            disabled={isLoadingAssignedReps || assignedReps.length === 0}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="priority"
            label="Priority"
            value={String(searchParams.priority || "")}
            onChange={handleSelectFieldChange("priority")}
            options={OPPORTUNITY_OPTIONS.priority}
            placeholder="Select priority"
          />
        </div>
      </div>

      {/* Row 2 - Dates and Timelines */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="estimated-close-date"
            label="Est. Close Date"
            type="date"
            value={searchParams.estimatedCloseDate || ""}
            onChange={handleFieldChange("estimatedCloseDate")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="actual-close-date"
            label="Actual Close Date"
            type="date"
            value={searchParams.actualCloseDate || ""}
            onChange={handleFieldChange("actualCloseDate")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="timeline"
            label="Timeline"
            value={searchParams.timeline || ""}
            onChange={handleFieldChange("timeline")}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelSelect
            id="status"
            label="Status"
            value={String(searchParams.status || "")}
            onChange={handleSelectFieldChange("status")}
            options={OPPORTUNITY_OPTIONS.status}
            placeholder="Select status"
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelSelect
            id="confidence-level"
            label="Confidence Level"
            value={String(searchParams.confidenceLevel || "")}
            onChange={handleSelectFieldChange("confidenceLevel")}
            options={OPPORTUNITY_OPTIONS.confidence}
            placeholder="Select level"
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="probability"
            label="Probability"
            value={searchParams.probability || ""}
            onChange={handleFieldChange("probability")}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-6 space-y-2">
          <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
          <FloatingLabelInput
            id="tags"
            label=""
            value={searchParams.tags || ""}
            onChange={handleFieldChange("tags")}
            placeholder="Enter tags"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            placeholder="Enter description" 
            onChange={handleInputChange}
            rows={3}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailsFields;
