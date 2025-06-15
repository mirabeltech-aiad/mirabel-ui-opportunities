import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function CustomerPortal({ state, handleInput }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Customer Portal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-2">
          <Label className="font-semibold" htmlFor="customerPortal-enable">
            Enable Customer Portal for client?
          </Label>
          <Switch
            id="customerPortal-enable"
            checked={!!state.CustomerPortalDetails?.IsEnabled}
            onCheckedChange={() => handleInput("CustomerPortalDetails", { ...state.CustomerPortalDetails, IsEnabled: !state.CustomerPortalDetails?.IsEnabled })}
          />
        </div>
        {state.CustomerPortalDetails?.IsEnabled && (
          <div className="p-2 text-sm text-muted-foreground">
            Note: You can send contacts this link to let them sign up for access to the portal: "http://tier1-portal2.mirabeltechnologies.com/signup/9970"
          </div>
        )}
      </CardContent>
    </Card>
  );
} 