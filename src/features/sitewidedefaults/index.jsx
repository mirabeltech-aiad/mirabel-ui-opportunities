import { FeatureSettingsProvider } from "./context/FeatureSettingsProvider";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tabList } from "./helpers/constants.helper";

export default function SiteWideDefaultsPage() {
  return (
    <FeatureSettingsProvider>
      <FeatureSettings />
    </FeatureSettingsProvider>
  );
}

function FeatureSettings() {

  const [tabWindow, setTabWindow] = useState([0, 5]);
  const [activeTab, setActiveTab] = useState("AdManagement");


  const handlePrevTabs = () => {
    setTabWindow([tabWindow[0] - 1, tabWindow[1] - 1]);
  };

  const handleNextTabs = () => {
    setTabWindow([tabWindow[0] + 1, tabWindow[1] + 1]);
  };

  return (
    <div className="px-4 py-2 mx-auto">
      <div className="sticky top-0 z-20 pb-2 bg-background">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="w-full"
        >
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevTabs}
              disabled={tabWindow[0] === 0}
              className="w-8 h-8"
              aria-label="Previous Tabs"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <TabsList className="flex flex-wrap gap-2 grow">
              {tabList.slice(tabWindow[0], tabWindow[1]).map((tab) => (
                <TabsTrigger key={tab.Value} value={tab.Value}>
                  {tab.Label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextTabs}
              disabled={tabWindow[1] >= tabList.length}
              className="w-8 h-8"
              aria-label="Next Tabs"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </Tabs>
      </div>

      

       <Tabs value={activeTab} className="w-full">
        {tabList.map((tab) => (
          <TabsContent key={tab.Value} value={tab.Value}>
            <tab.Component />
          </TabsContent>
        ))}
      </Tabs> 

      <div className="sticky bottom-0 flex justify-center py-3 bg-white shadow">
        <Button variant="default">Save</Button>
      </div>
    </div>
  );
}
