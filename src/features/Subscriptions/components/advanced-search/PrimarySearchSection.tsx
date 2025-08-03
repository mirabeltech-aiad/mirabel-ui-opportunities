
import { FloatingLabelInput } from '@/components';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PrimarySearchSectionProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  customerName: string;
  setCustomerName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  customerId: string;
  setCustomerId: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const PrimarySearchSection: React.FC<PrimarySearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
  customerName,
  setCustomerName,
  email,
  setEmail,
  customerId,
  setCustomerId,
  phoneNumber,
  setPhoneNumber,
  status,
  setStatus,
  isOpen,
  setIsOpen
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <Accordion type="single" collapsible value={isOpen ? "primary-search" : ""} onValueChange={(value) => setIsOpen(value === "primary-search")}>
        <AccordionItem value="primary-search" className="border-none transition-all duration-300 data-[state=open]:bg-blue-50/30 data-[state=open]:rounded-lg">
          <AccordionTrigger className="py-4 px-4 font-medium transition-all duration-300 hover:no-underline hover:text-blue-700 data-[state=open]:text-blue-800 data-[state=open]:hover:bg-blue-50/20">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
              <span>Primary Search</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-0 px-4">
            <div className="space-y-3">
              {/* Row 1: Full-width global search */}
              <div className="w-full">
                <FloatingLabelInput
                  type="text"
                  label="Global Search *"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search across all fields..."
                  required
                />
              </div>

              {/* Row 2: Most frequently searched fields */}
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[180px]">
                  <FloatingLabelInput
                    type="text"
                    label="Customer Name"
                    value={customerName}
                    onChange={setCustomerName}
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <FloatingLabelInput
                    type="email"
                    label="Email Address"
                    value={email}
                    onChange={setEmail}
                    placeholder="customer@example.com"
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <FloatingLabelInput
                    type="text"
                    label="Customer ID"
                    value={customerId}
                    onChange={setCustomerId}
                    placeholder="CUST-001"
                  />
                </div>
              </div>

              {/* Row 3: Contact and status */}
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[160px]">
                  <FloatingLabelInput
                    type="tel"
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <FloatingLabelInput
                    type="text"
                    label="Status"
                    value={status}
                    onChange={setStatus}
                    placeholder="Active, Inactive, Trial"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PrimarySearchSection;
