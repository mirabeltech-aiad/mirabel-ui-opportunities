
    import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteWideList } from "./hooks/useSiteWideList";

const initialSettings = {
  adManagement: {
    installmentBilling: true,
    multiplePublicationSelection: false,
    allowInsertions: true,
    allowAdjustments: false,
    allowProductionCharges: false,
    allowMultipleOrders: true,
    allowTestImpression: false,
    allowMoveOrders: false,
    requireProductFields: true,
    displayCreditLimit: false,
    creditLimitEnforced: false,
    creditLimitDays: '',
    defaultRepProposal: 'Logged in Rep',
    defaultRepOrder: 'Logged in Rep',
    proposalInventoryWarning: false,
    proposalStopProcessing: false,
    orderInventoryWarning: false,
    orderStopProcessing: false,
  },
  account: {
    batchUpdate: false,
    groupBy: false,
    chargeableSubscriptions: false,
    levelPricing: false,
    orderEntry: true,
    multiProposal: false,
    opportunity: false,
    emergencyBackup: false,
    digitalOrder: false,
    savePayment: false,
    paymentApproval: false,
    enableMultiCurrency: false,
  },
  production: {
    digitalStudio: false,
    enableProject: false,
  },
  contact: {
    allowJobEdit: false,
    callDisposition: false,
    displayReport: false,
    primaryContactSwitch: false,
    billingContact: false,
    enableCloud: false,
  },
  customerPortal: {
    enable: false,
  },
  userSettings: {
    restrictCustomerSearch: false,
    restrictCalendar: false,
    restrictProduct: false,
    enableEmailCapture: false,
    summaryEmail: false,
    marketingManager: false,
    repNotifications: false,
  },
  communications: {
    campaign: false,
    mailingManager: false,
    mailer: false,
    enableHelpdesk: false,
  },
  googleCalendar: {
    enable: false,
    apiKey: "",
  },
  helpdesk: {
    enable: false,
  },
  mediaMailKit: {
    sendLead: false,
    sendAd: false,
    sendEmail: false,
    enableKit: false,
  },
};

const tabList = [
  { value: "adManagement", label: "Ad Management" },
  { value: "account", label: "Account" },
  { value: "production", label: "Production" },
  { value: "contact", label: "Contact Management" },
  { value: "customerPortal", label: "Customer Portal" },
  { value: "userSettings", label: "User Settings" },
  { value: "communications", label: "Communications" },
  { value: "googleCalendar", label: "Google Calendar" },
  { value: "helpdesk", label: "Helpdesk" },
  { value: "mediaMailKit", label: "Media MailKit" },
];

// Settings metadata for headings and descriptions
const settingsMeta = {
  adManagement: [
    {
      key: "installmentBilling",
      heading: "Allow Installment Billing",
      description: "Set up your site to allow ad saltes to be split up for installment billing.",
    },
    {
      key: "multiplePublicationSelection",
      heading: "Allow Multiple Publication Selection",
      description: "Enable magazine manager site to allow multiple publications to be selected for ad sales and proposals.",
    },
    {
      key: "allowInsertions",
      heading: "Allow Insertions Scheduling",
      description: "Allow check box to default new ate cards as being 'Gross' rates, leave unchecked to default to 'Net' rates.",
    },
    {
      key: "deductGrossRateCard",
      heading: "Deduct as Gross Rate Card",
      description: "Allow surcharges on submissions to be created and added to ad invoices.",
    },
    {
      key: "allowAdjustments",
      heading: "Allow Net Adjustments",
      description: "Allow the user to pay the type in a Net amount, and have the system automatically apply a default charge or discount.",
    },
    {
      key: "allowProductionCharges",
      heading: "Allow Net Production Charges",
      description: "Allow the user to enter Production Chargees for Orders and Proposals.",
    },
    {
      key: "allowMultipleOrders",
      heading: "Allow Multiple Orders in Same Job Jacket",
      description: "Allow multiple orders on the same job jacket.",
    },
  ],
  // Add similar metadata for other sections as needed
};

