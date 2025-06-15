import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function GoogleCalendar({ state, handleToggle, handleInput }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Google Calendar Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Enable Google Calendar</Label>
          <Switch
            checked={state.googleCalendar || false}
            onCheckedChange={() => handleToggle("googleCalendar")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            value={state.googleCalendarApiKey || ""}
            onChange={(e) =>
              handleInput("googleCalendar", "apiKey", e.target.value)
            }
            placeholder="Enter your Google Calendar API Key"
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
} 