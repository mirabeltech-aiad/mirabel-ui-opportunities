
export const useBasicInfoHandlers = (
  handleInputChange,
  apiBusinessUnits,
  apiOpportunityTypes,
  apiProducts,
  apiUsers,
  apiLossReasons,
  apiStages,
  contactOptions
) => {
  // Handle business unit selection to capture both ID and name
  const handleBusinessUnitChange = (value) => {
    const selectedOption = apiBusinessUnits.find(option => option.value === value);
    
    if (selectedOption) {
      handleInputChange("businessUnit", value);
      handleInputChange("businessUnitId", selectedOption.id);
    } else {
      handleInputChange("businessUnit", value);
      handleInputChange("businessUnitId", "");
    }
  };

  // Handle opportunity type selection
  const handleOpportunityTypeChange = (value) => {
    const selectedType = apiOpportunityTypes.find(type => type.value === value);
    if (selectedType) {
      handleInputChange("opportunityType", {
        id: selectedType.id,
        name: selectedType.name
      });
    } else {
      handleInputChange("opportunityType", value);
    }
  };

  // Handle product selection to capture both ID and name
  const handleProductChange = (value) => {
    const selectedProduct = apiProducts.find(product => product.value === value);
    if (selectedProduct) {
      handleInputChange("product", value);
      handleInputChange("productDetails", [{
        ID: selectedProduct.id,
        Name: selectedProduct.name
      }]);
    } else {
      handleInputChange("product", value);
      handleInputChange("productDetails", []);
    }
  };

  // Handle assigned rep selection to capture both ID and name
  const handleAssignedRepChange = (value) => {
    const selectedUser = apiUsers.find(user => user.value === value);
    if (selectedUser) {
      handleInputChange("assignedRep", value);
      handleInputChange("assignedRepDetails", {
        ID: selectedUser.id,
        Name: selectedUser.name
      });
    } else {
      handleInputChange("assignedRep", value);
      handleInputChange("assignedRepDetails", {});
    }
  };

  // Handle sales presenter selection to capture both ID and name
  const handleSalesPresenterChange = (value) => {
    const selectedUser = apiUsers.find(user => user.value === value);
    if (selectedUser) {
      handleInputChange("salesPresentation", value);
      handleInputChange("salesPresenterDetails", {
        ID: selectedUser.id,
        Name: selectedUser.name
      });
    } else {
      handleInputChange("salesPresentation", value);
      handleInputChange("salesPresenterDetails", {});
    }
  };

  // Handle loss reason selection to capture both ID and name
  const handleLossReasonChange = (value) => {
    const selectedLossReason = apiLossReasons.find(reason => reason.value === value);
    if (selectedLossReason) {
      handleInputChange("lostReason", value);
      handleInputChange("lossReasonDetails", {
        ID: selectedLossReason.id,
        Name: selectedLossReason.name
      });
    } else {
      handleInputChange("lostReason", value);
      handleInputChange("lossReasonDetails", {});
    }
  };

  // Handle stage selection to capture both ID and name
  const handleStageChange = (value) => {
    const selectedStage = apiStages.find(stage => stage.value === value);
    if (selectedStage) {
      handleInputChange("stage", value);
      handleInputChange("stageDetails", {
        ID: parseInt(selectedStage.id),
        Stage: selectedStage.name || selectedStage.value,
        Description: selectedStage.description || "",
        PercentClosed: selectedStage.percentClosed || 0,
        SortOrder: selectedStage.sortOrder || 0,
        ColorCode: selectedStage.colorCode || ""
      });
    } else {
      handleInputChange("stage", value);
      handleInputChange("stageDetails", {
        ID: null,
        Stage: value || "",
        Description: "",
        PercentClosed: 0,
        SortOrder: 0,
        ColorCode: ""
      });
    }
  };

  // Handle contact name selection to capture both ID and name
  const handleContactNameChange = (value) => {
    const selectedContact = contactOptions.find(contact => contact.value === value);
    
    if (selectedContact) {
      handleInputChange("contactName", value);
      handleInputChange("contactId", selectedContact.id);
      handleInputChange("contactDetails", {
        ID: selectedContact.id,
        Name: selectedContact.name
      });
    } else {
      handleInputChange("contactName", value);
      handleInputChange("contactId", "");
      handleInputChange("contactDetails", {});
    }
  };

  return {
    handleBusinessUnitChange,
    handleOpportunityTypeChange,
    handleProductChange,
    handleAssignedRepChange,
    handleSalesPresenterChange,
    handleLossReasonChange,
    handleStageChange,
    handleContactNameChange
  };
};
