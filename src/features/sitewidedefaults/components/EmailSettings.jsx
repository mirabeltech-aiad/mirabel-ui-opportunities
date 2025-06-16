import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function EmailSettings({ state, handleToggle }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label className="font-semibold">Enable Email Capture</Label>
            <span className="text-sm text-muted-foreground">Enable/Disable Email Capture feature</span>
          </div>
          <Switch
            checked={!!state.IsBccFeatureEnabled}
            onCheckedChange={() => handleToggle('IsBccFeatureEnabled')}
          />
        </div>
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label className="font-semibold">Summary Email Notifications</Label>
            <span className="text-sm text-muted-foreground">Enable/Disable Summary Email Notifications</span>
          </div>
          <Switch
            checked={!!state.IsCESummaryEmail}
            onCheckedChange={() => handleToggle('IsCESummaryEmail')}
          />
        </div>
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label className="font-semibold">Marketing Manager Notifications</Label>
            <span className="text-sm text-muted-foreground">Enable/Disable Marketing Manager Notifications, Please contact the Marketing Manager team to make sure this client has been set up before enabling this feature here.</span>
            <span className="mt-1 text-xs text-muted-foreground">*Note: if "Marketing Manager Notifications" feature is disabled, all? of the marketing manager notification settings for all users will be removed and will have to be re-added after enabling this feature again.</span>
          </div>
          <Switch
            checked={!!state.IsMarketingManagerNotifications}
            onCheckedChange={() => handleToggle('IsMarketingManagerNotifications')}
          />
        </div>
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label className="font-semibold">Tracking Code</Label>
            <span className="text-sm text-muted-foreground">This will allow us to track replies/Links from Emails that we sent from Mailing List Wizard</span>
          </div>
          <Switch
            checked={!!state.IsTrackingCodeEnabled}
            onCheckedChange={() => handleToggle('IsTrackingCodeEnabled')}
          />
        </div>
        <div className="flex items-center justify-between p-2">
          <div className="flex flex-col items-start">
            <Label className="font-semibold">Rep Notifications From Marketing Manager</Label>
            <span className="text-sm text-muted-foreground">Send Rep Notifications through Marketing Manager</span>
          </div>
          <Switch
            checked={!!state.IsRepNotificationsEnabled}
            onCheckedChange={() => handleToggle('IsRepNotificationsEnabled')}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default EmailSettings;