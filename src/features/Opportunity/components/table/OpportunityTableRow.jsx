import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import StageDropdown from "./StageDropdown";
import TableStatusBadge from "./TableStatusBadge";
import UserAvatar from "./UserAvatar";

const OpportunityTableRow = ({ 
  opportunity, 
  isSelected, 
  onSelect, 
  columnOrder, 
  columnWidths,
  onCompanySelect,
  selectedCompany,
  stages = []
}) => {
  const navigate = useNavigate();

  const handleRowClick = (e) => {
    // Prevent navigation when clicking on interactive elements
    if (e.target.closest('input, button, [role="button"], [data-radix-select-trigger]')) {
      return;
    }
    
    // Single click selects the row for bulk actions
    onSelect(!isSelected);
  };

  const handleRowDoubleClick = (e) => {
    // Prevent navigation when double-clicking on interactive elements
    if (e.target.closest('input, button, [role="button"], [data-radix-select-trigger]')) {
      return;
    }
    // Double click opens edit opportunity
    navigate(`/edit-opportunity/${opportunity.id}`);
  };

  const handleCompanyClick = (e) => {
    e.stopPropagation();
    if (onCompanySelect) {
      onCompanySelect(opportunity.companyName, opportunity);
    }
  };

  const handleStageChange = (opportunityId, newStage) => {
    console.log(`Stage changed for opportunity ${opportunityId} to ${newStage}`);
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  const renderCellContent = (column) => {
    const getValue = (columnId) => {
      const apiFieldMappings = {
        'assignedRep': ['AssignedTo', 'assignedRep'],
        'createdBy': ['OwnerName', 'OwnerDetails.Name', 'createdBy'],
        'opportunityType': ['TypeName', 'OppTypeDetails.Name', 'opportunityType'],
        'companyName': ['CustomerName', 'ContactDetails.Name', 'companyName'],
        'projCloseDate': ['CloseDate', 'closeDate', 'projCloseDate'],
        'closeDate': ['CloseDate', 'projCloseDate', 'closeDate'],
        'description': ['Description', 'Notes', 'description'],
        'source': ['Source', 'source'],
        'status': ['Status', 'status'],
        'opportunityName': ['name', 'Name', 'opportunityName'],
        'name': ['name', 'Name', 'opportunityName'],
        'createdDate': ['CreatedDateFrom', 'CreatedDate', 'createdDate'],
        'contactName': ['SubContactName', 'SubContactDetails.Name', 'contactName'],
        'stage': ['Stage', 'OppStageDetails.Stage', 'stage'],
        'nextStep': ['NextStep', 'nextStep'],
        'amount': ['Amount', 'amount'],
        'probability': ['Probability', 'probability'],
        'actualCloseDate': ['ActualCloseDate', 'actualCloseDate'],
        'proposalId': ['ProposalID', 'proposalId'],
        'lossReason': ['LossReasonName', 'OppLossReasonDetails.Name', 'lossReason'],
        'salesPresenter': ['SalesPresenter', 'salesPresenter'],
        'businessUnit': ['BusinessUnit', 'businessUnit'],
        'forecastRevenue': ['ForecastRevenue', 'forecastRevenue'],
        'lastActivity': ['OpportunityField', 'LastActivity.Display', 'lastActivity'],
        'lastActivityDate': ['ActivityField', 'LastActivity.LastActivity', 'lastActivityDate'],
        'opportunityId': ['ID', 'opportunityId'],
        'contactId': ['gsCustomersID', 'ContactID', 'ContactDetails.ID', 'contactId'],
        'leadStatus': ['LeadStatus', 'leadStatus'],
        'product': ['ProductDetails.Name', 'ProductName', 'product']
      };

      if (opportunity[columnId] !== undefined && opportunity[columnId] !== null && opportunity[columnId] !== '') {
        return opportunity[columnId];
      }
      
      const mappings = apiFieldMappings[columnId] || [columnId];
      for (const fieldPath of mappings) {
        if (fieldPath.includes('.')) {
          const parts = fieldPath.split('.');
          let value = opportunity;
          for (const part of parts) {
            if (value && typeof value === 'object' && value[part] !== undefined) {
              value = value[part];
            } else {
              value = null;
              break;
            }
          }
          if (value !== null && value !== undefined && value !== '') {
            return value;
          }
        } else {
          if (opportunity[fieldPath] !== undefined && opportunity[fieldPath] !== null && opportunity[fieldPath] !== '') {
            return opportunity[fieldPath];
          }
        }
      }
      
      return null;
    };
    
    const value = getValue(column.id);
    
    switch (column.id) {
      case 'name':
      case 'opportunityName':
        return (
          <div className="font-medium text-blue-600 text-sm cursor-pointer hover:text-blue-700 transition-colors">
            {value || 'Untitled Opportunity'}
          </div>
        );
      case 'companyName':
        return (
          <Button
            variant="link"
            className={`p-0 h-auto font-medium text-sm hover:underline transition-colors ${
              selectedCompany === (value || opportunity.companyName) ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'
            }`}
            onClick={handleCompanyClick}
          >
            {value || opportunity.companyName || 'Unknown Company'}
          </Button>
        );
      case 'status':
        return <TableStatusBadge status={value || opportunity.status} />;
      case 'stage':
        return (
          <StageDropdown 
            stage={value || opportunity.stage} 
            opportunityId={opportunity.id}
            onStageChange={handleStageChange}
            stages={stages}
          />
        );
      case 'amount':
      case 'forecastRevenue':
      case 'proposalAmount':
        return (
          <div className="font-medium text-gray-900 text-sm">
            {formatCurrency(value)}
          </div>
        );
      case 'probability':
        return (
          <div className="text-gray-700 text-sm">
            {value ? `${value}%` : ''}
          </div>
        );
      case 'assignedRep':
        return <UserAvatar user={value || opportunity.assignedRep} />;
      case 'closeDate':
      case 'projCloseDate':
      case 'actualCloseDate':
      case 'createdDate':
      case 'lastActivityDate':
        return (
          <div className="text-gray-700 text-sm">
            {formatDate(value)}
          </div>
        );
      case 'contactName':
      case 'product':
      case 'nextStep':
      case 'leadStatus':
      case 'description':
      case 'proposalId':
      case 'lossReason':
      case 'salesPresenter':
      case 'businessUnit':
      case 'createdBy':
      case 'opportunityType':
      case 'source':
      case 'lastActivity':
        return (
          <div className="text-gray-700 text-sm max-w-xs truncate" title={value || ''}>
            {value || ''}
          </div>
        );
      case 'opportunityId':
      case 'contactId':
        return (
          <div className="text-gray-700 text-sm">
            {value || ''}
          </div>
        );
      default:
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'number' && column.id.toLowerCase().includes('amount')) {
            return (
              <div className="font-medium text-gray-900 text-sm">
                {formatCurrency(value)}
              </div>
            );
          } else if (typeof value === 'string' && (column.id.toLowerCase().includes('date') || value.match(/^\d{4}-\d{2}-\d{2}/))) {
            return (
              <div className="text-gray-700 text-sm">
                {formatDate(value)}
              </div>
            );
          } else {
            return (
              <div className="text-gray-700 text-sm" title={String(value)}>
                {String(value)}
              </div>
            );
          }
        }
        
        return (
          <div className="text-gray-700 text-sm">
            -
          </div>
        );
    }
  };

  return (
    <TableRow 
      className={`transition-colors border-b border-gray-100 cursor-pointer select-none ${
        isSelected 
          ? 'bg-blue-50 hover:bg-blue-100' 
          : 'hover:bg-gray-50'
      }`}
      onClick={handleRowClick}
      onDoubleClick={handleRowDoubleClick}
      title="Click to select, double-click to edit"
    >
      <TableCell className="w-12 px-4 py-2.5">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(checked)}
          onClick={(e) => e.stopPropagation()}
          className="focus:ring-ocean-500"
        />
      </TableCell>
      {columnOrder.map((column) => (
        <TableCell
          key={column.id}
          className="px-4 py-2.5 text-sm border-r border-gray-50 last:border-r-0"
          style={{
            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
            minWidth: '120px'
          }}
        >
          {renderCellContent(column)}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default OpportunityTableRow;
