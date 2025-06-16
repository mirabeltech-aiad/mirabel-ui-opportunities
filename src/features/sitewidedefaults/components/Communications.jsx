import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFeatureSettings } from "../context/Context";

function Communications() {
  const { state, handleToggle } = useFeatureSettings();
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Communications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Enable Campaign</Label>
          <Switch
            checked={state.campaign || false}
            onCheckedChange={() => handleToggle("campaign")}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Enable Mailing Manager</Label>
          <Switch
            checked={state.mailingManager || false}
            onCheckedChange={() => handleToggle("mailingManager")}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Enable Mailer</Label>
          <Switch
            checked={state.mailer || false}
            onCheckedChange={() => handleToggle("mailer")}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Enable Helpdesk</Label>
          <Switch
            checked={state.enableHelpdesk || false}
            onCheckedChange={() => handleToggle("enableHelpdesk")}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default Communications;
