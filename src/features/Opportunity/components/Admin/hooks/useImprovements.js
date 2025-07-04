
import { useState, useEffect } from "react";
import { toast } from "@/features/Opportunity/hooks/use-toast";

// Extracted for clarity - manages improvements state and operations
export const useImprovements = () => {
  const [improvements, setImprovements] = useState([]);

  useEffect(() => {
    const savedImprovements = localStorage.getItem("improvements");
    if (savedImprovements) {
      setImprovements(JSON.parse(savedImprovements));
    }
  }, []);

  const saveImprovements = (updatedImprovements) => {
    setImprovements(updatedImprovements);
    localStorage.setItem("improvements", JSON.stringify(updatedImprovements));
  };

  const addImprovement = (improvementData) => {
    if (!improvementData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the improvement",
        variant: "destructive",
      });
      return false;
    }

    const improvement = {
      id: Date.now(),
      ...improvementData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedImprovements = [...improvements, improvement];
    saveImprovements(updatedImprovements);
    
    toast({
      title: "Success",
      description: "Improvement has been added",
    });
    return true;
  };

  const updateImprovement = (improvementId, improvementData) => {
    if (!improvementData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the improvement",
        variant: "destructive",
      });
      return false;
    }

    const updatedImprovements = improvements.map(improvement => 
      improvement.id === improvementId 
        ? { ...improvement, ...improvementData, updatedAt: new Date().toISOString() }
        : improvement
    );

    saveImprovements(updatedImprovements);
    
    toast({
      title: "Success",
      description: "Improvement has been updated",
    });
    return true;
  };

  const deleteImprovement = (improvementId) => {
    const updatedImprovements = improvements.filter(improvement => improvement.id !== improvementId);
    saveImprovements(updatedImprovements);
    
    toast({
      title: "Success",
      description: "Improvement has been deleted",
    });
  };

  return {
    improvements,
    addImprovement,
    updateImprovement,
    deleteImprovement
  };
};
