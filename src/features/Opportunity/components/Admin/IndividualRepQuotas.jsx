
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { Button } from "@OpportunityComponents/ui/button";
import { Input } from "@OpportunityComponents/ui/input";
import { Label } from "@OpportunityComponents/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@OpportunityComponents/ui/tooltip";
import { Users, Plus, Trash2, Info } from 'lucide-react';
import CurrencyInput from './CurrencyInput';

const IndividualRepQuotas = ({ benchmarks, updateBenchmark, onAddRep, onRemoveRep }) => {
  const [newRepName, setNewRepName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddRep = () => {
    if (newRepName.trim()) {
      onAddRep(newRepName.trim());
      setNewRepName('');
      setShowAddForm(false);
    }
  };

  const quotaTooltips = {
    'monthly-quota': 'Individual monthly sales target for this sales representative',
    'quarterly-quota': 'Individual quarterly sales target for this sales representative',
    'annual-quota': 'Individual annual sales target for this sales representative'
  };

  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base flex items-center gap-2 text-ocean-800">
              <Users className="h-4 w-4" />
              Individual Rep Quota Targets
            </CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Set specific revenue targets for each sales representative. These individual targets are used for performance tracking and compensation calculations.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-ocean-600 border-ocean-200 hover:bg-ocean-50 rounded-md"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Rep
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
        {/* Add New Rep Form */}
        {showAddForm && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter rep name"
                value={newRepName}
                onChange={(e) => setNewRepName(e.target.value)}
                className="flex-1 rounded-md"
                onKeyPress={(e) => e.key === 'Enter' && handleAddRep()}
              />
              <Button size="sm" onClick={handleAddRep} className="bg-ocean-500 hover:bg-ocean-600 text-white rounded-md">
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)} className="rounded-md">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Individual Rep Quotas */}
        {Object.entries(benchmarks.individualQuotas || {}).map(([repName, quotas]) => (
          <div key={repName} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">{repName}</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveRep(repName)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {Object.entries(quotas).map(([period, amount]) => (
                <div key={period} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-1">
                    <Label className="text-sm text-gray-700 font-medium">
                      {period.replace('-', ' ').toUpperCase()}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{quotaTooltips[period]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <CurrencyInput
                    value={amount}
                    onChange={(value) => updateBenchmark('individualQuotas', `${repName}.${period}`, value)}
                    className="w-36 h-8 text-center border-gray-300 focus:border-ocean-500 focus:ring-ocean-500 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(benchmarks.individualQuotas || {}).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No individual rep quotas configured yet.</p>
            <p className="text-sm">Click "Add Rep" to set individual quota targets.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndividualRepQuotas;
