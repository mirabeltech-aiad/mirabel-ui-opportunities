
import { Badge } from '@/components/ui/badge';
import FormSection from '@/components/forms/FormSection';
import { FloatingLabelInput } from '@/components';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface GeographicSectionProps {
  country: string;
  setCountry: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
  selectedRegions: string[];
  setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const GeographicSection: React.FC<GeographicSectionProps> = ({
  country,
  setCountry,
  state,
  setState,
  city,
  setCity,
  postalCode,
  setPostalCode,
  selectedRegions,
  setSelectedRegions,
  isOpen,
  setIsOpen
}) => {
  const regions = [
    { id: 'north-america', name: 'North America' },
    { id: 'europe', name: 'Europe' },
    { id: 'asia-pacific', name: 'Asia Pacific' },
    { id: 'latin-america', name: 'Latin America' },
    { id: 'middle-east', name: 'Middle East' },
    { id: 'africa', name: 'Africa' }
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
    <Accordion type="single" collapsible value={isOpen ? "geographic" : ""} onValueChange={(value) => setIsOpen(value === "geographic")}>
      <AccordionItem value="geographic" className="transition-all duration-300 mb-2 data-[state=open]:bg-blue-50/30 data-[state=open]:border data-[state=open]:border-gray-200 data-[state=open]:rounded-lg hover:bg-blue-50/40">
        <AccordionTrigger className="py-4 px-4 font-medium transition-all duration-300 hover:no-underline hover:text-blue-700 data-[state=open]:text-blue-800 data-[state=open]:hover:bg-blue-50/20">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-red-500 rounded-full mr-3"></div>
            <span>Geographic Filters</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4 pt-0 px-4">
          <div className="space-y-4">
            {/* Row 1: Location fields */}
            <div className="flex flex-wrap gap-2">
              <div className="flex-1 min-w-[140px]">
                <FloatingLabelInput
                  type="text"
                  label="Country"
                  value={country}
                  onChange={setCountry}
                  placeholder="United States"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <FloatingLabelInput
                  type="text"
                  label="State/Province"
                  value={state}
                  onChange={setState}
                  placeholder="California"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <FloatingLabelInput
                  type="text"
                  label="City"
                  value={city}
                  onChange={setCity}
                  placeholder="Los Angeles"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <FloatingLabelInput
                  type="text"
                  label="Postal Code"
                  value={postalCode}
                  onChange={setPostalCode}
                  placeholder="90210"
                />
              </div>
            </div>

            {/* Row 2: Regional selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Regions</label>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <Badge
                    key={region.id}
                    variant={selectedRegions.includes(region.id) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-blue-100 rounded-md"
                    onClick={() => toggleSelection(region.id, selectedRegions, setSelectedRegions)}
                  >
                    {region.name}
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

export default GeographicSection;
