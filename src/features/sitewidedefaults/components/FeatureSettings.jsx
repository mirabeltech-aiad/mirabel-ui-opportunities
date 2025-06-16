import React, { useState, memo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tabList } from "../helpers/constants.helper";
import { useFeatureSettings } from "../context/Context";
import { useCirculationTypes } from "../hooks/useCirculationTypes";
import { AdManagement } from "./AdManagement";
import { AccountReceivable } from "./AccountReceivable";
import { Production } from "./Production";
import { CirculationSettings } from "./CirculationSettings";
import { ContactManagement } from "./ContactManagement";
import { CustomerPortal } from "./CustomerPortal";
import { UserSettings } from "./UserSettings";
import { Communications } from "./Communications";
import { GoogleCalendar } from "./GoogleCalendar";
import { MarketingManagerPackage } from "./MarketingManagerPackage";
import { Helpdesk } from "./Helpdesk";
import { MediaMateAI } from "./MediaMateAI";
import { EmailSettings } from "./EmailSettings";

function DashboardDemoPage() {
  const {
    state,
    handleToggle,
    handleInput,
    setNewSupplier,
    handleAddSupplier,
    handleRemoveSupplier,
    updateInventory,
    isLoading: apiLoading,
    error: apiError,
  } = useFeatureSettings();
  const [tabWindow, setTabWindow] = useState([0, 5]);
  const [activeTab, setActiveTab] = useState("adManagement");
  const {
    data: circulationTypes,
    isLoading: isTypesLoading,
    error: typesError,
  } = useCirculationTypes();

  const handlePrevTabs = () => {
    setTabWindow([tabWindow[0] - 1, tabWindow[1] - 1]);
  };

  const handleNextTabs = () => {
    setTabWindow([tabWindow[0] + 1, tabWindow[1] + 1]);
  };

  console.log("state",state );

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
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
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
        {/* Ad Management Tab */}
        <TabsContent value="adManagement" className="w-11/12 m-auto">
          <AdManagement />
        </TabsContent>

        {/* Account Receivable Settings */}
        <TabsContent value="accountReceivable" className="w-11/12 m-auto">
          <AccountReceivable />
        </TabsContent>

        {/* Production Tab */}
        <TabsContent value="production">
          <Production state={state} handleToggle={handleToggle} />
        </TabsContent>

        {/* Circulation Settings */}
        <TabsContent value="circulationSettings">
          <CirculationSettings
            state={state}
            handleInput={handleInput}
            circulationTypes={circulationTypes}
            isTypesLoading={isTypesLoading}
            typesError={typesError}
          />
        </TabsContent>

        {/* Contact Management Tab */}
        <TabsContent value="contact">
          <ContactManagement
            state={state}
            handleInput={handleInput}
            handleToggle={handleToggle}
          />
        </TabsContent>

        {/* Customer Portal Tab */}
        <TabsContent value="customerPortal">
          <CustomerPortal state={state} handleInput={handleInput} />
        </TabsContent>

        {/* User Settings Tab */}
        <TabsContent value="userSettings">
          <UserSettings state={state} handleToggle={handleToggle} />
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications">
          <Communications state={state} handleToggle={handleToggle} />
        </TabsContent>

        {/* Google Calendar Tab */}
        <TabsContent value="googleCalendar">
          <GoogleCalendar
            state={state}
            handleToggle={handleToggle}
            handleInput={handleInput}
          />
        </TabsContent>

        {/* Marketing Manager Package Settings */}
        <TabsContent value="marketingManagerPackageSettings">
          <MarketingManagerPackage state={state} handleInput={handleInput} />
        </TabsContent>

        {/* Helpdesk Tab */}
        <TabsContent value="helpdesk">
          <Helpdesk state={state} handleToggle={handleToggle} />
        </TabsContent>

        {/* Media MailKit Tab */}
        <TabsContent value="mediaMateAI">
          <MediaMateAI state={state} handleToggle={handleToggle} />
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="emailSettings">
          <EmailSettings state={state} handleToggle={handleToggle} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button variant="default">Save</Button>
      </div>
    </div>
  );
}

export default memo(DashboardDemoPage);
