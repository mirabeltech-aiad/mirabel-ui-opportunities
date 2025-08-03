
import { Badge } from '@/components/ui/badge';
import FormSection from '@/components/forms/FormSection';
import { FloatingLabelInput } from '@/components';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CategorizationSectionProps {
  subscriptionType: string;
  setSubscriptionType: (value: string) => void;
  selectedSegments: string[];
  setSelectedSegments: React.Dispatch<React.SetStateAction<string[]>>;
  selectedValueTiers: string[];
  setSelectedValueTiers: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLifecycleStages: string[];
  setSelectedLifecycleStages: React.Dispatch<React.SetStateAction<string[]>>;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const CategorizationSection: React.FC<CategorizationSectionProps> = ({
  subscriptionType,
  setSubscriptionType,
  selectedSegments,
  setSelectedSegments,
  selectedValueTiers,
  setSelectedValueTiers,
  selectedLifecycleStages,
  setSelectedLifecycleStages,
  paymentMethod,
  setPaymentMethod,
  isOpen,
  setIsOpen
}) => {
  const segments = [
    { id: 'enterprise', name: 'Enterprise' },
    { id: 'small-business', name: 'Small Business' },
    { id: 'individual', name: 'Individual' },
    { id: 'nonprofit', name: 'Non-Profit' },
    { id: 'education', name: 'Education' }
  ];

  const valueTiers = [
    { id: 'high-value', name: 'High Value' },
    { id: 'medium-value', name: 'Medium Value' },
    { id: 'low-value', name: 'Low Value' },
    { id: 'vip', name: 'VIP' }
  ];

  const lifecycleStages = [
    { id: 'trial', name: 'Trial' },
    { id: 'new', name: 'New Customer' },
    { id: 'active', name: 'Active' },
    { id: 'at-risk', name: 'At Risk' },
    { id: 'churned', name: 'Churned' }
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
    <Accordion type="single" collapsible value={isOpen ? "categorization" : ""} onValueChange={(value) => setIsOpen(value === "categorization")}>
      <AccordionItem value="categorization" className="transition-all duration-300 mb-2 data-[state=open]:bg-blue-50/30 data-[state=open]:border data-[state=open]:border-gray-200 data-[state=open]:rounded-lg hover:bg-blue-50/40">
        <AccordionTrigger className="py-4 px-4 font-medium transition-all duration-300 hover:no-underline hover:text-blue-700 data-[state=open]:text-blue-800 data-[state=open]:hover:bg-blue-50/20">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
            <span>Categorization & Segmentation</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4 pt-0 px-4">
          <div className="space-y-4">
            {/* Row 1: Subscription type and payment method */}
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[160px]">
                <FloatingLabelInput
                  type="text"
                  label="Subscription Type"
                  value={subscriptionType}
                  onChange={setSubscriptionType}
                  placeholder="Print, Digital, Premium"
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <FloatingLabelInput
                  type="text"
                  label="Payment Method"
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  placeholder="Credit Card, PayPal, Bank Transfer"
                />
              </div>
            </div>

            {/* Row 2: Customer Segments */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Customer Segments</label>
              <div className="flex flex-wrap gap-2">
                {segments.map((segment) => (
                  <Badge
                    key={segment.id}
                    variant={selectedSegments.includes(segment.id) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-blue-100 rounded-md"
                    onClick={() => toggleSelection(segment.id, selectedSegments, setSelectedSegments)}
                  >
                    {segment.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Row 3: Value Tiers */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Value Tiers</label>
              <div className="flex flex-wrap gap-2">
                {valueTiers.map((tier) => (
                  <Badge
                    key={tier.id}
                    variant={selectedValueTiers.includes(tier.id) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-blue-100 rounded-md"
                    onClick={() => toggleSelection(tier.id, selectedValueTiers, setSelectedValueTiers)}
                  >
                    {tier.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Row 4: Lifecycle Stages */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Lifecycle Stages</label>
              <div className="flex flex-wrap gap-2">
                {lifecycleStages.map((stage) => (
                  <Badge
                    key={stage.id}
                    variant={selectedLifecycleStages.includes(stage.id) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-blue-100 rounded-md"
                    onClick={() => toggleSelection(stage.id, selectedLifecycleStages, setSelectedLifecycleStages)}
                  >
                    {stage.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategorizationSection;
