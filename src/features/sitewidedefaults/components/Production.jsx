import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function Production({ state, handleToggle }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Production Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label className="mb-1 text-base font-semibold">
              Indesign + Digital Studio Plugin Access
            </Label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Download the Latest Version of the Plugin
            </a>
          </div>
          <Switch
            checked={state.IsIndesignEnabled || false}
            onCheckedChange={() => handleToggle("IsIndesignEnabled")}
          />
        </div>

        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label className="mb-1 text-base font-semibold">
              Default File Names
            </Label>
            <p className="text-sm text-left text-muted-foreground">
              Rename production file uploads using this pattern
              [Company~Product~Issue Name or Start Date~Production
              ID~Stage_Count]
            </p>
          </div>
          <Switch
            checked={state.IsFileRenameEnabled || false}
            onCheckedChange={() => handleToggle("IsFileRenameEnabled")}
          />
        </div>

        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label className="mb-1 text-base font-semibold">
              Indesign Plugin for Single Ad Indesign
            </Label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Download the Latest Version of the Plugin
            </a>
          </div>
          <Switch
            checked={state.IsSingleAdIndesignEnabled || false}
            onCheckedChange={() =>
              handleToggle("IsSingleAdIndesignEnabled")
            }
          />
        </div>
      </CardContent>
    </Card>
  );
} 