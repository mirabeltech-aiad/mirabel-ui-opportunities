
import React from "react";
import { User, Phone, Mail, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";

const CompanyDetailsCard = ({ 
  editableCompanyData, 
  editingField, 
  tempValue, 
  setTempValue, 
  startEditing, 
  saveEdit, 
  handleKeyDown 
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      {/* Contact Information Grid with Inline Editing */}
      <div className="space-y-3">
        {/* Row 1: Contact Person and Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            {editingField === 'firstName' || editingField === 'lastName' ? (
              <div className="flex gap-1 flex-1">
                <Input
                  value={editingField === 'firstName' ? tempValue : editableCompanyData.firstName}
                  onChange={(e) => editingField === 'firstName' && setTempValue(e.target.value)}
                  onBlur={() => editingField === 'firstName' && saveEdit('firstName')}
                  onKeyDown={(e) => editingField === 'firstName' && handleKeyDown(e, 'firstName')}
                  className="text-sm h-6 px-1 py-0 focus:ring-1 focus:ring-blue-500 flex-1"
                  placeholder="First"
                  autoFocus={editingField === 'firstName'}
                  onFocus={() => editingField !== 'firstName' && startEditing('firstName', editableCompanyData.firstName)}
                />
                <Input
                  value={editingField === 'lastName' ? tempValue : editableCompanyData.lastName}
                  onChange={(e) => editingField === 'lastName' && setTempValue(e.target.value)}
                  onBlur={() => editingField === 'lastName' && saveEdit('lastName')}
                  onKeyDown={(e) => editingField === 'lastName' && handleKeyDown(e, 'lastName')}
                  className="text-sm h-6 px-1 py-0 focus:ring-1 focus:ring-blue-500 flex-1"
                  placeholder="Last"
                  autoFocus={editingField === 'lastName'}
                  onFocus={() => editingField !== 'lastName' && startEditing('lastName', editableCompanyData.lastName)}
                />
              </div>
            ) : (
              <span 
                className="text-sm text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => startEditing('firstName', editableCompanyData.firstName)}
              >
                {editableCompanyData.firstName} {editableCompanyData.lastName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-green-600" />
            {editingField === 'phone' ? (
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={() => saveEdit('phone')}
                onKeyDown={(e) => handleKeyDown(e, 'phone')}
                className="text-sm h-6 px-1 py-0 focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <span 
                className="text-sm text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => startEditing('phone', `${editableCompanyData.phone} ext: ${editableCompanyData.ext}`)}
              >
                {editableCompanyData.phone} ext: {editableCompanyData.ext}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Mobile Phone and Email */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-green-600" />
            {editingField === 'mobile' ? (
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={() => saveEdit('mobile')}
                onKeyDown={(e) => handleKeyDown(e, 'mobile')}
                className="text-sm h-6 px-1 py-0 focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <span 
                className="text-sm text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => startEditing('mobile', editableCompanyData.mobile)}
              >
                {editableCompanyData.mobile}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            {editingField === 'email' ? (
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={() => saveEdit('email')}
                onKeyDown={(e) => handleKeyDown(e, 'email')}
                className="text-sm h-6 px-1 py-0 focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <span 
                className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
                onClick={() => startEditing('email', editableCompanyData.email)}
              >
                {editableCompanyData.email}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsCard;
