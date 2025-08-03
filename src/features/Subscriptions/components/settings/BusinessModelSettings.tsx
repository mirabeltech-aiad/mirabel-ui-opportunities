import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useBusinessModel } from '../../contexts/BusinessModelContext';
import { Building2, Zap, Info } from 'lucide-react';

const BusinessModelSettings: React.FC = () => {
  const { businessModel, setBusinessModel, isLoading } = useBusinessModel();

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-ocean-600" />
            Business Model Configuration
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-ocean-600" />
          Business Model Configuration
        </CardTitle>
        <CardDescription>
          Choose your business model to customize the platform experience and available reports
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <RadioGroup 
          value={businessModel} 
          onValueChange={(value) => setBusinessModel(value as 'saas' | 'media')}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Media Model */}
          <div className="relative">
            <RadioGroupItem value="media" id="media" className="peer sr-only" />
            <Label
              htmlFor="media"
              className={`flex flex-col p-6 border-2 rounded-lg cursor-pointer transition-all
                ${businessModel === 'media' 
                  ? 'border-ocean-500 bg-ocean-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-ocean-600" />
                  <span className="text-lg font-semibold text-gray-900">Media Company</span>
                </div>
                {businessModel === 'media' && (
                  <Badge variant="default" className="bg-ocean-500">Selected</Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Traditional media with print and digital publications, circulation tracking, and audit compliance.
              </p>
              
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Key Features:</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Circulation tracking & verification</li>
                  <li>• Audit bureau compliance (ABC, BPA, VAC)</li>
                  <li>• Postal compliance reporting</li>
                  <li>• Print & digital delivery management</li>
                  <li>• Geographic circulation analysis</li>
                </ul>
              </div>
            </Label>
          </div>

          {/* SaaS Model */}
          <div className="relative">
            <RadioGroupItem value="saas" id="saas" className="peer sr-only" />
            <Label
              htmlFor="saas"
              className={`flex flex-col p-6 border-2 rounded-lg cursor-pointer transition-all
                ${businessModel === 'saas' 
                  ? 'border-ocean-500 bg-ocean-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-purple-600" />
                  <span className="text-lg font-semibold text-gray-900">SaaS Company</span>
                </div>
                {businessModel === 'saas' && (
                  <Badge variant="default" className="bg-ocean-500">Selected</Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Software-as-a-Service business with digital subscriptions, user engagement, and feature analytics.
              </p>
              
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Key Features:</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• User engagement & retention metrics</li>
                  <li>• Feature adoption analytics</li>
                  <li>• API usage & performance tracking</li>
                  <li>• Subscription tier management</li>
                  <li>• Security & compliance reporting</li>
                </ul>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">What happens when you change this setting?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Reports will be automatically filtered to show only relevant templates</li>
                <li>• Dashboard metrics will adapt to your business model</li>
                <li>• Navigation and features will be optimized for your industry</li>
                <li>• You can change this setting at any time</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessModelSettings;