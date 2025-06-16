import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFeatureSettings } from "../context/Context";

function MediaMateAI() {
  const { state, handleToggle } = useFeatureSettings();
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Media Mate AI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Send Email</Label>
          <Switch
            checked={!!state.sendEmail}
            onCheckedChange={() => handleToggle("sendEmail")}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Company Notes</Label>
          <Switch
            checked={!!state.companyNote}
            onCheckedChange={() => handleToggle("companyNote")}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Sales Letters</Label>
          <Switch
            checked={!!state.salesLetters}
            onCheckedChange={() => handleToggle("salesLetters")}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Company Executive Info</Label>
          <Switch
            checked={!!state.companyExecutiveInfo}
            onCheckedChange={() => handleToggle("companyExecutiveInfo")}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Add Note</Label>
          <Switch
            checked={!!state.addNote}
            onCheckedChange={() => handleToggle("addNote")}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>AI Text Improver</Label>
          <Switch
            checked={!!state.aitextImprover}
            onCheckedChange={() => handleToggle("aitextImprover")}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Media Kit AI</Label>
          <Switch
            checked={!!state.mediaKitAI}
            onCheckedChange={() => handleToggle("mediaKitAI")}
          />
        </div>
      </CardContent>
    </Card>
  );
} 
export default MediaMateAI;