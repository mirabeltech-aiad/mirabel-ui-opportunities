import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function Helpdesk({ state, handleToggle }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Helpdesk Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label className="mb-1 text-base font-semibold" htmlFor="helpdesk">
              Enable Ticket
            </Label>
            <p className="text-sm text-left text-muted-foreground">
              Enable/disable access to new tech support ticket portal for site. Please refresh the entire site to see the changes after clicking the save button.
            </p>
          </div>
          <Switch
            checked={!!state.IsTicketEnabled}
            onCheckedChange={() => handleToggle("IsTicketEnabled")}
          />
        </div>
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label className="mb-1 text-base font-semibold" htmlFor="helpdesk">
              Enable Live Chat
            </Label>
            <p className="text-sm text-left text-muted-foreground">
              Enable/disable access to online tech support chat for this site. Please refresh the entire site to see the changes after clicking the save button.
            </p>
          </div>
          <Switch
            id="helpdesk"
            checked={!!state.IsChatEnabled}
            onCheckedChange={() => handleToggle("IsChatEnabled")}
          />
        </div>
      </CardContent>
    </Card>
  );
} 