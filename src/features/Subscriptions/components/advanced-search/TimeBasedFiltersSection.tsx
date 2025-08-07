
import FormSection from '@/components/forms/FormSection';
import { FloatingLabelInput } from '@/components';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface TimeBasedFiltersSectionProps {
  createdFrom: string;
  setCreatedFrom: (value: string) => void;
  createdTo: string;
  setCreatedTo: (value: string) => void;
  subscriptionStart: string;
  setSubscriptionStart: (value: string) => void;
  subscriptionEnd: string;
  setSubscriptionEnd: (value: string) => void;
  lastActivity: string;
  setLastActivity: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const TimeBasedFiltersSection: React.FC<TimeBasedFiltersSectionProps> = ({
  createdFrom,
  setCreatedFrom,
  createdTo,
  setCreatedTo,
  subscriptionStart,
  setSubscriptionStart,
  subscriptionEnd,
  setSubscriptionEnd,
  lastActivity,
  setLastActivity,
  isOpen,
  setIsOpen
}) => {
  return (
    <Accordion type="single" collapsible value={isOpen ? "time-filters" : ""} onValueChange={(value) => setIsOpen(value === "time-filters")}>
      <AccordionItem value="time-filters" className="transition-all duration-300 mb-2 data-[state=open]:bg-blue-50/30 data-[state=open]:border data-[state=open]:border-gray-200 data-[state=open]:rounded-lg hover:bg-blue-50/40">
        <AccordionTrigger className="py-4 px-4 font-medium transition-all duration-300 hover:no-underline hover:text-blue-700 data-[state=open]:text-blue-800 data-[state=open]:hover:bg-blue-50/20">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-yellow-500 rounded-full mr-3"></div>
            <span>Time-Based Filters</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4 pt-0 px-4">
          <div className="space-y-3">
            {/* Row 1: Account creation dates */}
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[160px]">
                <FloatingLabelInput
                  type="date"
                  label="Created From"
                  value={createdFrom}
                  onChange={setCreatedFrom}
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <FloatingLabelInput
                  type="date"
                  label="Created To"
                  value={createdTo}
                  onChange={setCreatedTo}
                />
              </div>
            </div>

            {/* Row 2: Subscription dates */}
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[160px]">
                <FloatingLabelInput
                  type="date"
                  label="Subscription Start"
                  value={subscriptionStart}
                  onChange={setSubscriptionStart}
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <FloatingLabelInput
                  type="date"
                  label="Subscription End"
                  value={subscriptionEnd}
                  onChange={setSubscriptionEnd}
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <FloatingLabelInput
                  type="date"
                  label="Last Activity Date"
                  value={lastActivity}
                  onChange={setLastActivity}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TimeBasedFiltersSection;
