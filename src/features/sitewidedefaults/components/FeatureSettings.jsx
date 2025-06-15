import React, { useState, memo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { tabList } from "../helpers/constants.helper";
import { useFeatureSettings } from "../context/Context";
import { useCirculationTypes } from "../hooks/useCirculationTypes";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { AdManagement } from './AdManagement';
import { AccountReceivable } from './AccountReceivable';
import { Production } from './Production';
import { CirculationSettings } from './CirculationSettings';
import { ContactManagement } from './ContactManagement';
// Settings metadata for headings and descriptions
const settingsMeta = {
  adManagement: [
    {
      key: "IsInstallmentBillingEnabled",
      label: "Allow Installment Billing",
      description:
        "Set up your magazine manager site to allow ad sales to be split up for installment billing.",
    },
    {
      key: "IsMultiplePubsEnabled",
      label: "Allow Multiple Publication Selection",
      description:
        "Set up your magazine manager site for multiple publications to be selected for ad sales and proposals.",
    },
    {
      key: "IsDefaultToGrossRateCardEnabled",
      label: "Default to Gross Rate Card",
      description:
        "Check this box to default new rate cards as being 'Gross' rates, leave unchecked to default to 'Net' rates.",
      enabled: false,
    },
    {
      key: "IsSurchargesEnabled",
      label: "Allow Insertion Surcharges and Discounts",
      description:
        "Allow surcharges and discounts to be created and added to ad sales and proposals.",
    },
    {
      key: "AllowNetAdjustments",
      label: "Allow Net Adjustments",
      description:
        "Allow the user to type in a Net amount, and have the system automatically apply a default charge or discount.",
    },
    {
      key: "AllowProductionCharges",
      label: "Allow Production Charges",
      description:
        "Allow the user to enter Production Charges for Orders and Proposals.",
    },
    {
      key: "IsSharedJobJacketEnabled",
      label: "Shared Job Jacket",
      description: "Allow multiple orders on the same job jacket.",
    },
    {
      key: "IsTextImageEnabled",
      label: "TextImage Tab",
      description:
        "Allow TextImage Changes in JobJacket. Note: This will not affect the invoice or quantity on order. It will just allow to change the text/image in the job jacket.",
    },
    {
      key: "IsESignature",
      label: "eSignature",
      description:
        "Enable electronic signing of documents using RightSignature.",
      enabled: false,
    },
    {
      key: "IsEnableBatchOrderUpdate",
      label: "Batch Update",
      description: "Enable Batch Update.",
      enabled: false,
    },
    {
      key: "IsGroupBuyEnabled",
      label: "Group Buy",
      description: "Enable Group Buy.",
      enabled: false,
    },
    {
      key: "IsSubscriptionEnabled",
      label: "ChargeBrite Subscriptions",
      description: "Enable the ChargeBrite application on your site.",
      enabled: false,
    },
    {
      key: "AllowLevelPricingForMultipleProduct",
      label: "Level Pricing for Multiple Products",
      description:
        "Allow users to enter different rates when adding multiple products to an order buy.",
      enabled: false,
    },
    {
      key: "IsOrderEntryByBusinessUnit",
      label: "Order Entry by Business Unit",
      description:
        "Start the order entry process by selecting a business unit.",
      enabled: false,
    },
    {
      key: "IsProposalPageLinkOppEnabled",
      label: "Add/Link an Opportunity to Proposals",
      description:
        "Display a Button to link a proposal to an existing opportunity or create a new one for the proposal.",
      enabled: false,
    },
    {
      key: "IsProposalPageLinkRequireOppEnabled",
      label: "Require Opportunity for Proposal",
      description:
        "Require an Opportunity to be created or linked in order to save a proposal.",
      enabled: false,
    },
    {
      key: "IsEmergencyBackUpEnabled",
      label: "Emergency Backup",
      description:
        "This feature will enable the Emergency Backup Plan, which uploads data backup files of specific features to destinations such as Google Drive, Dropbox, FTP etc.",
      enabled: false,
    },
    {
      key: "IsInternalApprovalEnabled",
      label: "Enable Internal Approval",
      description: "Set Up Internal Approval Process.",
      enabled: false,
    },
    {
      key: "IsSplitRepChangeOrder",
      label: "Commissioned Rep Change",
      description: "Change Commissioned Rep with Change Order only.",
      enabled: false,
    },
    {
      key: "IsChargebriteMediaOrderEnabled",
      label: "ChargeBrite Media Orders",
      description:
        "Enable the ChargeBrite Media Orders application on your site.",
      enabled: false,
    },
    {
      key: "CaptureCCProfileOnProposalApproval",
      label: "Save Payment Information On Proposal Approval",
      description:
        "Selecting this checkbox will allow customers to store their payment information through a new 'Update Card Details' modal window that opens upon signing and approving the proposal.",
      enabled: false,
    },
    {
      key: "IsMoveContractsEnabled",
      label: "Allow Non-Admins to Move Orders",
      description:
        "Allow Reps to move Orders from one contact record to another.",
    },
    {
      key: "IsContactReqFieldsEnabled",
      label: "Required Fields during Add Contact",
      description: "Required Fields must be filled in to add a new contact.",
    },
    {
      key: "InvPropCheck",
      label: "Proposal Inventory Warning",
      description:
        "Show a warning before creating, converting, or copying proposals if inventory limits are exceeded.",
    },
    {
      key: "StopInvPropFail",
      label: "Proposal Stop Processing",
      description:
        "Prevent proposal creation/copy/convert if inventory limits are exceeded (Admins can override).",
    },
    {
      key: "InvCheck",
      label: "Order Inventory Warning",
      description:
        "Show a warning before creating, converting, or copying orders if inventory limits are exceeded.",
    },
    {
      key: "StopInvFail",
      label: "Order Stop Processing",
      description:
        "Prevent order creation/copy/convert if inventory limits are exceeded (Admins can override).",
    },
    {
      key: "IsShowAmountOnInventoryReport",
      label: "Show Amount on Inventory Report",
      description: "Display the amount on the inventory report.",
    },
    {
      key: "RsKey",
      label: "RightSignature API Key",
      description: "API Key for RightSignature integration.",
      input: true,
    },
  ],
  accountReceivable: [
    {
      key: "InvoiceVoidAdminOnly",
      label: "Void Invoices - Admin Only",
      description: "Only admin users can unlock and void invoices.",
    },
    {
      key: "CInvoiceByDefault",
      label: "Consolidate Invoices by Default",
      description:
        "By default, invoices for a single billing contact will be consolidated into a single invoice during invoice creation. If not selected, there is still an option to consolidate invoices as needed on the invoice creation screen.",
    },
    {
      key: "StatementsPerBillingContact",
      label: "Statements Per Billing Contact",
      description:
        "Create statements per billing contact. If selected, pre-payments will NOT show on statements since these cannot be posted per billing contact (only per customer); once prepayments are applied to an invoice, they will show on the statements. If not selected, the statements will be created per customer.",
    },
    {
      key: "IsMagazineVisible",
      label: "Allow Magazine Drop Down in Statement",
      description:
        "Allow user to Enable/Disable the Magazine Drop Down for Statement Search.",
    },
    {
      key: "IsMirabelEmailTransSendEnabled",
      label: "Email from Marketing Manager",
      description:
        "Invoice, Statement and Proposal Emails will be sent via Marketing Manager.",
    },
    {
      key: "IsInvoicePdfEnabled",
      label: "Allow Invoice Pdf as Attachment",
      description:
        "Enable this option to send invoices as PDF attachments via email.",
    },
    {
      key: "IsFinanceChargesEnabled",
      label: "Finance Charges",
      description:
        "Adding finance charges to the selected invoice will create a separate misc. charge invoice for each selected invoices for the percentage of the total or the amount entered. The original invoices will not be changed. These new finance charge invoices can be seen in customer statements.",
    },
    {
      key: "IsPaymentPlanEnabled",
      label: "Payment Plans",
      description:
        "Allow users to set up payment plans on this site. This allows the application to create a set of installments for items grouped together on a proposal. These layer over the actual invoices to better control the amounts and dates for receivables and payments. *Note: Can't disable if any Payment Plans exist.",
    },
    {
      key: "IsARScheduleInvoiceEnabled",
      label: "Enable Schedule Invoices",
      description:
        "This feature will enable the option to schedule invoice creation based on the specified criteria.",
    },
    {
      key: "IsARSchedulePaymentEnabled",
      label: "Enable Schedule Payments",
      description:
        "This feature will enable the option to schedule payment creation based on the specified criteria.",
    },
  ],
};

const pickupFromOptions = [
  { value: "ProductName", label: "Product Name" },
  { value: "IssueName", label: "Issue Name" },
  { value: "IssueYear", label: "Issue Year" },
  { value: "AdSize", label: "Ad Size" },
  { value: "AdName", label: "Ad Name" },
  // Add more as needed
];



const packageTypeOptions = [
  { value: "Trial", label: "Trial" },
  { value: "CRM", label: "CRM" },
  { value: "CRM + MKM", label: "CRM + MKM" },
  { value: "Other CRM Int + DATA", label: "Other CRM Int + DATA" },
  { value: "CRM + DATA", label: "CRM + DATA" },
  { value: "CRM + MKM + DATA", label: "CRM + MKM + DATA" },
];

// Descriptions for each package type
const packageTypeDescriptions = {
  Trial: "Trial Version",
  CRM: "CRM/MagazineManager Only",
  "CRM + MKM": "CRM, Marketing Manager Reports and Content Analytics",
  "Other CRM Int + DATA": "Browser Extension with third party CRM Integration",
  "CRM + DATA": "CRM, Prospecting Dashboard and Browser Extension with data restrictions",
  "CRM + MKM + DATA": "CRM, Marketing Manager Reports, Prospecting Dashboard with data restriction and Browser Extension with data restrictions",
};

// Which package types show the Data Pack section
const showDataPackTypes = [
  "Other CRM Int + DATA",
  "CRM + DATA",
  "CRM + MKM + DATA",
];

const dataPackTypeOptions = [
  { value: "Basic", label: 150 },
  { value: "Standard", label: 300 },
  { value: "Enterprise", label: 1000 },
];

const pickupOptions = [
  { Key: "", Description: "", Script: "''" },
  {
    Key: "ProductName",
    Description: "Product Name",
    Script: "ISNULL(gsPublications.PubName,'')",
  },
  {
    Key: "Description",
    Description: "Description",
    Script: "ISNULL(gsContracts.Description,'')",
  },
  {
    Key: "IssueName",
    Description: "Issue Name",
    Script: "ISNULL(tblMagFrequency.IssueName,'')",
  },
  {
    Key: "IssueYear",
    Description: "Issue Year",
    Script: "ISNULL(CONVERT(VARCHAR,tblMagFrequency.IssueYear),'')",
  },
  {
    Key: "IssueDate",
    Description: "Issue Date",
    Script: "ISNULL(CONVERT(VARCHAR,tblMagFrequency.IssueDate,101),'')",
  },
  {
    Key: "AdSize",
    Description: "Ad Size",
    Script: "ISNULL(gsAdSize.AdSizeName,'')",
  },
  {
    Key: "Frequency",
    Description: "Frequency",
    Script: "ISNULL(gsContracts.Frequency,'')",
  },
  {
    Key: "Color",
    Description: "Color",
    Script: "ISNULL(gsContracts.Color,'')",
  },
  {
    Key: "Position",
    Description: "Position",
    Script: "ISNULL(gsContracts.PosReq1,'')",
  },
  {
    Key: "Section",
    Description: "Section",
    Script: "ISNULL(gsPubSections.SectionName,'')",
  },
  {
    Key: "AdName",
    Description: "Ad Name",
    Script: "ISNULL(gsContracts.AdName,'')",
  },
];



function DummyPackageDetailsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">Package Type</th>
            <th className="px-2 py-1 border">Data Pack Type</th>
            <th className="px-2 py-1 border">Base Data Pack Count</th>
            <th className="px-2 py-1 border">Effective count of Data Packs</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-2 py-1 font-bold border">Trial</td>
            <td className="px-2 py-1 border">N/A</td>
            <td className="px-2 py-1 border">N/A</td>
            <td className="px-2 py-1 border">N/A</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function DummyUsersWithDataPacksTable() {
  return (
    <div className="overflow-x-auto">
      <div className="mb-2 font-semibold">Count of Active packs2</div>
      <table className="min-w-full text-sm border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">User</th>
            <th className="px-2 py-1 border">Assigned Date</th>
            <th className="px-2 py-1 border">Disabled Date</th>
            <th className="px-2 py-1 border">Data Pack Enabled</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-2 py-1 border">-</td>
            <td className="px-2 py-1 border">-</td>
            <td className="px-2 py-1 border">-</td>
            <td className="px-2 py-1 border">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

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
  console.log("circulationTypes", circulationTypes);
  const handlePrevTabs = () => {
    setTabWindow([tabWindow[0] - 1, tabWindow[1] - 1]);
  };

  const handleNextTabs = () => {
    setTabWindow([tabWindow[0] + 1, tabWindow[1] + 1]);
  };

  console.log("ststatestatestateate", state,activeTab);
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
          <TabsContent value="storeSupply" className="p-0">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Inventory Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apiLoading ? (
                    <div>Loading inventory settings...</div>
                  ) : apiError ? (
                    <div>
                      Error loading inventory settings: {apiError.message}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="track-inventory">Track Inventory</Label>
                        <Switch
                          id="track-inventory"
                          checked={state.storeSupply?.trackInventory || false}
                          onCheckedChange={() =>
                            updateInventory({
                              trackInventory:
                                !state.storeSupply?.trackInventory,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="low-stock-alert">
                          Low Stock Alerts
                        </Label>
                        <Switch
                          id="low-stock-alert"
                          checked={state.storeSupply?.lowStockAlert || false}
                          onCheckedChange={() =>
                            updateInventory({
                              lowStockAlert: !state.storeSupply?.lowStockAlert,
                            })
                          }
                          disabled={!state.storeSupply?.trackInventory}
                        />
                      </div>

                      {state.storeSupply?.lowStockAlert && (
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="threshold">Low Stock Threshold</Label>
                          <Input
                            id="threshold"
                            type="number"
                            value={state.storeSupply?.lowStockThreshold || 5}
                            onChange={(e) =>
                              updateInventory({
                                lowStockThreshold: Number(e.target.value),
                              })
                            }
                            min={1}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-reorder">Auto Reorder</Label>
                        <Switch
                          id="auto-reorder"
                          checked={state.storeSupply?.autoReorder || false}
                          onCheckedChange={() =>
                            updateInventory({
                              autoReorder: !state.storeSupply?.autoReorder,
                            })
                          }
                          disabled={!state.storeSupply?.trackInventory}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Supplier Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apiLoading ? (
                    <div>Loading supplier settings...</div>
                  ) : apiError ? (
                    <div>
                      Error loading supplier settings: {apiError.message}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="new-supplier">
                          Add Preferred Supplier
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="new-supplier"
                            value={state.newSupplier || ""}
                            onChange={(e) => setNewSupplier(e.target.value)}
                            placeholder="Enter supplier name"
                          />
                          <Button onClick={handleAddSupplier}>Add</Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Preferred Suppliers</Label>
                        {!state.storeSupply?.preferredSuppliers?.length ? (
                          <p className="text-sm text-muted-foreground">
                            No preferred suppliers added yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {state.storeSupply?.preferredSuppliers?.map(
                              (supplier, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 border rounded"
                                >
                                  <span>{supplier}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleRemoveSupplier(supplier)
                                    }
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Tabs value={activeTab} className="w-full">
        {/* Ad Management Tab */}
        <TabsContent value="adManagement" className="w-11/12 m-auto">
          <AdManagement 
            state={state}
            handleInput={handleInput}
            handleToggle={handleToggle}
            settingsMeta={settingsMeta}
          />
        </TabsContent>
        {/* Account Tab */}

        {/* Account Receivable Settings */}
        
        <TabsContent value="accountReceivable" className="w-11/12 m-auto">
  <AccountReceivable
    state={state}
    handleInput={handleInput}
    handleToggle={handleToggle}
    settingsMeta={settingsMeta}
  />
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Customer Portal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2">
                <Label className="font-semibold" htmlFor="customerPortal-enable">
                  Enable Customer Portal for client?
                </Label>
                <Switch
                  id="customerPortal-enable"
                  checked={!!state.CustomerPortalDetails?.IsEnabled}
                  onCheckedChange={() => handleInput("CustomerPortalDetails", { ...state.CustomerPortalDetails, IsEnabled: !state.CustomerPortalDetails?.IsEnabled })}
                />
              </div>
              {state.CustomerPortalDetails?.IsEnabled && (
                <div className="p-2 text-sm text-muted-foreground">
                  Note: You can send contacts this link to let them sign up for access to the portal: "http://tier1-portal2.mirabeltechnologies.com/signup/9970"
                </div>
              )}
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
              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label className="font-semibold">Restrict Customer Search to Allowed Reps Only</Label>
                  <span className="text-sm text-muted-foreground">Users can only search for clients assigned to reps that they have set been set up to view in additional security access.</span>
                </div>
                <Switch
                  checked={!!state.LimitCustomerSearchByRep}
                  onCheckedChange={() => handleToggle('LimitCustomerSearchByRep')}
                />
              </div>
              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label className="font-semibold">Restrict Customer Add to Allowed Reps Only</Label>
                  <span className="text-sm text-muted-foreground">Users can add clients and assign them to reps that they have set been set up to view in additional security access.</span>
                </div>
                <Switch
                  checked={!!state.LimitCustomerAddByRep}
                  onCheckedChange={() => handleToggle('LimitCustomerAddByRep')}
                />
              </div>
              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label className="font-semibold">Restrict Calendar Viewing to Allowed Reps Only</Label>
                  <span className="text-sm text-muted-foreground">Users can only view calendars of other users that they have set been set up to view in additional security access.</span>
                </div>
                <Switch
                  checked={!!state.LimitCalendarByRep}
                  onCheckedChange={() => handleToggle('LimitCalendarByRep')}
                />
              </div>
              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label className="font-semibold">Allow Non Admin Users to Add to Calendar</Label>
                  <span className="text-sm text-muted-foreground">Allow users who are not site administrators to add items to other calendars, if not set only admin users can add items to other user's calendars.</span>
                </div>
                <Switch
                  checked={!!state.AllowNonAdminAddToCalendar}
                  onCheckedChange={() => handleToggle('AllowNonAdminAddToCalendar')}
                />
              </div>
              <div className="flex items-center justify-between p-2">
                <div className="flex flex-col items-start">
                  <Label className="font-semibold">Filter/Restrict Contact Page Items by Product</Label>
                  <span className="text-sm text-muted-foreground">Users/Reps with product security set will only see items (orders, proposals, invoices etc.) summaries for products they have specific access for.</span>
                </div>
                <Switch
                  checked={!!state.IsOrderListSecurityEnabled}
                  onCheckedChange={() => handleToggle('IsOrderListSecurityEnabled')}
                />
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
                <Switch
                  checked={state.campaign || false}
                  onCheckedChange={() => handleToggle("campaign")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Mailing Manager</Label>
                <Switch
                  checked={state.mailingManager || false}
                  onCheckedChange={() => handleToggle("mailingManager")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Mailer</Label>
                <Switch
                  checked={state.mailer || false}
                  onCheckedChange={() => handleToggle("mailer")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Helpdesk</Label>
                <Switch
                  checked={state.enableHelpdesk || false}
                  onCheckedChange={() => handleToggle("enableHelpdesk")}
                />
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
        </TabsContent>


        {/* Marketing Manager Package Settings */}
        <TabsContent value="marketingManagerPackageSettings">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Marketing Manager Package Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white border rounded">
                {/* Package Type Row */}
                <div className="flex flex-row items-center mb-2">
                  <div className="font-semibold min-w-[160px] text-right pr-2">Package Type</div>
                  <select
                    id="packageType"
                    className="px-2 py-1 text-sm border rounded min-w-[260px]"
                    value={state.packageType || "Trial"}
                    onChange={e => handleInput("packageType", e.target.value)}
                  >
                    {packageTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="ml-4 text-sm">{packageTypeDescriptions[state.packageType || "Trial"]}</div>
                </div>

                {/* Data Pack Section (only for certain package types) */}
                {showDataPackTypes.includes(state.packageType) && (
                  <>
                    {/* Data Pack Type Row */}
                    <div className="flex flex-row items-center mb-2">
                      <div className="font-semibold min-w-[160px] text-right pr-2">Data Pack Type</div>
                      <select
                        id="dataPackType"
                        className="px-2 py-1 text-sm border rounded min-w-[260px]"
                        value={state.dataPackType || "Basic"}
                        onChange={e => handleInput("dataPackType", e.target.value)}
                      >
                        <option value="Basic">Basic</option>
                        <option value="Standard">Standard</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                      <div className="ml-4 text-sm">
                        {dataPackTypeOptions.find(option => option.value === state.dataPackType)?.label} contact records per month</div>
                    </div>
                    {/* Base Data Pack Count Row */}
                    <div className="flex flex-row items-center mb-2">
                      <div className="font-semibold min-w-[160px] text-right pr-2">Base Data Pack Count</div>
                      <Input
                        id="baseDataPackCount"
                        type="number"
                        min={0}
                        className="w-16"
                        value={state.baseDataPackCount || 0}
                        onChange={e => handleInput("baseDataPackCount", parseInt(e.target.value, 10))}
                      />
                    </div>
                    {/* Count of Data Packs charged for current month Row */}
                    <div className="flex flex-row items-center mb-2">
                      <div className="font-semibold min-w-[320px] text-right pr-2">Count of Data Packs charged for current month</div>
                      <Input
                        id="countDataPacksCurrentMonth"
                        type="number"
                        min={0}
                        className="w-16"
                        value={state.countDataPacksCurrentMonth || 0}
                        disabled={true}
                        onChange={e => handleInput("countDataPacksCurrentMonth", parseInt(e.target.value, 10))}
                      />
                    </div>
                  </>
                )}

                {/* Links Row (center aligned) */}
                <div className="flex flex-row flex-wrap justify-center w-full gap-8 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <a href="#" className="text-sm text-blue-600 hover:underline">
                        Package and Data Pack Details applicable for next month
                      </a>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Package and Data Pack Details applicable for next month</DialogTitle>
                      </DialogHeader>
                      <DummyPackageDetailsTable />
                    </DialogContent>
                  </Dialog>
                  {showDataPackTypes.includes(state.packageType) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <a href="#" className="text-sm text-blue-600 hover:underline">
                          Show users with data packs assigned
                        </a>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Users with Data Packs Assigned</DialogTitle>
                        </DialogHeader>
                        <DummyUsersWithDataPacksTable />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
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
              <div className={`flex items-center justify-between p-2 border-b`}>
                <div className="flex flex-col items-start">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor="helpdesk"
                  >
                    Enable Ticket
                  </Label>
                  <p className="text-sm text-left text-muted-foreground">
                    Enable/disable access to new tech support ticket portal for
                    site. Please refresh the entire site to see the changes
                    after clicking the save button.
                  </p>
                </div>
                <Switch
                  checked={!!state.IsTicketEnabled}
                  onCheckedChange={() => handleToggle("IsTicketEnabled")}
                />
              </div>
              <div className={`flex items-center justify-between p-2 border-b`}>
                <div className="flex flex-col items-start">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor="helpdesk"
                  >
                    Enable Live Chat
                  </Label>
                  <p className="text-sm text-left text-muted-foreground">
                    Enable/disable access to online tech support chat for this
                    site. Please refresh the entire site to see the changes
                    after clicking the save button.
                  </p>
                </div>
                <Switch
                  id="helpdesk"
                  checked={!!state.IsChatEnabled}
                  onCheckedChange={() => handleToggle("IsChatEnabled")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media MailKit Tab */}
        <TabsContent value="mediaMateAI">
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
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="emailSettings">
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
        </TabsContent>
        
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button variant="default">Save</Button>
      </div>
    </div>
  );
}

// Wrap component with memo to prevent unnecessary renders
export default memo(DashboardDemoPage);
