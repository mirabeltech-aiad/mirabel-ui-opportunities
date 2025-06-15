import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function UserSettings({ state, handleToggle }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>User Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label className="font-semibold">Restrict Customer Search to Allowed Reps Only</Label>
            <span className="text-sm text-muted-foreground">Users can only search for clients assigned to reps that they have set been set up to view in additional security access.</span>
          </div>
          <Switch
            checked={!!state.LimitCustomerSearchByRep}
            onCheckedChange={() => handleToggle('LimitCustomerSearchByRep')}
          />
        </div>
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label className="font-semibold">Restrict Customer Add to Allowed Reps Only</Label>
            <span className="text-sm text-muted-foreground">Users can add clients and assign them to reps that they have set been set up to view in additional security access.</span>
          </div>
          <Switch
            checked={!!state.LimitCustomerAddByRep}
            onCheckedChange={() => handleToggle('LimitCustomerAddByRep')}
          />
        </div>
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label className="font-semibold">Restrict Calendar Viewing to Allowed Reps Only</Label>
            <span className="text-sm text-muted-foreground">Users can only view calendars of other users that they have set been set up to view in additional security access.</span>
          </div>
          <Switch
            checked={!!state.LimitCalendarByRep}
            onCheckedChange={() => handleToggle('LimitCalendarByRep')}
          />
        </div>
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label className="font-semibold">Allow Non Admin Users to Add to Calendar</Label>
            <span className="text-sm text-muted-foreground">Allow users who are not site administrators to add items to other calendars, if not set only admin users can add items to other user's calendars.</span>
          </div>
          <Switch
            checked={!!state.AllowNonAdminAddToCalendar}
            onCheckedChange={() => handleToggle('AllowNonAdminAddToCalendar')}
          />
        </div>
        <div className="flex items-center justify-between p-2">
          <div className="flex flex-col items-start">
            <Label className="font-semibold">Filter/Restrict Contact Page Items by Product</Label>
            <span className="text-sm text-muted-foreground">Users/Reps with product security set will only see items (orders, proposals, invoices etc.) summaries for products they have specific access for.</span>
          </div>
          <Switch
            checked={!!state.IsOrderListSecurityEnabled}
            onCheckedChange={() => handleToggle('IsOrderListSecurityEnabled')}
          />
        </div>
      </CardContent>
    </Card>
  );
} 