export default function DashboardDemoPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [tabWindow, setTabWindow] = useState([0, 5]);
  const [activeTab, setActiveTab] = useState(tabList[0].value);
  const { data, isLoading, error } = useSiteWideList();

  console.log("datadatadatadatadata", data);

  const handleToggle = (section, key) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key],
      },
    }));
  };

  const handleInput = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handlePrevTabs = () => {
    setTabWindow(([start, end]) => {
      if (start === 0) return [0, 5];
      return [start - 1, end - 1];
    });
  };
  const handleNextTabs = () => {
    setTabWindow(([start, end]) => {
      if (end >= tabList.length) return [tabList.length - 5, tabList.length];
      return [start + 1, end + 1];
    });
  };

  return (
    <div className="container px-8 py-8 mx-auto">
      <div className="sticky top-0 z-20 pb-2 bg-background">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
      {/* Ad Management Tab */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="adManagement" className="m-auto max-w-4/5">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ad Management Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {settingsMeta.adManagement.map((item, idx) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between px-6 py-4 ${idx !== settingsMeta.adManagement.length - 1 ? 'border-b' : ''}`}
                >
                  <div className="flex flex-col items-start ">
                    <div className="mb-1 text-base font-semibold">{item.heading}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                  <Switch
                    checked={settings.adManagement[item.key] || false}
                    onCheckedChange={() => handleToggle("adManagement", item.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Additional Controls Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order & Inventory Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Credit Limit Control */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="creditLimitCheckbox" checked={settings.adManagement.creditLimitEnforced || false} onCheckedChange={() => handleToggle("adManagement", "creditLimitEnforced")} />
                  <Label htmlFor="creditLimitCheckbox" className="font-medium">Don't Allow Orders for Customers Over their Credit Limit</Label>
                </div>
                <div className="flex items-center gap-2 pl-6">
                  <span>Do not allow orders/insertions to be added into the system for clients that have an unpaid balance more than</span>
                  <Input type="number" min={0} className="w-16" value={settings.adManagement.creditLimitDays || ''} onChange={e => handleInput("adManagement", "creditLimitDays", e.target.value)} />
                  <span>days past due that are over their credit limit.</span>
                </div>
                <div className="pl-6 text-xs text-muted-foreground">*Admin users can still create insertions/orders.</div>
              </div>
              <Separator />
              {/* Default Sales Rep Dropdowns */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="defaultRepProposal" className="w-64">Default Sales Rep for Item Entry (Proposals)</Label>
                  <select
                    id="defaultRepProposal"
                    className="px-2 py-1 border rounded"
                    value={settings.adManagement.defaultRepProposal || 'Logged in Rep'}
                    onChange={e => handleInput("adManagement", "defaultRepProposal", e.target.value)}
                  >
                    <option value="Logged in Rep">Logged in Rep</option>
                    <option value="Unassigned">Unassigned</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="defaultRepOrder" className="w-64">Default Sales Rep for Item Entry (Order)</Label>
                  <select
                    id="defaultRepOrder"
                    className="px-2 py-1 border rounded"
                    value={settings.adManagement.defaultRepOrder || 'Logged in Rep'}
                    onChange={e => handleInput("adManagement", "defaultRepOrder", e.target.value)}
                  >
                    <option value="Logged in Rep">Logged in Rep</option>
                    <option value="Unassigned">Unassigned</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>
              <Separator />
              {/* Check Inventory Controls */}
              <div className="flex flex-col gap-2">
                <Label className="mb-1 font-medium">Check Inventory</Label>
                <div className="mb-2 text-xs text-muted-foreground">Check items against entered inventory limits when adding new items, editing existing items, converting proposals to orders or copying existing orders. Inventory limits are set by product/issue/adsize or product/adsize for products with no issues (i.e. digital only).</div>
                <div className="flex flex-col gap-4 md:flex-row">
                  {/* Proposal Items */}
                  <div className="border rounded p-3 flex-1 min-w-[220px]">
                    <div className="mb-2 font-semibold text-center">Proposal Items</div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="proposalInventoryWarning" checked={settings.adManagement.proposalInventoryWarning || false} onCheckedChange={() => handleToggle("adManagement", "proposalInventoryWarning")} />
                        <Label htmlFor="proposalInventoryWarning">Inventory Warning</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="proposalStopProcessing" checked={settings.adManagement.proposalStopProcessing || false} onCheckedChange={() => handleToggle("adManagement", "proposalStopProcessing")} />
                        <Label htmlFor="proposalStopProcessing">Stop Processing</Label>
                      </div>
                    </div>
                  </div>
                  {/* Orders */}
                  <div className="border rounded p-3 flex-1 min-w-[220px]">
                    <div className="mb-2 font-semibold text-center">Orders</div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="orderInventoryWarning" checked={settings.adManagement.orderInventoryWarning || false} onCheckedChange={() => handleToggle("adManagement", "orderInventoryWarning")} />
                        <Label htmlFor="orderInventoryWarning">Inventory Warning</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="orderStopProcessing" checked={settings.adManagement.orderStopProcessing || false} onCheckedChange={() => handleToggle("adManagement", "orderStopProcessing")} />
                        <Label htmlFor="orderStopProcessing">Stop Processing</Label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">If "Warning" is selected, a window with a warning will show before any new items are created, converted or copied; showing a summary of the inventory numbers with a link to the inventory report and a button to proceed with the entry despite the warning.<br/>If "Stop" is selected, the button to "Proceed" with the entry will not be available and the item cannot be created/copied/converted/etc. *Admin users can still add items even if they "Stop Processing" option is checked.</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Account Tab */}
        <TabsContent value="account">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Account Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Batch Update</Label>
                <Switch checked={settings.account.batchUpdate} onCheckedChange={() => handleToggle("account", "batchUpdate")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Group By</Label>
                <Switch checked={settings.account.groupBy} onCheckedChange={() => handleToggle("account", "groupBy")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Chargeable Subscriptions</Label>
                <Switch checked={settings.account.chargeableSubscriptions} onCheckedChange={() => handleToggle("account", "chargeableSubscriptions")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Level Pricing for Products</Label>
                <Switch checked={settings.account.levelPricing} onCheckedChange={() => handleToggle("account", "levelPricing")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Order Entry for Business</Label>
                <Switch checked={settings.account.orderEntry} onCheckedChange={() => handleToggle("account", "orderEntry")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Multi/Remix Opportunity for Proposals</Label>
                <Switch checked={settings.account.multiProposal} onCheckedChange={() => handleToggle("account", "multiProposal")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Opportunity for Proposals</Label>
                <Switch checked={settings.account.opportunity} onCheckedChange={() => handleToggle("account", "opportunity")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Emergency Backup Files</Label>
                <Switch checked={settings.account.emergencyBackup} onCheckedChange={() => handleToggle("account", "emergencyBackup")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Digital Order</Label>
                <Switch checked={settings.account.digitalOrder} onCheckedChange={() => handleToggle("account", "digitalOrder")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Save Payment Information</Label>
                <Switch checked={settings.account.savePayment} onCheckedChange={() => handleToggle("account", "savePayment")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Payment Approval</Label>
                <Switch checked={settings.account.paymentApproval} onCheckedChange={() => handleToggle("account", "paymentApproval")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Multi-Currency</Label>
                <Switch checked={settings.account.enableMultiCurrency} onCheckedChange={() => handleToggle("account", "enableMultiCurrency")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Production Tab */}
        <TabsContent value="production">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Production Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Digital Studio Project Access</Label>
                <Switch checked={settings.production.digitalStudio} onCheckedChange={() => handleToggle("production", "digitalStudio")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Project Access</Label>
                <Switch checked={settings.production.enableProject} onCheckedChange={() => handleToggle("production", "enableProject")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Contact Management Tab */}
        <TabsContent value="contact">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Allow Job # Edit</Label>
                <Switch checked={settings.contact.allowJobEdit} onCheckedChange={() => handleToggle("contact", "allowJobEdit")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Call Disposition</Label>
                <Switch checked={settings.contact.callDisposition} onCheckedChange={() => handleToggle("contact", "callDisposition")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Display Report</Label>
                <Switch checked={settings.contact.displayReport} onCheckedChange={() => handleToggle("contact", "displayReport")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Primary Contact Switch</Label>
                <Switch checked={settings.contact.primaryContactSwitch} onCheckedChange={() => handleToggle("contact", "primaryContactSwitch")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Billing Contact</Label>
                <Switch checked={settings.contact.billingContact} onCheckedChange={() => handleToggle("contact", "billingContact")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Cloud Communications</Label>
                <Switch checked={settings.contact.enableCloud} onCheckedChange={() => handleToggle("contact", "enableCloud")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Customer Portal Tab */}
        <TabsContent value="customerPortal">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Customer Portal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Customer Portal</Label>
                <Switch checked={settings.customerPortal.enable} onCheckedChange={() => handleToggle("customerPortal", "enable")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* User Settings Tab */}
        <TabsContent value="userSettings">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Restrict Customer Search</Label>
                <Switch checked={settings.userSettings.restrictCustomerSearch} onCheckedChange={() => handleToggle("userSettings", "restrictCustomerSearch")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Restrict Calendar Access</Label>
                <Switch checked={settings.userSettings.restrictCalendar} onCheckedChange={() => handleToggle("userSettings", "restrictCalendar")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Restrict Product Access</Label>
                <Switch checked={settings.userSettings.restrictProduct} onCheckedChange={() => handleToggle("userSettings", "restrictProduct")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Email Capture</Label>
                <Switch checked={settings.userSettings.enableEmailCapture} onCheckedChange={() => handleToggle("userSettings", "enableEmailCapture")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Summary Email Notifications</Label>
                <Switch checked={settings.userSettings.summaryEmail} onCheckedChange={() => handleToggle("userSettings", "summaryEmail")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Marketing Manager Notifications</Label>
                <Switch checked={settings.userSettings.marketingManager} onCheckedChange={() => handleToggle("userSettings", "marketingManager")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Rep Notifications</Label>
                <Switch checked={settings.userSettings.repNotifications} onCheckedChange={() => handleToggle("userSettings", "repNotifications")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Communications Tab */}
        <TabsContent value="communications">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Communications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Campaign</Label>
                <Switch checked={settings.communications.campaign} onCheckedChange={() => handleToggle("communications", "campaign")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Mailing Manager</Label>
                <Switch checked={settings.communications.mailingManager} onCheckedChange={() => handleToggle("communications", "mailingManager")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Mailer</Label>
                <Switch checked={settings.communications.mailer} onCheckedChange={() => handleToggle("communications", "mailer")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Helpdesk</Label>
                <Switch checked={settings.communications.enableHelpdesk} onCheckedChange={() => handleToggle("communications", "enableHelpdesk")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Google Calendar Tab */}
        <TabsContent value="googleCalendar">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Google Calendar Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Google Calendar</Label>
                <Switch checked={settings.googleCalendar.enable} onCheckedChange={() => handleToggle("googleCalendar", "enable")} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  value={settings.googleCalendar.apiKey}
                  onChange={(e) => handleInput("googleCalendar", "apiKey", e.target.value)}
                  placeholder="Enter your Google Calendar API Key"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Helpdesk Tab */}
        <TabsContent value="helpdesk">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Helpdesk Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Helpdesk</Label>
                <Switch checked={settings.helpdesk.enable} onCheckedChange={() => handleToggle("helpdesk", "enable")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Media MailKit Tab */}
        <TabsContent value="mediaMailKit">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Media MailKit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Send Lead as HTML</Label>
                <Switch checked={settings.mediaMailKit.sendLead} onCheckedChange={() => handleToggle("mediaMailKit", "sendLead")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Send Ad as HTML</Label>
                <Switch checked={settings.mediaMailKit.sendAd} onCheckedChange={() => handleToggle("mediaMailKit", "sendAd")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Send Email as HTML</Label>
                <Switch checked={settings.mediaMailKit.sendEmail} onCheckedChange={() => handleToggle("mediaMailKit", "sendEmail")} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Media MailKit</Label>
                <Switch checked={settings.mediaMailKit.enableKit} onCheckedChange={() => handleToggle("mediaMailKit", "enableKit")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end mt-8">
        <Button variant="default">Save</Button>
      </div>
    </div>
  );
}