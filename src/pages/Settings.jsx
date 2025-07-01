
import React from "react";
import MainNavbar from "@OpportunityComponents/MainNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEditMode } from "@/contexts/EditModeContext";
import BenchmarksTab from "@/features/Opportunity/components/Admin/BenchmarksTab";
import CustomFieldsTab from "@/features/Opportunity/components/Settings/CustomFieldsTab";

const Settings = () => {
  const { isEditMode, toggleEditMode } = useEditMode();

  return (
    <div className="flex-1 flex flex-col bg-white w-full overflow-x-hidden">
      <MainNavbar />
      
      <div className="w-full px-4 py-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-ocean-800">Settings</h1>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-blue-50 border-blue-200">
            <TabsTrigger value="general" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">General</TabsTrigger>
            <TabsTrigger value="custom-fields" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Custom Fields</TabsTrigger>
            <TabsTrigger value="benchmarks" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Benchmarks & Goals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-ocean-800">General Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="edit-mode" className="text-base font-medium">Edit Mode</Label>
                    <p className="text-sm text-gray-500">Enable edit mode to modify content directly</p>
                  </div>
                  <Switch
                    id="edit-mode"
                    checked={isEditMode}
                    onCheckedChange={toggleEditMode}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="custom-fields" className="mt-6">
            <CustomFieldsTab />
          </TabsContent>
          
          <TabsContent value="benchmarks" className="mt-6">
            <BenchmarksTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
