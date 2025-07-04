
import React from "react";

const AddressSection = ({ 
  formData, 
  handleInputChange, 
  stateOptions = []
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Address Information section is now empty but maintains structure */}
      <div className="col-span-full text-center text-gray-500 py-8">
        Address information fields have been removed
      </div>
    </div>
  );
};

export default AddressSection;
