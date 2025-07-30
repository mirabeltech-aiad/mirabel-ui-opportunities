

import { Calendar } from 'lucide-react';
import FormSection from '@/components/forms/FormSection';
import { FloatingLabelInput } from '@/components';

interface AdvancedOptionsSectionProps {
  notesComments: string;
  setNotesComments: (value: string) => void;
  createdFrom: string;
  setCreatedFrom: (value: string) => void;
  createdTo: string;
  setCreatedTo: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  resultsPerPage: string;
  setResultsPerPage: (value: string) => void;
  exportFormat: string;
  setExportFormat: (value: string) => void;
}

const AdvancedOptionsSection: React.FC<AdvancedOptionsSectionProps> = ({
  notesComments,
  setNotesComments,
  createdFrom,
  setCreatedFrom,
  createdTo,
  setCreatedTo,
  sortBy,
  setSortBy,
  resultsPerPage,
  setResultsPerPage,
  exportFormat,
  setExportFormat
}) => {
  return (
    <FormSection title="Advanced Options" icon={<Calendar className="h-5 w-5" />}>
      <div className="space-y-3">
        {/* Row 1: Full-width textarea for notes */}
        <div className="w-full">
          <FloatingLabelInput
            label="Notes & Comments"
            value={notesComments}
            onChange={setNotesComments}
            placeholder="Search in notes and comments..."
            isTextarea={true}
            rows={3}
          />
        </div>

        {/* Row 2: All settings fields optimally sized */}
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[130px]">
            <FloatingLabelInput
              type="date"
              label="From Date"
              value={createdFrom}
              onChange={setCreatedFrom}
            />
          </div>
          <div className="flex-1 min-w-[130px]">
            <FloatingLabelInput
              type="date"
              label="To Date"
              value={createdTo}
              onChange={setCreatedTo}
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <FloatingLabelInput
              type="text"
              label="Sort By"
              value={sortBy}
              onChange={setSortBy}
              placeholder="Date, Name, Relevance"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <FloatingLabelInput
              type="number"
              label="Results Per Page"
              value={resultsPerPage}
              onChange={setResultsPerPage}
              placeholder="25"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <FloatingLabelInput
              type="text"
              label="Export Format"
              value={exportFormat}
              onChange={setExportFormat}
              placeholder="CSV, Excel, PDF"
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default AdvancedOptionsSection;
