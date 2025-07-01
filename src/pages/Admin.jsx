
import React from "react";
import MainNavbar from "@OpportunityComponents/MainNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComponentInventoryTab from "@/features/Opportunity/components/Admin/ComponentInventoryTab";
import DocumentationTab from "@/features/Opportunity/components/Admin/DocumentationTab";
import FieldMappingTab from "@/features/Opportunity/components/Admin/FieldMappingTab";
import SyncManagementTab from "@/features/Opportunity/components/Admin/SyncManagementTab";
import ImprovementsTab from "@/features/Opportunity/components/Admin/ImprovementsTab";
import RefactoringTab from "@/features/Opportunity/components/Admin/RefactoringTab";
import ColorSettingsTab from "@/features/Opportunity/components/Admin/ColorSettingsTab";

const Admin = () => {
  return (
    <div className="flex-1 flex flex-col bg-white w-full overflow-x-hidden">
      <MainNavbar />
      
      <div className="w-full px-4 py-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-ocean-800">Admin Panel</h1>
        </div>
        
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-blue-50 border-blue-200">
            <TabsTrigger value="inventory" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Inventory</TabsTrigger>
            <TabsTrigger value="documentation" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Documentation</TabsTrigger>
            <TabsTrigger value="field-mapping" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Field Mapping</TabsTrigger>
            <TabsTrigger value="sync-management" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Sync Management</TabsTrigger>
            <TabsTrigger value="improvements" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Improvements</TabsTrigger>
            <TabsTrigger value="refactoring" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Refactoring</TabsTrigger>
            <TabsTrigger value="colors" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Colors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="mt-6">
            <ComponentInventoryTab />
          </TabsContent>
          
          <TabsContent value="documentation" className="mt-6">
            <DocumentationTab />
          </TabsContent>
          
          <TabsContent value="field-mapping" className="mt-6">
            <FieldMappingTab />
          </TabsContent>
          
          <TabsContent value="sync-management" className="mt-6">
            <SyncManagementTab />
          </TabsContent>
          
          <TabsContent value="improvements" className="mt-6">
            <ImprovementsTab />
          </TabsContent>
          
          <TabsContent value="refactoring" className="mt-6">
            <RefactoringTab />
          </TabsContent>
          
          <TabsContent value="colors" className="mt-6">
            <ColorSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
