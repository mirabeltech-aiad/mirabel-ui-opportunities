import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCirculationTypes } from "../hooks/useService";
import { useFeatureSettings } from "../context/Context";

function CirculationSettings() {

  const {
    data: circulationTypes,
    isLoading: isTypesLoading,
    error: typesError,
  } = useCirculationTypes();
  
  const { state, handleInput } = useFeatureSettings();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Circulation Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-2 border-b">
          {/* Label and description on the left */}
          <div className="flex flex-col w-full md:w-2/3">
            <Label
              className="mb-1 text-base font-semibold"
              htmlFor="allow_quickbooks_xero_integration"
            >
              Default Subscription Type
            </Label>
            <p className="text-sm text-left text-muted-foreground">
              as the default subscription type for new subscriptions.
            </p>
          </div>

          {/* Actions on the right */}
          <div className="flex items-center justify-end w-auto gap-2 md:gap-4">
            {/* Dropdown */}
            <select
              id="subscription_type_dropdown"
              className="px-2 py-1 text-sm border rounded"
              value={state.SubscriptionTypeID || ""}
              onChange={(e) =>
                handleInput("SubscriptionTypeID", e.target.value)
              }
            >
              <option value="">Subscription Type</option>
              {isTypesLoading && <option>Loading...</option>}
              {typesError && <option>Error loading types</option>}
              {circulationTypes &&
                circulationTypes.map((type) => (
                  <option key={type.Value} value={type.Value}>
                    {type.Display}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CirculationSettings;
