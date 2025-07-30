
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpTooltip } from '../../../components';

const ExpirationActionItems: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-ocean-800 flex items-center gap-1">
          Recommended Actions
          <HelpTooltip helpId="expiration-action-items" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-red-600">Urgent (30 Days)</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Send immediate renewal reminders to manual subscribers</li>
                <li>• Verify auto-renewal payment methods</li>
                <li>• Escalate high-value accounts to retention team</li>
                <li>• Prepare special offers for hesitant renewers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-orange-600">Medium Priority (60 Days)</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Begin renewal campaign sequences</li>
                <li>• Update subscriber preferences and contact info</li>
                <li>• Offer subscription upgrades or bundles</li>
                <li>• Schedule account manager check-ins</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpirationActionItems;
