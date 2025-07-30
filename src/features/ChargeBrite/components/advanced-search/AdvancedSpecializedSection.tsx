
import { Badge } from '@/components/ui/badge';
import FormSection from '@/components/forms/FormSection';
import { FloatingLabelInput } from '@/components';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface AdvancedSpecializedSectionProps {
  campaignName: string;
  setCampaignName: (value: string) => void;
  promoCode: string;
  setPromoCode: (value: string) => void;
  supportTickets: string;
  setSupportTickets: (value: string) => void;
  notesComments: string;
  setNotesComments: (value: string) => void;
  selectedAcquisitionChannels: string[];
  setSelectedAcquisitionChannels: React.Dispatch<React.SetStateAction<string[]>>;
  fulfillmentStatus: string;
  setFulfillmentStatus: (value: string) => void;
  deliveryMethod: string;
  setDeliveryMethod: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const AdvancedSpecializedSection: React.FC<AdvancedSpecializedSectionProps> = ({
  campaignName,
  setCampaignName,
  promoCode,
  setPromoCode,
  supportTickets,
  setSupportTickets,
  notesComments,
  setNotesComments,
  selectedAcquisitionChannels,
  setSelectedAcquisitionChannels,
  fulfillmentStatus,
  setFulfillmentStatus,
  deliveryMethod,
  setDeliveryMethod,
  isOpen,
  setIsOpen
}) => {
  const acquisitionChannels = [
    { id: 'direct', name: 'Direct' },
    { id: 'social', name: 'Social Media' },
    { id: 'email', name: 'Email Marketing' },
    { id: 'referral', name: 'Referral' },
    { id: 'paid-ads', name: 'Paid Advertising' },
    { id: 'organic', name: 'Organic Search' },
    { id: 'content', name: 'Content Marketing' },
    { id: 'partnership', name: 'Partnership' }
  ];

  const toggleSelection = (
    id: string, 
    selected: string[], 
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <Accordion type="single" collapsible value={isOpen ? "advanced" : ""} onValueChange={(value) => setIsOpen(value === "advanced")}>
      <AccordionItem value="advanced" className="transition-all duration-300 mb-2 data-[state=open]:bg-blue-50/30 data-[state=open]:border data-[state=open]:border-gray-200 data-[state=open]:rounded-lg hover:bg-blue-50/40">
        <AccordionTrigger className="py-4 px-4 font-medium transition-all duration-300 hover:no-underline hover:text-blue-700 data-[state=open]:text-blue-800 data-[state=open]:hover:bg-blue-50/20">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
            <span>Advanced & Specialized Filters</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4 pt-0 px-4">
          <div className="space-y-4">
            {/* Row 1: Campaign and promo tracking */}
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[180px]">
                <FloatingLabelInput
                  type="text"
                  label="Campaign Name"
                  value={campaignName}
                  onChange={setCampaignName}
                  placeholder="Summer2024, BlackFriday"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <FloatingLabelInput
                  type="text"
                  label="Promo Code"
                  value={promoCode}
                  onChange={setPromoCode}
                  placeholder="SAVE20, WELCOME"
                />
              </div>
            </div>

            {/* Row 2: Operational fields */}
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[160px]">
                <FloatingLabelInput
                  type="text"
                  label="Fulfillment Status"
                  value={fulfillmentStatus}
                  onChange={setFulfillmentStatus}
                  placeholder="Pending, Shipped, Delivered"
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <FloatingLabelInput
                  type="text"
                  label="Delivery Method"
                  value={deliveryMethod}
                  onChange={setDeliveryMethod}
                  placeholder="Mail, Digital, Pickup"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <FloatingLabelInput
                  type="text"
                  label="Support Tickets"
                  value={supportTickets}
                  onChange={setSupportTickets}
                  placeholder="0, 1-5, 5+"
                />
              </div>
            </div>

            {/* Row 3: Acquisition Channels */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Acquisition Channels</label>
              <div className="flex flex-wrap gap-2">
                {acquisitionChannels.map((channel) => (
                  <Badge
                    key={channel.id}
                    variant={selectedAcquisitionChannels.includes(channel.id) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-blue-100 rounded-md"
                    onClick={() => toggleSelection(channel.id, selectedAcquisitionChannels, setSelectedAcquisitionChannels)}
                  >
                    {channel.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Row 4: Full-width notes field */}
            <div className="w-full">
              <FloatingLabelInput
                label="Notes & Comments"
                value={notesComments}
                onChange={setNotesComments}
                placeholder="Search in customer notes, support comments, and internal records..."
                isTextarea={true}
                rows={3}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdvancedSpecializedSection;
