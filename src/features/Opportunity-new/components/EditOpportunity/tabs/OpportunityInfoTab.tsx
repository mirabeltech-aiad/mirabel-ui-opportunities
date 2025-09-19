import React from 'react';
import { FormInput } from '../../ui/FormInput';
import { FloatingLabelSelect } from '@/shared/components/ui/FloatingLabelSelect';
import { Textarea } from '@/components/ui/textarea';
import { TabProps } from '../../../types/opportunity';
import { 
  OPPORTUNITY_STATUS_OPTIONS, 
  OPPORTUNITY_PROBABILITY_OPTIONS,
  OPPORTUNITY_LEAD_SOURCES,
  OPPORTUNITY_LEAD_TYPES,
  OPPORTUNITY_LEAD_STATUS
} from '../../../constants/opportunityOptions';
interface OpportunityInfoTabProps extends TabProps {
  isAddMode: boolean;
}

const OpportunityInfoTab: React.FC<OpportunityInfoTabProps> = ({
  formData,
  handleInputChange,
  handleBatchInputChange,
  getFieldError
}) => {
  // Mock data for now - replace with actual API calls
  const opportunityTypes: any[] = [];
  const stages: any[] = [];
  const businessUnits: any[] = [];
  const products: any[] = [];
  const users: any[] = [];
  const contacts: any[] = [];
  const lossReasons: any[] = [];
  const isLoading = {
    opportunityTypes: false,
    stages: false,
    businessUnits: false,
    products: false,
    users: false,
    contacts: false,
    lossReasons: false
  };

  // Check if proposal is linked to determine field disable state
  const isProposalLinked = !!(formData.proposalId && formData.proposalId.trim() !== '');

  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Row 1: Name (6), Company (4), Status (2) */}
          <div className="md:col-span-6">
            <FormInput
              label="Opportunity Name"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              error={getFieldError('name')}
              placeholder="Enter opportunity name"
              required
            />
          </div>
          
          <div className="md:col-span-4">
            <FormInput
              label="Company Name"
              value={formData.company}
              onChange={(value) => handleInputChange('company', value)}
              error={getFieldError('company')}
              placeholder="Enter company name"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <FloatingLabelSelect
              id="status"
              label="Status *"
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
              options={OPPORTUNITY_STATUS_OPTIONS}
              error={getFieldError('status')}
            />
          </div>

          {/* Row 2: Contact (4), Stage (4), Amount (2), Probability (2) */}
          <div className="md:col-span-4">
            <FloatingLabelSelect
              id="contactName"
              label="Contact Name"
              value={formData.contactName}
              onChange={(value) => handleInputChange('contactName', value)}
              options={contacts.map((contact: any) => ({
                value: contact.Name,
                label: contact.ContactFullName || contact.Name
              }))}
              error={getFieldError('contactName')}
              loading={isLoading.contacts}
            />
          </div>
          
          <div className="md:col-span-4">
            <FloatingLabelSelect
              id="stage"
              label="Stage *"
              value={formData.stage}
              onChange={(value) => handleInputChange('stage', value)}
              options={stages.map((stage: any) => ({
                value: stage.Stage,
                label: stage.Stage
              }))}
              error={getFieldError('stage')}
              loading={isLoading.stages}
            />
          </div>
          
          <div className="md:col-span-2">
            <FormInput
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(value) => handleInputChange('amount', value)}
              error={getFieldError('amount')}
              placeholder="0.00"
              disabled={isProposalLinked}
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <FloatingLabelSelect
              id="probability"
              label="Probability *"
              value={formData.probability}
              onChange={(value) => handleInputChange('probability', value)}
              options={OPPORTUNITY_PROBABILITY_OPTIONS}
              error={getFieldError('probability')}
            />
          </div>

          {/* Row 3: Opportunity Type (4), Business Unit (4), Product (4) */}
          <div className="md:col-span-4">
            <FloatingLabelSelect
              id="opportunityType"
              label="Opportunity Type *"
              value={formData.opportunityType.id}
              onChange={(value: any) => {
                const selectedType = opportunityTypes.find((type: any) => type.ID.toString() === value);
                handleInputChange('opportunityType', {
                  id: value,
                  name: selectedType?.Name || ''
                });
              }}
              options={opportunityTypes.map((type: any) => ({
                value: type.ID.toString(),
                label: type.Name
              }))}
              error={getFieldError('opportunityType')}
              loading={isLoading.opportunityTypes}
            />
          </div>
          
          <div className="md:col-span-4">
            <FloatingLabelSelect
              id="businessUnit"
              label="Business Unit"
              value={formData.businessUnit}
              onChange={(value: any) => {
                const selectedUnits = businessUnits.filter((unit: any) => 
                  value.includes(unit.Name)
                );
                handleBatchInputChange({
                  businessUnit: value,
                  businessUnitId: selectedUnits.map((unit: any) => unit.ID.toString()),
                  businessUnitDetails: selectedUnits
                });
              }}
              options={businessUnits.map((unit: any) => ({
                value: unit.Name,
                label: unit.Name
              }))}
              multiple
              disabled={isProposalLinked}
              loading={isLoading.businessUnits}
            />
          </div>
          
          <div className="md:col-span-4">
            <FloatingLabelSelect
              id="product"
              label="Product"
              value={formData.product}
              onChange={(value: any) => {
                const selectedProducts = products.filter((product: any) => 
                  value.includes(product.Name)
                );
                handleBatchInputChange({
                  product: value,
                  productId: selectedProducts.map((product: any) => product.ID.toString()),
                  productDetails: selectedProducts
                });
              }}
              options={products.map((product: any) => ({
                value: product.Name,
                label: product.Name
              }))}
              multiple
              disabled={isProposalLinked}
              loading={isLoading.products}
            />
          </div>

          {/* Row 4: Campaign Source (4), Close Date (3), Assigned Rep (5) */}
          <div className="md:col-span-4">
            <FloatingLabelSelect
              id="primaryCampaignSource"
              label="Primary Campaign Source"
              value={formData.primaryCampaignSource}
              onChange={(value) => handleInputChange('primaryCampaignSource', value)}
              options={OPPORTUNITY_LEAD_SOURCES}
            />
          </div>
          
          <div className="md:col-span-3">
            <FormInput
              label="Projected Close Date"
              type="date"
              value={formData.projCloseDate}
              onChange={(value) => handleInputChange('projCloseDate', value)}
              error={getFieldError('projCloseDate')}
              required
            />
          </div>
          
          <div className="md:col-span-5">
            <FloatingLabelSelect
              id="assignedRep"
              label="Assigned Rep"
              value={formData.assignedRep}
              onChange={(value: any) => {
                const selectedUser = users.find((user: any) => user.Name === value);
                handleBatchInputChange({
                  assignedRep: value,
                  assignedRepDetails: selectedUser ? {
                    ID: selectedUser.ID,
                    Name: selectedUser.Name
                  } : {}
                });
              }}
              options={users.map((user: any) => ({
                value: user.Name,
                label: user.Name
              }))}
              loading={isLoading.users}
            />
          </div>

          {/* Row 5: Sales Presenter (4), Loss Reason (4), Forecast Revenue (4) */}
          <div className="md:col-span-4">
            <FloatingLabelSelect
              id="salesPresentation"
              label="Sales Presenter"
              value={formData.salesPresentation}
              onChange={(value: any) => {
                const selectedUser = users.find((user: any) => user.Name === value);
                handleBatchInputChange({
                  salesPresentation: value,
                  salesPresenterDetails: selectedUser ? {
                    ID: selectedUser.ID,
                    Name: selectedUser.Name
                  } : {}
                });
              }}
              options={users.map((user: any) => ({
                value: user.Name,
                label: user.Name
              }))}
              loading={isLoading.users}
            />
          </div>
          
          <div className="md:col-span-4">
            <FloatingLabelSelect
              id="lostReason"
              label="Loss Reason"
              value={formData.lostReason}
              onChange={(value: any) => {
                const selectedReason = lossReasons.find((reason: any) => reason.Name === value);
                handleBatchInputChange({
                  lostReason: value,
                  lossReasonDetails: selectedReason ? {
                    ID: selectedReason.ID,
                    Name: selectedReason.Name
                  } : {}
                });
              }}
              options={lossReasons.map((reason: any) => ({
                value: reason.Name,
                label: reason.Name
              }))}
              loading={isLoading.lossReasons}
            />
          </div>
          
          <div className="md:col-span-4">
            <FormInput
              label="Forecast Revenue"
              type="number"
              value={formData.forecastRevenue}
              onChange={(value) => handleInputChange('forecastRevenue', value)}
              placeholder="0.00"
              disabled
            />
          </div>

          {/* Row 6: Created By (4), Created Date (3) */}
          <div className="md:col-span-4">
            <FormInput
              label="Created By"
              value={formData.createdBy}
              onChange={(value) => handleInputChange('createdBy', value)}
              error={getFieldError('createdBy')}
              placeholder="Enter creator name"
              required
            />
          </div>
          
          <div className="md:col-span-3">
            <FormInput
              label="Created Date"
              type="date"
              value={formData.createdDate}
              onChange={(value) => handleInputChange('createdDate', value)}
              error={getFieldError('createdDate')}
              required
            />
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FloatingLabelSelect
            id="leadSource"
            label="Lead Source"
            value={formData.leadSource}
            onChange={(value) => handleInputChange('leadSource', value)}
            options={OPPORTUNITY_LEAD_SOURCES}
          />
          
          <FloatingLabelSelect
            id="leadType"
            label="Lead Type"
            value={formData.leadType}
            onChange={(value) => handleInputChange('leadType', value)}
            options={OPPORTUNITY_LEAD_TYPES}
          />
          
          <FloatingLabelSelect
            id="leadStatus"
            label="Lead Status"
            value={formData.leadStatus}
            onChange={(value) => handleInputChange('leadStatus', value)}
            options={OPPORTUNITY_LEAD_STATUS}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Steps
            </label>
            <Textarea
              value={formData.nextSteps}
              onChange={(e) => handleInputChange('nextSteps', e.target.value)}
              placeholder="Enter next steps..."
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Enter notes..."
              rows={3}
            />
            {getFieldError('notes') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('notes')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityInfoTab;