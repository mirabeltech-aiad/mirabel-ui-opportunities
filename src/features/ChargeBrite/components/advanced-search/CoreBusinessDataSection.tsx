
import FormSection from '@/components/forms/FormSection';
import { FloatingLabelInput } from '@/components';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CoreBusinessDataSectionProps {
  revenueMin: string;
  setRevenueMin: (value: string) => void;
  revenueMax: string;
  setRevenueMax: (value: string) => void;
  ltvMin: string;
  setLtvMin: (value: string) => void;
  ltvMax: string;
  setLtvMax: (value: string) => void;
  subscriptionPrice: string;
  setSubscriptionPrice: (value: string) => void;
  churnRiskScore: string;
  setChurnRiskScore: (value: string) => void;
  engagementScore: string;
  setEngagementScore: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const CoreBusinessDataSection: React.FC<CoreBusinessDataSectionProps> = ({
  revenueMin,
  setRevenueMin,
  revenueMax,
  setRevenueMax,
  ltvMin,
  setLtvMin,
  ltvMax,
  setLtvMax,
  subscriptionPrice,
  setSubscriptionPrice,
  churnRiskScore,
  setChurnRiskScore,
  engagementScore,
  setEngagementScore,
  isOpen,
  setIsOpen
}) => {
  return (
    <Accordion type="single" collapsible value={isOpen ? "business-data" : ""} onValueChange={(value) => setIsOpen(value === "business-data")}>
      <AccordionItem value="business-data" className="transition-all duration-300 mb-2 data-[state=open]:bg-blue-50/30 data-[state=open]:border data-[state=open]:border-gray-200 data-[state=open]:rounded-lg hover:bg-blue-50/40">
        <AccordionTrigger className="py-4 px-4 font-medium transition-all duration-300 hover:no-underline hover:text-blue-700 data-[state=open]:text-blue-800 data-[state=open]:hover:bg-blue-50/20">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-yellow-500 rounded-full mr-3"></div>
            <span>Core Business Data</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4 pt-0 px-4">
          <div className="space-y-3">
            {/* Row 1: Revenue ranges */}
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[140px]">
                <FloatingLabelInput
                  type="number"
                  label="Min Revenue ($)"
                  value={revenueMin}
                  onChange={setRevenueMin}
                  placeholder="0"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <FloatingLabelInput
                  type="number"
                  label="Max Revenue ($)"
                  value={revenueMax}
                  onChange={setRevenueMax}
                  placeholder="10000"
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <FloatingLabelInput
                  type="number"
                  label="Subscription Price ($)"
                  value={subscriptionPrice}
                  onChange={setSubscriptionPrice}
                  placeholder="29.99"
                />
              </div>
            </div>

            {/* Row 2: LTV and scoring */}
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[140px]">
                <FloatingLabelInput
                  type="number"
                  label="Min LTV ($)"
                  value={ltvMin}
                  onChange={setLtvMin}
                  placeholder="100"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <FloatingLabelInput
                  type="number"
                  label="Max LTV ($)"
                  value={ltvMax}
                  onChange={setLtvMax}
                  placeholder="5000"
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <FloatingLabelInput
                  type="text"
                  label="Churn Risk Score"
                  value={churnRiskScore}
                  onChange={setChurnRiskScore}
                  placeholder="Low, Medium, High"
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <FloatingLabelInput
                  type="number"
                  label="Engagement Score"
                  value={engagementScore}
                  onChange={setEngagementScore}
                  placeholder="1-100"
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CoreBusinessDataSection;
