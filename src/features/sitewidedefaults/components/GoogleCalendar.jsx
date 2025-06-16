import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function GoogleCalendar({ state, handleToggle, handleInput }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Google Calendar Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="apiKey">API Client ID</Label>
          <Input
            id="apiKey"
            value={state.ClientID || ""}
            onChange={(e) => handleInput("ClientID", e.target.value)}
            placeholder="Enter your Google Calendar API Key"
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="apiKey">API Client Secret</Label>
          <Input
            id="apiKey"
            value={state.ClientSecret || ""}
            onChange={(e) => handleInput("ClientSecret", e.target.value)}
            placeholder="Enter your Google Calendar API Key"
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default GoogleCalendar;